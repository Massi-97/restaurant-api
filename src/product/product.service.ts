import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { ProductsListDto } from "./dto/product-list.dto";
import { StockService } from "../stock/stock.service";
import { StockCsvDto } from "../stock/dto/stock-csv.dto";
import { ProductDto } from "./dto/product.dto";
import { RestaurantDto } from "../auth/dto/restaurant.dto";
import { AuthService } from "../auth/auth.service";
import { ConfigService } from "@nestjs/config";
import axios from "axios";
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from "@nestjs/cache-manager";

@Injectable()
export class ProductService {
  constructor(
    private readonly authService: AuthService,
    private readonly stockService: StockService,
    private readonly configService: ConfigService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) { }

  /**
   * Filtre et trie les produits.
   * - Exclut les produits hors stock (stock = 0).
   * - Trie les produits par prix décroissant.
   * - Applique une remise de 30% aux produits dont la date limite de consommation (DLC) est à J+3.
   * @param restaurant Identifiants du restaurant, comprenant le nom d'utilisateur, le code du restaurant et le mot de passe.
   * @param apiKey Clé API pour accéder au Web Service National et récupérer les produits.
   * @returns {Promise<ProductsListDto>} Une promesse renvoyant une liste de produits classés dans deux catégories : standard et featured.
   * @throws Une erreur si la récupération des produits échoue ou si l'application des règles métiers échoue.
   */
  async filteredAndOrderedProducts(restaurant: RestaurantDto, apiKey: string): Promise<ProductsListDto> {
    const cacheKeyProducts = `products_${restaurant.codeRestaurant}`;

    let products: ProductDto[] | null;
    let stocks: StockCsvDto[];

    try {
      products = await this.cacheManager.get<ProductDto[]>(cacheKeyProducts);
      if (!products) {
        const { token } = await this.authService.getAuthorizationToken(restaurant);
        products = await this.fetchProducts(token, apiKey);
        await this.cacheManager.set(cacheKeyProducts, products, 60);
      }
      stocks = await this.stockService.parseStockFromCsv();
    } catch (error) {
      throw new HttpException(
        { message: error.response.data.message || 'Error when retrieving products' },
        HttpStatus.BAD_REQUEST,
      );
    }

    const stocksById = stocks.reduce((acc, stock) => {
      acc[stock.idProduct] = stock;
      return acc;
    }, {});

    const featuredProducts: ProductDto[] = [];
    const standardProducts: ProductDto[] = [];

    try {
      for (const product of products) {
        const stockData = stocksById[product.id];
        if (!stockData || stockData.stock === 0) continue;

        let updatedProduct = this.mapStockToProduct(product, stockData);

        if (this.isExpiringInThreeDays(product.dlc)) {
          updatedProduct = this.applyDiscount(updatedProduct, 0.3);
          featuredProducts.push(updatedProduct);
        } else {
          standardProducts.push(updatedProduct);
        }
      }

      featuredProducts.sort((a, b) => b.price - a.price);
      standardProducts.sort((a, b) => b.price - a.price);

      return { featuredProducts, standardProducts };
    } catch (error) {
      throw new HttpException(
        { message: error.response.data.message || 'Error when processing products' },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * Appel API pour récupérer la liste des produits nationaux.
   * @param token Token d'authentification pour valider l'accès aux produits. Ce token est obtenu lors de l'authentification du restaurant.
   * @param apiKey Clé API permettant d'accéder au Web Service National pour récupérer les données des produits.
   * @returns {Promise<ProductDto[]>} Une promesse renvoyant la liste des produits nationaux sous forme de tableau d'objets `ProductDto`.
   */
  private async fetchProducts(token: string, apiKey: string): Promise<ProductDto[]> {
    const loginUrl = this.configService.get<string>('API');

    const res = await axios.get(`${loginUrl}/products`, {
      headers: {
        Authorization: token,
        apiKey: apiKey,
      },
    })

    return res.data;
  }

  /**
   * Vérifie si une DLC est dans 3 jours à venir à partir d'aujourd'hui.
   * @param {string} dlc - Date limite de consommation du produit (au format ISO).
   * @returns {boolean} - Renvoie `true` si la DLC est dans 3 jours à venir, sinon `false`.
   */
  private isExpiringInThreeDays(dlc: string): boolean {
    const now = new Date();
    const dlcDate = new Date(dlc);

    now.setHours(0, 0, 0, 0);
    dlcDate.setHours(0, 0, 0, 0);

    const targetDate = new Date(now);
    targetDate.setDate(now.getDate() + 3);

    return dlcDate.getTime() === targetDate.getTime();
  }

  /**
   * Applique une remise au prix du produit.
   * @param {ProductDto} product - Le produit à modifier.
   * @param {number} discount - Le pourcentage de remise (ex: 0.3 pour 30%).
   * @returns {ProductDto} - Renvoie le produit avec le prix remisé.
   */
  private applyDiscount(product: ProductDto, discount: number): ProductDto {
    return {
      ...product,
      price: parseFloat((product.price * (1 - discount)).toFixed(2))
    };
  }

  /**
   * Ajoute la quantité de stock au produit.
   * @param {ProductDto} product - Produit de base.
   * @param {StockCsvDto} stock - Données de stock associées.
   * @returns {ProductDto} - Renvoie le produit enrichi avec le stock.
   */
  private mapStockToProduct(product: ProductDto, stock: StockCsvDto): ProductDto {
    return {
      ...product,
      stock: stock.stock
    };
  }
}