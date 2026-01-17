import { Test, TestingModule } from '@nestjs/testing';
import { FirebaseAdminService } from './firebase-admin.service';

jest.mock('firebase-admin', () => ({
  initializeApp: jest.fn(),
  credential: {
    cert: jest.fn(),
  },
  auth: jest.fn(),
}));

jest.mock('node:fs', () => ({
  readFileSync: jest.fn(),
}));

import * as admin from 'firebase-admin';
import * as fs from 'node:fs';

describe('FirebaseAdminService', () => {
  let service: FirebaseAdminService;

  const mockServiceAccount = {
    type: 'service_account',
    project_id: 'test-project',
    private_key_id: 'test-key-id',
    private_key: '-----BEGIN PRIVATE KEY-----\ntest-key\n-----END PRIVATE KEY-----\n',
    client_email: 'test@test-project.iam.gserviceaccount.com',
    client_id: '123456789',
  };

  const mockApp = { name: '[DEFAULT]', options: {} };
  const mockAuth = { verifyIdToken: jest.fn(), getUser: jest.fn() };

  beforeEach(async () => {
    jest.clearAllMocks();

    process.env.FIREBASE_SERVICE_ACCOUNT_KEY_PATH = '/path/to/service-account.json';

    (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify(mockServiceAccount));
    (admin.credential.cert as jest.Mock).mockReturnValue({});
    (admin.initializeApp as jest.Mock).mockReturnValue(mockApp);
    (admin.auth as jest.Mock).mockReturnValue(mockAuth);

    const module: TestingModule = await Test.createTestingModule({
      providers: [FirebaseAdminService],
    }).compile();

    service = module.get<FirebaseAdminService>(FirebaseAdminService);
  });

  afterEach(() => {
    delete process.env.FIREBASE_SERVICE_ACCOUNT_KEY_PATH;
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('onModuleInit', () => {
    it('should initialize Firebase Admin SDK', () => {
      service.onModuleInit();

      expect(fs.readFileSync).toHaveBeenCalledWith('/path/to/service-account.json', 'utf8');
      expect(admin.credential.cert).toHaveBeenCalledWith(mockServiceAccount);
      expect(admin.initializeApp).toHaveBeenCalled();
    });

    it('should not initialize Firebase twice', () => {
      service.onModuleInit();
      service.onModuleInit();

      expect(admin.initializeApp).toHaveBeenCalledTimes(1);
    });
  });

  describe('auth', () => {
    it('should return Firebase Auth instance', () => {
      service.onModuleInit();
      const auth = service.auth;

      expect(auth).toBeDefined();
      expect(auth).toBe(mockAuth);
    });
  });
});
