"use client";
import { messagesState } from "@/atoms/messages";
import ChatInput from "@/components/chat-input";
import ChatList from "@/components/chat-list";
import apiClient from "@/lib/axiosInstance";
import { Loader2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useRef } from "react";
import { useRecoilState } from "recoil";

export default function Page() {
  const [messages, setMessages] = useRecoilState(messagesState);
  const pathname = usePathname();
  const session_id = pathname.split("/chat/")[1];
  const router = useRouter();
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const fetchMessages = async () => {
    if (!session_id) {
      router.push("/");
      return;
    }
    const { data } = await apiClient.get(`/history/${session_id}`);
    setMessages(data.messages);
  };

  useEffect(() => {
    fetchMessages();
    return () => {
      setMessages([]);
    };
  }, [session_id]);

  // Scroll to bottom when messages update
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="w-full h-full bg-[#f4f8fb] rounded-2xl flex justify-center">
        <div className="lg:max-w-4xl w-full flex flex-col gap-2 p-4 h-full">
          <div className="flex-1 overflow-auto no-scrollbar ">
            <div className="h-full flex items-center justify-center w-full">
              <Loader2 size={24} className="animate-spin" />
            </div>
          </div>
          <ChatInput />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-[#f4f8fb] rounded-2xl flex justify-center">
      <div className="lg:max-w-4xl w-full flex flex-col gap-2 p-4 h-full">
        <div className="flex-1 overflow-auto no-scrollbar">
          <ChatList messages={messages} />
          <div ref={chatEndRef} />
        </div>
        <ChatInput />
      </div>
    </div>
  );
}
