import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    loginWithFirebase: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('firebaseLogin', () => {
    it('should return user data and access token', async () => {
      const idToken = 'valid-token';
      const mockResponse = {
        userId: 'user-123',
        email: 'test@example.com',
        accessToken: 'jwt-token',
      };

      (authService.loginWithFirebase as jest.Mock).mockResolvedValue(mockResponse);

      const result = await controller.firebaseLogin({ idToken });

      expect(authService.loginWithFirebase).toHaveBeenCalledWith(idToken);
      expect(result).toEqual(mockResponse);
    });

    it('should throw error when service fails', async () => {
      const idToken = 'invalid-token';
      const error = new Error('Invalid token');

      (authService.loginWithFirebase as jest.Mock).mockRejectedValue(error);

      await expect(controller.firebaseLogin({ idToken })).rejects.toThrow(error);
      expect(authService.loginWithFirebase).toHaveBeenCalledWith(idToken);
    });
  });
});
