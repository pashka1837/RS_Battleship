import { addCellsToCheck } from "../logic.js";
export default function botAttack(bot, data, unvisitedCells, cellsToCheck) {
    if (data.currentPlayer !== bot.id)
        return false;
    const position = {
        x: data.position.x,
        y: data.position.y,
    };
    unvisitedCells.delete(`${position.x}${position.y}`);
    if (data.status === "shot") {
        addCellsToCheck(position.x, position.y, cellsToCheck, unvisitedCells);
    }
    return true;
}
//# sourceMappingURL=bot_attack.js.map