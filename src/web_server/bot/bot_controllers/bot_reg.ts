export default function botReg(existingBotId: string, bot: any, data: any) {
  if (!existingBotId) {
    bot.id = data.index;
    process.send({ botId: bot.id });
  } else {
    bot.id = data.index;
    bot.name = data.name;
  }
}
