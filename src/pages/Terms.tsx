import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Terms = () => {
    return (
        <div className="min-h-screen bg-background font-body">
            <Header />
            <div className="container-main py-20">
                <h1 className="heading-display text-4xl md:text-5xl lg:text-6xl text-foreground mb-12">
                    Terms and Conditions
                </h1>

                <div className="max-w-4xl space-y-8 text-foreground/80">
                    <section>
                        <h2 className="font-display text-2xl mb-4 text-foreground">1. Introduction</h2>
                        <p className="leading-relaxed">
                            Welcome to Booksmart. By accessing our website and using our services, you agree to be bound by these Terms and Conditions. Please read them carefully.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-display text-2xl mb-4 text-foreground">2. Use of Service</h2>
                        <p className="leading-relaxed">
                            Booksmart provides a platform for students to buy, sell, and trade textbooks. You agree to use this service only for lawful purposes and in accordance with these Terms.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-display text-2xl mb-4 text-foreground">3. User Accounts</h2>
                        <p className="leading-relaxed">
                            To access certain features, you may be required to create an account. You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-display text-2xl mb-4 text-foreground">4. Privacy</h2>
                        <p className="leading-relaxed">
                            Your privacy is important to us. Please review our Privacy Policy to understand how we collect, use, and share your information.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-display text-2xl mb-4 text-foreground">5. Contact</h2>
                        <p className="leading-relaxed">
                            If you have any questions about these Terms, please contact us at Booksmart.network@gmail.com.
                        </p>
                    </section>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Terms;
