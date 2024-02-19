import { WebSocket } from "ws";

import db from "../../db/db.js";
import { createResponse } from "../../utils/utils.js";

export default function attack_controller(data: any, curWS: WebSocket) {
  console.log("attack");
  const { x: attackX, y: attackY, gameId, indexPlayer: curPlayerId } = data;

  const curGame = db.getGameById(gameId);
  const enemyPlayer = [...curGame.players.values()].find(
    (player) => player.playerId !== curPlayerId
  );

  let isHit = "miss";

  let hittedShip = null;
  let removeI = null;

  for (let z = 0; z < enemyPlayer.ships.length; z++) {
    const curShip = enemyPlayer.ships.at(z);
    let enemyX = curShip.position.x;
    let enemyY = curShip.position.y;

    if (curShip.direction && enemyX !== attackX) continue;
    if (!curShip.direction && enemyY !== attackY) continue;

    let start = curShip.direction ? enemyY : enemyX;
    let attack = curShip.direction ? attackY : attackX;
    let end = start + curShip.length - 1;

    while (start <= end) {
      let mid = Math.floor((end + start) / 2);
      if (attack === mid) {
        curShip.lifesLeft -= 1;
        hittedShip = { ...curShip };
        break;
      }
      if (attack < mid) {
        end = mid - 1;
      } else start = mid + 1;
    }

    if (hittedShip) {
      removeI = z;
      break;
    }
  }

  if (hittedShip) {
    isHit = hittedShip.lifesLeft ? "shot" : "killed";
    hittedShip.lifesLeft
      ? enemyPlayer.ships.splice(removeI, 1, hittedShip)
      : enemyPlayer.ships.splice(removeI, 1);
  }

  if (isHit !== "killed") {
    const resData = {
      position: {
        x: attackX,
        y: attackY,
      },
      currentPlayer: curPlayerId,
      status: isHit,
    };
    const response = createResponse("attack", resData);
    curWS.send(response);
  } else {
    Array.from({ length: hittedShip.length }).forEach((_, i) => {
      const resData = {
        position: {
          x: !hittedShip.direction
            ? hittedShip.position.x + i
            : hittedShip.position.x,
          y: hittedShip.direction
            ? hittedShip.position.y + i
            : hittedShip.position.y,
        },
        currentPlayer: curPlayerId,
        status: "killed",
      };
      const response = createResponse("attack", resData);
      curWS.send(response);
    });
  }
}

// for (let i = 0; i < curShip.length; i++) {
//   if (curShip.direction) {
//     if (enemyX !== attackX) break;
//     if (enemyY !== attackY) {
//       enemyY += 1;
//       continue;
//     }
//     curShip.lifesLeft -= 1;
//     hittedShip = { ...curShip };
//     break;
//   }
//   if (enemyY !== attackY) break;
//   if (enemyX !== attackX) {
//     enemyX += 1;
//     continue;
//   }
//   curShip.lifesLeft -= 1;
//   hittedShip = { ...curShip };
//   break;
// }
