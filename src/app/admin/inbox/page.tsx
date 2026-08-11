import { Metadata } from 'next';
import connectDB from '@/lib/mongodb';
import InboxMessage from '@/models/InboxMessage';
import InboxClientView from './InboxClientView';

export const metadata: Metadata = { title: 'Inbox Messages - Admin' };
export const dynamic = 'force-dynamic';

export default async function InboxPage() {
  await connectDB();
  const rawMessages = await InboxMessage.find().sort({ createdAt: -1 }).lean();

  const messages = rawMessages.map((msg) => ({
    id: (msg._id as { toString(): string }).toString(),
    name: msg.name,
    email: msg.email,
    subject: msg.subject,
    message: msg.message,
    read: msg.read,
    createdAt: msg.createdAt ? new Date(msg.createdAt).toISOString() : new Date().toISOString(),
  }));

  const unreadCount = messages.filter((m) => !m.read).length;

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Inbox Messages</h1>
          <p className="text-muted-foreground text-xs font-mono mt-1">
            Form Submissions ({unreadCount} unread / {messages.length} total)
          </p>
        </div>
      </div>

      <InboxClientView initialMessages={messages} />
    </div>
  );
}
