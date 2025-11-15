// -------------------------------------
// Settings Page (Server Component)
// File: app/app/settings/page.tsx
// -------------------------------------

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { SettingsForm } from "@/components/settings-form";

export default async function SettingsPage() {
    // later you can load this from your backend
    const fakeUser = {
        firstName: "Learner",
        lastName: "User",
        email: "you@example.com",
    };

    return (
        <div className="max-w-xl mx-auto px-4 py-6 space-y-6">
            <section className="space-y-2">
                <h1 className="text-2xl font-semibold">Settings</h1>
                <p className="text-sm text-muted-foreground">
                    Edit your basic account information.
                </p>
            </section>

            <Card>
                <CardHeader>
                    <CardTitle>Account details</CardTitle>
                    <CardDescription>These fields describe who you are.</CardDescription>
                </CardHeader>
                <CardContent>
                    {/* Client-side form with state */}
                    <SettingsForm initialUser={fakeUser} />
                </CardContent>
            </Card>
        </div>
    );
}
