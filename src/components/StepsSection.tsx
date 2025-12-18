import { Play } from "lucide-react";

const StepsSection = () => {
  const steps = [
    {
      number: 1,
      title: "Register For An Account",
      description: "Email address, password, select customer or vendor role",
      hasScreenshot: true,
    },
    {
      number: 2,
      title: "Locate Vendor Dashboard",
      description: "Access your account dashboard and manage settings",
      hasScreenshot: true,
    },
    {
      number: 3,
      title: "Add a New Product",
      description: 'Click on "Add new product", add in textbook information and wait for a review within 1-3 days!',
      hasVideo: true,
    },
    {
      number: 4,
      title: "Dashboard",
      description: "For now, please list items as Cash on Delivery (mention it in description along with your contact info). Please do not enter personal bank information until the online payment method becomes fully functional.",
      hasScreenshot: true,
    },
  ];

  return (
    <section className="py-20 md:py-28 bg-dark overflow-hidden">
      <div className="container-main">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-16">
          <div className="flex flex-col items-center bg-text-light px-4 py-2">
            <span className="text-sm font-bold tracking-wider text-dark">SMART</span>
            <div className="flex gap-1">
              <div className="w-6 h-7 bg-dark rounded-sm" />
              <div className="w-6 h-7 bg-dark rounded-sm" />
            </div>
            <span className="text-[8px] text-dark mt-1">Save money, save nature, safe future</span>
          </div>
          <p className="font-body text-lg md:text-xl tracking-[0.3em] text-text-light/80">
            EXPLORE, CHECKOUT, & ENJOY
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step) => (
            <div key={step.number} className="step-card bg-card text-foreground">
              {/* Decorative corner curves */}
              <div className="absolute top-0 left-0 w-16 h-16 bg-dark rounded-br-[60px]" />
              <div className="absolute bottom-0 right-0 w-16 h-16 bg-dark rounded-tl-[60px]" />

              <div className="relative z-10">
                {/* Mock UI Elements */}
                <div className="bg-secondary rounded-lg p-3 mb-4 min-h-[120px] flex items-center justify-center">
                  {step.hasVideo ? (
                    <div className="w-16 h-16 bg-foreground/10 rounded-full flex items-center justify-center">
                      <Play className="w-8 h-8 text-foreground/60" />
                    </div>
                  ) : (
                    <div className="space-y-2 w-full">
                      <div className="h-2 bg-foreground/10 rounded w-3/4" />
                      <div className="h-2 bg-foreground/10 rounded w-1/2" />
                      <div className="h-2 bg-foreground/10 rounded w-2/3" />
                    </div>
                  )}
                </div>

                {/* Step Info */}
                <p className="font-body text-sm font-semibold text-muted-foreground mb-1">
                  STEP {step.number}
                </p>
                <h3 className="font-display text-xl font-medium text-foreground mb-2">
                  {step.title}
                </h3>
                {step.number === 3 && (
                  <p className="font-body text-sm text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* URL Bar */}
        <div className="mt-12">
          <div className="inline-flex items-center bg-dark-surface rounded-full px-6 py-3">
            <span className="font-body text-text-light/80">https://book-smart.shop</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StepsSection;
