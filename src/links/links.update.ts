import { LinksService } from './links.service';
import { Action, Ctx, InjectBot, Message, On, Start, Update } from 'nestjs-telegraf';
import { Markup, Telegraf } from 'telegraf';
import { actionButtons, saveButtons } from './links.buttons';
import { Context } from './context.interface';
import { CreateLinkDto } from './dto/create-link.dto';
import { v4 as uuidv4 } from 'uuid';

function isValidURL(url: string) {
    var RegExp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;

    if (RegExp.test(url)) {
        return true;
    } else {
        return false;
    }
}


@Update()
export class LinksUpdate {
    constructor(
        @InjectBot()
        private readonly bot: Telegraf<Context>,
        private readonly linksService: LinksService
    ) { }


    @Start()
    @Action('back')
    async startBot(ctx: Context) {
        await ctx.replyWithSticker('CAACAgIAAxkBAAEIlJZm6sqiKRMHVVu-NdG5yLWvJ2oEqgACEwADsjaQGYjqOlghB5NpNgQ')
        await ctx.reply('Что ты хочешь сделать со мной?', actionButtons())
    }

    // Сохранение ссылки
    // Бот принимает ссылку (проверка что url, валиден), внутреннее название, 
    // сохраняет в свою бд, возвращает уникальный код, по которому можно получить ссылку  
    @Action('save')
    async createName(ctx: Context /* @Body() createLinkDto: CreateLinkDto */) {
        await ctx.reply('Введите название ссылки', saveButtons(true));
        ctx.session.type = 'saveName';
    }

    @Action('saveLink')
    async createLink(ctx: Context) {
        await ctx.reply('Введите URL', saveButtons(false))
        ctx.session.type = 'saveURL';
    }

    @On('text')
    async textHandler(@Message('text') message: string, @Ctx() ctx: Context) {
        if (!ctx.session.type) return;
        if (ctx.session.type === 'saveName') {
            ctx.session.name = message
            await this.createLink(ctx);
            return;
        }
        if (ctx.session.type === 'saveURL') {
            if (isValidURL(message)) {
                ctx.session.url = message
            } else {
                await ctx.reply(`Неверный формат URL, введите еще раз`)
                await this.createLink(ctx);
                return
            }
            const newLink: CreateLinkDto = {
                name: ctx.session.name,
                url: ctx.session.url,
                uuid: uuidv4()
            }
            const link = await this.linksService.create(newLink);
            await ctx.reply(`Создана ссылка с уникальным uuid ${link.uuid}`, actionButtons())
            return;
        }
        if (ctx.session.type === 'find') {
            ctx.session.uuid = message
            const link = await this.linksService.findOneByUUID(message);
            if (link.id) { 
                await ctx.reply(`Ваша ссылка!`) 
                await ctx.reply(`${link.url}`) 
                return 
            }
            else {
                await ctx.reply(`Такой ссылки не существует`)
            }
            return
        }
    }


    // Список сохраненных ссылок
    // бот выводит список ссылок и их уникальных кодов (пагинация не требуется, но будет плюсом) 
    @Action('list')
    async listLinks(ctx: Context) {
        const btns = [];
        const list = await this.linksService.findAll();
        await ctx.reply(`Список ссылок: \n\n 
            ${list.length > 0 ? list.map(link => {
            link.name + '\n\n';
            btns.push(Markup.button.callback(link.name, link.id.toString()))
        }
        ).join('') : 'Список пуст'}`, Markup.inlineKeyboard(
            btns,
            {
                columns: 1
            }
        ));
        return
    }

    // Получение ссылки   
    // Бот принимает ранее созданный уникальный код, 
    // возвращает связанную с ним ссылку если она существует, 
    // если её нет, то возвращает ошибку, так же пользователь может 
    // передавать любым способом уникальный код ссылки любому другому пользователю, 
    // по которой он так же сможет получить сохранненую ссылку     
    @Action('get')
    async findOne(ctx: Context) /* : Promise<Link> */ {
        // return this.linksService.findOne(+id);
        await ctx.reply(`Введите уникальный uuid ссылки`, actionButtons())
        ctx.session.type = 'find'
    }

    // Удаление ссылки  
    // пользователь может удалить ранее созданную им ссылку из бота  
    @Action('delete')
    async remove(ctx: Context/* @Param('id') id: string */) {
        // return this.linksService.remove(+id);
        await ctx.replyWithSticker('CAACAgIAAxkBAAEIlJZm6sqiKRMHVVu-NdG5yLWvJ2oEqgACEwADsjaQGYjqOlghB5NpNgQ')
    }
}
