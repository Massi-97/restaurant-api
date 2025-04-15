import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { RestaurantDto } from "./dto/restaurant.dto";
import axios from 'axios';

@Injectable()
export class AuthService {
  constructor(private readonly configService: ConfigService) {}

  /**
   * Appel API pour générer un token d'authentification.
   * @param restaurant Identité du restaurant, contenant les informations nécessaires (nom, code, mot de passe).
   * @returns {Promise<{ token: string }>} Un objet contenant le token d'authentification personnalisé pour le restaurant.
   */
  async getAuthorizationToken(restaurant: RestaurantDto): Promise<{ token: string }> {
    const loginUrl = this.configService.get<string>('API');

    const res = await axios.post(`${loginUrl}/login`, {
      name: restaurant.username,
      resto: restaurant.codeRestaurant,
      pwd: restaurant.password
    })

    return { token: res.data.token };
  }
}