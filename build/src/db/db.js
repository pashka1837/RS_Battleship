import { randomUUID, createHash } from "node:crypto";
class DB {
    gamesMap = new Map();
    roomsMap = new Map();
    usersMap = new Map();
    ws_users_Map = new Map();
    foundUser = null;
    getGameById(id) {
        return this.gamesMap.get(id);
    }
    get getGameMap() {
        return this.gamesMap;
    }
    get getUsersMap() {
        return this.usersMap;
    }
    get getRoomsMap() {
        return this.roomsMap;
    }
    getUserByName(name) {
        this.foundUser = [...this.usersMap.values()].find((user) => user.name === name);
    }
    isAuthUser(newUser) {
        this.getUserByName(newUser.name);
        if (!this.foundUser)
            return false;
        const newPassword = createHash("sha256")
            .update(newUser.password)
            .digest("hex");
        return newPassword === this.foundUser.password && this.foundUser;
    }
    addNewUser(newUser) {
        if (this.foundUser) {
            this.foundUser = null;
            return null;
        }
        const newPassword = createHash("sha256")
            .update(newUser.password)
            .digest("hex");
        const newId = randomUUID();
        const createdUser = {
            name: newUser.name,
            password: newPassword,
            id: newId,
            isOnline: false,
            wins: 0,
            roomId: "",
            botId: "",
        };
        this.usersMap.set(createdUser.id, createdUser);
        return createdUser;
    }
    addNewRoom(creator_user, ws) {
        const isAlreadyExists = creator_user.roomId ? true : false;
        if (isAlreadyExists)
            return null;
        const roomId = randomUUID();
        const roomUser = {
            id: creator_user.id,
            name: creator_user.name,
            ws,
        };
        const newRoom = {
            roomId,
            roomUsers: [roomUser],
        };
        creator_user.roomId = roomId;
        this.roomsMap.set(roomId, newRoom);
        return newRoom;
    }
    getEmptyRooms(id) {
        return [...this.roomsMap.values()].filter((room) => {
            if (room.roomUsers.length === 1 && room.roomUsers[0].id !== id)
                return true;
            return false;
        });
    }
    addUserToRoom(user_to_add, roomID, ws) {
        const curRoom = this.roomsMap.get(roomID);
        const newRoomUser = {
            id: user_to_add.id,
            name: user_to_add.name,
            ws,
        };
        curRoom.roomUsers.push(newRoomUser);
        return curRoom;
    }
    addNewGame(newGame) {
        newGame.players = new Map();
        newGame.currentPlayerId = "";
        this.gamesMap.set(newGame.gameId, newGame);
    }
    addGamePlayers(newPlayer, ws) {
        const curGame = this.gamesMap.get(newPlayer.gameId);
        const playerShips = newPlayer.ships.map((ship) => ({
            ...ship,
            lifesLeft: ship.length,
        }));
        const curPlayer = {
            playerId: newPlayer.indexPlayer,
            ships: playerShips,
            playerWs: ws,
        };
        curGame.players.set(curPlayer.playerId, curPlayer);
        return curGame;
    }
}
const db = new DB();
export default db;
//# sourceMappingURL=db.js.map