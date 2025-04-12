import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductModule } from 'src/product/product.module';
import { StockModule } from 'src/stock/stock.module';

@Module({
  imports: [ProductModule, StockModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
