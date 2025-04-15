import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AuthService } from '../../auth/auth.service';
import { AppModule } from '../../app/app.module';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

describe('ProductController (e2e)', () => {
  let app: INestApplication;

  const mockAuthService = {
    getAuthorizationToken: jest.fn().mockResolvedValue({ token: 'mocked-token' }),
  };

  const mockCacheManager = {
    get: jest.fn().mockResolvedValue(null),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(AuthService)
      .useValue(mockAuthService)
      .overrideProvider(CACHE_MANAGER)
      .useValue(mockCacheManager)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  it('POST /formatted-products returns 400 for empty API key', async () => {
    const restaurantDto = {
      username: 'testUser',
      codeRestaurant: 'resto123',
      password: 'testPwd',
    };
  
    const apiKey = '';
    const authorizationToken = 'some-jwt-token';
  
    const response = await request(app.getHttpServer())
      .post('/formatted-products')
      .set('apiKey', apiKey)
      .set('Authorization', authorizationToken)
      .send(restaurantDto);
  
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message');
  });

  afterAll(async () => {
    await app.close();
  });
});