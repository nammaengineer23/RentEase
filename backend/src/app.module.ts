import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';

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


@Module({
  imports: [
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
    
  ],

  controllers: [AppController],

  providers: [AppService],
})
export class AppModule {}