import { Test, TestingModule } from '@nestjs/testing';
import { StockService } from '../stock.service';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

jest.mock('axios');
jest.mock('@nestjs/config');

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('StockService', () => {
  let stockService: StockService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StockService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('https://rct2cms.zebrix.net/exam-api/stocks.csv'),
          },
        },
      ],
    }).compile();

    stockService = module.get<StockService>(StockService);
  });

  it('should be defined', () => {
    expect(stockService).toBeDefined();
  });

  it('should parse stock data from CSV URL', async () => {
    const mockData = `IdProduct;stock\n1;100\n2;200`;
    mockedAxios.get.mockResolvedValue({ data: mockData });

    const result = await stockService.parseStockFromCsv();

    expect(result).toEqual([
      { idProduct: 1, stock: 100 },
      { idProduct: 2, stock: 200 },
    ]);
    expect(mockedAxios.get).toHaveBeenCalledWith('https://rct2cms.zebrix.net/exam-api/stocks.csv', { responseType: 'text' });
  });

  it('should throw error when parsing CSV fails', async () => {
    mockedAxios.get.mockRejectedValue(new Error('Network error'));
    await expect(stockService.parseStockFromCsv()).rejects.toThrow('Failed to parse CSV');
  });
});