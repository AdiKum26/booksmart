import professorImage from "@/assets/professor-headshot.jpg";

const PartnersSection = () => {
  return (
    <section className="py-20 md:py-28 bg-black">
      <div className="container-main">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Quote Content */}
          <div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-text-light mb-6">
              Partners & Affiliates
            </h2>
            <blockquote className="font-body text-lg md:text-xl text-text-light/90 leading-relaxed mb-6">
              "Access to affordable textbooks is key to empowering students in their educational journey.{" "}
              <span className="underline">Booksmart</span>, a non-profit, student-led communications interface, is helping to ensure that financial barriers don't stand in the way of learning and academic success"
            </blockquote>
            <div className="space-y-2">
              <p className="font-body text-text-light font-semibold">
                •  Recommended by Tod Bergstrom
              </p>
              <p className="font-body text-text-light/80 text-sm">
                Assistant Teaching Professor of Management and Organization at the<br />
                University of Washington Foster School of Business
              </p>
            </div>
          </div>

          {/* Professor Image */}
          <div className="flex justify-center lg:justify-end">
            <img
              src={professorImage}
              alt="Tod Bergstrom - Assistant Teaching Professor"
              className="w-80 h-auto object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;
