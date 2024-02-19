import db from "../../db/db.js";
import ws_ids_db from "../../db/ws_ids_db.js";
import { WebSocket } from "ws";

export default function update_room_controller(curWS?: WebSocket) {
  console.log("update_room");
  ws_ids_db.forEach((id, ws) => {
    const response = {
      type: "update_room",
      data: db.getEmptyRoom(id),
      id: 0,
    };
    const jsonResponse = JSON.stringify({
      ...response,
      data: JSON.stringify(response.data),
    });
    ws.send(jsonResponse);
  });
}
