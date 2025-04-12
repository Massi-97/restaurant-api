import { Test, TestingModule } from '@nestjs/testing';
import { StockController } from './stock.controller';

describe('StockController', () => {
  let stockController: StockController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StockController],
      providers: [StockController],
    }).compile();

    stockController = module.get<StockController>(StockController);
  });
});