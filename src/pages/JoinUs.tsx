import Header from "@/components/Header";
import Footer from "@/components/Footer";

const JoinUs = () => {
    return (
        <div className="min-h-screen bg-background font-body">
            <Header />
            <div className="container-main py-20">
                <h1 className="heading-display text-4xl md:text-5xl lg:text-6xl text-foreground mb-8">
                    Join Us
                </h1>
                <div className="max-w-2xl text-foreground/80 space-y-6 text-lg">
                    <p>
                        We are always looking for passionate individuals to join the Booksmart movement.
                        Whether you are a student, educator, or just someone who cares about sustainable education,
                        there is a place for you here.
                    </p>
                    <p>
                        If you are interested in contributing to our mission of making education accessible and affordable,
                        please reach out to us.
                    </p>

                    <div className="mt-8 p-6 bg-secondary/30 rounded-lg">
                        <h3 className="font-display text-2xl mb-4">Get in Touch</h3>
                        <p className="mb-2">Email: <a href="mailto:Booksmart.network@gmail.com" className="underline hover:text-primary">Booksmart.network@gmail.com</a></p>
                        <p>Phone: 206-915-9943</p>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default JoinUs;
