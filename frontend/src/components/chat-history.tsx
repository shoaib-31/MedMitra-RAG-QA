import { History } from "lucide-react";
import React from "react";
import { format, isToday, isYesterday, subDays, parseISO } from "date-fns";
import { ChatHistoryInterface } from "@/interfaces/chat-history";
import Link from "next/link";

const ChatHistory: React.FC = () => {
  const chatHistory: ChatHistoryInterface[] = [
    { id: "1", title: "Water Issues checking disease", date: "2025-02-23" },
    { id: "2", title: "Water Issues", date: "2025-02-22" },
    { id: "3", title: "Water Issues", date: "2025-02-18" },
    { id: "4", title: "Water Issues", date: "2025-02-02" },
  ];

  const categories: Record<string, ChatHistoryInterface[]> = {
    today: [],
    yesterday: [],
    last7Days: [],
    last30Days: [],
  };

  chatHistory.forEach((chat) => {
    const chatDate = parseISO(chat.date);
    if (isToday(chatDate)) {
      categories.today.push(chat);
    } else if (isYesterday(chatDate)) {
      categories.yesterday.push(chat);
    } else if (chatDate >= subDays(new Date(), 7)) {
      categories.last7Days.push(chat);
    } else if (chatDate >= subDays(new Date(), 30)) {
      categories.last30Days.push(chat);
    }
  });

  return (
    <div className="flex flex-col mt-4 rounded-lg p-2 text-sm text-gray-700">
      <div className="flex font-semibold items-center w-full p-3 gap-2 text-gray-700">
        <History size={18} /> Chat History
      </div>
      <div className="flex flex-col gap-2 w-full">
        {Object.entries(categories).map(([category, chats]) =>
          chats.length > 0 ? (
            <div key={category} className="mb-2">
              <div className="text-xs font-semibold text-gray-500 uppercase p-2">
                {category === "today"
                  ? "Today"
                  : category === "yesterday"
                  ? "Yesterday"
                  : category === "last7Days"
                  ? "Last 7 Days"
                  : "Last 30 Days"}
              </div>
              <div className="flex flex-col gap-1">
                {chats.map((chat) => (
                  <Link key={chat.id} href={`/chat/${chat.id}`}>
                    <div className="flex items-center justify-between p-2 bg-white rounded-md shadow-sm hover:bg-gray-100 cursor-pointer">
                      <div
                        className="text-xs font-medium truncate max-w-[150px]"
                        title={chat.title}
                      >
                        {chat.title.length > 20
                          ? chat.title.substring(0, 20) + "..."
                          : chat.title}
                      </div>
                      <div className="text-xs text-gray-400 whitespace-nowrap">
                        {format(parseISO(chat.date), "MMM dd, yyyy")}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ) : null
        )}
      </div>
    </div>
  );
};

export default ChatHistory;
