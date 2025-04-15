import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from '../product.service';
import { AppModule } from '../../app/app.module';

describe('ProductService', () => {
  let service: ProductService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    service = module.get<ProductService>(ProductService);
  });

  it('should return true if dlc is exactly 3 days from today', () => {
    const today = new Date();
    today.setDate(today.getDate() + 3);
    const dlc = today.toISOString();

    const result = (service as any).isExpiringInThreeDays(dlc);

    expect(result).toBe(true);
  });

  it('should return false if dlc is not exactly 3 days from today', () => {
    const today = new Date();
    today.setDate(today.getDate() + 2);
    const dlc = today.toISOString();

    const result = (service as any).isExpiringInThreeDays(dlc);

    expect(result).toBe(false);
  });
});