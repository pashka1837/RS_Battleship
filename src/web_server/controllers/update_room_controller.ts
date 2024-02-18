import db from "../../db/db.js";
import ws_ids_db from "../../db/ws_ids_db.js";
import { WebSocket } from "ws";

export default function update_room_controller(curWS?: WebSocket) {
  console.log("update_room");
  const emptyRoom = db.getEmptyRoom();
  const response = {
    type: "update_room",
    data: emptyRoom,
    id: 0,
  };
  const jsonResponse = JSON.stringify({
    ...response,
    data: JSON.stringify(response.data),
  });
  ws_ids_db.forEach((_, ws) => {
    // if (curWS) {
    //   if (curWS !== ws) ws.send(jsonResponse);
    // } else ws.send(jsonResponse);
    ws.send(jsonResponse);
  });
  //   return JSON.stringify({ ...response, data: JSON.stringify(response.data) });
}
