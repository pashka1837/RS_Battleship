import { readFile } from "node:fs";
import { dirname, resolve } from "node:path";
import { createServer } from "node:http";
import { webSoscketServer } from "../web_server/web_server.js";
export const httpServer = createServer((req, res) => {
    const __dirname = resolve(dirname(""));
    const filePath = __dirname + (req.url === "/" ? "/front/index.html" : "/front" + req.url);
    readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404);
            res.end(JSON.stringify(err));
            return;
        }
        res.writeHead(200);
        res.end(data);
    });
});
httpServer.on("upgrade", (request, socket, head) => {
    console.log(request.url);
    webSoscketServer.handleUpgrade(request, socket, head, (ws) => {
        webSoscketServer.emit("connection", ws, request);
    });
});
//# sourceMappingURL=index.js.map