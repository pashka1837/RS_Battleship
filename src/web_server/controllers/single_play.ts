import { WebSocket } from "ws";
import { dirname, resolve } from "node:path";
import { fork } from "child_process";
import { fileURLToPath } from "url";

import createRoom from "./create_room.js";
import db from "../../db/db.js";

export default function singlePlay(curWs: WebSocket) {
  console.log(`single_play`);
  createRoom(curWs);

  const curFilename = fileURLToPath(import.meta.url);
  const curDirname = dirname(curFilename);
  const botFilepath = resolve(curDirname + "./../bot/bot");

  const curPLayer = db.ws_users_Map.get(curWs);

  const botId = curPLayer.botId;
  const bot = db.getUsersMap.get(botId) || null;

  const botProcess = fork(botFilepath);

  botProcess.send({ bot, roomId: curPLayer.roomId });
  botProcess.on("message", (d: any) => (curPLayer.botId = d.botId));
  botProcess.on("close", () => console.log("Bot process closed."));
}
