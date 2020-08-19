import http from "http";
import sockjs from "sockjs";
import redis from "redis";

// Setup Redis pub/sub. Need two Redis clients, as the one that subscribes can't also publish.
const pub = redis.createClient();
const sub = redis.createClient();
sub.subscribe("global");

type Connection = {
  conn: sockjs.Connection;
  uid?: string;
};

export enum RelayMessageType {
  Hello = "hello",
  Update = "update",
}

export type RelayMessage = {
  type: RelayMessageType;
  uid?: string;
  x?: number;
  y?: number;
  speaking?: boolean;
};

const clients: { [id: string]: Connection } = {};
const handler = sockjs.createServer();

// Listen for messages being published to this server.
sub.on("message", function (channel, msg) {
  // Broadcast to all connected clients
  for (const conn of Object.values(clients)) {
    conn.conn.write(msg);
  }
});

handler.on("connection", function (conn) {
  clients[conn.id] = { conn };

  conn.on("data", function (data) {
    console.log("data:", data);
    try {
      const client = clients[conn.id];
      const message: RelayMessage = JSON.parse(data);
      switch (message.type) {
        case RelayMessageType.Hello:
          if (client.uid) {
            throw new Error("Cannot set uid twice");
          }
          if (!message.uid) {
            throw new Error("Hello must have uid");
          }
          client.uid = message.uid;
          break;
        case RelayMessageType.Update:
          if (!client.uid) {
            throw new Error("Must Hello first");
          }
          if (message.uid !== client.uid) {
            throw new Error("UID mismatch");
          }
          if (!message.x || !message.y || !message.speaking) {
            throw new Error("Missing data");
          }
          pub.publish("global", JSON.stringify(message));
      }
    } catch (e) {
      conn.write(`Bad message: ${data}; error: ${e}`);
      conn.close();
    }
  });

  conn.on("close", function () {
    delete clients[conn.id];
  });
});

// Begin listening.
var server = http.createServer();
handler.installHandlers(server, { prefix: "/sockjs" });
server.listen(80);
