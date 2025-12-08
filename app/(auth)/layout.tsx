import { Activity } from "lucide-react";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-brand-navy via-brand-teal to-brand-eucalyptus relative">
        <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10" />
        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 backdrop-blur">
              <Activity className="h-6 w-6" />
            </div>
            <span className="text-2xl font-bold">Suubi Medical</span>
          </Link>

          <div className="space-y-6">
            <h1 className="text-4xl font-bold leading-tight">
              Quality Healthcare
              <br />
              <span className="text-brand-amber">For Everyone</span>
            </h1>
            <p className="text-white/80 text-lg max-w-md">
              Join thousands of patients who trust Suubi Medical Centre for their healthcare needs.
              Book appointments, chat with doctors, and manage your health all in one place.
            </p>
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-400" />
                <span>24/7 Support</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-400" />
                <span>Expert Doctors</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-400" />
                <span>Secure Platform</span>
              </div>
            </div>
          </div>

          <p className="text-white/60 text-sm">
            © {new Date().getFullYear()} Suubi Medical Centre. All rights reserved.
          </p>
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-8 text-center">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-teal text-white">
                <Activity className="h-6 w-6" />
              </div>
              <span className="text-xl font-bold text-brand-navy">Suubi Medical</span>
            </Link>
          </div>

          {children}

          {/* Footer Links */}
          <div className="mt-8 text-center text-sm text-muted-foreground">
            <p>
              By continuing, you agree to our{" "}
              <Link href="/terms" className="text-brand-teal hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-brand-teal hover:underline">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
