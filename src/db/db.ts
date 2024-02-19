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

class DB {
  private users: UserT[] = [];
  private rooms: RoomT[] = [];
  private roomsMap = new Map<string, RoomT>();
  private usersMap = new Map<string, UserT>();
  public ws_users_Map = new Map<WebSocket, UserT>();
  private foundUser: UserT | null = null;

  get getUsers() {
    return this.users;
  }
  get getRooms() {
    return this.rooms;
  }

  get getUsersMap() {
    return this.usersMap;
  }

  get getFoundUser() {
    return this.foundUser;
  }

  // setRooms() {
  //   this.rooms = this.rooms.filter((room) => room.roomUsers.length === 1);
  // }

  // getUserById(id: string) {
  //   return this.users.find((user) => user.id === id);
  // }

  // getUserByWS(ws:WebSocket){
  //   this.ws_users_Map.get(ws, newUser);
  // }

  // setWsUsersMap(ws: WebSocket, newUser: UserT) {
  //   this.ws_users_Map.set(ws, newUser);
  // }

  getUserByName(name: string) {
    this.foundUser = [...this.usersMap.values()].find(
      (user) => user.name === name
    );
  }
  // getUserByName(name: string) {
  //   return this.users.find((user) => user.name === name);
  // }

  isAuthUser(newUser: Omit<UserT, "id">) {
    this.getUserByName(newUser.name);
    if (!this.foundUser) return false;
    const newPassword = createHash("sha256")
      .update(newUser.password)
      .digest("hex");
    return newPassword === this.foundUser.password;
  }

  addNewUser(newUser: Omit<UserT, "id">) {
    // const foundUser = this.getUserByName(newUser.name);
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
    // this.users.push(createdUser);
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
    delete user_to_add.password;
    const roomUsers = [user_to_add];
    const newRoom: RoomT = {
      roomId,
      roomUsers,
    };
    this.roomsMap.set(roomId, newRoom);
    return newRoom;
  }

  //&& room.roomUsers[0].id !== myId
  getEmptyRooms(id: string) {
    return [...this.roomsMap.values()].filter((room) => {
      if (room.roomUsers.length === 1 && room.roomUsers[0].id !== id)
        return true;
      return false;
    });
  }

  addUserToRoom(user_to_add: Omit<UserT, "password">, roomId: string) {
    const curRoom = this.rooms.find((room) => {
      if (room.roomId === roomId && room.roomUsers[0].id !== user_to_add.id)
        return true;
      return false;
    });
    if (!curRoom) return false;
    curRoom.roomUsers.push(user_to_add);
    return curRoom;
  }
}

const db = new DB();
export default db;
