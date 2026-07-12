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

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

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
  ],

  controllers: [AppController],

  providers: [AppService],
})
export class AppModule {}