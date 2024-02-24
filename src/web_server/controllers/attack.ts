import db from "../../db/db.js";
import { createResponse, random } from "../../utils/utils.js";
import {
  createKillData,
  getHittedShip,
  isWinner,
} from "../services/services.js";

export default function attack(data: any, isRandomAttack = false) {
  let { x: attackX, y: attackY, gameId, indexPlayer: curPlayerId } = data;
  const curGame = db.getGameById(gameId);

  if (curGame?.currentPlayerId !== curPlayerId) return true;
  if (isRandomAttack) {
    attackX = random(10);
    attackY = random(10);
  }

  console.log(isRandomAttack ? "random attack" : "attack");

  const enemyPlayer = [...curGame.players.values()].find(
    (player) => player.playerId !== curPlayerId
  );

  const { hittedShip, removeI, deadShip, isHit } = getHittedShip(
    enemyPlayer.ships,
    attackX,
    attackY
  );

  if (deadShip) {
    attackX = -1;
    attackY = -1;
  }

  if (hittedShip) enemyPlayer.ships.splice(removeI, 1, hittedShip);

  curGame.players.forEach((player, _) => {
    const resDataAr =
      isHit === "killed"
        ? createKillData(hittedShip, curPlayerId)
        : [
            {
              position: {
                x: attackX,
                y: attackY,
              },
              currentPlayer: curPlayerId,
              status: isHit,
            },
          ];

    resDataAr.forEach((data) => {
      const response = createResponse("attack", data);
      player.playerWs.send(response);
    });
  });

  return isWinner(enemyPlayer.ships, curPlayerId, gameId);
}