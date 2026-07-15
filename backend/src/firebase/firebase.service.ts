import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import {
  cert,
  getApps,
  initializeApp,
} from 'firebase-admin/app';

import { getAuth } from 'firebase-admin/auth';
import { getMessaging } from 'firebase-admin/messaging';


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

  getMessaging() {
  return getMessaging();
}

  getAuth() {
    return getAuth();
  }

  // ==========================
// Send Push Notification
// ==========================
async sendToDevice(
  token: string,
  title: string,
  body: string,
  data?: Record<string, string>,
) {
  return this.getMessaging().send({
    token,
    notification: {
      title,
      body,
    },
    data,
  });
}

// ==========================
// Send Multicast Notification
// ==========================
async sendToDevices(
  tokens: string[],
  title: string,
  body: string,
  data?: Record<string, string>,
) {
  if (tokens.length === 0) {
    return;
  }

  return this.getMessaging().sendEachForMulticast({
    tokens,
    notification: {
      title,
      body,
    },
    data,
  });
}



  async verifyToken(idToken: string) {
    return this.getAuth().verifyIdToken(idToken);
  }
}