import { Injectable } from '@nestjs/common';

import {
  initializeApp,
  cert,
  getApps,
} from 'firebase-admin/app';

import { getAuth } from 'firebase-admin/auth';

import { readFileSync } from 'fs';
import { join } from 'path';

@Injectable()
export class FirebaseService {
  constructor() {
    if (getApps().length === 0) {
      const serviceAccount = JSON.parse(
        readFileSync(
          join(
            process.cwd(),
            'firebase',
            'service-account.json',
          ),
          'utf8',
        ),
      );

      initializeApp({
        credential: cert(serviceAccount),
      });

      console.log(
        '✅ Firebase Admin initialized',
      );
    }
  }

  async verifyToken(idToken: string) {
    return getAuth().verifyIdToken(idToken);
  }
}