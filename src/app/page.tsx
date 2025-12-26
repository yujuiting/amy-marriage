import { AnimatedTitle } from "@/components/AnimatedTitle";
import { QRCodeDisplay } from "@/components/QRCodeDisplay";
import { DonationForm } from "@/components/DonationForm";
import { DonationFeed } from "@/components/DonationFeed";

export default function Home() {
  return (
    <div className="min-h-screen py-8 px-4">
      <main className="max-w-6xl mx-auto">
        <AnimatedTitle />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          {/* QR code (desktop only) and How it Works */}
          <div className="order-1 lg:order-2 space-y-6">
            <div className="hidden lg:block">
              <QRCodeDisplay />
            </div>

            <div className="glass-card rounded-2xl p-6 text-center">
              <h3 className="text-xl font-semibold mb-3" style={{ color: "var(--foreground)" }}>
                How It Works
              </h3>
              <ol className="text-left text-sm space-y-2 opacity-80">
                <li>1. Connect your wallet</li>
                <li>2. Enter your name & message</li>
                <li>3. Send ETH on Base network</li>
                <li>4. Your blessing is recorded on-chain!</li>
              </ol>
            </div>
          </div>

          {/* Mobile: Donation form below QR code, Hidden on desktop */}
          <div className="order-2 lg:hidden space-y-6">
            <DonationForm />
          </div>

          {/* Donation feed - shown on both, but full width on desktop */}
          <div className="order-3 lg:order-1 lg:col-span-2 space-y-6">
            <DonationFeed />
          </div>
        </div>

        <footer className="mt-12 text-center text-sm opacity-60">
          <p>Made with love for Amy&apos;s special day</p>
          <p className="mt-1">
            Donations are sent directly to Amy&apos;s wallet on Base network
          </p>
        </footer>
      </main>
    </div>
  );
}
