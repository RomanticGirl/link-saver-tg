import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LinksService } from './links.service';
import { CreateLinkDto } from './dto/create-link.dto';
import { UpdateLinkDto } from './dto/update-link.dto';
import { Link } from './entities/link.entity';
import { InjectBot } from 'nestjs-telegraf';
import { Context, Telegraf } from 'telegraf';

@Controller('links')
export class LinksController {
  constructor(
    @InjectBot()
    private readonly bot: Telegraf<Context>,
    private readonly linksService: LinksService
  ) { }

  // Сохранение ссылки
  // Бот принимает ссылку (проверка что url, валиден), внутреннее название, 
  // сохраняет в свою бд, возвращает уникальный код, по которому можно получить ссылку  
  @Post()
  create(@Body() createLinkDto: CreateLinkDto) {
    return this.linksService.create(createLinkDto);
  }

  // Список сохраненных ссылок
  // бот выводит список ссылок и их уникальных кодов (пагинация не требуется, но будет плюсом) 
  @Get()
  findAll(): Promise<Link[]> {
    return this.linksService.findAll();
  }

  // Получение ссылки   
  // Бот принимает ранее созданный уникальный код, 
  // возвращает связанную с ним ссылку если она существует, 
  // если её нет, то возвращает ошибку, так же пользователь может 
  // передавать любым способом уникальный код ссылки любому другому пользователю, 
  // по которой он так же сможет получить сохранненую ссылку     
  @Get(':id')
  findOne(@Param('id') id: number): Promise<Link> {
    return this.linksService.findOne(+id);
  }

  // Удаление ссылки  
  // пользователь может удалить ранее созданную им ссылку из бота  
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.linksService.remove(+id);
  }
}
