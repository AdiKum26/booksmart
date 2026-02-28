import { useState, useEffect } from "react";
import { Eye, EyeOff, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import heroBookImage from "@/assets/hero-book.jpg";
import helpStudentImage from "@/assets/help-section-stressed-student.jpg";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import type { User } from "@supabase/supabase-js";

const MyAccount = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [userType, setUserType] = useState("customer");
  const [rememberMe, setRememberMe] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();

  // Login state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // Register state
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerLoading, setRegisterLoading] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: loginEmail,
      password: loginPassword,
    });
    setLoginLoading(false);
    if (error) {
      toast({ title: "Login failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Welcome back!", description: "You have been logged in." });
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterLoading(true);
    const { error } = await supabase.auth.signUp({
      email: registerEmail,
      password: "", // Password will be set via the email link
      options: {
        emailRedirectTo: window.location.origin,
      },
    });
    setRegisterLoading(false);
    if (error) {
      toast({ title: "Registration failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Check your email", description: "A link to set your password has been sent." });
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({ title: "Logged out", description: "You have been signed out." });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[400px] flex items-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroBookImage})` }}
        >
          <div className="absolute inset-0 bg-black/60" />
        </div>
        <div className="container-main relative z-10">
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl text-text-light mb-4">
            My Account
          </h1>
          <p className="font-body text-lg md:text-xl text-text-light font-semibold mb-2">
            Save Money, Save Nature, Safe Future
          </p>
          <p className="font-body text-text-light/80">
            Just a college student who thinks that textbooks are overpriced
          </p>
        </div>
      </section>

      {/* Logged-in state */}
      {user ? (
        <section className="py-16 md:py-24 bg-background">
          <div className="container-main max-w-2xl">
            <h2 className="font-display text-3xl md:text-4xl text-foreground mb-6">
              Welcome back!
            </h2>
            <p className="font-body text-foreground/80 mb-4">
              Logged in as <strong>{user.email}</strong>
            </p>
            <Button onClick={handleLogout} className="rounded-none bg-foreground text-background hover:bg-foreground/90">
              Log out
            </Button>
          </div>
        </section>
      ) : (
        /* Login & Register Section */
        <section className="py-16 md:py-24 bg-background">
          <div className="container-main">
            <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
              {/* Login Form */}
              <div>
                <h2 className="font-display text-3xl md:text-4xl text-foreground mb-8">
                  Login
                </h2>
                <div className="border border-border p-6 md:p-8">
                  <form className="space-y-6" onSubmit={handleLogin}>
                    <div>
                      <Label htmlFor="login-email" className="font-body text-foreground">
                        Username or email address <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="login-email"
                        type="text"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        className="mt-2 rounded-none border-foreground/30"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="login-password" className="font-body text-foreground">
                        Password <span className="text-destructive">*</span>
                      </Label>
                      <div className="relative mt-2">
                        <Input
                          id="login-password"
                          type={showPassword ? "text" : "password"}
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
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
                    <div className="flex items-center gap-4">
                      <Button type="submit" disabled={loginLoading} className="rounded-none bg-foreground text-background hover:bg-foreground/90">
                        {loginLoading ? "Logging in..." : "Log in"}
                      </Button>
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id="remember"
                          checked={rememberMe}
                          onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                        />
                        <Label htmlFor="remember" className="font-body text-sm text-foreground">
                          Remember me
                        </Label>
                      </div>
                    </div>
                    <a href="#" className="inline-block font-body text-foreground underline hover:no-underline">
                      Lost your password?
                    </a>
                  </form>
                </div>
              </div>

              {/* Register Form */}
              <div>
                <h2 className="font-display text-3xl md:text-4xl text-foreground mb-8">
                  Register
                </h2>
                <div className="border border-border p-6 md:p-8">
                  <form className="space-y-6" onSubmit={handleRegister}>
                    <div>
                      <Label htmlFor="register-email" className="font-body text-foreground">
                        Email address <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="register-email"
                        type="email"
                        value={registerEmail}
                        onChange={(e) => setRegisterEmail(e.target.value)}
                        className="mt-2 rounded-none border-foreground/30"
                        required
                      />
                    </div>
                    <p className="font-body text-sm text-foreground/80">
                      A link to set a new password will be sent to your email address.
                    </p>
                    <RadioGroup value={userType} onValueChange={setUserType} className="space-y-4">
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="customer" id="customer" />
                        <Label htmlFor="customer" className="font-body text-foreground">
                          I am a customer
                        </Label>
                      </div>
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="vendor" id="vendor" />
                        <Label htmlFor="vendor" className="font-body text-foreground">
                          I am a vendor
                        </Label>
                      </div>
                    </RadioGroup>
                    <Button type="submit" disabled={registerLoading} className="rounded-none bg-foreground text-background hover:bg-foreground/90">
                      {registerLoading ? "Registering..." : "Register"}
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Help Section */}
      <section className="py-16 md:py-24 bg-black">
        <div className="container-main">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-display text-3xl md:text-4xl text-text-light mb-8 leading-tight">
                Found an Issue with your Account?
              </h2>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 text-text-light">
                  <Check className="w-5 h-5 flex-shrink-0" />
                  <span className="font-body">Contact one of our team members.</span>
                </li>
                <li className="flex items-center gap-3 text-text-light">
                  <Check className="w-5 h-5 flex-shrink-0" />
                  <span className="font-body">1 on 1 assistance with account creation!</span>
                </li>
                <li className="flex items-center gap-3 text-text-light">
                  <Check className="w-5 h-5 flex-shrink-0" />
                  <span className="font-body">Both on-site and online service.</span>
                </li>
              </ul>
              <div className="flex gap-4">
                <Button className="rounded-none bg-text-light text-dark hover:bg-text-light/90">
                  Contact Us!
                </Button>
                <Button variant="outline" className="rounded-none border-text-light text-text-light bg-transparent hover:bg-text-light hover:text-dark">
                  More Info
                </Button>
              </div>
            </div>
            <div className="flex justify-center lg:justify-end items-center">
              <img
                src={helpStudentImage}
                alt="Student working on laptop"
                className="w-full max-w-md lg:max-w-lg h-auto object-cover rounded-sm"
              />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default MyAccount;
