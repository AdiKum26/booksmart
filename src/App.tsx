import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import AboutUs from "./pages/AboutUs";
import MyAccount from "./pages/MyAccount";
import Shop from "./pages/Shop";
import StoreList from "./pages/StoreList";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";

import JoinUs from "./pages/JoinUs";
import Terms from "./pages/Terms";
import ContactUs from "./pages/ContactUs";
import AiAssistant from "./components/AiAssistant";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/my-account" element={<MyAccount />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/store-list" element={<StoreList />} />
          <Route path="/join-us" element={<JoinUs />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/contact-us" element={<ContactUs />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      <AiAssistant />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
