import { IsNumber, IsString } from 'class-validator';

export class CsvRowDto {
  @IsString()
  readonly IdProduct: string;

  @IsString()
  readonly stock: string;
}