import { WebSocketServer, WebSocket, AddressInfo } from "ws";
import check_message from "./commands.js";

export const webSoscketServer = new WebSocketServer({
  port: 3000,
});

webSoscketServer.on("connection", (ws: WebSocket, _request, _client) => {
  ws.on("error", console.error);

  ws.on("message", (message) => {
    check_message(message, ws);
    // res.forEach((r) => ws.send(r));
    // console.log(res);
  });
  // ws.send(JSON.stringify("hello"));
});

webSoscketServer.on("listening", (ws, request, client) => {
  // console.log(ws);
  const { port } = webSoscketServer.address() as AddressInfo;
  console.log(`WS server started at port ${port} `);
});
