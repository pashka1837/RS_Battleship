import { WebSocketServer, WebSocket, AddressInfo } from "ws";
import controller from "./controller.js";
import db from "../db/db.js";

export const webSoscketServer = new WebSocketServer({
  port: 3000,
});

webSoscketServer.on("connection", (ws: WebSocket) => {
  ws.on("error", console.error);

  ws.on("message", (message) => {
    controller(message, ws);
  });

  ws.on("close", () => {
    const delUser = db.ws_users_Map.get(ws);
    const isBot = delUser.name.includes("bot");
    console.log(
      `${isBot ? "Bot has been" : delUser.name + " has"} disconected.`
    );
    delUser.isOnline = false;
    db.ws_users_Map.delete(ws);
  });
});

webSoscketServer.on("listening", () => {
  const { port } = webSoscketServer.address() as AddressInfo;
  console.log(`WS server started at port ${port} `);
});

webSoscketServer.on("close", () =>
  console.log("Web Socket Server has been closed.")
);

process.on("exit", () => webSoscketServer.close());
process.on("SIGINT", () => {
  webSoscketServer.close();
  process.exit();
});
