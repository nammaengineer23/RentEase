import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';

import { MailService } from './mail.service';

@Module({
  imports: [
    ConfigModule,

    MailerModule.forRoot({
      transport: {
        host: process.env.MAIL_HOST,
        port: Number(process.env.MAIL_PORT),
        secure: false,
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASSWORD,
        },
      },

      defaults: {
        from: process.env.MAIL_FROM,
      },
    }),
  ],

  providers: [MailService],

  exports: [MailService],
})
export class MailModule {}