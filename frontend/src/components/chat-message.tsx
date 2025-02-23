import { cn } from "@/lib/utils";
import { CircleUser } from "lucide-react";
import Image from "next/image";
import React from "react";
import ReactMarkdown from "react-markdown";
import botImage from "@/assets/bot.svg";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import { ChatMessageInterface } from "@/interfaces/messge";
import { motion } from "framer-motion";

const ChatMessage = ({ role, message }: ChatMessageInterface) => {
  message = message.replace(/\n/g, "  \n");

  const isSearchingMessage = message == "Searching through guidelines...";

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={cn(
        "flex w-full justify-start font-open-sans ",
        role == "bot" ? "flex-row" : "flex-row-reverse"
      )}
    >
      <div className="p-2">
        {role == "bot" ? (
          <Image
            src={botImage}
            alt="Bot"
            width={35}
            height={35}
            className="rounded-full p-1"
          />
        ) : (
          <CircleUser color="#4a90e2" className="size-8 " />
        )}
      </div>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className={cn(
          "max-w-[80%] p-2 px-4 rounded-xl",
          role == "bot" ? "" : " bg-[#E8EDF1] flex items-center"
        )}
      >
        {role == "bot" ? (
          !isSearchingMessage ? (
            <ReactMarkdown
              components={{
                ul: ({ ...props }) => (
                  <ul className="list-disc pl-5" {...props} />
                ),
                ol: ({ ...props }) => (
                  <ol className="list-decimal pl-5" {...props} />
                ),
                strong: ({ ...props }) => (
                  <strong className="font-bold" {...props} />
                ),
                a: ({ ...props }) => (
                  <a
                    className="text-blue-700 text-sm underline"
                    target="_blank"
                    {...props}
                  />
                ),
              }}
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
            >
              {message}
            </ReactMarkdown>
          ) : (
            <motion.span
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="text-blue-500"
            >
              {message}
            </motion.span>
          )
        ) : (
          message
        )}
      </motion.div>
    </motion.div>
  );
};

export default ChatMessage;
