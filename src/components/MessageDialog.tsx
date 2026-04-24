import { useState, useEffect, useRef } from "react";
import { Send } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  read_at: string | null;
}

interface MessageDialogProps {
  productId: string;
  productTitle: string;
  sellerId: string;
  currentUserId: string;
  open: boolean;
  onClose: () => void;
  existingConversationId?: string;
}

const MessageDialog = ({
  productId,
  productTitle,
  sellerId,
  currentUserId,
  open,
  onClose,
  existingConversationId,
}: MessageDialogProps) => {
  const [conversationId, setConversationId] = useState<string | null>(existingConversationId ?? null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Load or create conversation on open
  useEffect(() => {
    if (!open) return;
    setLoading(true);
    setConversationId(existingConversationId ?? null);

    const init = async () => {
      let convId = existingConversationId ?? null;

      if (!convId) {
        const { data: existing } = await supabase
          .from("conversations")
          .select("id")
          .eq("product_id", productId)
          .eq("buyer_id", currentUserId)
          .maybeSingle();
        convId = existing?.id ?? null;
      }

      if (convId) {
        setConversationId(convId);
        const { data: msgs } = await supabase
          .from("messages")
          .select("*")
          .eq("conversation_id", convId)
          .order("created_at", { ascending: true });
        setMessages(msgs || []);

        // Mark unread messages as read
        await supabase
          .from("messages")
          .update({ read_at: new Date().toISOString() })
          .eq("conversation_id", convId)
          .neq("sender_id", currentUserId)
          .is("read_at", null);
      } else {
        setConversationId(null);
        setMessages([]);
      }
      setLoading(false);
    };

    init();
  }, [open, productId, currentUserId]);

  // Realtime subscription
  useEffect(() => {
    if (!conversationId) return;

    const channel = supabase
      .channel(`messages:${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          const newMsg = payload.new as Message;
          setMessages((prev) => {
            if (prev.some((m) => m.id === newMsg.id)) return prev;
            return [...prev, newMsg];
          });
          // Mark as read if the message is from the other party
          if (newMsg.sender_id !== currentUserId) {
            supabase
              .from("messages")
              .update({ read_at: new Date().toISOString() })
              .eq("id", newMsg.id);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, currentUserId]);

  const handleSend = async () => {
    const content = input.trim();
    if (!content || sending) return;

    setSending(true);
    let convId = conversationId;

    // Create conversation on first message
    if (!convId) {
      const { data: newConv, error } = await supabase
        .from("conversations")
        .insert({ product_id: productId, buyer_id: currentUserId, seller_id: sellerId })
        .select("id")
        .single();

      if (error || !newConv) {
        setSending(false);
        return;
      }
      convId = newConv.id;
      setConversationId(convId);
    }

    const optimistic: Message = {
      id: crypto.randomUUID(),
      conversation_id: convId,
      sender_id: currentUserId,
      content,
      created_at: new Date().toISOString(),
      read_at: null,
    };
    setMessages((prev) => [...prev, optimistic]);
    setInput("");

    const { data: inserted, error: msgError } = await supabase
      .from("messages")
      .insert({ conversation_id: convId, sender_id: currentUserId, content })
      .select()
      .single();

    if (!msgError && inserted) {
      // Replace optimistic message with real one
      setMessages((prev) =>
        prev.map((m) => (m.id === optimistic.id ? (inserted as Message) : m))
      );
    }

    setSending(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md rounded-none flex flex-col h-[500px] p-0">
        <DialogHeader className="px-6 py-4 border-b border-border flex-shrink-0">
          <DialogTitle className="font-display text-lg leading-tight">
            {productTitle}
          </DialogTitle>
        </DialogHeader>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3 min-h-0">
          {loading ? (
            <p className="text-center text-sm text-muted-foreground py-8">Loading...</p>
          ) : messages.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground py-8">
              No messages yet. Send a message to the seller!
            </p>
          ) : (
            messages.map((msg) => {
              const isOwn = msg.sender_id === currentUserId;
              return (
                <div
                  key={msg.id}
                  className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[75%] px-4 py-2 text-sm rounded-none ${
                      isOwn
                        ? "bg-foreground text-background"
                        : "bg-muted text-foreground"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="flex gap-2 px-6 py-4 border-t border-border flex-shrink-0">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="rounded-none border-border flex-1"
            disabled={sending}
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || sending}
            className="rounded-none bg-foreground text-background hover:bg-foreground/90 px-3"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MessageDialog;
