import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsNumber, IsOptional, IsString, ValidateIf } from "class-validator";

export class ProductDto {
  @IsNumber()
  @ApiProperty({ description: 'Product ID' })
  id: number;

  @IsString()
  @ApiProperty({ description: 'Product name' })
  name: string;

  @IsNumber()
  @ApiProperty({ description: 'Product price' })
  price: number;

  @IsDateString()
  @ApiProperty({ description: 'Product expiration date' })
  dlc: string;

  @ApiProperty({ description: 'Product stock quantity', type: Number })
  @ValidateIf(o => o.stock !== null)
  @IsNumber()
  @IsOptional()
  stock?: number | null;
}