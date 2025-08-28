import http from "http";
import app from "./src/app.js";
import {
  normalizePort,
  onError,
  onListening,
} from "./src/utils/serverHandlers.js";

const port = normalizePort(process.env.PORT || 8000);

app.set("port", port);

const server = http.createServer(app);

// server listen
server.listen(port);

// server handlers
server.on("error", (error) => onError(error, port));

server.on("listening", onListening.bind(server));
