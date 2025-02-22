import React from "react";
import ChatMessage from "./chat-message";
import { ChatMessageInterface } from "@/interfaces/messge";

interface ChatListProps {
  messages: ChatMessageInterface[];
}

const ChatList = ({ messages }: ChatListProps) => {
  return (
    <div className=" ">
      {messages.map((msg, index) => (
        <ChatMessage key={index} message={msg.message} role={msg.role} />
      ))}
    </div>
  );
};

export default ChatList;
