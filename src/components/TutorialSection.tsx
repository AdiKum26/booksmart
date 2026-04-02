import { Check } from "lucide-react";
import geometricPattern from "@/assets/geometric-pattern.jpg";
import { Button } from "@/components/ui/button";

const TutorialSection = () => {
  const features = [
    "Account Creation Process",
    "Become a vendor or customer",
    "Post your personal product in a personalized shop!",
  ];

  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="container-main">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div>
            <h2 className="heading-section text-foreground mb-8">
              Ask our AI assistant for help navigating our website!
            </h2>
            <ul className="space-y-4 mb-8">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-foreground flex-shrink-0" />
                  <span className="font-body text-foreground">{feature}</span>
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-4">
              <a href="#dashboard">
                <Button variant="default" size="lg" className="rounded-none">
                  Create an Account!
                </Button>
              </a>
              <Button variant="heroOutline" size="lg">
                Contact us for Help!
              </Button>
            </div>
          </div>

          {/* Geometric Pattern Image */}
          <div className="flex justify-center lg:justify-end">
            <img
              src={geometricPattern}
              alt="Abstract geometric pattern"
              className="w-full max-w-md h-auto object-cover rounded-lg shadow-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default TutorialSection;
