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
    console.log("close");
    const delUser = db.ws_users_Map.get(ws);
    delUser.isOnline = false;
    db.ws_users_Map.delete(ws);
  });
});

webSoscketServer.on("listening", () => {
  const { port } = webSoscketServer.address() as AddressInfo;
  console.log(`WS server started at port ${port} `);
});
