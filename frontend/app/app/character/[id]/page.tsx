// ----------------------------------------
// CHARACTER PAGE (simple + chat only)
// File: app/app/character/[id]/page.tsx
// ----------------------------------------

import { MessageCircle, PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CharacterChat } from "@/components/character-chat";

// Define a TypeScript interface for our Character object
interface Character {
  _id: string;
  characterId: string;
  name: string;
  role: string;
  avatarEmoji: string;
  vibe: string;
}

// This async function fetches the specific character's data from the backend.
async function getCharacter(id: string): Promise<Character | null> {
  // If id is not provided, don't even try to fetch.
  if (!id) return null;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/characters/${id}`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      return null;
    }

    const result = await response.json();
    return result.success ? result.data : null;
  } catch (error) {
    console.error("Failed to fetch character:", error);
    return null;
  }
}

// This is a Server Component that fetches data before rendering.
export default async function CharacterPage({
  params,
}: {
  // The parameter name 'id' must match the folder name '[id]'
  params: { id: string };
}) {
  // Use params.id to get the character's ID from the URL
  const resolvedParams = await params;
  const character = await getCharacter(resolvedParams.id);

  if (!character) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-6">
        <p className="text-lg font-medium mb-2">Character not found.</p>
        <p className="text-sm text-muted-foreground">
          This character could not be loaded from the backend.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      {/* TOP: simple header, now using data from the backend */}
      <section className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 shrink-0 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-semibold">
            {character.avatarEmoji}
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

      {/* MIDDLE: chat component */}
      <CharacterChat character={character} />
    </div>
  );
}
