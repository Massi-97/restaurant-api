import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { StockCsvDto } from "./dto/stock-csv.dto";
import { parse } from 'csv-parse';
import axios from 'axios';
import { CsvRowDto } from "./dto/csv-row.dto";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class StockService {
  constructor(private readonly configService: ConfigService) { }

  /**
   * Parse un fichier CSV de stock à partir d'une URL distante.
   *
   * @returns Une promesse contenant une liste d'objets de type `StockCsvDto`.
   * @throws Une erreur si le parsing échoue ou si la récupération du fichier échoue.
   */
  async parseStockFromCsv(): Promise<StockCsvDto[]> {
    try {
      const url = this.configService.get<string>('API');
      const response = await axios.get(`${url}/stocks.csv`, { responseType: 'text' });

      const results: StockCsvDto[] = [];
      await new Promise<void>((resolve, reject) => {
        parse(response.data, { columns: true, trim: true, delimiter: ';' })
          .on('data', (row: CsvRowDto) => {
            results.push({
              idProduct: parseInt(row.IdProduct, 10),
              stock: parseInt(row.stock, 10),
            });
          })
          .on('end', resolve)
          .on('error', reject);
      });
      return results;
    }
    catch (error) {
      throw new HttpException(
        { message: error.response.data.message || 'Failed to parse CSV' },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}