import { IsNumber } from 'class-validator';

export class StockCsvDto {
  @IsNumber()
  readonly idProduct: number;

  @IsNumber()
  readonly stock: number;
}