import { Controller, Get } from '@nestjs/common';
import { StockService } from './stock.service';
import { StockCsvDto } from './dto/stock-csv.dto';

@Controller('stocks')
export class StockController {
  constructor(private readonly stockService: StockService) { }

  @Get()
  async findStock(): Promise<StockCsvDto[]> {
    return await this.stockService.parseStockFromCsv();
  }
}