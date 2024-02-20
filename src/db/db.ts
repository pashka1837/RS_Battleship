import { randomUUID, createHash } from "node:crypto";
import { WebSocket } from "ws";

type UserT = {
  name: string;
  password: string;
  id: `${string}-${string}-${string}-${string}-${string}`;
  isOnline: boolean;
  wins: number;
  roomId: string;
};

type roomUserT = {
  id: UserT["id"];
  name: UserT["name"];
  ws: WebSocket;
};

type RoomT = {
  roomId: `${string}-${string}-${string}-${string}-${string}`;
  roomUsers: roomUserT[];
};

type ShipT = {
  position: {
    x: number;
    y: number;
  };
  direction: boolean;
  type: "small" | "medium" | "large" | "huge";
  length: number;
  lifesLeft: number;
};

type PlayerT = {
  playerId: `${string}-${string}-${string}-${string}-${string}`;
  playerWs: WebSocket;
  ships: ShipT[];
};

type GameT = {
  gameId: `${string}-${string}-${string}-${string}-${string}`;
  players: Map<string, PlayerT>;
  currentPlayerId: string;
};

class DB {
  private gamesMap = new Map<string, GameT>();
  private roomsMap = new Map<string, RoomT>();
  private usersMap = new Map<string, UserT>();
  public ws_users_Map = new Map<WebSocket, UserT>();
  private foundUser: UserT | null = null;

  getGameById(id: string) {
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

  getUserByName(name: string) {
    this.foundUser = [...this.usersMap.values()].find(
      (user) => user.name === name
    );
  }

  isAuthUser(newUser: any) {
    this.getUserByName(newUser.name);
    if (!this.foundUser) return false;
    const newPassword = createHash("sha256")
      .update(newUser.password)
      .digest("hex");
    return newPassword === this.foundUser.password && this.foundUser;
  }

  addNewUser(newUser: any) {
    if (this.foundUser) {
      this.foundUser = null;
      return null;
    }
    const newPassword = createHash("sha256")
      .update(newUser.password)
      .digest("hex");
    const newId = randomUUID();
    const createdUser: UserT = {
      name: newUser.name,
      password: newPassword,
      id: newId,
      isOnline: false,
      wins: 0,
      roomId: "",
    };

    this.usersMap.set(createdUser.id, createdUser);
    return createdUser;
  }

  addNewRoom(creator_user: UserT, ws: WebSocket) {
    // const isAlreadyExists = [...this.roomsMap.values()].some((room) => {
    //   if (
    //     room.roomUsers.length === 1 &&
    //     room.roomUsers[0].id === user_to_add.id
    //   )
    //     return true;
    //   return false;
    // });
    const isAlreadyExists = creator_user.roomId ? true : false;
    if (isAlreadyExists) return null;
    const roomId = randomUUID();
    const roomUser: roomUserT = {
      id: creator_user.id,
      name: creator_user.name,
      ws,
    };
    const newRoom: RoomT = {
      roomId,
      roomUsers: [roomUser],
    };
    creator_user.roomId = roomId;
    this.roomsMap.set(roomId, newRoom);
    return newRoom;
  }

  getEmptyRooms(id: string) {
    return [...this.roomsMap.values()].filter((room) => {
      if (room.roomUsers.length === 1 && room.roomUsers[0].id !== id)
        return true;
      return false;
    });
  }

  addUserToRoom(user_to_add: UserT, roomID: string, ws: WebSocket) {
    const curRoom = this.roomsMap.get(roomID);
    const newRoomUser: roomUserT = {
      id: user_to_add.id,
      name: user_to_add.name,
      ws,
    };
    curRoom.roomUsers.push(newRoomUser);
    return curRoom;
  }

  addNewGame(newGame: any) {
    newGame.players = new Map<string, PlayerT>();
    newGame.currentPlayerId = "";
    this.gamesMap.set(newGame.gameId, newGame);
  }

  addGamePlayers(newPlayer: any, ws: WebSocket) {
    const curGame = this.gamesMap.get(newPlayer.gameId);
    const playerShips = newPlayer.ships.map((ship) => ({
      ...ship,
      lifesLeft: ship.length,
    }));
    const curPlayer: PlayerT = {
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
