import { Module } from '@nestjs/common';
import { LinksModule } from './links/links.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Link } from './links/entities/link.entity';
import { ConfigModule } from '@nestjs/config';
import { TelegrafModule } from 'nestjs-telegraf';
import * as LocalSession from 'telegraf-session-local';


const sessions = new LocalSession({
  
})

console.log(process.env.BOT_API_TOKEN)
@Module({
  imports: [
    ConfigModule.forRoot(),
    TelegrafModule.forRoot({
      middlewares: [sessions.middleware()],
      token: process.env.BOT_API_TOKEN
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [Link],
      synchronize: true,
    }),
    LinksModule,
  ],
})
export class AppModule { }
