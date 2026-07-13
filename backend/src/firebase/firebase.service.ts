import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import {
  cert,
  getApps,
  initializeApp,
} from 'firebase-admin/app';

import { getAuth } from 'firebase-admin/auth';

@Injectable()
export class FirebaseService {
  constructor(
    private readonly configService: ConfigService,
  ) {
    if (!getApps().length) {
      initializeApp({
        credential: cert({
          projectId: this.configService.get<string>(
            'FIREBASE_PROJECT_ID',
          ),
          clientEmail: this.configService.get<string>(
            'FIREBASE_CLIENT_EMAIL',
          ),
          privateKey: this.configService
            .get<string>('FIREBASE_PRIVATE_KEY')
            ?.replace(/\\n/g, '\n'),
        }),
      });

      console.log('✅ Firebase Admin initialized');
    }
  }

  getAuth() {
    return getAuth();
  }

  async verifyToken(idToken: string) {
    return this.getAuth().verifyIdToken(idToken);
  }
}