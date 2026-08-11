'use client';

import { useState } from 'react';
import { Mail, CheckCircle2, Trash2, Eye, MailOpen, User, Calendar } from 'lucide-react';
import { toggleReadStatus, deleteInboxMessage } from './actions';
import { toast } from 'sonner';

interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export default function InboxClientView({ initialMessages }: { initialMessages: Message[] }) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  const handleToggleRead = async (msg: Message) => {
    const res = await toggleReadStatus(msg.id, msg.read);
    if (res.success) {
      setMessages((prev) =>
        prev.map((m) => (m.id === msg.id ? { ...m, read: !m.read } : m))
      );
      if (selectedMessage?.id === msg.id) {
        setSelectedMessage({ ...selectedMessage, read: !msg.read });
      }
      toast.success(msg.read ? 'Marked as unread' : 'Marked as read');
    } else {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return;
    const res = await deleteInboxMessage(id);
    if (res.success) {
      setMessages((prev) => prev.filter((m) => m.id !== id));
      if (selectedMessage?.id === id) {
        setSelectedMessage(null);
      }
      toast.success('Message deleted');
    } else {
      toast.error('Failed to delete message');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Message List */}
      <div className={`lg:col-span-${selectedMessage ? '5' : '12'} space-y-3`}>
        {messages.length === 0 ? (
          <div className="p-12 text-center bg-card border border-border rounded-md">
            <Mail className="w-8 h-8 mx-auto text-muted-foreground mb-3" />
            <p className="text-sm font-medium text-foreground">No messages yet</p>
            <p className="text-xs text-muted-foreground mt-1">Form submissions will appear here.</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              onClick={() => {
                setSelectedMessage(msg);
                if (!msg.read) handleToggleRead(msg);
              }}
              className={`p-4 border rounded-md cursor-pointer transition-all ${
                selectedMessage?.id === msg.id
                  ? 'border-foreground bg-muted'
                  : msg.read
                  ? 'border-border bg-card opacity-80 hover:opacity-100 hover:border-foreground/50'
                  : 'border-border bg-card font-semibold'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  {!msg.read && <span className="w-2 h-2 rounded-full bg-foreground" />}
                  <span className="text-xs font-mono text-foreground truncate max-w-[150px]">{msg.name}</span>
                </div>
                <span className="text-[10px] font-mono text-muted-foreground shrink-0">
                  {new Date(msg.createdAt).toLocaleDateString()}
                </span>
              </div>
              <h3 className="text-sm font-bold text-foreground mt-2 line-clamp-1">{msg.subject}</h3>
              <p className="text-xs text-muted-foreground line-clamp-2 mt-1 font-sans font-normal">
                {msg.message}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Detail Pane */}
      {selectedMessage && (
        <div className="lg:col-span-7 bg-card border border-border rounded-md p-6 space-y-6 animate-in fade-in duration-150">
          <div className="flex items-start justify-between gap-4 border-b border-border pb-4">
            <div>
              <h2 className="text-lg font-bold text-foreground">{selectedMessage.subject}</h2>
              <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2 font-mono">
                <span className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5" />
                  {selectedMessage.name} &lt;{selectedMessage.email}&gt;
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(selectedMessage.createdAt).toLocaleString()}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleToggleRead(selectedMessage)}
                className="p-1.5 border border-border rounded-md hover:bg-muted text-foreground transition-colors cursor-pointer"
                title={selectedMessage.read ? 'Mark as Unread' : 'Mark as Read'}
              >
                {selectedMessage.read ? <Mail className="w-4 h-4" /> : <MailOpen className="w-4 h-4" />}
              </button>
              <button
                onClick={() => handleDelete(selectedMessage.id)}
                className="p-1.5 border border-border rounded-md hover:bg-destructive hover:text-destructive-foreground transition-colors cursor-pointer"
                title="Delete message"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="text-sm text-foreground leading-relaxed whitespace-pre-wrap font-sans">
            {selectedMessage.message}
          </div>

          <div className="pt-4 border-t border-border flex justify-end">
            <a
              href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(selectedMessage.subject)}`}
              className="inline-flex items-center gap-2 px-4 py-2 bg-foreground text-background text-xs font-semibold rounded-md hover:opacity-90 transition-opacity"
            >
              <Mail className="w-3.5 h-3.5" />
              Reply via Email
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
