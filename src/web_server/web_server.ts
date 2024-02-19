import { WebSocketServer, WebSocket, AddressInfo } from "ws";
import controller from "./controller.js";
import ws_ids_db from "../db/ws_ids_db.js";

export const webSoscketServer = new WebSocketServer({
  port: 3000,
});

webSoscketServer.on("connection", (ws: WebSocket, _request, _client) => {
  ws.on("error", console.error);

  ws.on("message", (message) => {
    controller(message, ws);
    // res.forEach((r) => ws.send(r));
    // console.log(res);
  });
  ws.on("close", () => {
    console.log("close");
    const delID = ws_ids_db.get(ws);
    ws_ids_db.delete(ws);
  });
  // ws.send(JSON.stringify("hello"));
});

webSoscketServer.on("listening", (ws, request, client) => {
  // console.log(ws);
  const { port } = webSoscketServer.address() as AddressInfo;
  console.log(`WS server started at port ${port} `);
});
