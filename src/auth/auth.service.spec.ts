import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('AuthService', () => {
  let service: AuthService;
  let configService: ConfigService;

  beforeEach(() => {
    configService = {
      get: jest.fn().mockReturnValue('fake-url')
    } as any;

    service = new AuthService(configService);
  });

  it('should return a token from API', async () => {
    const restaurantDto = {
      username: 'testUser',
      codeRestaurant: 'resto123',
      password: 'testPwd',
    };

    mockedAxios.post.mockResolvedValueOnce({
      data: { token: 'mocked-token' }
    });

    const result = await service.getAuthorizationToken(restaurantDto);

    expect(configService.get).toHaveBeenCalledWith('API');
    expect(mockedAxios.post).toHaveBeenCalledWith('fake-url/login', {
      name: 'testUser',
      resto: 'resto123',
      pwd: 'testPwd'
    });
    expect(result).toEqual({ token: 'mocked-token' });
  });
});