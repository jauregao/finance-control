import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { FirebaseAdminService } from '../firebase/firebase-admin.service';

describe('AuthService', () => {
  let service: AuthService;
  let prismaService: PrismaService;
  let firebaseAdmin: FirebaseAdminService;
  let jwtService: JwtService;

  const mockUser = {
    id: 'user-123',
    email: 'test@example.com',
    name: 'Test User',
    provider: 'firebase',
    providerAccountId: 'firebase-uid-123',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockDecodedToken = {
    uid: 'firebase-uid-123',
    email: 'test@example.com',
    name: 'Test User',
    email_verified: true,
    iat: 1234567890,
    exp: 1234567890,
    aud: 'test-project',
    iss: 'https://securetoken.google.com/test-project',
    sub: 'firebase-uid-123',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findFirst: jest.fn(),
              create: jest.fn(),
            },
          },
        },
        {
          provide: FirebaseAdminService,
          useValue: {
            auth: {
              verifyIdToken: jest.fn(),
            },
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
    firebaseAdmin = module.get<FirebaseAdminService>(FirebaseAdminService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('loginWithFirebase', () => {
    const validIdToken = 'valid-firebase-token';
    const mockAccessToken = 'mock-jwt-token';

    it('should successfully login existing user', async () => {
      (firebaseAdmin.auth.verifyIdToken as jest.Mock).mockResolvedValue(mockDecodedToken);
      (prismaService.user.findFirst as jest.Mock).mockResolvedValue(mockUser);
      (jwtService.signAsync as jest.Mock).mockResolvedValue(mockAccessToken);

      const result = await service.loginWithFirebase(validIdToken);

      expect(firebaseAdmin.auth.verifyIdToken).toHaveBeenCalledWith(validIdToken);
      expect(prismaService.user.findFirst).toHaveBeenCalledWith({
        where: { email: mockDecodedToken.email },
        select: { id: true, email: true },
      });
      expect(prismaService.user.create).not.toHaveBeenCalled();
      expect(jwtService.signAsync).toHaveBeenCalledWith({
        sub: mockUser.id,
        email: mockUser.email,
      });
      expect(result).toEqual({
        userId: mockUser.id,
        email: mockUser.email,
        accessToken: mockAccessToken,
      });
    });

    it('should create new user if not exists', async () => {
      (firebaseAdmin.auth.verifyIdToken as jest.Mock).mockResolvedValue(mockDecodedToken);
      (prismaService.user.findFirst as jest.Mock).mockResolvedValue(null);
      (prismaService.user.create as jest.Mock).mockResolvedValue(mockUser);
      (jwtService.signAsync as jest.Mock).mockResolvedValue(mockAccessToken);

      const result = await service.loginWithFirebase(validIdToken);

      expect(firebaseAdmin.auth.verifyIdToken).toHaveBeenCalledWith(validIdToken);
      expect(prismaService.user.findFirst).toHaveBeenCalledWith({
        where: { email: mockDecodedToken.email },
        select: { id: true, email: true },
      });
      expect(prismaService.user.create).toHaveBeenCalledWith({
        data: {
          email: mockDecodedToken.email,
          name: mockDecodedToken.name,
          provider: 'firebase',
          providerAccountId: mockDecodedToken.uid,
        },
        select: { id: true, email: true },
      });
      expect(jwtService.signAsync).toHaveBeenCalledWith({
        sub: mockUser.id,
        email: mockUser.email,
      });
      expect(result).toEqual({
        userId: mockUser.id,
        email: mockUser.email,
        accessToken: mockAccessToken,
      });
    });

    it('should throw UnauthorizedException when Firebase token is invalid', async () => {
      const invalidToken = 'invalid-token';
      (firebaseAdmin.auth.verifyIdToken as jest.Mock).mockRejectedValue(
        new Error('Invalid token')
      );

      await expect(service.loginWithFirebase(invalidToken)).rejects.toThrow(
        UnauthorizedException
      );
      await expect(service.loginWithFirebase(invalidToken)).rejects.toThrow(
        'Invalid Firebase token'
      );

      expect(firebaseAdmin.auth.verifyIdToken).toHaveBeenCalledWith(invalidToken);
      expect(prismaService.user.findFirst).not.toHaveBeenCalled();
      expect(prismaService.user.create).not.toHaveBeenCalled();
      expect(jwtService.signAsync).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException when Firebase token is expired', async () => {
      const expiredToken = 'expired-token';
      (firebaseAdmin.auth.verifyIdToken as jest.Mock).mockRejectedValue({
        code: 'auth/id-token-expired',
        message: 'Firebase ID token has expired',
      });

      await expect(service.loginWithFirebase(expiredToken)).rejects.toThrow(
        UnauthorizedException
      );

      expect(firebaseAdmin.auth.verifyIdToken).toHaveBeenCalledWith(expiredToken);
    });

    it('should handle database errors gracefully', async () => {
      (firebaseAdmin.auth.verifyIdToken as jest.Mock).mockResolvedValue(mockDecodedToken);
      (prismaService.user.findFirst as jest.Mock).mockRejectedValue(
        new Error('Database connection error')
      );

      await expect(service.loginWithFirebase(validIdToken)).rejects.toThrow(
        'Database connection error'
      );

      expect(firebaseAdmin.auth.verifyIdToken).toHaveBeenCalledWith(validIdToken);
      expect(prismaService.user.findFirst).toHaveBeenCalled();
    });

    it('should handle JWT signing errors', async () => {
      (firebaseAdmin.auth.verifyIdToken as jest.Mock).mockResolvedValue(mockDecodedToken);
      (prismaService.user.findFirst as jest.Mock).mockResolvedValue(mockUser);
      (jwtService.signAsync as jest.Mock).mockRejectedValue(
        new Error('JWT signing failed')
      );

      await expect(service.loginWithFirebase(validIdToken)).rejects.toThrow(
        'JWT signing failed'
      );

      expect(jwtService.signAsync).toHaveBeenCalled();
    });

    it('should create user with name from token', async () => {
      const tokenWithoutName = { ...mockDecodedToken, name: undefined };
      (firebaseAdmin.auth.verifyIdToken as jest.Mock).mockResolvedValue(tokenWithoutName);
      (prismaService.user.findFirst as jest.Mock).mockResolvedValue(null);
      (prismaService.user.create as jest.Mock).mockResolvedValue(mockUser);
      (jwtService.signAsync as jest.Mock).mockResolvedValue(mockAccessToken);

      await service.loginWithFirebase(validIdToken);

      expect(prismaService.user.create).toHaveBeenCalledWith({
        data: {
          email: tokenWithoutName.email,
          name: undefined,
          provider: 'firebase',
          providerAccountId: tokenWithoutName.uid,
        },
        select: { id: true, email: true },
      });
    });
  });
});
