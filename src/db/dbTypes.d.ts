import { WebSocket } from "ws";

export type UserT = {
  name: string;
  password: string;
  id: `${string}-${string}-${string}-${string}-${string}`;
  isOnline: boolean;
  wins: number;
  roomId: string;
  botId: string;
};

export type roomUserT = {
  id: UserT["id"];
  name: UserT["name"];
  ws: WebSocket;
};

export type RoomT = {
  roomId: `${string}-${string}-${string}-${string}-${string}`;
  roomUsers: roomUserT[];
};

export type ShipT = {
  position: {
    x: number;
    y: number;
  };
  direction: boolean;
  type: "small" | "medium" | "large" | "huge";
  length: number;
  lifesLeft: number;
};

export type PlayerT = {
  playerId: `${string}-${string}-${string}-${string}-${string}`;
  playerWs: WebSocket;
  ships: ShipT[];
};

export type GameT = {
  gameId: `${string}-${string}-${string}-${string}-${string}`;
  players: Map<string, PlayerT>;
  currentPlayerId: string;
};
