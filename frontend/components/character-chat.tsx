"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Define a type for the Character prop
interface Character {
  characterId: string;
  name: string;
}

// Update the Message type to match our backend model
type Message = {
  role: "user" | "model"; // 'user' for you, 'model' for the AI
  content: string;
  createdAt: string; // We'll use the timestamp from the backend
};

export function CharacterChat({ character }: { character: Character }) {
  const { getToken } = useAuth(); // Hook to get the auth token

  // State for the list of messages, now starting empty
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sessionId, setSessionId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false); // To show a loading state

  // Generate a unique session ID when the component mounts
  useEffect(() => {
    setSessionId(`session_${Date.now()}`);
  }, []);

  // This function now handles the entire API call process
  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || isLoading) return;

    setIsLoading(true);
    const userMessage: Message = {
      role: "user",
      content: text,
      createdAt: new Date().toISOString(),
    };

    // Optimistic UI update: show the user's message immediately
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      // Get the authentication token from Clerk
      const token = await getToken();

      // Call our backend API
      const response = await fetch(
        `http://localhost:3001/api/chat/${character.characterId}/message`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Send the token
          },
          body: JSON.stringify({
            message: text,
            sessionId: sessionId, // Send the session ID
          }),
        }
      );

      const result = await response.json();

      if (result.success) {
        // Add the AI's response to the message list
        setMessages((prev) => [...prev, result.data]);
      } else {
        console.error("API Error:", result.error);
        // Optional: Show an error message in the chat
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsLoading(false); // Stop loading state
    }
  }

  return (
    <Card className="mt-4 h-[70vh] flex flex-col">
      <CardHeader className="shrink-0">
        <CardTitle>Chat with {character.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col flex-1 min-h-0">
        {/* messages area - added proper scrolling */}
        <div className="flex-1 overflow-y-auto space-y-3 mb-3 pr-2">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex ${
                m.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${
                  m.role === "user"
                    ? "bg-primary text-primary-foreground rounded-br-sm"
                    : "bg-muted text-foreground rounded-bl-sm"
                } wrap-break-word whitespace-pre-wrap`}
              >
                <div>{m.content}</div>
                <span
                  className={`mt-1 text-[10px] block ${
                    m.role === "user"
                      ? "text-primary-foreground/70 text-right"
                      : "text-muted-foreground text-left"
                  }`}
                >
                  {new Date(m.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-muted text-foreground rounded-2xl px-3 py-2 text-sm rounded-bl-sm">
                {character.name} is typing...
              </div>
            </div>
          )}
        </div>

        {/* input area */}
        <form onSubmit={handleSend} className="flex gap-2 shrink-0">
          <Input
            placeholder={`Type a message to ${character.name}...`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Sending..." : "Send"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
