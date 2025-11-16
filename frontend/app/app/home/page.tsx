// -------------------------------------
// Simple Home Page
// File: app/app/home/page.tsx
// -------------------------------------

// ==== testing =====

"use client";

import { useSession } from "@clerk/nextjs";
import { useEffect } from "react";

// ==== testing =====

import Link from "next/link";
import { MessageCircle } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const characters = [
  {
    id: "michael",
    name: "Michael",
    role: "Coworker",
    line: "Practice office English and small talk.",
  },
  {
    id: "angela",
    name: "Angela",
    role: "College friend",
    line: "Practice casual conversations about life.",
  },
  {
    id: "alex",
    name: "Alex",
    role: "High school ex",
    line: "Practice difficult or emotional conversations.",
  },
];

export default function HomePage() {
  const fakeUserName = "Learner";

  //   TODO: TEMP CODE SHOULD BE DETLETED USING TO TEST ON POSTMAN
  const { session } = useSession();

  useEffect(() => {
    const getToken = async () => {
      if (session) {
        const token = await session.getToken();
        console.log("--- CLERK SESSION TOKEN ---");
        console.log(token);
        console.log("--- COPY THE TOKEN ABOVE ---");
      }
    };
    getToken();
  }, [session]);
  //   TODO:  TEMP CODE SHOULD BE DETLETED USING TO TEST ON POSTMAN

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
          <Link href="/app/character/michael">
            <MessageCircle className="w-4 h-4 mr-2" />
            Start practicing now
          </Link>
        </Button>
      </section>

      {/* Characters list – very simple cards */}
      <section className="space-y-3">
        <h2 className="text-sm font-medium text-muted-foreground">
          Characters
        </h2>

        <div className="grid gap-3 md:grid-cols-3">
          {characters.map((c) => (
            <Link key={c.id} href={`/app/character/${c.id}`}>
              <Card className="h-full cursor-pointer hover:bg-accent transition-colors">
                <CardHeader className="space-y-1">
                  {/* Avatar circle with initial */}
                  <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-lg font-semibold mb-1">
                    {c.name.substring(0, 1)}
                  </div>
                  <CardTitle className="text-base">{c.name}</CardTitle>
                  <CardDescription className="text-xs">
                    {c.role}
                  </CardDescription>
                  <p className="text-xs text-muted-foreground mt-1">{c.line}</p>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
