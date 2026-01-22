import Link from "next/link";

export default function CtaSection() {
    return (<section className="container mx-auto px-6 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
            Ready to Take Control of Your Passwords?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of users who trust LockPulse for truly secure password management.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" className="bg-primary text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary-dark transition-all duration-300 transform hover:scale-105">
              Start Securing Your Passwords
            </Link>
            <Link href="/login" className="border border-primary text-primary px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary hover:text-white transition-all duration-300">
              Already Have an Account?
            </Link>
          </div>
        </div>
      </section>);
}