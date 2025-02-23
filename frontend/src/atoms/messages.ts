import { ChatMessageInterface } from "@/interfaces/messge";
import { atom } from "recoil";

export const messagesState = atom<ChatMessageInterface[]>({
  key: "messagesState",
  default: [],
});
