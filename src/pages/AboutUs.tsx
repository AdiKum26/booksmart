import Header from "@/components/Header";
import Footer from "@/components/Footer";
import aboutHeroImage from "@/assets/about-hero-book.jpg";
import zhichenImg from "@/assets/zhichen-ming-xia.png";
import ethanImg from "@/assets/ethan-pogrebinsky.jpg";
import allanImg from "@/assets/allan-xuan.png";
import tianhaoImg from "@/assets/tianhao-wu.png";

import michaelImg from "@/assets/michael-cheng.png";
import adityaImg from "@/assets/aditya-kumar.png";
import maggieImg from "@/assets/maggie-zhou.png";
import nathanImg from "@/assets/nathan-seamans.png";

import sanjitImg from "@/assets/sanjit-subramaniam.png";
import manvithImg from "@/assets/manvith-kothapalli.png";
import shaneImg from "@/assets/shane-marshall.png";
import williamImg from "@/assets/william-xu.png";

const teamMembers = [
  {
    name: "ZhiChen Ming Xia",
    roles: ["Founder/CEO"],
    email: "Booksmart.network@gmail.com",
    phone: "206-915-9943",
    image: zhichenImg,
  },
  {
    name: "Ethan Pogrebinsky",
    roles: ["Executive Director of Library Service"],
    image: ethanImg,
  },
  {
    name: "Allan Xuan",
    roles: ["Director of Communications and", "Marketing"],
    image: allanImg,
  },
  {
    name: "Tianhao Wu",
    roles: ["Director of Human Resources"],
    image: tianhaoImg,
  },
  {
    name: "Michael Cheng",
    roles: ["Social Media and Connections Leader", "Marketing Team Member"],
    image: michaelImg,
  },
  {
    name: "Aditya Kumar",
    roles: ["Technology Director", "Development Lead"],
    image: adityaImg,
  },
  {
    name: "Maggie Zhou",
    roles: ["Corporate Ambassador &", "Marketing Communications Assistant"],
    image: maggieImg,
  },
  {
    name: "Nathan Seamans",
    roles: ["Board Member/Website Tester", "Programming Team Member"],
    image: nathanImg,
  },
  {
    name: "Sanjit Subramaniam",
    roles: ["Full Stack Developer"],
    image: sanjitImg,
  },
  {
    name: "Manvith Kothapalli",
    roles: ["Full Stack Developer"],
    image: manvithImg,
  },
  {
    name: "Shane Marshall",
    roles: ["Marketing Team Member"],
    image: shaneImg,
  },
  {
    name: "William Xu",
    roles: ["Website Designer/Tester", "Programming Team Member"],
    image: williamImg,
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
          <div className="max-w-4xl space-y-6 text-text-light/90 font-book text-xl leading-relaxed">
            <p>
              At Booksmart, we believe education should be accessible, affordable, sustainable, and convenient for everyone. As a dedicated platform for students, vendors, and educators, we provide a seamless space to buy, sell, and trade textbooks, helping reduce the financial burden of learning materials.
            </p>
            <p>
              Founded with a passion for a brighter academic community, Booksmart is more than just a marketplace—it's a movement toward sustainable education.
            </p>
            <p>
              By connecting individuals and fostering a collaborative environment, we aim to make textbooks more affordable and give used books a{" "}
              <span className="font-bold italic">second life</span>.
            </p>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="py-20 bg-background">
        <div className="container-main">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
            {teamMembers.map((member) => (
              <div key={member.name} className="flex flex-col items-center text-center">
                <div className="w-full aspect-square mb-6 overflow-hidden rounded-[2.5rem] shadow-sm">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
                <h3 className="font-body font-bold text-foreground text-xl mb-2">
                  {member.name}
                </h3>
                {member.roles.map((role, index) => (
                  <p key={index} className="font-body text-muted-foreground text-sm leading-snug">
                    {role}
                  </p>
                ))}
                {member.email && (
                  <a href={`mailto:${member.email}`} className="font-body text-foreground text-sm underline mt-1 hover:text-primary transition-colors">
                    {member.email}
                  </a>
                )}
                {member.phone && (
                  <p className="font-body text-muted-foreground text-sm mt-1">
                    {member.phone}
                  </p>
                )}
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
