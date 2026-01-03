"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CheckCircle2, Heart, Users } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <section className="bg-brand-navy pt-32 pb-32 text-white relative overflow-hidden">
        <div className="container-custom relative z-10 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold mb-6 font-heading"
          >
            About Suubi
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-300 max-w-2xl mx-auto"
          >
            Restoring hope through accessible, high-quality healthcare.
          </motion.p>
        </div>
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/5 to-transparent pointer-events-none" />
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none translate-y-1/4 translate-x-1/4">
          <Heart className="w-[500px] h-[500px] text-white" />
        </div>
        <div className="absolute left-10 top-20 opacity-5 pointer-events-none">
          <Users className="w-32 h-32 text-white" />
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="container-custom">
          {/* Intro */}
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-navy mb-6">About Suubi Healthcare</h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              Suubi Healthcare is an initiative of the <strong>Boost Health Initiative (BHI)</strong>, a non-profit organization dedicated to improving healthcare access and outcomes for marginalized communities in Uganda, with a special focus on women and children.
            </p>
            <p className="mt-4 text-gray-600">
              By combining medical expertise, community engagement, and sustainable development practices, we strive to create lasting positive change in the health landscape of underserved populations.
            </p>
          </div>

          {/* Vision & Mission */}
          <div className="grid md:grid-cols-2 gap-12 mb-20">
            <div className="bg-brand-navy/5 p-10 rounded-3xl border border-brand-navy/10 hover:shadow-brand-soft transition-all">
              <h3 className="text-2xl font-bold text-brand-navy mb-4">Our Vision</h3>
              <p className="text-gray-700 italic mb-4">
                "To create communities where every individual, regardless of their socioeconomic status, has access to quality healthcare, equal opportunities, and the resources they need to lead a healthy and dignified life."
              </p>
              <p className="text-sm text-gray-600">
                We envision a Uganda where healthcare disparities are eliminated, and marginalized populations are empowered to take control of their well-being.
              </p>
            </div>
            <div className="bg-brand-teal/5 p-10 rounded-3xl border border-brand-teal/10 hover:shadow-brand-soft transition-all">
              <h3 className="text-2xl font-bold text-brand-teal mb-4">Our Mission</h3>
              <p className="text-gray-700 italic mb-4">
                "To implement sustainable health initiatives, educational programs, and economic empowerment projects that address the unique challenges faced by marginalized communities, with a special focus on women and children in Uganda."
              </p>
              <p className="text-sm text-gray-600">
                Through collaboration with local stakeholders and partners, we aim to create lasting solutions that improve health outcomes and quality of life.
              </p>
            </div>
          </div>

          {/* Our Story */}
          <div className="max-w-4xl mx-auto mb-20">
            <h3 className="text-3xl font-bold text-brand-navy mb-6 text-center">Our Story</h3>
            <div className="prose prose-lg mx-auto text-gray-600">
              <p>
                Boost Health Initiative (BHI) was founded in 2015 by a team of Ugandan healthcare professionals and community leaders who witnessed firsthand the devastating impact of healthcare inequality in rural and urban underserved areas.
              </p>
              <p>
                What began as a small mobile clinic serving a handful of villages has grown into a comprehensive healthcare initiative that now reaches thousands of Ugandans through various programs and services, including our flagship Suubi Healthcare platform.
              </p>
              <p>
                The name "Suubi" means "hope" in Luganda, reflecting our commitment to bringing hope through healthcare to communities that have historically been overlooked by traditional medical systems.
              </p>
            </div>
          </div>

          {/* Operational Categories */}
          <div className="mb-20">
            <h3 className="text-3xl font-bold text-brand-navy mb-10 text-center">Operational Categories</h3>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { title: "Gender Equality", desc: "Promoting equal access to healthcare, education, and economic opportunities regardless of gender." },
                { title: "Health Promotion", desc: "Supporting initiatives that enhance community health awareness, prevention, and access to quality healthcare." },
                { title: "Women Empowerment", desc: "Creating opportunities for women to gain financial independence, leadership roles, and self-advocacy." }
              ].map((cat, i) => (
                <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center hover:bg-gray-50 bg-white shadow-brand-soft">
                  <h4 className="text-xl font-bold text-brand-navy mb-3">{cat.title}</h4>
                  <p className="text-gray-600">{cat.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Core Program Areas */}
          <div className="mb-20">
            <h3 className="text-3xl font-bold text-brand-navy mb-10 text-center">Core Program Areas</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                "Maternal & Child Health", "Sexual Reproductive Health", "Financial Literacy",
                "HIV/AIDS Awareness", "Mental Health Support", "Education Sponsorship",
                "Environmentally Sustainable Projects"
              ].map((prog, i) => (
                <div key={i} className="bg-brand-navy text-white p-6 rounded-xl flex items-center justify-center text-center font-semibold hover:bg-brand-teal transition-colors">
                  {prog}
                </div>
              ))}
            </div>
          </div>

          {/* Meet Our Team (Static List) */}
          <div className="mb-20">
            <h3 className="text-3xl font-bold text-brand-navy mb-10 text-center">Meet Our Healthcare Team</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { name: "Fred Osuuna", role: "Doctor" },
                { name: "Nakiirya Sandra", role: "Technical Staff" },
                { name: "Nanyonjo Doreen", role: "Midwifery" },
                { name: "Nakato Mutesi", role: "Nurse" }
              ].map((member, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl shadow-brand-soft text-center border border-gray-100">
                  <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold text-brand-teal">
                    {member.name.charAt(0)}
                  </div>
                  <h4 className="text-lg font-bold text-brand-navy">{member.name}</h4>
                  <p className="text-brand-orange text-sm uppercase tracking-wide font-medium">{member.role}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center mt-12">
            <Button asChild size="lg" className="bg-brand-navy hover:bg-brand-navy/90 text-white rounded-full px-10 py-6">
              <Link href="/contact">Support Our Mission</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
