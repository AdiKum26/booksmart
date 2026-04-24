CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  buyer_id UUID NOT NULL,
  seller_id UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT unique_conversation_per_buyer_product UNIQUE (product_id, buyer_id)
);

CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  read_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_conversations_buyer_id ON public.conversations (buyer_id);
CREATE INDEX IF NOT EXISTS idx_conversations_seller_id ON public.conversations (seller_id);
CREATE INDEX IF NOT EXISTS idx_conversations_updated_at ON public.conversations (updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id_created_at ON public.messages (conversation_id, created_at);
CREATE INDEX IF NOT EXISTS idx_messages_unread_by_conversation ON public.messages (conversation_id, read_at);

CREATE OR REPLACE FUNCTION public.sync_conversation_participants()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  product_owner_id UUID;
BEGIN
  IF NEW.product_id IS NULL THEN
    RAISE EXCEPTION 'Conversation must belong to a product';
  END IF;

  SELECT user_id
  INTO product_owner_id
  FROM public.products
  WHERE id = NEW.product_id;

  IF product_owner_id IS NULL THEN
    RAISE EXCEPTION 'Product not found';
  END IF;

  NEW.seller_id := product_owner_id;

  IF NEW.buyer_id = NEW.seller_id THEN
    RAISE EXCEPTION 'You cannot create a conversation with your own listing';
  END IF;

  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.touch_conversation_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  UPDATE public.conversations
  SET updated_at = now()
  WHERE id = NEW.conversation_id;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_conversation_participants ON public.conversations;
CREATE TRIGGER set_conversation_participants
BEFORE INSERT OR UPDATE OF product_id, buyer_id ON public.conversations
FOR EACH ROW
EXECUTE FUNCTION public.sync_conversation_participants();

DROP TRIGGER IF EXISTS update_conversation_timestamp_on_message ON public.messages;
CREATE TRIGGER update_conversation_timestamp_on_message
AFTER INSERT ON public.messages
FOR EACH ROW
EXECUTE FUNCTION public.touch_conversation_updated_at();

ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Participants can view their conversations" ON public.conversations;
CREATE POLICY "Participants can view their conversations"
ON public.conversations
FOR SELECT
TO authenticated
USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

DROP POLICY IF EXISTS "Buyers can start conversations for other users listings" ON public.conversations;
CREATE POLICY "Buyers can start conversations for other users listings"
ON public.conversations
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = buyer_id);

DROP POLICY IF EXISTS "Participants can update their conversations" ON public.conversations;
CREATE POLICY "Participants can update their conversations"
ON public.conversations
FOR UPDATE
TO authenticated
USING (auth.uid() = buyer_id OR auth.uid() = seller_id)
WITH CHECK (auth.uid() = buyer_id OR auth.uid() = seller_id);

DROP POLICY IF EXISTS "Participants can view messages" ON public.messages;
CREATE POLICY "Participants can view messages"
ON public.messages
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.conversations c
    WHERE c.id = messages.conversation_id
      AND (c.buyer_id = auth.uid() OR c.seller_id = auth.uid())
  )
);

DROP POLICY IF EXISTS "Participants can send messages" ON public.messages;
CREATE POLICY "Participants can send messages"
ON public.messages
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = sender_id
  AND EXISTS (
    SELECT 1
    FROM public.conversations c
    WHERE c.id = messages.conversation_id
      AND (c.buyer_id = auth.uid() OR c.seller_id = auth.uid())
  )
);

DROP POLICY IF EXISTS "Participants can mark messages as read" ON public.messages;
CREATE POLICY "Participants can mark messages as read"
ON public.messages
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.conversations c
    WHERE c.id = messages.conversation_id
      AND (c.buyer_id = auth.uid() OR c.seller_id = auth.uid())
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.conversations c
    WHERE c.id = messages.conversation_id
      AND (c.buyer_id = auth.uid() OR c.seller_id = auth.uid())
  )
);

ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;