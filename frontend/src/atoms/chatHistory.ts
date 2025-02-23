import { ChatHistoryInterface } from "@/interfaces/chat-history";
import { atom } from "recoil";

export const chatHistoryState = atom<ChatHistoryInterface[]>({
  key: "chatHistoryState",
  default: [],
});
