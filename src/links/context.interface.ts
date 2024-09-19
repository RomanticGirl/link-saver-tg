import { IsUrl } from "@nestjs/class-validator";
import { Context as ContextTelegraf } from "telegraf";
import { Url } from "url";

export interface Context extends ContextTelegraf {
    session: {
        type?: 'saveName' | 'saveURL' | 'find' | 'remove'
        name?: string,
        url?: string,
        uuid?: string
    }
}