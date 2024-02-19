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
  private usersMap = new Map<string, UserT>();
  private ws_users_Map = new Map<WebSocket, UserT>();
  // private onlineUsersSet = new Map<WebSocket, UserT>();
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

  setWsUsersMap(ws: WebSocket, newUser: UserT) {
    this.ws_users_Map.set(ws, newUser);
  }

  getUserByName(name: string) {
    this.foundUser = [...this.usersMap]
      .find(([_, user]) => user.name === name)
      ?.at(1) as UserT;
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
    if (this.foundUser) return null;
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

  createRoom(user_to_add: Omit<UserT, "password">) {
    const roomId = randomUUID();
    const roomUsers = [user_to_add];
    const newRoom: RoomT = {
      roomId,
      roomUsers,
    };
    this.rooms.push(newRoom);
    return newRoom;
  }

  //&& room.roomUsers[0].id !== myId
  getEmptyRoom(id: string) {
    return this.rooms.filter((room) => {
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
