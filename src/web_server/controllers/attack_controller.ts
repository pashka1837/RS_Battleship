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
  console.log("enemy player", enemyPlayer);

  const typeOfShip = {
    1: "small",
    2: "medium",
    3: "large",
    4: "huge",
  };

  let isHit = "miss";

  let hittedShip = null;
  let newShip = null;
  let removeI = null;

  for (let z = 0; z < enemyPlayer.ships.length; z++) {
    const curShip = enemyPlayer.ships.at(z);
    let enemyX = curShip.position.x;
    let enemyY = curShip.position.y;
    const oldLength = curShip.length;
    console.log(hittedShip);

    for (let i = 0; i < curShip.length; i++) {
      if (curShip.direction) {
        if (enemyX !== attackX) break;
        if (enemyY !== attackY) {
          enemyY += 1;
          continue;
        }
        if (attackY === curShip.position.y) {
          curShip.position.y += 1;
          curShip.length -= 1;
          hittedShip = { ...curShip };
          break;
        }
        if (attackY === curShip.position.y + curShip.length - 1) {
          curShip.length -= 1;
          hittedShip = { ...curShip };
          break;
        }

        curShip.length = attackY - curShip.position.y;
        hittedShip = { ...curShip };

        newShip = {};
        newShip.position = {};

        newShip.position.x = curShip.position.x;
        newShip.length = oldLength - 1 - curShip.length;
        newShip.position.y = attackY + 1;
        newShip.type = typeOfShip[newShip.length];
        newShip.direction = true;
        break;
      }

      if (enemyY !== attackY) break;
      if (enemyX !== attackX) {
        enemyX += 1;
        continue;
      }
      if (attackX === curShip.position.x) {
        curShip.position.x += 1;
        curShip.length -= 1;
        hittedShip = { ...curShip };
        break;
      }
      if (attackX === curShip.position.x + curShip.length - 1) {
        curShip.length -= 1;
        hittedShip = { ...curShip };
        break;
      }

      curShip.length = attackX - curShip.position.x;
      hittedShip = { ...curShip };

      newShip = {};
      newShip.position = {};

      newShip.position.y = curShip.position.y;
      newShip.length = oldLength - 1 - curShip.length;
      newShip.position.x = attackX + 1;
      newShip.type = typeOfShip[newShip.length];
      newShip.direction = false;
      break;
    }
    if (hittedShip) {
      console.log("hitted ship", hittedShip);
      removeI = z;
      break;
    }
  }

  if (hittedShip) {
    isHit = hittedShip.length ? "shot" : "killed";
    hittedShip.length
      ? enemyPlayer.ships.splice(removeI, 1, hittedShip)
      : enemyPlayer.ships.splice(removeI, 1);
  }

  if (newShip) enemyPlayer.ships.push(newShip);

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
}

// enemyPlayer.ships.map((ship, i) => {
//     let enemyX = ship.position.x;
//     let enemyY = ship.position.y;
//     const oldLength = ship.length;

//     for (let i = 0; i < ship.length; i++) {
//       if (ship.direction) {
//         if (enemyX !== attackX) return ship;
//         if (enemyY !== attackY) {
//           enemyY += 1;
//           continue;
//         }
//         if (attackY === ship.position.y) {
//           ship.position.y -= 1;
//           ship.length -= 1;
//           break;
//         }
//         if (attackY === ship.position.y + ship.length - 1) {
//           ship.length -= 1;
//           //   ship.type = typeOfShip[ship.length];
//           break;
//         }
//         ship.length = attackY - ship.position.y;
//         newShip.position.x = ship.position.x;
//         newShip.length = oldLength - 1 - ship.length;
//         newShip.position.y = attackY + newShip.length;
//         newShip.type = typeOfShip[newShip.length];
//         newShip.direction = true;
//         break;
//       }

//       if (enemyY !== attackY) return ship;
//       if (enemyX !== attackX) {
//         enemyX += 1;
//         continue;
//       }
//       if (attackX === ship.position.x) {
//         ship.position.x -= 1;
//         ship.length -= 1;
//         // ship.type = typeOfShip[ship.length];
//         break;
//       }
//       if (attackX === ship.position.x + ship.length - 1) {
//         ship.length -= 1;
//         // ship.type = typeOfShip[ship.length];
//         break;
//       }

//       ship.length = attackX - ship.position.x;
//       ship.type = typeOfShip[ship.length];
//       newShip.position.y = ship.position.y;
//       newShip.length = oldLength - 1 - ship.length;
//       newShip.position.x = attackX + newShip.length;
//       newShip.type = typeOfShip[newShip.length];
//       newShip.direction = false;
//       break;
//     }

//     if (!ship.length) {
//       isHit = typeOfHit[0];
//       removeI = i;
//     } else if (ship.length < oldLength) isHit = typeOfHit[1];
//     else isHit = "";

//     console.log(
//       "isHit: ",
//       isHit,
//       "\n",
//       "oldL: ",
//       oldLength,
//       "\n",
//       "newL: ",
//       ship.length
//     );

//     return ship;
//   });

// for (let i = 0; i < ship.length; i++) {
//     if (enemyX === attackX && enemyY === attackY) {
//       if (!ship.length) {
//         isHit = typeOfHit[2];
//         return ship;
//       }
//       if (ship.direction) {
//         if (attackY === ship.position.y) {
//           ship.position.y -= 1;
//           ship.length -= 1;
//           // return ship;
//           break;
//         } else if (attackY === ship.position.y + ship.length - 1) {
//           ship.length -= 1;
//           ship.type = typeOfShip[ship.length];
//           // return ship;
//           break;
//         } else {
//           ship.length = attackY - ship.position.y;
//           newShip.position.x = ship.position.x;
//           newShip.length = oldLength - 1 - ship.length;
//           newShip.position.y = attackY + newShip.length;
//           newShip.type = typeOfShip[newShip.length];
//           // return ship;
//           break;
//         }
//       } else {
//         if (attackX === ship.position.x) {
//           ship.position.x -= 1;
//           ship.length -= 1;
//           ship.type = typeOfShip[ship.length];
//           // return ship;
//           break;
//         } else if (attackX === ship.position.x + ship.length - 1) {
//           ship.length -= 1;
//           ship.type = typeOfShip[ship.length];
//           // return ship;
//           break;
//         } else {
//           ship.length = attackX - ship.position.x;
//           ship.type = typeOfShip[ship.length];
//           newShip.position.y = ship.position.y;
//           newShip.length = oldLength - 1 - ship.length;
//           newShip.position.x = attackX + newShip.length;
//           newShip.type = typeOfShip[newShip.length];
//           // return ship;
//           break;
//         }
//       }
//     } else {
//       if (ship.direction) enemyY += 1;
//       else enemyX += 1;
//     }
//   }
