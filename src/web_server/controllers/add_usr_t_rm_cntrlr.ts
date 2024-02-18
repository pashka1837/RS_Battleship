import db from "../../db/db.js";
import ws_ids_db from "../../db/ws_ids_db.js";
import update_room_controller from "./update_room_controller.js";

export default function add_usr_t_rm_cntrlr(
  enterRoomID: string,
  enterUserID: string
) {
  console.log("add_user_to_room");
  const curUser = db.getUserById(enterUserID);
  const curRoom = db.addUserToRoom(curUser, enterRoomID);
  if (!curRoom) return null;
  update_room_controller();

  ws_ids_db.forEach((id, ws) => {
    if (id === curRoom.roomUsers[0].id || id === curRoom.roomUsers[1].id) {
      const response = {
        type: "create_game",
        data: JSON.stringify({
          idGame: 1,
          idPlayer: id,
        }),
        id: 0,
      };
      ws.send(JSON.stringify(response));
    }
  });
}
