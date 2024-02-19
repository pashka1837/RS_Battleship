import { randomUUID, createHash } from "node:crypto";
import { WebSocket } from "ws";

type UserT = {
  name: string;
  password: string;
  id: `${string}-${string}-${string}-${string}-${string}`;
  isOnline: boolean;
};

type RoomT = {
  roomId: `${string}-${string}-${string}-${string}-${string}`;
  roomUsers: Omit<UserT, "password">[];
};

type ShipT = {
  position: {
    x: number;
    y: number;
  };
  direction: boolean;
  type: "small" | "medium" | "large" | "huge";
  length: number;
};

// type PlayerMapT = Map<string, PlayerT>;

type PlayerT = {
  playerId: `${string}-${string}-${string}-${string}-${string}`;
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

  get getFoundUser() {
    return this.foundUser;
  }

  getUserByName(name: string) {
    this.foundUser = [...this.usersMap.values()].find(
      (user) => user.name === name
    );
  }

  isAuthUser(newUser: Omit<UserT, "id">) {
    this.getUserByName(newUser.name);
    if (!this.foundUser) return false;
    const newPassword = createHash("sha256")
      .update(newUser.password)
      .digest("hex");
    return newPassword === this.foundUser.password;
  }

  addNewUser(newUser: Omit<UserT, "id">) {
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
    };

    this.usersMap.set(createdUser.id, createdUser);
    return createdUser;
  }

  createRoom(user_to_add: UserT) {
    const isAlreadyExists = [...this.roomsMap.values()].find((room) => {
      if (
        room.roomUsers.length === 1 &&
        room.roomUsers[0].id === user_to_add.id
      )
        return true;
      return false;
    });
    if (isAlreadyExists) return null;
    const roomId = randomUUID();
    const newUser = { ...user_to_add };
    delete newUser.password;
    const roomUsers = [user_to_add];
    const newRoom: RoomT = {
      roomId,
      roomUsers,
    };
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

  addUserToRoom(user_to_add: UserT, roomID: string) {
    const curRoom = this.roomsMap.get(roomID);
    const newUser = { ...user_to_add };
    delete newUser.password;
    curRoom.roomUsers.push(newUser);
    return curRoom;
  }

  addNewGame(newGame: any) {
    newGame.players = new Map<string, PlayerT>();
    newGame.currentPlayerId = "";
    this.gamesMap.set(newGame.gameId, newGame);
  }

  addGamePlayers(newPlayer: any) {
    const curGame = this.gamesMap.get(newPlayer.gameId);
    const curPlayer: PlayerT = {
      playerId: newPlayer.indexPlayer,
      ships: newPlayer.ships,
    };
    curGame.players.set(curPlayer.playerId, curPlayer);
    return curGame;
  }
}

const db = new DB();
export default db;
