import { Controller, Get } from '@nestjs/common';
import { StockService } from './stock.service';
import { StockCsvDto } from './dto/stock-csv.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('stocks')
export class StockController {
  constructor(private readonly stockService: StockService) { }

  @Get()
  @ApiOperation({ summary: 'Get stocks' })
  @ApiResponse({ status: 200, description: 'Parse the stock from the remote csv', type: StockCsvDto })
  async findStock(): Promise<StockCsvDto[]> {
    return await this.stockService.parseStockFromCsv();
  }
}