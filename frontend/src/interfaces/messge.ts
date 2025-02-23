export interface ChatMessageInterface {
  role: "bot" | "user";
  message: string;
  timestamp: string;
  references?: string;
}
