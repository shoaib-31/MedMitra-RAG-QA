import ChatInput from "@/components/chat-input";
import ChatList from "@/components/chat-list";
import PreChat from "@/components/pre-chat";
import { ChatMessageInterface } from "@/interfaces/messge";
import React from "react";

export default function Home() {
  const messages: ChatMessageInterface[] = [
    {
      role: "user",
      message: "Give me recommendations on water quality",
    },
    {
      role: "bot",
      message:
        "**Recommendations on Water Quality**\n\nTo ensure the safety of drinking water, it is crucial to implement water quality monitoring [1]. If water treatment is conducted on-site, the water should be tested for residual chlorine at the point of use to ensure levels between 0.2–0.5 mg/L [1]. Additionally, wastewater should be connected to an appropriate sewage system [1].\n\n**Related follow-up questions:**\n\n* What specific health concerns or symptoms do you have?\n* Have you consulted with a healthcare professional about your health concerns?\n* Would you like to ask any other health-related questions?\n\n**References:**\n['**Infectious Diarrhoea summary** by WHO - [Source](https://cdn.who.int/media/docs/default-source/ipc---wash/who_whe_infectious_diarrhoea_summary-(3)-(1).pdf?sfvrsn=68b25696_1&download=true)']",
    },
  ];
  // const messages: ChatMessageInterface[] = [];
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
