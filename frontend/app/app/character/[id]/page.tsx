// ----------------------------------------
// CHARACTER PAGE (simple + chat only)
// File: app/app/character/[id]/page.tsx
// ----------------------------------------

import { MessageCircle, PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CharacterChat } from "@/components/character-chat";

type CharacterConfig = {
    id: string;
    name: string;
    role: string;
    vibe: string;
};

const characterConfigs: Record<string, CharacterConfig> = {
    michael: {
        id: "michael",
        name: "Michael",
        role: "Coworker",
        vibe: "Semi-formal, supportive, professional small talk.",
    },
    angela: {
        id: "angela",
        name: "Angela",
        role: "College friend",
        vibe: "Casual, warm, emoji-friendly.",
    },
    alex: {
        id: "alex",
        name: "Alex",
        role: "High school ex",
        vibe: "A bit emotional, reflective, sometimes awkward.",
    },
};

// Next 16: params is a Promise
export default async function CharacterPage({
                                                params,
                                            }: {
    params: Promise<{ id: string }>;
}) {
    const resolved = await params;
    const id = resolved.id.toLowerCase();
    const character = characterConfigs[id];

    if (!character) {
        return (
            <div className="max-w-3xl mx-auto px-4 py-6">
                <p className="text-lg font-medium mb-2">Character not found.</p>
                <p className="text-sm text-muted-foreground">
                    This character doesn&apos;t exist yet. Try Michael, Angela, or Alex.
                </p>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
            {/* TOP: simple header */}
            <section className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <div className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-semibold">
                        {character.name.substring(0, 1)}
                    </div>

                    <div>
                        <p className="text-xs uppercase tracking-wide text-muted-foreground">
                            {character.role}
                        </p>
                        <h1 className="text-2xl font-semibold">{character.name}</h1>
                        <p className="text-xs text-muted-foreground mt-1">
                            {character.vibe}
                        </p>
                    </div>
                </div>

                {/* Buttons – visual only */}
                <div className="flex gap-2">
                    <Button type="button">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Text chat
                    </Button>
                    <Button type="button" variant="outline">
                        <PhoneCall className="w-4 h-4 mr-2" />
                        Voice chat
                    </Button>
                </div>
            </section>

            {/* MIDDLE: chat only */}
            <CharacterChat characterName={character.name} />
        </div>
    );
}
