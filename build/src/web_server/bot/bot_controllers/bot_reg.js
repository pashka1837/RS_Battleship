export default function botReg(existingBotId, bot, data) {
    if (!existingBotId) {
        bot.id = data.index;
        process.send({ botId: bot.id });
    }
    else {
        bot.id = data.index;
        bot.name = data.name;
    }
}
//# sourceMappingURL=bot_reg.js.map