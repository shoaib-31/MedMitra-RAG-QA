import type { Metadata } from "next";
import "./globals.css";
import { Montserrat, Open_Sans } from "next/font/google";
import { cn } from "@/lib/utils";
import Sidebar from "@/components/sidebar";
import Provider from "@/components/provider";
import { ToastContainer } from "react-toastify";

const montserrat = Montserrat({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  variable: "--font-montserrat",
});

const openSans = Open_Sans({
  weight: ["300", "400", "500", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-opensans",
});

export const metadata: Metadata = {
  title: "MedMitra AI Chatbot",
  description: "Get your health queries answered by our AI Chatbot",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(montserrat.variable, openSans.variable, "antialiased")}
      >
        <Provider>
          <div className="flex w-full h-full min-h-screen">
            <Sidebar />
            <div className="flex-1 h-screen p-4">{children}</div>
          </div>
          <ToastContainer />
        </Provider>
      </body>
    </html>
  );
}
