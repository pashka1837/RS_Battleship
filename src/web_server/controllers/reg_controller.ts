import { WebSocket } from "ws";
import db from "../../db/db.js";
import { createRegResponse } from "../../utils/utils.js";

export default function reg_controller(data: any, ws: WebSocket) {
  console.log("reg");
  const isAuth = db.isAuthUser(data);
  const user = isAuth ? db.getFoundUser : db.addNewUser(data);
  if (!user) return createRegResponse("", "", true, "Wrong password");
  if (user.isOnline)
    return createRegResponse("", "", true, "User is already online");

  user.isOnline = true;
  db.ws_users_Map.set(ws, user);

  return createRegResponse(user.name, user.id);
}
