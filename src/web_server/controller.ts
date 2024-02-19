import { WebSocket } from "ws";
import reg_controller from "./controllers/reg_controller.js";
import update_room_controller from "./controllers/update_room_controller.js";
import create_room_ctrlr from "./controllers/create_room_controller.js";
import add_usr_t_rm_cntrlr from "./controllers/add_usr_t_rm_cntrlr.js";
import db from "../db/db.js";
import add_ships_controller from "./controllers/add_ships.js";
import attack_controller from "./controllers/attack_controller.js";
import turn_controller from "./controllers/turn_controller.js";

export default function controller(message: any, ws: WebSocket) {
  const req = JSON.parse(message);
  const { type, data: dataJSON } = req;

  switch (type) {
    case "reg":
      {
        const data = dataJSON ? JSON.parse(dataJSON) : null;
        const regResponse = reg_controller(data, ws);
        ws.send(regResponse);
        const curUser = db.ws_users_Map.get(ws);
        if (curUser) update_room_controller();
      }
      break;
    case "create_room":
      {
        const crtRoomResponse = create_room_ctrlr(ws);
        ws.send(crtRoomResponse);
        update_room_controller(ws);
      }
      break;
    case "add_user_to_room":
      {
        const data = JSON.parse(dataJSON);
        add_usr_t_rm_cntrlr(data.indexRoom, ws);
      }
      break;
    case "add_ships":
      {
        const data = JSON.parse(dataJSON);
        add_ships_controller(ws, data);
        turn_controller(data.gameId);
      }
      break;
    case "attack":
      {
        const data = JSON.parse(dataJSON);
        attack_controller(data, ws);
        turn_controller(data.gameId);
      }
      break;

    default:
      console.log("kek");
  }
}
