import Header from "@/components/Header";
import Footer from "@/components/Footer";
import aboutHeroImage from "@/assets/about-hero-book.jpg";

const teamMembers = [
  {
    name: "Michael Cheng",
    roles: ["Social Media and Connections Leader", "Marketing Team Member"],
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
  },
  {
    name: "Aditya Kumar",
    roles: ["Technology Director", "Development Lead"],
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=face",
  },
  {
    name: "Maggie Zhou",
    roles: ["Corporate Ambassador &", "Marketing Communications Assistant"],
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face",
  },
  {
    name: "Nathan Seamans",
    roles: ["Board Member/Website Tester", "Programming Team Member"],
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face",
  },
  {
    name: "Sanjit Subramaniam",
    roles: ["Full Stack Developer"],
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop&crop=face",
  },
  {
    name: "Manvith Kothapalli",
    roles: ["Full Stack Developer"],
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
  },
  {
    name: "Shane Marshall",
    roles: ["Marketing Team Member"],
    image: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=400&h=400&fit=crop&crop=face",
  },
  {
    name: "William Xu",
    roles: ["Website Designer/Tester", "Programming Team Member"],
    image: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=400&h=400&fit=crop&crop=face",
  },
];

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${aboutHeroImage})` }}
        >
          <div className="absolute inset-0 bg-dark/70" />
        </div>
        
        <div className="container-main relative z-10 py-20">
          <h1 className="heading-display text-4xl md:text-5xl lg:text-6xl text-text-light mb-8 max-w-4xl">
            About Us & Meet Our Team
          </h1>
          <div className="max-w-4xl space-y-6 text-text-light/90 font-body text-lg leading-relaxed">
            <p>
              At Booksmart, we believe education should be accessible, affordable, sustainable, and convenient for everyone. As a dedicated platform for students, vendors, and educators, we provide a seamless space to buy, sell, and trade textbooks, helping reduce the financial burden of learning materials.
            </p>
            <p>
              Founded with a passion for a brighter academic community, Booksmart is more than just a marketplace—it's a movement toward sustainable education.
            </p>
            <p>
              By connecting individuals and fostering a collaborative environment, we aim to make textbooks more affordable and give used books a{" "}
              <span className="underline font-semibold">second life</span>.
            </p>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-background">
        <div className="container-main">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
            {teamMembers.map((member) => (
              <div key={member.name} className="text-center">
                <div className="aspect-[4/5] mb-4 overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-body font-semibold text-foreground text-lg mb-1">
                  {member.name}
                </h3>
                {member.roles.map((role, index) => (
                  <p key={index} className="font-body text-muted-foreground text-sm">
                    {role}
                  </p>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutUs;
