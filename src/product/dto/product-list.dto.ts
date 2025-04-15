import { IsArray } from "class-validator";
import { ProductDto } from "./product.dto";
import { ApiProperty } from "@nestjs/swagger";

export class ProductsListDto {
  @IsArray()
  @ApiProperty({ type: [ProductDto], description: 'List of featured products' })
  featuredProducts: ProductDto[];
  
  @IsArray()
  @ApiProperty({ type: [ProductDto], description: 'List of standard products' })
  standardProducts: ProductDto[];
}