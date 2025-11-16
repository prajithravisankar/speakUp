// app/page.tsx
// Landing page for SpeakUp

import Link from "next/link";
import Image from "next/image";
import { MessageCircle, BarChart3, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-5xl mx-auto px-4 py-12 md:py-20 flex flex-col gap-12">
        {/* HERO SECTION */}
        <section className="flex flex-col md:flex-row items-center gap-10">
          {/* Left side: text + buttons */}
          <div className="flex-1 space-y-4">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              <Sparkles className="w-3 h-3" />
              AI-powered English speaking practice
            </span>

            <h1 className="text-3xl md:text-4xl font-semibold leading-tight">
              Practice real-life English with{" "}
              <span className="text-primary">friendly AI characters.</span>
            </h1>

            <p className="text-sm md:text-base text-muted-foreground max-w-xl">
              SpeakUp helps you practice everyday conversations with characters
              like a coworker, a close friend, or an ex. Make mistakes safely,
              learn natural phrases, and track your progress.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button asChild className="w-full sm:w-auto">
                <Link href="/auth/signup">Get started for free</Link>
              </Button>

              <Button asChild variant="outline" className="w-full sm:w-auto">
                <Link href="/auth/login">I already have an account</Link>
              </Button>
            </div>

            {/* Small reassurance text */}
            <p className="text-xs text-muted-foreground">
              No pressure, no grades — just gentle feedback and real practice.
            </p>
          </div>

          {/* Right side: simple mock chat card */}
          <div className="flex-1 w-full">
            <Card className="max-w-md mx-auto">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold">
                    M
                  </span>
                  Michael · Coworker
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="space-y-1">
                  <p className="text-[11px] uppercase text-muted-foreground">
                    Example chat
                  </p>
                  <div className="space-y-2">
                    {/* Character message */}
                    <div className="flex justify-start">
                      <div className="max-w-[70%] rounded-2xl rounded-bl-sm bg-muted px-3 py-2">
                        <p>Hey, how is your project going this week?</p>
                        <span className="mt-1 block text-[10px] text-muted-foreground">
                          09:15
                        </span>
                      </div>
                    </div>

                    {/* Learner message */}
                    <div className="flex justify-end">
                      <div className="max-w-[70%] rounded-2xl rounded-br-sm bg-primary px-3 py-2 text-primary-foreground">
                        <p>
                          I&apos;m doing good, but I still have some tasks left.
                        </p>
                        <span className="mt-1 block text-[10px] text-primary-foreground/70 text-right">
                          09:16
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Small hint that this is practice-based */}
                <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                  <MessageCircle className="w-3 h-3" />
                  <span>
                    Practice everyday conversations before you use them in real
                    life.
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">
                Practice real situations
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground space-y-1">
              <p>Office small talk with Michael.</p>
              <p>Casual chats with Angela.</p>
              <p>Tricky emotional talks with Alex.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Gentle corrections</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground space-y-1">
              <p>Notice common grammar mistakes.</p>
              <p>See better ways to say your ideas.</p>
              <p>Learn phrases you can reuse.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Insights that feel useful
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground space-y-1">
              <p>Track your sessions over time.</p>
              <p>See which grammar areas need work.</p>
              <p>Download a simple PDF summary.</p>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}
