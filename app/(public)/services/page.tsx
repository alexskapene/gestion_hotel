"use client";

import { Button } from "@/components/ui/button";
import {
  CalendarCheck,
  Headphones,
  MapPin,
  Search,
  ShieldCheck,
  Star,
  TrendingUp,
} from "lucide-react";
import Image from "next/image";
import { CTASection } from "@/components/landing/cta-section";

const allFeatures = [
  {
    type: "Voyageur",
    title: "Recherche intelligente & intuitive",
    description: "Trouvez l'établissement idéal en quelques secondes. Notre moteur de recherche croise vos préférences avec les meilleures offres de la province pour vous garantir un séjour sur mesure.",
    image: "/hero.jpg",
    icon: <Search className="w-6 h-6 text-primary" />,
  },
  {
    type: "Hôtelier",
    title: "Gestion & Visibilité simplifiée",
    description: "Digitalisez votre hôtel sans effort. Profitez d'une exposition immédiate et d'outils de gestion intuitifs pour optimiser votre taux d'occupation et simplifier votre quotidien.",
    image: "/room.jpg",
    icon: <TrendingUp className="w-6 h-6 text-primary" />,
  },
  {
    type: "Voyageur",
    title: "Sécurité & Tranquillité d'esprit",
    description: "Réservez avec une confiance absolue. Chaque transaction est sécurisée et chaque établissement est rigoureusement vérifié pour vous offrir l'excellence sans compromis.",
    image: "/hero.jpg",
    icon: <ShieldCheck className="w-6 h-6 text-primary" />,
  },
  {
    type: "Hôtelier",
    title: "Analytiques & Croissance",
    description: "Prenez des décisions basées sur des données réelles. Suivez vos performances, analysez les tendances de réservation et développez votre activité grâce à nos outils d'analyse avancés.",
    image: "/room.jpg",
    icon: <Star className="w-6 h-6 text-primary" />,
  },
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="w-full">
        {/* HERO SECTION - Optimized Responsive */}
        <section className="relative min-h-[45vh] md:min-h-[50vh] flex items-center justify-center overflow-hidden py-16 md:py-0">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
            style={{
              backgroundImage: "url('/hero.jpg')",
            }}
          />
          <div className="absolute inset-0 bg-black/75 backdrop-blur-[1px]" />

          <div className="relative z-10 container mx-auto px-4 sm:px-6 text-center text-white space-y-6">
            <h1 className="font-serif text-3xl sm:text-4xl md:text-6xl font-bold leading-[1.1] max-w-5xl mx-auto text-balance">
              L&apos;écosystème complet de <span className="text-primary">l&apos;hôtellerie</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-white/80 max-w-3xl mx-auto text-balance leading-relaxed">
              Une plateforme unique qui connecte les voyageurs en quête d&apos;excellence avec les hôteliers les plus prestigieux de l&apos;Ituri.
            </p>
          </div>
        </section>

        {/* UNIFIED SERVICES SECTION */}
        <section className="py-24 container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center mb-24 space-y-4">
            <h2 className="font-serif text-3xl md:text-5xl font-bold italic">Nos Solutions Globales</h2>
            <div className="h-1 w-24 bg-primary mx-auto" />
            <p className="text-muted-foreground text-lg">Découvrez comment nous réinventons l&apos;expérience hôtelière pour tous.</p>
          </div>

          <div className="space-y-32">
            {allFeatures.map((feature, index) => (
              <div 
                key={index} 
                className={`flex flex-col lg:flex-row items-center gap-16 ${index % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}
              >
                {/* Image side */}
                <div className="flex-1 relative aspect-[16/10] w-full rounded-3xl overflow-hidden shadow-2xl group">
                  <Image
                    src={feature.image}
                    alt={feature.title}
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>

                {/* Content side */}
                <div className="flex-1 space-y-8">
                  <div className="inline-flex items-center gap-3 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-bold uppercase tracking-widest">
                    <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                    {feature.type}
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-serif text-3xl md:text-4xl font-bold leading-tight">
                      {feature.title}
                    </h3>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>

                  <div className="pt-4 flex items-center gap-6">
                    <div className="w-14 h-14 bg-foreground text-white flex items-center justify-center rounded-2xl shadow-lg">
                      {feature.icon}
                    </div>
                    <Button variant="link" className="text-primary p-0 h-auto font-bold text-lg hover:no-underline group">
                      En savoir plus 
                      <span className="ml-2 inline-block transition-transform group-hover:translate-x-2">→</span>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <CTASection />
      </main>
    </div>
  );
}
