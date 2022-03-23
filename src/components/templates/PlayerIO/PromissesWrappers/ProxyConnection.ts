import { connection, Message } from "../PlayerIO";

export class ProxyConnection {
  constructor(public originConnection: connection) {}

  get connected() {
    return this.originConnection.connected;
  }

  public addMessageCallback<T>(
    type: string,
    callback: (m: Message<T>) => void
  ) {
    return this.originConnection.addMessageCallback<T>(type, callback);
  }

  public createMessage<T extends object>(type: string) {
    return this.originConnection.createMessage<T>(type);
  }

  public disconnect() {
    return this.originConnection.disconnect();
  }

  public sendMessage<T>(m: Message<T>) {
    return this.originConnection.sendMessage<T>(m);
  }
}
