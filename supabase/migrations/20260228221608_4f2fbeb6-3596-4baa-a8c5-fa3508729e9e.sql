
-- Categories table for majors/subjects
CREATE TABLE public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Everyone can read categories
CREATE POLICY "Categories are viewable by everyone"
ON public.categories FOR SELECT USING (true);

-- Seed default categories
INSERT INTO public.categories (name) VALUES
  ('Computer Science'),
  ('Economics'),
  ('Business'),
  ('Mathematics'),
  ('Engineering'),
  ('Biology'),
  ('Chemistry'),
  ('Physics'),
  ('Psychology'),
  ('English'),
  ('History'),
  ('Political Science'),
  ('Communications'),
  ('Sociology'),
  ('Art'),
  ('Music'),
  ('Philosophy'),
  ('Nursing'),
  ('Education'),
  ('Other');

-- Stores table for vendors
CREATE TABLE public.stores (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  phone TEXT,
  email TEXT,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.stores ENABLE ROW LEVEL SECURITY;

-- Everyone can view stores
CREATE POLICY "Stores are viewable by everyone"
ON public.stores FOR SELECT USING (true);

-- Vendors can create their own store
CREATE POLICY "Users can create their own store"
ON public.stores FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Vendors can update their own store
CREATE POLICY "Users can update their own store"
ON public.stores FOR UPDATE USING (auth.uid() = user_id);

-- Vendors can delete their own store
CREATE POLICY "Users can delete their own store"
ON public.stores FOR DELETE USING (auth.uid() = user_id);

-- Products table for textbooks
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  store_id UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  category_id UUID REFERENCES public.categories(id),
  title TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10,2) NOT NULL,
  original_price NUMERIC(10,2),
  image_url TEXT,
  on_sale BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Everyone can view products
CREATE POLICY "Products are viewable by everyone"
ON public.products FOR SELECT USING (true);

-- Vendors can create products in their store
CREATE POLICY "Users can create their own products"
ON public.products FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Vendors can update their own products
CREATE POLICY "Users can update their own products"
ON public.products FOR UPDATE USING (auth.uid() = user_id);

-- Vendors can delete their own products
CREATE POLICY "Users can delete their own products"
ON public.products FOR DELETE USING (auth.uid() = user_id);

-- Create storage bucket for product images
INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true);

-- Storage policies for product images
CREATE POLICY "Product images are publicly accessible"
ON storage.objects FOR SELECT USING (bucket_id = 'product-images');

CREATE POLICY "Authenticated users can upload product images"
ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'product-images' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update their own product images"
ON storage.objects FOR UPDATE USING (bucket_id = 'product-images' AND auth.role() = 'authenticated');

CREATE POLICY "Users can delete their own product images"
ON storage.objects FOR DELETE USING (bucket_id = 'product-images' AND auth.role() = 'authenticated');

-- Update timestamp function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_stores_updated_at
BEFORE UPDATE ON public.stores
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
