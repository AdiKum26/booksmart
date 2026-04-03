import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Terms = () => {
  return (
    <div className="min-h-screen bg-background font-body">
      <Header />
      <div className="container-main py-20">
        {/* Refund Policy */}
        <h1 className="heading-display text-4xl md:text-5xl lg:text-6xl text-foreground mb-12">
          Refund Policy
        </h1>

        <div className="max-w-4xl space-y-8 text-foreground/80 mb-20">
          <p className="leading-relaxed">
            To refund or return products purchased on the website, you must contact your vendor for specific information on what they expect.
          </p>
          <p className="leading-relaxed">
            Here are some examples for possible policies when returning items to vendors:
          </p>
          <p className="leading-relaxed">
            To be eligible for a return, your item must be unused and in the same condition that you received it. It must also be in the original packaging.
          </p>
          <p className="leading-relaxed">
            Several types of goods are exempt from being returned. Perishable goods such as food, flowers, newspapers, or magazines cannot be returned. We also do not accept products that are intimate or sanitary goods, hazardous materials, or flammable liquids or gases.
          </p>

          <div>
            <p className="leading-relaxed font-semibold text-foreground mb-2">Additional non-returnable items:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Gift cards</li>
              <li>Downloadable software products</li>
              <li>Some health and personal care items</li>
            </ul>
          </div>

          <p className="leading-relaxed">
            You are also required to have a receipt or proof of purchase to complete your return.
          </p>
          <p className="leading-relaxed">
            Please contact the original owner of the item.
          </p>

          <div>
            <p className="leading-relaxed font-semibold text-foreground mb-2">There are certain situations where only partial or no refunds are granted:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Book with obvious signs of use</li>
              <li>CD, DVD, VHS tape, software, video game, cassette tape, or vinyl record that has been opened.</li>
              <li>Any item not in its original condition is damaged or missing parts for reasons not due to our error.</li>
              <li>Any item that is returned more than 30 days after delivery</li>
              <li>Textbooks that have received damage (including any form of printing that does not associate with the original content)</li>
            </ul>
          </div>

          <section>
            <h2 className="font-display text-2xl mb-4 text-foreground">Refunds</h2>
            <p className="leading-relaxed mb-4">
              Once your return is received and inspected, the vendor can email you to notify you that he has received your returned item. He will also inform you of the possible completion of your refund.
            </p>
            <p className="leading-relaxed">
              If you are approved, your refund will be processed, and a credit/or cash in contact will automatically be applied to your original payment method within a certain amount of days.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl mb-4 text-foreground">Late or Missing Refunds</h2>
            <p className="leading-relaxed mb-4">
              If you haven't received a refund yet, first check your bank account again.
            </p>
            <p className="leading-relaxed mb-4">
              (We are currently only accepting cash as vendor and customer's payment method)
            </p>
            <p className="leading-relaxed mb-4">
              Then contact your credit card company, it may take some time before your refund is officially posted.
            </p>
            <p className="leading-relaxed mb-4">
              Also, contact the owner of the copy you purchased from. We are not obligated to deliver a refund for items not purchased from our producers.
            </p>
            <p className="leading-relaxed mb-4">
              Next, contact your bank. There is often some processing time before a refund is posted.
            </p>
            <p className="leading-relaxed">
              If you've done all of this and still have not received your refund yet, please contact us at{" "}
              <a href="mailto:booksmart.network@gmail.com" className="text-primary underline">booksmart.network@gmail.com</a>.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl mb-4 text-foreground">Sale Items and Rentals</h2>
            <p className="leading-relaxed mb-4">
              Only regular-priced items may be refunded. Sale items cannot be refunded.
            </p>
            <p className="leading-relaxed">
              Rental items are only accessible through their original vendor. Vendors must clarify their preferred methods. Please do not contact Booksmart officials for the vendor's preferences and rental style. (usually with a down-payment / deposit)
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl mb-4 text-foreground">Returns</h2>
            <p className="leading-relaxed mb-4">
              To return your product, you should mail your product to the original owner.
            </p>
            <p className="leading-relaxed mb-4">
              You will be responsible for paying for your own shipping costs for returning your item. Shipping costs are non-refundable. If you receive a refund, the cost of return shipping will be deducted from your refund.
            </p>
            <p className="leading-relaxed mb-4">
              Depending on where you live, the time it may take for your exchanged product to reach you may vary.
            </p>
            <p className="leading-relaxed">
              If returning more expensive items, consider using a trackable shipping service or purchasing shipping insurance. We don't guarantee that the vendor will receive your returned item.
            </p>
          </section>
        </div>

        {/* Terms and Conditions */}
        <h1 className="heading-display text-4xl md:text-5xl lg:text-6xl text-foreground mb-12">
          Terms and Conditions
        </h1>

        <div className="max-w-4xl space-y-8 text-foreground/80">
          <p className="leading-relaxed">
            Welcome to Booksmart! These Terms and Conditions govern your access to and use of our website and services. By accessing or using our Service, you agree to be bound by these Terms. Please read them carefully.
          </p>

          <section>
            <h2 className="font-display text-2xl mb-4 text-foreground">1. Acceptance of Terms</h2>
            <p className="leading-relaxed">
              By using our website and services, you agree to these Terms and any future updates or modifications. If you do not agree with any part of these Terms, please do not use the Service.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl mb-4 text-foreground">2. Use of the Service</h2>
            <p className="leading-relaxed">
              You agree to use Booksmart only for lawful purposes and in a manner that does not infringe upon the rights of others. The Service is intended to allow users to buy, sell, or rent secondhand textbooks at competitive prices.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl mb-4 text-foreground">3. Account Registration</h2>
            <p className="leading-relaxed">
              To use certain features of the Service, you must register for an account. You are responsible for maintaining the confidentiality of your login credentials and are responsible for all activities that occur under your account. Booksmart reserves the right to suspend or terminate any account that violates these Terms.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl mb-4 text-foreground">4. Product Listings and Transactions</h2>
            <p className="leading-relaxed mb-4">
              Booksmart allows users to create listings to sell or rent secondhand textbooks (or vendors that can provide customers with a lower price than other sources). All transactions are between the buyer and the seller, and Booksmart is not responsible for any disputes that arise between users.
            </p>
            <h3 className="font-display text-xl mb-3 text-foreground">4.1 Product Listings</h3>
            <ul className="list-disc list-inside space-y-1 ml-4 mb-4">
              <li>Sellers are responsible for ensuring that all information in their listings is accurate and that the products listed are in the condition described.</li>
              <li>Misleading or fraudulent listings will be removed, and the seller's account may be suspended or terminated.</li>
            </ul>
            <h3 className="font-display text-xl mb-3 text-foreground">4.2 Payments</h3>
            <p className="leading-relaxed">
              Payments for textbooks are processed through third-party payment methods. Booksmart is not responsible for payment processing errors or issues.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl mb-4 text-foreground">5. Fees and Commissions</h2>
            <p className="leading-relaxed">
              Booksmart will not charge a commission on transactions made through the platform. This is a non-profitable website built for third-party vendors and customers.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl mb-4 text-foreground">6. Refunds and Returns</h2>
            <p className="leading-relaxed">
              Booksmart does not handle refunds or returns directly. Any requests for refunds or returns must be addressed between the buyer and seller, following the terms they have agreed upon.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl mb-4 text-foreground">7. Intellectual Property</h2>
            <p className="leading-relaxed">
              All content on the Booksmart website, including but not limited to text, images, logos, and software, is the property of Booksmart or its licensors and is protected by copyright and other intellectual property laws. You may not use, copy, or distribute any content without prior written consent from Booksmart.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl mb-4 text-foreground">8. User-Generated Content</h2>
            <p className="leading-relaxed">
              By submitting content (such as product listings or reviews) to Booksmart, you grant us a non-exclusive, royalty-free, worldwide license to use, display, and distribute that content in connection with our Service.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl mb-4 text-foreground">9. Limitation of Liability</h2>
            <p className="leading-relaxed">
              Booksmart is not liable for any damages, including but not limited to indirect, incidental, or consequential damages, arising out of or in connection with the use of the Service or inability to use the Service.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl mb-4 text-foreground">10. Termination</h2>
            <p className="leading-relaxed">
              We reserve the right to suspend or terminate your access to the Service at any time, with or without cause or notice, for any reason, including if we believe that you have violated these Terms.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl mb-4 text-foreground">11. Arbitration and Dispute Resolution</h2>
            <p className="leading-relaxed mb-4">
              Any dispute, controversy, or claim arising out of or relating to these Terms, your use of the Service, or any products or services sold through Booksmart shall be resolved by binding arbitration by the rules of the American Arbitration Association (AAA). The arbitration will take place in Seattle, Washington and will be conducted in the English language.
            </p>
            <p className="leading-relaxed mb-4">
              <span className="font-semibold text-foreground">Waiver of Class Action:</span> You agree that any arbitration will be conducted on an individual basis, and not as part of a class, consolidated, or representative action. You hereby waive your right to participate in a class action lawsuit, class-wide arbitration, or a jury trial.
            </p>
            <p className="leading-relaxed">
              The decision of the arbitrator shall be final and binding on both parties. Judgment on the arbitration award may be entered in any court of competent jurisdiction.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl mb-4 text-foreground">12. Governing Law</h2>
            <p className="leading-relaxed">
              These Terms shall be governed by and construed following the laws of the State of Washington, without regard to its conflict of law principles.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl mb-4 text-foreground">13. Changes to the Terms</h2>
            <p className="leading-relaxed">
              We may update or modify these Terms at any time, and any changes will be effective immediately upon posting the revised Terms on our website. Your continued use of the Service after any such changes constitutes your acceptance of the new Terms.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl mb-4 text-foreground">14. Contact Us</h2>
            <p className="leading-relaxed">
              Contact us at{" "}
              <a href="mailto:booksmart.network@gmail.com" className="text-primary underline">booksmart.network@gmail.com</a>{" "}
              for questions related to terms and conditions.
            </p>
          </section>

          <p className="leading-relaxed font-semibold text-foreground pt-4">
            By using Booksmart, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Terms;
