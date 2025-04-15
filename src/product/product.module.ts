import { Module } from '@nestjs/common';
import { ProductController } from "./product.controller";
import { ProductService } from "./product.service";
import { StockModule } from '../stock/stock.module';
import { AuthModule } from '../auth/auth.module';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    StockModule,
    AuthModule,
    CacheModule.register({
      max: 100,
    }),
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule { }
