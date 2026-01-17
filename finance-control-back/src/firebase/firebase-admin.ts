import { Injectable, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { readFileSync } from 'node:fs';

@Injectable()
export class FirebaseAdmin implements OnModuleInit {
  private app: admin.app.App;

  onModuleInit() {
    if (!this.app) {
      const path = process.env.FIREBASE_SERVICE_ACCOUNT_KEY_PATH;
      const serviceAccount = JSON.parse(readFileSync(path, 'utf8'));

      this.app = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    }
  }

  getAuth() {
    return admin.auth(this.app);
  }
}
