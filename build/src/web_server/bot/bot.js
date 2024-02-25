import { WebSocket } from "ws";
import botController from "./bot_controller.js";
process.on("message", (mainProcData) => {
    console.log("Bot porcess has been opened.");
    const { bot, roomId } = mainProcData;
    runBt(roomId, bot);
});
function runBt(roomID, existingBot) {
    const botWs = new WebSocket("ws://localhost:3000");
    botWs.onopen = (_) => {
        console.log("Bot websocket has been connected.");
        botWs.send(JSON.stringify({
            type: "reg",
            data: JSON.stringify({
                name: existingBot?.name || "bot - " + crypto.randomUUID(),
                password: "bot123",
            }),
            id: 0,
        }));
        botWs.send(JSON.stringify({
            type: "add_user_to_room",
            data: JSON.stringify({
                indexRoom: roomID,
            }),
            id: 0,
        }));
    };
    botWs.onmessage = (res) => {
        botController(res, botWs, existingBot?.id);
    };
    botWs.onclose = () => {
        console.log("Bot WebSocket has been closed.");
        process.exit();
    };
}
//# sourceMappingURL=bot.js.map