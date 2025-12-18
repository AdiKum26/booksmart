import { Button } from "@/components/ui/button";

const PressSection = () => {
  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="container-main">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-body text-2xl md:text-3xl font-medium tracking-wider text-foreground mb-2">
            CHECK US OUT ON
          </h2>
          <p className="font-display text-3xl md:text-4xl font-medium text-foreground underline underline-offset-4 mb-8">
            THEDAILYUW
          </p>
          <a 
            href="https://www.dailyuw.com/article/student-led-nonprofit-booksmart-launches-site-for-used-textbook-resale-20251031"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="default" size="lg" className="rounded-none">
              Read The Article
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
};

export default PressSection;
