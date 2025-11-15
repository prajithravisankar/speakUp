import { ChatNavbar } from "@/components/chat-navbar";

export default function AppLayout({
  children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div>
            <ChatNavbar />
            <div className="p-6">{children}</div>
        </div>
    );
}
