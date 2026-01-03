"use client";

import { Hero } from "@/components/marketing/Hero";
import { ServicesGrid } from "@/components/marketing/ServicesGrid";
import { DoctorsCarousel } from "@/components/marketing/DoctorsCarousel";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CheckCircle2, ChevronRight, Activity, Calendar, ArrowRight } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { format } from "date-fns";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Hero />

      <ServicesGrid />

      {/* Stats Section */}
      <StatsSection />

      {/* Why Choose Us / Features Section */}
      <section className="py-24 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              {/* Replace with actual image later if needed, using a gradient placeholder for now */}
              <div className="relative rounded-3xl overflow-hidden aspect-[4/3] bg-gray-100 shadow-brand-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-navy to-brand-teal opacity-90" />
                <div className="absolute inset-0 flex items-center justify-center text-white/10">
                  <span className="text-9xl font-bold">Suubi</span>
                </div>
                {/* Floating Card */}
                <div className="absolute -bottom-6 -right-6 md:bottom-8 md:right-8 bg-white p-6 rounded-2xl shadow-brand-lg max-w-xs animate-pulse-subtle">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">Verified Quality</p>
                      <p className="text-xs text-gray-500">ISO Certified</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    We adhere to the highest international standards of medical care and safety.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <h2 className="text-3xl md:text-4xl font-bold text-brand-navy font-heading">
                Why Choose Suubi Medical Centre?
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                We combine state-of-the-art technology with a warm, family-centered approach to care. Our facility is designed to provide safety, comfort and the best possible medical outcomes.
              </p>

              <ul className="space-y-4">
                {[
                  "Experienced Specialist Doctors",
                  "24/7 Emergency & Ambulance Service",
                  "Modern Laboratory & Diagnostics",
                  "Affordable & Transparent Pricing",
                  "Patient-Centered Care Model"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-brand-teal shrink-0" />
                    <span className="text-gray-700 font-medium">{item}</span>
                  </li>
                ))}
              </ul>

              <Button asChild className="bg-brand-navy text-white hover:bg-brand-navy/90 rounded-full px-8 py-6 text-lg mt-4">
                <Link href="/about">
                  Learn More About Us <ChevronRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <DoctorsCarousel />

      {/* Latest News & Updates */}
      <LatestNewsSection />

      {/* CTA Section */}
      <section className="py-24 bg-brand-teal relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/img/pattern.png')] opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-navy/50 to-transparent" />

        <div className="container-custom relative z-10 text-center text-white">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 font-heading">Ready to prioritize your health?</h2>
          <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-2xl mx-auto">
            Book an appointment today with our specialists or contact us for emergency services.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg" className="bg-brand-orange hover:bg-brand-orange-dark text-white rounded-full px-10 py-7 text-lg shadow-xl">
              <Link href="/booking">Book Appointment Now</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-brand-teal rounded-full px-10 py-7 text-lg">
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

function StatsSection() {
  const stats = useQuery(api.publicStats.getLandingStats);

  if (!stats) return null;

  const statItems = [
    { label: "Happy Patients", value: stats.patients, suffix: "+" },
    { label: "Expert Specialists", value: stats.specialists, suffix: "" },
    { label: "Years Experience", value: stats.years, suffix: "+" },
    { label: "Medical Programs", value: stats.programs, suffix: "" },
  ];

  return (
    <section className="py-16 bg-brand-navy text-white">
      <div className="container-custom">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {statItems.map((item, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl md:text-5xl font-bold font-heading mb-2 text-brand-orange">
                {item.value}{item.suffix}
              </div>
              <div className="text-gray-300 text-sm md:text-base uppercase tracking-wider font-medium">
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function LatestNewsSection() {
  const allNews = useQuery(api.news.getPublishedNews);
  // Show only top 3
  const news = allNews ? allNews.slice(0, 3) : [];

  if (!news || news.length === 0) return null;

  return (
    <section className="py-24 bg-gray-50">
      <div className="container-custom">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-bold font-heading text-brand-navy mb-4">Latest News & Updates</h2>
            <p className="text-gray-600 max-w-lg">
              Keep up with the latest announcements, health tips, and success stories from Suubi Medical Centre.
            </p>
          </div>
          <Button asChild variant="ghost" className="hidden md:flex text-brand-teal hover:text-brand-navy">
            <Link href="/news">View All News <ArrowRight className="ml-2 w-4 h-4" /></Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {news.map((item) => (
            <div key={item._id} className="bg-white rounded-3xl overflow-hidden shadow-brand-soft hover:shadow-brand-md transition-all duration-300 group">
              <div className="h-48 bg-brand-navy/5 relative overflow-hidden">
                {item.images && item.images.length > 0 ? (
                  <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-brand-navy/20">
                    <Activity className="w-16 h-16" />
                  </div>
                )}
                <div className="absolute top-4 left-4 bg-brand-orange text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  {item.category}
                </div>
              </div>
              <div className="p-8">
                <div className="text-sm text-gray-500 mb-3 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {format(item.publishedAt, "MMM d, yyyy")}
                </div>
                <h3 className="text-xl font-bold text-brand-navy mb-3 line-clamp-2 group-hover:text-brand-orange transition-colors">
                  {item.title}
                </h3>
                <p className="text-gray-600 line-clamp-3 mb-6">
                  {item.summary}
                </p>
                <Link href={`/news/${item._id}`} className="inline-flex items-center text-brand-teal font-semibold hover:text-brand-navy transition-colors">
                  Read Article <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center md:hidden">
          <Button asChild variant="outline" className="w-full">
            <Link href="/news">View All News</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}