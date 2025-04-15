import { Body, Controller, Headers, Post } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductsListDto } from './dto/product-list.dto';
import { ApiBody, ApiHeader, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RestaurantDto } from '../auth/dto/restaurant.dto';

@Controller('formatted-products')
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  @Post()
  @ApiBody({
    type: RestaurantDto,
    description: 'Restaurant login details',
    required: true
  })
  @ApiHeader({
    name: 'apiKey',
    description: 'API key for authentication',
    required: true,
  })
  @ApiOperation({ summary: 'List of filtered and ordered products' })
  @ApiResponse({ status: 200, description: 'List of national products filtered and ordered with stocks', type: ProductsListDto })
  async getFormattedProducts(@Body() restaurant: RestaurantDto, @Headers('apiKey') apiKey: string): Promise<ProductsListDto> {
    return await this.productService.filteredAndOrderedProducts(restaurant, apiKey);
  }
}