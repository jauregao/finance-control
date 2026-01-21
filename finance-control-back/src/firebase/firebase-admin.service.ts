import { Injectable, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { readFileSync } from 'node:fs';
import * as path from 'node:path';

@Injectable()
export class FirebaseAdminService implements OnModuleInit {
  private app: admin.app.App;

  async onModuleInit() {
    if (!this.app) {
      const envPath = process.env.FIREBASE_SERVICE_ACCOUNT_KEY_PATH;

      if (!envPath) {
        throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY_PATH is not defined');
      }

      const filePath = path.join(process.cwd(), envPath);

      const serviceAccount = JSON.parse(readFileSync(filePath, 'utf8'));

      this.app = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    }
  }

  get auth() {
    return admin.auth(this.app);
  }
}
