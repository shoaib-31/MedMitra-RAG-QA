"use client";
import React, { useState, useRef, useEffect } from "react";
import { SendHorizonal } from "lucide-react";
import { motion } from "framer-motion";

const ChatInput: React.FC = () => {
  const [text, setText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

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

  const handleSubmit = () => {
    if (text.trim() === "") return;
    console.log("Message sent:", text); // Replace this with actual send function
    setText(""); // Clear input after sending
    adjustTextareaHeight();
  };

  return (
    <motion.div
      className="font-open-sans flex gap-3 items-end w-full mt-6"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 1.2, ease: "easeOut" }}
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
