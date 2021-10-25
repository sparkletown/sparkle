export interface SendMessageProps {
  message: string;
}

export type SendJukeboxMessage = (
  sendMessageProps: SendMessageProps
) => Promise<void | undefined>;
