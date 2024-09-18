import { Module } from '@nestjs/common';
import { LinksService } from './links.service';
import { LinksController } from './links.controller';
import { Link } from './entities/link.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LinksUpdate } from './links.update';

@Module({
  imports: [TypeOrmModule.forFeature([Link])],
  controllers: [LinksController],
  providers: [LinksService, LinksUpdate],
})
export class LinksModule { }
