"use client";
import React from "react";
import { motion } from "framer-motion";
import { BookCheck, Bot, FileUser } from "lucide-react";
import { cn } from "@/lib/utils";

const PreChat = () => {
  const features = [
    {
      title: "Verified Medical Sources",
      description:
        "All information is sourced from WHO guidelines and trusted medical references, ensuring accuracy and reliability.",
      iconColor: "text-[#4A90E2]",
      icon: BookCheck,
    },
    {
      title: "AI-Powered Insights",
      description:
        "Get instant, research-backed answers with AI-driven analysis based on scientific evidence.",
      iconColor: "text-[#32A852]", // Green for health
      icon: Bot,
    },
    {
      title: "Personalized Follow-ups",
      description:
        "Receive custom follow-up questions to explore related topics and enhance your understanding.",
      iconColor: "text-[#008080]", // Teal for reassurance
      icon: FileUser,
    },
  ];

  return (
    <motion.div
      className="w-full h-full flex flex-col items-center justify-center font-montserrat px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Header Section */}
      <motion.div
        className="text-center font-bold py-4 text-gray-600 text-4xl flex items-center justify-center"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        Welcome to&nbsp;
        <span className="bg-gradient-to-r from-[#4A90E2] via-[#32A852] to-[#008080] bg-clip-text text-transparent font-bold">
          MedMitra AI
        </span>
        &nbsp;Chatbot!
      </motion.div>

      {/* Features Section */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 w-full max-w-4xl"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15 }, // Slightly increased delay
          },
        }}
      >
        {features.map((feature, index) => (
          <motion.div
            key={index}
            className="flex flex-col p-6 gap-3 border border-[#E0EFFF] bg-white shadow-lg rounded-2xl"
            initial={{ y: 30, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.03, transition: { duration: 0.1 } }}
            transition={{
              duration: 0.4,
              delay: index * 0.15, // Consistent delay per card
              ease: "easeOut",
              type: "spring",
              stiffness: 100,
            }} // Added spring effect to smooth out scaling
          >
            <div
              className={cn(
                "text-lg flex flex-col gap-2 font-semibold",
                feature.iconColor
              )}
            >
              <feature.icon size={28} />
              {feature.title}
            </div>
            <div className="text-sm text-gray-600 font-open-sans">
              {feature.description}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Call to Action */}
      <motion.div
        className="text-lg text-gray-700 font-medium mt-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 1, ease: "easeOut" }}
      >
        Ask Me Anything!
      </motion.div>
    </motion.div>
  );
};

export default PreChat;
