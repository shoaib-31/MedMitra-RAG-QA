import ChatInput from "@/components/chat-input";
import ChatList from "@/components/chat-list";
import PreChat from "@/components/pre-chat";
import { ChatMessageInterface } from "@/interfaces/messge";
import React from "react";

export default function Home() {
  //   const messages: ChatMessageInterface[] = [
  //     {
  //       role: "user",
  //       message: "Give me recommendations on water quality",
  //     },
  //     {
  //       role: "bot",
  //       message:
  //         "**Recommendations for Water Quality**\n\nEnsure water quality by:\n\n* Implementing water quality monitoring in healthcare settings. [[1]](https://cdn.who.int/media/docs/default-source/ipc---wash/who_whe_infectious_diarrhoea_summary-(3)-(1).pdf?sfvrsn=68b25696_1&download=true)\n* Testing water for residual chlorine levels at the point of use (taps). Aim for 0.2–0.5 mg/L. [[1]](https://cdn.who.int/media/docs/default-source/ipc---wash/who_whe_infectious_diarrhoea_summary-(3)-(1).pdf?sfvrsn=68b25696_1&download=true)\n\n**Related Follow-up Questions:**\n\n* What additional measures can I take to ensure water safety in healthcare environments?\n* How often should water quality be monitored in healthcare facilities?\n* What types of disinfectants are recommended for water treatment in healthcare settings?\n\n**References:**\n- [**Infectious Diarrhoea summary**](https://cdn.who.int/media/docs/default-source/ipc---wash/who_whe_infectious_diarrhoea_summary-(3)-(1).pdf?sfvrsn=68b25696_1&download=true)",
  //     },
  //   ];
  const messages: ChatMessageInterface[] = [];
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
