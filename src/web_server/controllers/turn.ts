import db from "../../db/db.js";
import { createResponse } from "../../utils/utils.js";

export default function turn(gameId: string) {
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

  curGame.players.forEach((player, _) => {
    const response = createResponse("turn", data);
    player.playerWs.send(response);
  });
}
