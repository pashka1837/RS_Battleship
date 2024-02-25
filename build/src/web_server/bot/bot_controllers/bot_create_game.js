import { createResponse, random } from "../../../utils/utils.js";
import ships from "../ships.js";
export default function botCreateGame(bot, data, botWs) {
    bot.gameId = data.idGame;
    const reqData = {
        gameId: bot.gameId,
        ships: ships[random(ships.length)],
        indexPlayer: bot.id,
    };
    const req = createResponse("add_ships", reqData);
    botWs.send(req);
}
//# sourceMappingURL=bot_create_game.js.map