import { WebSocket } from "ws";
import db from "../../db/db.js";
import { createRegResponse } from "../../utils/utils.js";

export default function reg_controller(data: any, ws: WebSocket) {
  console.log("reg");
  const isRegisteredUser = db.isAuthUser(data);
  const user = isRegisteredUser || db.addNewUser(data);
  if (!user) {
    const response = createRegResponse("", "", true, "Wrong password");
    ws.send(response);
    return false;
  }
  if (user.isOnline) {
    const response = createRegResponse("", "", true, "User is already online");
    ws.send(response);
    return false;
  }

  user.isOnline = true;
  db.ws_users_Map.set(ws, user);

  const response = createRegResponse(user.name, user.id);
  ws.send(response);
  return true;
}
