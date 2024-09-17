import { Injectable } from '@nestjs/common';
import { CreateLinkDto } from './dto/create-link.dto';
import { UpdateLinkDto } from './dto/update-link.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Link } from './entities/link.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LinksService {
  constructor(
    @InjectRepository(Link)
    private linksRepository: Repository<Link>,
  ) { }

  create(link: Partial<Link>): Promise<Link> {
    const newLink = this.linksRepository.create(link);
    return this.linksRepository.save(newLink);
  }

  findAll(): Promise<Link[]> {
    return this.linksRepository.find();
  }

  findOne(id: number): Promise<Link> {
    return this.linksRepository.findOneBy({ id });
  }

  async remove(id: number): Promise<void> {
    await this.linksRepository.delete(id);
  }
}
