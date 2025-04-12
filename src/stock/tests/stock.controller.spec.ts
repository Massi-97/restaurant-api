import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { StockModule } from '../stock.module';
import * as request from 'supertest';


describe('StockController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [StockModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('GET /stocks should return a list of stocks', async () => {
    const response = await request(app.getHttpServer())
      .get('/stocks')
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body[0]).toHaveProperty('idProduct');
    expect(response.body[0]).toHaveProperty('stock');
  });

  afterAll(async () => {
    await app.close();
  });
});