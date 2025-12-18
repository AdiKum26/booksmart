import heroBook from "@/assets/hero-book.jpg";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <section className="relative min-h-[80vh] bg-dark overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroBook}
          alt="Open book with pages fanning out"
          className="w-full h-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-dark/90 via-dark/60 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative container-main py-20 md:py-32 lg:py-40">
        <div className="max-w-2xl">
          <h1 className="heading-display text-text-light mb-6">
            Booksmart Ex.
          </h1>
          <p className="font-body text-lg font-semibold text-text-light mb-4">
            Save Money, Save Nature, Safe Future
          </p>
          <p className="font-body text-text-light/80 text-lg mb-8">
            Just a college student who thinks that textbooks are overpriced
          </p>
          <Button variant="hero" size="lg">
            Sign up for our Mailing List!
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
