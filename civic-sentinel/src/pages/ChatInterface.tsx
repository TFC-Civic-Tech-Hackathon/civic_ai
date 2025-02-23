import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import axios from "axios";
import { query } from "@/services/ChatService";
import "./ChatInterface.css";
type Message = {
  sender: "user" | "bot";
  text: string;
};
export const TypingIndicator: React.FC = () => {
  return (
    <div className="typing-dots">
      <span>.</span>
      <span>.</span>
      <span>.</span>
    </div>
  );
};

const ChatInterface: React.FC = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    try {
      setIsLoading(true);

      // Add user message to chat
      const userMessage: Message = { sender: "user", text: input };
      setMessages((prev) => [...prev, userMessage]);

      // Send query to backend
      const response = await query(input);
      if (response) {
        // Add bot response to chat
        const botMessage: Message = {
          sender: "bot",
          text: response.response,
        };
        setMessages((prev) => [...prev, botMessage]);
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error("Error:", error);
      const errorMessage: Message = {
        sender: "bot",
        text: "Sorry, there was an error processing your request.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setInput("");
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col h-[90vh]">
        {/* Header with Back Button */}
        <header className="flex items-center p-4 border-b">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mr-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold">Chat</h1>
        </header>

        {/* Chat Messages */}
        <div className="flex flex-col flex-1 p-4 overflow-y-auto bg-gray-100">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`mb-4 p-3 rounded-md max-w-xs ${
                msg.sender === "user"
                  ? "bg-blue-500 text-white self-end"
                  : "bg-white text-gray-800 self-start"
              }`}
            >
              {msg.text}
            </div>
          ))}
          {isLoading ? (
            <div className="mb-4 p-3 rounded-md max-w-xs bg-white text-gray-800 self-start">
              <TypingIndicator />
            </div>
          ) : null}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="p-4 border-t">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              disabled={isLoading}
              className="flex-grow"
            />
            <Button type="submit" disabled={isLoading}>
              {"Send"}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default ChatInterface;
