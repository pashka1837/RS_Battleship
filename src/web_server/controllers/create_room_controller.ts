import { WebSocket } from "ws";
import ws_ids_db from "../../db/ws_ids_db.js";
import db from "../../db/db.js";

export default function create_room_ctrlr(ws: WebSocket) {
  console.log("create_room");
  const curUserId = ws_ids_db.get(ws);
  const curUser = db.getUserById(curUserId);
  delete curUser.password;
  const newRoom = db.createRoom(curUser);
  const response: any = {
    type: "create_room",
    data: [newRoom],
    id: 0,
  };
  response.data = JSON.stringify(response.data);
  return JSON.stringify(response);
}
