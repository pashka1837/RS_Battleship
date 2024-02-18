import { randomUUID, createHash } from "node:crypto";

type UserT = {
  name: string;
  password: string;
  id: `${string}-${string}-${string}-${string}-${string}`;
};

type RoomT = {
  roomId: `${string}-${string}-${string}-${string}-${string}`;
  roomUsers: Omit<UserT, "password">[];
};

class DB {
  private users: UserT[] = [];
  private rooms: RoomT[] = [];

  get getUsers() {
    return this.users;
  }
  get getRooms() {
    return this.rooms;
  }

  getUserById(id: string) {
    return this.users.find((user) => user.id === id);
  }

  getUserByName(name: string) {
    return this.users.find((user) => user.name === name);
  }

  isAuthUser(newUser: Omit<UserT, "id">) {
    const foundUser = this.getUserByName(newUser.name);
    if (!foundUser) return false;
    const newPassword = createHash("sha256")
      .update(newUser.password)
      .digest("hex");
    return newPassword === foundUser.password;
  }

  addNewUser(newUser: Omit<UserT, "id">) {
    const foundUser = this.getUserByName(newUser.name);
    if (foundUser) return null;
    const newPassword = createHash("sha256")
      .update(newUser.password)
      .digest("hex");
    const newId = randomUUID();
    const createdUser = {
      name: newUser.name,
      password: newPassword,
      id: newId,
    };
    this.users.push(createdUser);
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
  getEmptyRoom() {
    return (
      this.rooms.find((room) => {
        if (room.roomUsers.length === 1) return true;
        return false;
      }) || null
    );
  }

  addUserToRoom(user_to_add: Omit<UserT, "password">, roomId: string) {
    const curRoom = this.rooms.find((room) => room.roomId === roomId);
    curRoom.roomUsers.push(user_to_add);
  }
}

const db = new DB();
export default db;
