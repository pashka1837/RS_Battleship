import { WebSocket } from "ws";
import db from "../../db/db.js";
import ws_ids_db from "../../db/ws_ids_db.js";
export default function reg_controller(data: any, ws: WebSocket) {
  console.log("reg");
  const isAuth = db.isAuthUser(data);
  const user = isAuth ? db.getUserByName(data.name) : db.addNewUser(data);
  if (user) ws_ids_db.set(ws, user.id);
  const response: any = {
    type: "reg",
    data: {
      name: user?.name,
      index: user?.id,
      error: !user,
      errorText: !user ? "Wrong Password" : "",
    },
    id: 0,
  };
  const jsonData = JSON.stringify(response.data);
  const jsonResponse = { ...response, data: jsonData };
  return JSON.stringify(jsonResponse);
}
