import Header from "@/components/Header";
import Footer from "@/components/Footer";

const ContactUs = () => {
    return (
        <div className="min-h-screen bg-background font-body">
            <Header />
            <div className="container-main py-20">
                <h1 className="heading-display text-4xl md:text-5xl lg:text-6xl text-foreground mb-8">
                    Contact Us
                </h1>
                <div className="max-w-2xl text-foreground/80 space-y-6 text-lg">
                    <p>
                        Have a question, suggestion, or just want to say hello? We'd love to hear from you!
                    </p>

                    <div className="mt-8 space-y-8">
                        <div className="bg-secondary/30 p-8 rounded-lg">
                            <h3 className="font-display text-2xl mb-4">General Inquiries</h3>
                            <p className="mb-2">
                                For general questions about Booksmart or our services:
                            </p>
                            <a href="mailto:Booksmart.network@gmail.com" className="text-primary hover:underline font-medium text-xl block mb-2">
                                Booksmart.network@gmail.com
                            </a>
                            <p className="text-muted-foreground">206-915-9943</p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-secondary/30 p-6 rounded-lg">
                                <h3 className="font-display text-xl mb-3">Support</h3>
                                <p className="mb-2 text-sm">Need help with your account?</p>
                                <a href="mailto:support@booksmart.network" className="text-primary hover:underline">
                                    support@booksmart.network
                                </a>
                            </div>

                            <div className="bg-secondary/30 p-6 rounded-lg">
                                <h3 className="font-display text-xl mb-3">Partnerships</h3>
                                <p className="mb-2 text-sm">Interested in partnering with us?</p>
                                <a href="mailto:partners@booksmart.network" className="text-primary hover:underline">
                                    partners@booksmart.network
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default ContactUs;
