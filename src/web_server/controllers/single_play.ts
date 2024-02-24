import { WebSocket } from "ws";
import { resolve } from "node:path";
import { fork } from "child_process";

import createRoom from "./create_room.js";
import db from "../../db/db.js";

export default function singlePlay(curWs: WebSocket) {
  console.log(`single_play`);
  createRoom(curWs);

  const curPLayer = db.ws_users_Map.get(curWs);

  const botId = curPLayer.botId;
  const bot = db.getUsersMap.get(botId) || null;
  const botFilepath = resolve(__dirname + "./../bot/bot.ts");

  const botProcess = fork(botFilepath);

  botProcess.send({ bot, roomId: curPLayer.roomId });
  botProcess.on("message", (d: any) => (curPLayer.botId = d.botId));
  botProcess.on("close", () => console.log("Bot process closed"));
}
