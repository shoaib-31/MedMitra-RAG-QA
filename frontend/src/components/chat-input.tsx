"use client";
import React, { useState, useRef, useEffect } from "react";
import { SendHorizonal } from "lucide-react";
import { motion } from "framer-motion";
import apiClient from "@/lib/axiosInstance";
import { usePathname } from "next/navigation";
import { useSetRecoilState } from "recoil";
import { chatHistoryState } from "@/atoms/chatHistory";
import { messagesState } from "@/atoms/messages";

const ChatInput: React.FC = () => {
  const [text, setText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const pathname = usePathname();
  const session_id = pathname.split("/chat/")[1];
  const setChatHistoryState = useSetRecoilState(chatHistoryState);
  const setChatState = useSetRecoilState(messagesState);
  useEffect(() => {
    // Auto-focus the input field when the component mounts
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value);
    adjustTextareaHeight();
  };

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        Math.min(textareaRef.current.scrollHeight, 120) + "px";
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault(); // Prevents newline when Enter is pressed alone
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    if (text.trim() === "") return;
    const message = text;
    setText("");
    setChatState((prev) => [
      ...prev,
      {
        role: "user",
        message: message,
        timestamp: new Date().toISOString(),
      },
      {
        role: "bot",
        message: "Searching through guidelines...",
        timestamp: new Date().toISOString(),
      },
    ]);
    try {
      const { data } = await apiClient.post("/ask", {
        question: message,
        session_id,
      });
      if (!session_id) {
        window.history.pushState({}, "", `/chat/${data.session_id}`);
        setChatHistoryState((prev) => [
          ...prev,
          {
            id: data.session_id,
            title: data.title,
            date: new Date().toISOString(),
          },
        ]);
      }
      setChatState((prev) => [
        ...prev.slice(0, -1),
        {
          role: "bot",
          message: data.answer,
          timestamp: new Date().toISOString(),
          references: data.references,
        },
      ]);
    } catch (error: any) {
      setChatState((prev) => [
        ...prev.slice(0, -1),
        {
          role: "bot",
          message:
            "Sorry, I am not able to answer this question. Please try again later.",
          timestamp: new Date().toISOString(),
        },
      ]);
    }

    adjustTextareaHeight();
  };

  return (
    <motion.div
      className="font-open-sans flex gap-3 items-end w-full mt-6"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: 0.4, ease: "easeOut" }}
    >
      <textarea
        ref={textareaRef}
        className="w-full font-medium text-gray-700 shadow-md p-4 rounded-xl flex-1 border border-[#d9d9d9] focus:outline-none resize-none overflow-hidden"
        placeholder="Ask MedMitra AI..."
        rows={1}
        style={{ minHeight: "40px", maxHeight: "120px" }}
        value={text}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown} // Handle Enter key
      ></textarea>
      <motion.button
        className="h-14 w-14 bg-gradient-to-b from-[#4a90e2] to-[#4a90e2]/80 hover:to-[#4a90e2] transition-colors duration-150 ease-in-out shadow-lg flex items-center justify-center text-white rounded-xl"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleSubmit} // Handle button click to send message
      >
        <SendHorizonal />
      </motion.button>
    </motion.div>
  );
};

export default ChatInput;
