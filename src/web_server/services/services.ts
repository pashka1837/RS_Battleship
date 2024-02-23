import db from "../../db/db.js";
import { ShipT } from "../../db/dbTypes.js";
import { createResponse } from "../../utils/utils.js";
import winner_controller from "../controllers/winner_controller.js";

export function isWinner(
  enemyShips: ShipT[],
  curPlayerId: string,
  gameId: string
) {
  if (enemyShips.some((ship) => ship.lifesLeft)) return false;
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

export function getHittedShip(
  enemyShips: ShipT[],
  attackX: number,
  attackY: number
) {
  let hittedShip: null | ShipT = null;
  let removeI: null | number = null;
  let deadShip = false;
  let isHit = "miss";

  for (let z = 0; z < enemyShips.length; z++) {
    const curShip = enemyShips.at(z);
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
        if (curShip.lifesLeft === 0) {
          deadShip = true;
          break;
        }
        curShip.lifesLeft -= 1;
        hittedShip = { ...curShip };
        break;
      }
      if (attack < mid) {
        end = mid - 1;
      } else start = mid + 1;
    }

    if (deadShip) break;

    if (hittedShip) {
      removeI = z;
      break;
    }
  }
  if (hittedShip) isHit = hittedShip.lifesLeft ? "shot" : "killed";

  return {
    hittedShip,
    removeI,
    deadShip,
    isHit,
  };
}

export function createKillData(hittedShip: ShipT, curPlayerId: string) {
  const resData = [];
  Array.from({ length: hittedShip.length }).forEach((_, i) => {
    const killData = {
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
    resData.push(killData);

    for (let y = 0; y < 2; y++) {
      let x: number;
      if (y % 2 === 0) x = -1;
      else x = 1;
      const missData = {
        position: {
          x: !hittedShip.direction
            ? hittedShip.position.x + i
            : hittedShip.position.x + x,
          y: hittedShip.direction
            ? hittedShip.position.y + i
            : hittedShip.position.y + x,
        },
        currentPlayer: curPlayerId,
        status: "miss",
      };
      // if (
      //   missData.position.x >= 0 &&
      //   missData.position.y >= 0 &&
      //   missData.position.x <= 10 &&
      //   missData.position.y <= 0
      // ) {
      //   resData.push(missData);
      // }
      resData.push(missData);
    }
  });

  for (let y = 0; y < 2; y++) {
    let posX: number, posY: number, x: number;
    if (y % 2 === 0) x = -1;
    else x = hittedShip.length;
    if (!hittedShip.direction) {
      posY = hittedShip.position.y - 1;
      posX = hittedShip.position.x;
    } else {
      posY = hittedShip.position.y;
      posX = hittedShip.position.x - 1;
    }
    for (let z = 0; z < 3; z++) {
      const missData = {
        position: {
          x: !hittedShip.direction ? hittedShip.position.x + x : posX,
          y: hittedShip.direction ? hittedShip.position.y + x : posY,
        },
        currentPlayer: curPlayerId,
        status: "miss",
      };
      // if (
      //   missData.position.x >= 0 &&
      //   missData.position.y >= 0 &&
      //   missData.position.x <= 10 &&
      //   missData.position.y <= 0
      // ) {
      //   resData.push(missData);
      // }
      resData.push(missData);

      posX++;
      posY++;
    }
  }
  return resData;
}
