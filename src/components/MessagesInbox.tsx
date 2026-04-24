import { useState, useEffect } from "react";
import { MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import MessageDialog from "@/components/MessageDialog";

interface Conversation {
  id: string;
  product_id: string | null;
  buyer_id: string;
  seller_id: string;
  updated_at: string;
  products: { id: string; title: string; user_id: string } | null;
  unread_count: number;
}

interface MessagesInboxProps {
  userId: string;
}

const MessagesInbox = ({ userId }: MessagesInboxProps) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeConv, setActiveConv] = useState<Conversation | null>(null);

  const fetchConversations = async () => {
    const { data } = await supabase
      .from("conversations")
      .select("*, products(id, title, user_id)")
      .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
      .order("updated_at", { ascending: false });

    if (!data) {
      setLoading(false);
      return;
    }

    // Fetch unread counts for each conversation
    const withUnread = await Promise.all(
      data.map(async (conv) => {
        const { count } = await supabase
          .from("messages")
          .select("id", { count: "exact", head: true })
          .eq("conversation_id", conv.id)
          .neq("sender_id", userId)
          .is("read_at", null);

        return {
          ...conv,
          products: conv.products as { id: string; title: string; user_id: string } | null,
          unread_count: count ?? 0,
        };
      })
    );

    setConversations(withUnread);
    setLoading(false);
  };

  useEffect(() => {
    fetchConversations();
  }, [userId]);

  // Subscribe to new messages to refresh unread counts
  useEffect(() => {
    const channel = supabase
      .channel("inbox-updates")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        () => fetchConversations()
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "messages" },
        () => fetchConversations()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  const handleOpenConv = (conv: Conversation) => {
    setActiveConv(conv);
  };

  const handleCloseDialog = () => {
    setActiveConv(null);
    fetchConversations(); // Refresh unread counts after closing
  };

  const totalUnread = conversations.reduce((sum, c) => sum + c.unread_count, 0);

  return (
    <div className="border border-border mb-8">
      <div className="flex items-center gap-3 px-6 py-4 border-b border-border">
        <MessageSquare className="w-5 h-5" />
        <h3 className="font-display text-xl text-foreground">Messages</h3>
        {totalUnread > 0 && (
          <Badge className="bg-foreground text-background rounded-none px-2 py-0.5 text-xs">
            {totalUnread}
          </Badge>
        )}
      </div>

      {loading ? (
        <p className="px-6 py-8 text-sm text-muted-foreground">Loading messages...</p>
      ) : conversations.length === 0 ? (
        <p className="px-6 py-8 text-sm text-muted-foreground">
          No messages yet. When a buyer contacts you about a listing, it will appear here.
        </p>
      ) : (
        <ul className="divide-y divide-border">
          {conversations.map((conv) => {
            const isBuying = conv.buyer_id === userId;
            const productTitle = conv.products?.title ?? "Deleted listing";

            return (
              <li key={conv.id}>
                <button
                  className="w-full flex items-center justify-between px-6 py-4 hover:bg-muted/50 transition-colors text-left"
                  onClick={() => handleOpenConv(conv)}
                >
                  <div className="min-w-0">
                    <p className="font-body text-sm font-medium text-foreground truncate">
                      {productTitle}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {isBuying ? "You are buying" : "You are selling"}
                    </p>
                  </div>
                  {conv.unread_count > 0 && (
                    <Badge className="bg-foreground text-background rounded-none px-2 py-0.5 text-xs ml-4 flex-shrink-0">
                      {conv.unread_count} new
                    </Badge>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {activeConv && activeConv.products && (
        <MessageDialog
          productId={activeConv.products.id}
          productTitle={activeConv.products.title}
          sellerId={activeConv.seller_id}
          currentUserId={userId}
          open={true}
          onClose={handleCloseDialog}
          existingConversationId={activeConv.id}
        />
      )}
    </div>
  );
};

export default MessagesInbox;
