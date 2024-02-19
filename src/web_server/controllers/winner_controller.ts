import db from "../../db/db.js";
import { createResponse } from "../../utils/utils.js";

export default function winner_controller() {
  const data = [...db.getUsersMap.values()].sort((a, b) => b.wins - a.wins);
  const response = createResponse("update_winners", data);
  [...db.ws_users_Map.keys()].forEach((ws) => {
    ws.send(response);
  });
}
