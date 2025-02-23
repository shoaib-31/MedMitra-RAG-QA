"use client";
import { messagesState } from "@/atoms/messages";
import ChatInput from "@/components/chat-input";
import ChatList from "@/components/chat-list";
import PreChat from "@/components/pre-chat";
import React from "react";
import { useRecoilValue } from "recoil";

export default function Home() {
  const messages = useRecoilValue(messagesState);
  return (
    <div className="w-full h-full bg-[#f4f8fb] rounded-2xl flex justify-center">
      <div className="lg:max-w-4xl w-full flex flex-col gap-2 p-4 h-full">
        <div className="flex-1 overflow-auto no-scrollbar ">
          {messages.length > 0 ? <ChatList messages={messages} /> : <PreChat />}
        </div>
        <ChatInput />
      </div>
    </div>
  );
}
