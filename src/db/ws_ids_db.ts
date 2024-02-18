import { WebSocket } from "ws";

const ws_ids_db = new Map<WebSocket, string>();

export default ws_ids_db;
