import { WebSocketServer } from "ws";
import controller from "./controller.js";
import db from "../db/db.js";
export const webSoscketServer = new WebSocketServer({
    port: 3000,
});
webSoscketServer.on("connection", (ws) => {
    ws.on("error", console.error);
    ws.on("message", (message) => {
        controller(message, ws);
    });
    ws.on("close", () => {
        const delUser = db.ws_users_Map.get(ws);
        const isBot = delUser.name.includes("bot");
        console.log(`${isBot ? "Bot" : "User"} has been disconected.`);
        delUser.isOnline = false;
        db.ws_users_Map.delete(ws);
    });
});
webSoscketServer.on("listening", () => {
    const { port } = webSoscketServer.address();
    console.log(`WS server started at port ${port} `);
});
process.on("exit", () => {
    webSoscketServer.close();
    console.log("Web Socket Server has been closed.");
});
process.on("SIGINT", () => {
    webSoscketServer.close();
    console.log("Web Socket Server has been closed.");
    process.exit();
});
//# sourceMappingURL=web_server.js.map