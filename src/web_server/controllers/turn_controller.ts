import db from "../../db/db.js";
import { createResponse } from "../../utils/utils.js";

export default function turn_controller(gameId: string) {
  const curGame = db.getGameById(gameId);
  const curTurn = curGame.currentPlayerId;
  const newTurn =
    curTurn === [...curGame.players.keys()][0]
      ? [...curGame.players.keys()][1]
      : [...curGame.players.keys()][0];
  const data = {
    currentPlayer: newTurn,
  };
  curGame.currentPlayerId = newTurn;

  db.ws_users_Map.forEach((user, ws) => {
    if (curGame.players.has(user.id)) {
      ws.send(createResponse("turn", data));
    }
  });
}
