"use client";
import React from "react";
import logo from "@/assets/logo.svg";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Bot, CirclePlus, History } from "lucide-react";
import ChatHistory from "./chat-history";

const Sidebar = () => {
  const pathname = usePathname();

  const navItems = [
    { name: "Chatbot", path: "/", icon: <Bot size={20} /> },
    { name: "Ingest", path: "/ingest", icon: <CirclePlus size={20} /> },
  ];

  return (
    <div className="font-open-sans flex flex-col h-screen bg-[#f4f8fb] w-60 p-4 relative">
      {/* Logo */}
      <div className="bg-gradient-to-r font-montserrat gap-2 text-2xl w-full flex justify-center from-[#4A90E2] via-[#32A852] to-[#008080] bg-clip-text text-transparent font-bold">
        <Image src={logo} alt="MedMitra AI" width={30} height={30} />
        MedMitra AI
      </div>

      {/* Navigation Items */}
      <div className="flex flex-col mt-10 space-y-2 relative">
        {navItems.map((item, index) => (
          <Link key={index} href={item.path} className="relative">
            {pathname === item.path && (
              <motion.div
                className="absolute left-0 w-full h-full bg-[#d9ecff] rounded-lg"
                layoutId="activeIndicator"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              />
            )}
            <div
              className={`relative z-10 flex font-semibold items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                pathname === item.path
                  ? "text-[#4A90E2] "
                  : "text-gray-600 hover:text-[#4A90E2]"
              }`}
            >
              {item.icon} {item.name}
            </div>
          </Link>
        ))}
      </div>
      <ChatHistory />
    </div>
  );
};

export default Sidebar;
