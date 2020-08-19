import { validate } from "jsonschema";
import http from "http";
import sockjs from "sockjs";
import redis from "redis";

// Setup Redis pub/sub.
// NOTE: You must create two Redis clients, as
// the one that subscribes can't also publish.
const pub = redis.createClient();
const sub = redis.createClient();
sub.subscribe("global");

const clients: sockjs.Connection[] = [];
const handler = sockjs.createServer();

// Listen for messages being published to this server.
sub.on("message", function (channel, msg) {
  // Broadcast the message to all connected clients on this server.
  for (var i = 0; i < clients.length; i++) {
    clients[i].write(msg);
  }
});

const validate = (message, conn) => {
  const errors: string[] = [];
  return errors;
};

// Setup our SockJS server.
handler.on("connection", function (conn) {
  clients.push(conn);

  conn.on("data", function (message) {
    const verrs = validate(message, conn);
    if (verrs.length) {
      verrs.forEach((err) => conn.write(err));
    }
    pub.publish("global", message);
  });

  conn.on("close", function () {
    clients.splice(clients.indexOf(conn), 1);
  });
});

// Begin listening.
var server = http.createServer();
handler.installHandlers(server, { prefix: "/sockjs" });
server.listen(80);
