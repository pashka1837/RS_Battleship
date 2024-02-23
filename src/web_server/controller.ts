import { WebSocket } from "ws";
import { dirname, resolve } from "node:path";
import { fork } from "child_process";

import reg_controller from "./controllers/reg_controller.js";
import update_room_controller from "./controllers/update_room_controller.js";
import create_room_ctrlr from "./controllers/create_room_controller.js";
import add_usr_t_rm_cntrlr from "./controllers/add_usr_t_rm_cntrlr.js";
import add_ships_controller from "./controllers/add_ships.js";
import attack_controller from "./controllers/attack_controller.js";
import turn_controller from "./controllers/turn_controller.js";
import { random } from "../utils/utils.js";
import winner_controller from "./controllers/winner_controller.js";
import db from "../db/db.js";

const bot_filepath = resolve(__dirname + "/bot/bot.ts");

export default function controller(message: any, ws: WebSocket) {
  const req = JSON.parse(message);
  const { type, data: dataJSON } = req;
  const data = dataJSON ? JSON.parse(dataJSON) : null;

  switch (type) {
    case "reg":
      {
        const isSuccessfull = reg_controller(data, ws);
        if (isSuccessfull) {
          update_room_controller();
          winner_controller();
        }
      }
      break;
    case "create_room":
      {
        create_room_ctrlr(ws);
        update_room_controller();
      }
      break;
    case "add_user_to_room":
      {
        add_usr_t_rm_cntrlr(data.indexRoom, ws);
        // console.log(db.getRoomsMap);
      }
      break;
    case "add_ships":
      {
        const isGameStarted = add_ships_controller(ws, data);
        if (isGameStarted) turn_controller(data.gameId);
        // console.log(db.getGameMap);
      }
      break;
    case "attack":
      {
        const isGameFinsished = attack_controller(data);
        if (!isGameFinsished) turn_controller(data.gameId);
      }
      break;
    case "randomAttack":
      {
        data.x = random(10);
        data.y = random(10);
        const isGameFinsished = attack_controller(data, true);
        if (!isGameFinsished) turn_controller(data.gameId);
      }
      break;
    case "single_play":
      {
        console.log(`single_play`);
        create_room_ctrlr(ws);
        const curPLayer = db.ws_users_Map.get(ws);

        const botId = curPLayer.botId;
        const bot = db.getUsersMap.get(botId) || null;

        const botProcess = fork(bot_filepath);

        botProcess.send({ bot, roomId: curPLayer.roomId });
        botProcess.on("message", (d: any) => {
          console.log(d);
          curPLayer.botId = d.botId;
        });
        botProcess.on("close", () => {
          console.log("Bot process closed");
        });
      }
      break;

    default:
      console.log("kek");
  }
}
