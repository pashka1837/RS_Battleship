import { addUserToRoom, attack, createRoom, reg, turn, updateRoom, winner, addShips, singlePlay, } from "./controllers/index.js";
export default function controller(message, ws) {
    const req = JSON.parse(message);
    const { type, data: dataJSON } = req;
    const data = dataJSON ? JSON.parse(dataJSON) : null;
    switch (type) {
        case "reg":
            {
                const isSuccessfull = reg(data, ws);
                if (isSuccessfull) {
                    updateRoom();
                    winner();
                }
            }
            break;
        case "create_room":
            {
                createRoom(ws);
                updateRoom();
            }
            break;
        case "add_user_to_room":
            {
                addUserToRoom(data.indexRoom, ws);
            }
            break;
        case "add_ships":
            {
                const isGameStarted = addShips(ws, data);
                if (isGameStarted)
                    turn(data.gameId);
            }
            break;
        case "attack":
            {
                const isGameFinsished = attack(data);
                if (!isGameFinsished)
                    turn(data.gameId);
            }
            break;
        case "randomAttack":
            {
                const isGameFinsished = attack(data, true);
                if (!isGameFinsished)
                    turn(data.gameId);
            }
            break;
        case "single_play":
            singlePlay(ws);
            break;
        default:
            console.log("kek");
    }
}
//# sourceMappingURL=controller.js.map