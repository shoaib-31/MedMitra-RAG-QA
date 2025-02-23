import { History, Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { format, isToday, isYesterday, subDays, parseISO } from "date-fns";
import { ChatHistoryInterface } from "@/interfaces/chat-history";
import Link from "next/link";
import { usePathname } from "next/navigation";
import apiClient from "@/lib/axiosInstance";
import { useRecoilState } from "recoil";
import { chatHistoryState } from "@/atoms/chatHistory";

const ChatHistory: React.FC = () => {
  const pathname = usePathname();
  const [chatHistory, setChatHistory] = useRecoilState(chatHistoryState);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const response = await apiClient.get("/session-history");
        setChatHistory(response.data);
      } catch (error) {
        console.error("Error fetching chat history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChatHistory();
  }, []);

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
    <div className="flex flex-1 flex-col mt-4 rounded-lg p-2 text-sm text-gray-700">
      <div className="flex font-semibold items-center w-full p-3 gap-2 text-gray-700">
        <History size={18} /> Chat History
      </div>
      {loading ? (
        <div className="p-4 flex-1 justify-center flex items-center text-center text-gray-500">
          <Loader2 size={24} className=" animate-spin" />
        </div>
      ) : (
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
                  {chats.map((chat) => {
                    const isActive = pathname?.startsWith(`/chat/${chat.id}`);
                    return (
                      <Link key={chat.id} href={`/chat/${chat.id}`}>
                        <div
                          className={`flex items-center justify-between p-2 bg-white rounded-md shadow-sm hover:bg-gray-100 cursor-pointer ${
                            isActive
                              ? "bg-gray-300 hover:bg-gray-300 font-semibold"
                              : ""
                          }`}
                        >
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
                    );
                  })}
                </div>
              </div>
            ) : null
          )}
        </div>
      )}
    </div>
  );
};

export default ChatHistory;
