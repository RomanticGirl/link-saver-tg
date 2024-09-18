import { Markup } from "telegraf";


export function actionButtons () {
    return Markup.inlineKeyboard(
        [
            Markup.button.callback('Сохранить ссылку 🤤', 'save'),
            Markup.button.callback('Список ссылок 🥵', 'list'),
            Markup.button.callback('Удалить ссылку 🥺', 'delete'),
            Markup.button.callback('Получить ссылку 😻', 'get'),
        ],
        {
            columns: 2,
        }
    )
}

export function saveButtons (oneStep: boolean) {
    return Markup.inlineKeyboard(
        [
            Markup.button.callback('К основному меню', 'back'),
            Markup.button.callback('К предыдущему шагу', 'save', oneStep),
        ],
        {
            columns: 2,
        }
    )
}