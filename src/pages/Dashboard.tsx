import { useState } from "react";
import { Eye, EyeOff, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import heroBookImage from "@/assets/hero-book.jpg";
import helpStudentImage from "@/assets/help-section-student.jpg";

const Dashboard = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [userType, setUserType] = useState("customer");
  const [rememberMe, setRememberMe] = useState(false);

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

      {/* Login & Register Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container-main">
          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* Login Form */}
            <div>
              <h2 className="font-display text-3xl md:text-4xl text-foreground mb-8">
                Login
              </h2>
              <div className="border border-border p-6 md:p-8">
                <form className="space-y-6">
                  <div>
                    <Label htmlFor="login-email" className="font-body text-foreground">
                      Username or email address <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="login-email"
                      type="text"
                      className="mt-2 rounded-none border-foreground/30"
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
                        className="rounded-none border-foreground/30 pr-10"
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
                    <Button type="submit" className="rounded-none bg-foreground text-background hover:bg-foreground/90">
                      Log in
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
                <form className="space-y-6">
                  <div>
                    <Label htmlFor="register-email" className="font-body text-foreground">
                      Email address <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="register-email"
                      type="email"
                      className="mt-2 rounded-none border-foreground/30"
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
                  <Button type="submit" className="rounded-none bg-foreground text-background hover:bg-foreground/90">
                    Register
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Help Section */}
      <section className="py-16 md:py-24 bg-dark">
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
                <Button variant="outline" className="rounded-none border-text-light text-text-light bg-transparent hover:bg-text-light hover:text-dark">
                  Contact Us!
                </Button>
                <Button className="rounded-none bg-text-light text-dark hover:bg-text-light/90">
                  More Info
                </Button>
              </div>
            </div>
            <div className="flex justify-center lg:justify-end">
              <img
                src={helpStudentImage}
                alt="Student working on laptop"
                className="w-full max-w-lg h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Dashboard;
