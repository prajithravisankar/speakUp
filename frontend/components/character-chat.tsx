// -------------------------------------
// Chat UI for a character
// File: components/character-chat.tsx
// -------------------------------------
"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Message = {
    from: "you" | "character";
    text: string;
    time: string; // HH:MM
};

function getTimeString() {
    return new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
    });
}

export function CharacterChat({ characterName }: { characterName: string }) {
    // fake initial messages (with time)
    const [messages, setMessages] = useState<Message[]>(() => {
        const t = getTimeString();
        return [
            {
                from: "character",
                text: `Hey, I'm ${characterName}. Ready to practice today?`,
                time: t,
            },
            {
                from: "you",
                text: "Yes, I want to practice speaking more naturally.",
                time: t,
            },
        ];
    });

    const [input, setInput] = useState("");

    function handleSend(e: React.FormEvent) {
        e.preventDefault();
        const text = input.trim();
        if (!text) return;

        const t = getTimeString();

        setMessages((prev) => [...prev, { from: "you", text, time: t }]);
        setInput("");
    }

    return (
        <Card className="mt-4 h-[60vh] flex flex-col">
            <CardHeader>
                <CardTitle>Chat with {characterName}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col flex-1">
                {/* messages area */}
                <div className="flex-1 overflow-y-auto space-y-3 mb-3 pr-1">
                    {messages.map((m, idx) => (
                        <div
                            key={idx}
                            className={`flex ${
                                m.from === "you" ? "justify-end" : "justify-start"
                            }`}
                        >
                            <div
                                className={`
                  max-w-xs rounded-2xl px-3 py-2 text-sm
                  ${
                                    m.from === "you"
                                        ? "bg-primary text-primary-foreground rounded-br-sm"
                                        : "bg-muted text-foreground rounded-bl-sm"
                                }
                `}
                            >
                                <div>{m.text}</div>
                                <span
                                    className={`
                    mt-1 text-[10px] block
                    ${
                                        m.from === "you"
                                            ? "text-primary-foreground/70 text-right"
                                            : "text-muted-foreground text-left"
                                    }
                  `}
                                >
                  {m.time}
                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* input area */}
                <form onSubmit={handleSend} className="flex gap-2">
                    <Input
                        placeholder={`Type a message to ${characterName}...`}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    />
                    <Button type="submit">Send</Button>
                </form>
            </CardContent>
        </Card>
    );
}
