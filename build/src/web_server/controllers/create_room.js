import db from "../../db/db.js";
import { createResponse } from "../../utils/utils.js";
export default function createRoom(ws) {
    console.log("create_room");
    const curUser = db.ws_users_Map.get(ws);
    const newRoom = db.addNewRoom(curUser, ws);
    if (!newRoom)
        return;
    const response = createResponse("create_room", [newRoom]);
    ws.send(response);
}
//# sourceMappingURL=create_room.js.map