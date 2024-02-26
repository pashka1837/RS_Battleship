import db from "../../db/db.js";
import { createResponse } from "../../utils/utils.js";

export default function winner() {
  const data = [...db.getUsersMap.values()]
    .sort((a, b) => b.wins - a.wins)
    .filter((user) => !user.name.includes("bot - "))
    .map((user) => ({ name: user.name, wins: user.wins }));
  const response = createResponse("update_winners", data);
  db.ws_users_Map.forEach((user, ws) => {
    if (!user.name.includes("bot - ")) ws.send(response);
  });
}
