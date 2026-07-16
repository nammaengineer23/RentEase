import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { FirebaseModule } from './firebase/firebase.module';
import { join } from 'path';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { DatabaseModule } from './database/database.module';
import { PrismaModule } from './prisma/prisma.module';

import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { PropertiesModule } from './modules/properties/properties.module';
import { AmenitiesModule } from './modules/amenities/amenities.module';
import { UploadsModule } from './modules/uploads/uploads.module';
import { PropertyImagesModule } from './modules/property-images/property-images.module';
import { FavoritesModule } from './modules/favorites/favorites.module';
import { PropertyVisitsModule } from './modules/property-visits/property-visits.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { OwnerDashboardModule } from './modules/owner-dashboard/owner-dashboard.module';
import { ChatModule } from './modules/chat/chat.module';
import { PushNotificationsModule } from './modules/push-notifications/push-notifications.module';
import { AdminModule } from './modules/admin/admin.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';



@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    ThrottlerModule.forRoot([
  {
    ttl: 60_000,
    limit: 100,
  },
 ]),

    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
    }),

    DatabaseModule,
    PrismaModule,
    AuthModule,
    UsersModule,
    PropertiesModule,
    AmenitiesModule,
    UploadsModule,
    PropertyImagesModule,
    FavoritesModule,
    FirebaseModule,
    PropertyVisitsModule,
    NotificationsModule,
    ReviewsModule,
    OwnerDashboardModule,
    ChatModule,
    PushNotificationsModule,
    AdminModule,
  ],

  controllers: [AppController],

  providers: [
  AppService,
  {
    provide: APP_GUARD,
    useClass: ThrottlerGuard,
  },
],

})
export class AppModule {}