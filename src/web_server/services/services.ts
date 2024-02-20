import db from "../../db/db.js";
import { createResponse } from "../../utils/utils.js";
import winner_controller from "../controllers/winner_controller.js";

export function isWinner(
  isEnemyShips: number,
  curPlayerId: string,
  gameId: string
) {
  if (isEnemyShips) return false;
  const curGame = db.getGameById(gameId);
  const winner = db.getUsersMap.get(curPlayerId);
  winner.wins += 1;

  curGame.players.forEach((player, _) => {
    const response = createResponse("finish", { winPlayer: curPlayerId });
    player.playerWs.send(response);
  });

  db.getGameMap.delete(gameId);
  winner_controller();
  return true;
}
