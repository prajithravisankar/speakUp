"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Define a TypeScript interface for our Character object
// This provides type safety and autocompletion.
interface Character {
  _id: string;
  characterId: string;
  name: string;
  role: string;
  avatarEmoji: string;
  vibe: string;
}

export default function HomePage() {
  const fakeUserName = "Learner"; // We'll update this later

  // Create a state variable to hold the list of characters.
  // It starts as an empty array.
  const [characters, setCharacters] = useState<Character[]>([]);

  // useEffect hook runs once when the component mounts.
  useEffect(() => {
    // Define an async function to fetch the characters.
    const fetchCharacters = async () => {
      try {
        // Fetch data from our backend API endpoint.
        const response = await fetch("http://localhost:3001/api/characters");
        const data = await response.json();

        if (data.success) {
          // If the fetch was successful, update our state with the character data.
          setCharacters(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch characters:", error);
      }
    };

    // Call the fetch function.
    fetchCharacters();
  }, []); // The empty dependency array [] means this effect runs only once.

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
      {/* Top: short welcome + main CTA */}
      <section className="space-y-3">
        <p className="text-sm text-muted-foreground">
          Welcome back, {fakeUserName} 👋
        </p>
        <h1 className="text-2xl font-semibold">
          Choose someone to practice English with.
        </h1>
        <p className="text-sm text-muted-foreground">
          Start a simple conversation. No pressure, just practice.
        </p>

        <Button asChild className="mt-2">
          {/* Link to the first character in the list, if it exists */}
          <Link href={`/app/character/${characters[0]?.characterId || ""}`}>
            <MessageCircle className="w-4 h-4 mr-2" />
            Start practicing now
          </Link>
        </Button>
      </section>

      {/* Characters list – now rendered from state */}
      <section className="space-y-3">
        <h2 className="text-sm font-medium text-muted-foreground">
          Characters
        </h2>

        <div className="grid gap-3 md:grid-cols-3">
          {characters.map((c) => (
            // Use the characterId for the link URL
            <Link key={c.characterId} href={`/app/character/${c.characterId}`}>
              <Card className="h-full cursor-pointer hover:bg-accent transition-colors">
                <CardHeader className="space-y-1">
                  <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-lg font-semibold mb-1">
                    {/* Use the avatarEmoji from the backend */}
                    {c.avatarEmoji}
                  </div>
                  <CardTitle className="text-base">{c.name}</CardTitle>
                  <CardDescription className="text-xs">
                    {c.role}
                  </CardDescription>
                  {/* The 'line' property doesn't exist in our backend model, so we remove it */}
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
