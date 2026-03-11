import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isRecovery, setIsRecovery] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Listen for the PASSWORD_RECOVERY event from the auth state change
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setIsRecovery(true);
      }
    });

    // Also check the URL hash for type=recovery (handles page refresh)
    const hash = window.location.hash;
    if (hash.includes("type=recovery")) {
      setIsRecovery(true);
    }

    return () => subscription.unsubscribe();
  }, []);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure both passwords are the same.",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) {
      toast({
        title: "Reset failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Password updated!",
        description: "Your password has been successfully reset.",
      });
      navigate("/my-account");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="py-16 md:py-24 bg-background">
        <div className="container-main max-w-md mx-auto">
          <h1 className="font-display text-3xl md:text-4xl text-foreground mb-8">
            Reset Password
          </h1>

          {!isRecovery ? (
            <div className="border border-border p-6 md:p-8">
              <p className="font-body text-foreground/80 mb-4">
                Please click the password reset link in your email to continue. If you haven't received one, go back to the{" "}
                <a href="/my-account" className="underline hover:no-underline text-foreground">
                  login page
                </a>{" "}
                and request a new link.
              </p>
            </div>
          ) : (
            <div className="border border-border p-6 md:p-8">
              <p className="font-body text-foreground/80 mb-6">
                Enter your new password below.
              </p>
              <form className="space-y-6" onSubmit={handleReset}>
                <div>
                  <Label htmlFor="new-password" className="font-body text-foreground">
                    New Password <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative mt-2">
                    <Input
                      id="new-password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="rounded-none border-foreground/30 pr-10"
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/60 hover:text-foreground"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                <div>
                  <Label htmlFor="confirm-password" className="font-body text-foreground">
                    Confirm Password <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="confirm-password"
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="mt-2 rounded-none border-foreground/30"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="rounded-none bg-foreground text-background hover:bg-foreground/90"
                >
                  {loading ? "Updating..." : "Update Password"}
                </Button>
              </form>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ResetPassword;
