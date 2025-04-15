import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class StockCsvDto {
  @IsNumber()
  @ApiProperty({ description: 'Product ID' })
  readonly idProduct: number;

  @IsNumber()
  @ApiProperty({ description: 'Product stock quantity' })
  readonly stock: number;
}