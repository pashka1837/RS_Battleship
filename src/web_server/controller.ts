import { WebSocket } from "ws";
import reg_controller from "./controllers/reg_controller.js";
import update_room_controller from "./controllers/update_room_controller.js";
import create_room_ctrlr from "./controllers/create_room_controller.js";
import ws_ids_db from "../db/ws_ids_db.js";
import add_usr_t_rm_cntrlr from "./controllers/add_usr_t_rm_cntrlr.js";

export default function controller(message: any, ws: WebSocket) {
  const req = JSON.parse(message);
  const { type, data: dataJSON } = req;

  switch (type) {
    case "reg":
      {
        const data = dataJSON ? JSON.parse(dataJSON) : null;
        const regResponse = reg_controller(data, ws);
        ws.send(regResponse);
        const curUserId = ws_ids_db.get(ws);
        if (curUserId) update_room_controller();
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
        const data = dataJSON ? JSON.parse(dataJSON) : null;
        const curUserId = ws_ids_db.get(ws);

        add_usr_t_rm_cntrlr(data.indexRoom, curUserId);
      }
      break;

    default:
      console.log("kek");
  }
}
