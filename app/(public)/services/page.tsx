"use client";

import { CTASection } from "@/components/landing/cta-section";
import { Button } from "@/components/ui/button";
import {
  CalendarCheck,
  ChartColumn,
  CreditCard,
  GitCompare,
  Headphones,
  Hotel,
  MapPin,
  PartyPopper,
  Search,
  ShieldCheck,
  Star,
  TrendingUp,
} from "lucide-react";
import Image from "next/image";

const travelerServices = [
  {
    title: "Recherche intelligente",
    description:
      "Trouvez rapidement l’hôtel idéal grâce à un moteur de recherche moderne et intuitif.",
    icon: <Search className="w-6 h-6" />,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    title: "Réservation rapide",
    description:
      "Réservez votre chambre en quelques clics avec une expérience fluide et rapide.",
    icon: <CalendarCheck className="w-6 h-6" />,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    title: "Paiement sécurisé",
    description:
      "Toutes vos transactions sont protégées avec des systèmes de sécurité fiables.",
    icon: <ShieldCheck className="w-6 h-6" />,
    color: "text-violet-500",
    bg: "bg-violet-500/10",
  },
  {
    title: "Support 24/7",
    description:
      "Notre équipe reste disponible à tout moment pour vous accompagner.",
    icon: <Headphones className="w-6 h-6" />,
    color: "text-orange-500",
    bg: "bg-orange-500/10",
  },
  {
    title: "Avis vérifiés",
    description:
      "Consultez des avis authentiques pour choisir votre séjour en toute confiance.",
    icon: <Star className="w-6 h-6" />,
    color: "text-yellow-500",
    bg: "bg-yellow-500/10",
  },
  {
    title: "Localisation précise",
    description:
      "Découvrez facilement les hôtels proches de votre destination idéale.",
    icon: <MapPin className="w-6 h-6" />,
    color: "text-rose-500",
    bg: "bg-rose-500/10",
  },
];

const hotelServices = [
  {
    title: "Gestion réservations",
    description:
      "Centralisez et gérez toutes les réservations depuis un tableau de bord moderne.",
    icon: <Hotel className="w-6 h-6" />,
    color: "text-cyan-500",
    bg: "bg-cyan-500/10",
  },
  {
    title: "Analytiques avancées",
    description:
      "Suivez les performances de votre établissement grâce à des statistiques détaillées.",
    icon: <ChartColumn className="w-6 h-6" />,
    color: "text-indigo-500",
    bg: "bg-indigo-500/10",
  },
  {
    title: "Croissance & visibilité",
    description:
      "Développez votre visibilité en ligne et augmentez votre taux d’occupation rapidement.",
    icon: <TrendingUp className="w-6 h-6" />,
    color: "text-green-500",
    bg: "bg-green-500/10",
  },
  {
    title: "Paiements simplifiés",
    description:
      "Recevez et gérez vos paiements facilement avec des outils intégrés modernes.",
    icon: <CreditCard className="w-6 h-6" />,
    color: "text-pink-500",
    bg: "bg-pink-500/10",
  },
];

const processSteps = [
  {
    title: "Rechercher",
    description:
      "Explorez une large sélection d’établissements adaptés à vos besoins.",
    icon: <Search className="w-6 h-6" />,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    title: "Comparer",
    description:
      "Analysez les prix, services et avis pour trouver la meilleure option.",
    icon: <GitCompare className="w-6 h-6" />,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    title: "Réserver",
    description:
      "Effectuez votre réservation rapidement avec un paiement sécurisé.",
    icon: <CalendarCheck className="w-6 h-6" />,
    color: "text-violet-500",
    bg: "bg-violet-500/10",
  },
  {
    title: "Profiter",
    description:
      "Vivez une expérience confortable et premium pendant votre séjour.",
    icon: <PartyPopper className="w-6 h-6" />,
    color: "text-orange-500",
    bg: "bg-orange-500/10",
  },
];
export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-background overflow-hidden">
      <main className="w-full">
        {/* HERO SECTION */}
        <section className="relative min-h-[45vh] md:min-h-[50vh] flex items-center justify-center overflow-hidden py-16 md:py-0">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
            style={{
              backgroundImage: "url('/room.jpg')",
            }}
          />

          <div className="absolute inset-0 bg-black/75 backdrop-blur-[2px]" />

          <div className="relative z-10 container mx-auto px-4 sm:px-6 text-center text-white space-y-6">
            <h1 className="font-serif text-4xl sm:text-4xl md:text-6xl font-bold leading-[1.1] max-w-4xl mx-auto text-balance">
              Une plateforme pensée pour{" "}
              <span className="text-primary">vos besoins</span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-white/80 max-w-3xl mx-auto text-balance leading-relaxed">
              Découvrez des solutions modernes conçues pour simplifier les
              réservations, améliorer la gestion hôtelière et offrir une
              expérience fluide à chaque utilisateur.
            </p>
          </div>
        </section>
        {/* TRAVELERS SERVICES */}
        <section className="relative py-28">
          <div className="absolute top-20 left-0 w-72 h-72 bg-primary/10 blur-3xl rounded-full" />

          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-3xl mx-auto text-center space-y-5 mb-20">
              <h2 className="font-serif text-3xl md:text-5xl font-bold">
                Une expérience pensée pour les voyageurs
              </h2>

              <p className="text-muted-foreground text-lg leading-relaxed">
                Réservez facilement vos séjours et profitez d’outils modernes
                conçus pour rendre chaque expérience plus simple et agréable.
              </p>
            </div>

            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
              {travelerServices.map((service, index) => (
                <div
                  key={index}
                  className="group relative border border-border bg-background/70 p-8 hover:-translate-y-1 transition-all duration-500"
                >
                  <div className="relative z-10 space-y-6">
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center ${service.bg} ${service.color}`}
                    >
                      {service.icon}
                    </div>

                    <div className="space-y-3">
                      <h3 className="text-2xl font-semibold">
                        {service.title}
                      </h3>

                      <p className="text-muted-foreground leading-relaxed">
                        {service.description}
                      </p>
                    </div>

                    <Button
                      variant="link"
                      className="p-0 h-auto text-primary font-semibold hover:no-underline"
                    >
                      Découvrir →
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        {/* HOTELIERS SERVICES */}
        <section className="py-28 bg-muted/30 relative overflow-hidden">
          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-3xl mx-auto text-center space-y-5 mb-20">
              <h2 className="font-serif text-3xl md:text-5xl font-bold">
                Des outils puissants pour votre établissement
              </h2>

              <p className="text-muted-foreground text-lg leading-relaxed">
                Gérez votre hôtel plus efficacement grâce à des solutions
                modernes pensées pour améliorer votre activité.
              </p>
            </div>

            <div className="grid lg:grid-cols-2  gap-10 items-center">
              {/* BIG CARD */}
              <div className="relative  overflow-hidden min-h-[550px] border border-border/50">
                <Image
                  src="/room.jpg"
                  alt="Hotel Dashboard"
                  fill
                  className="object-cover"
                />

                <div className="absolute inset-0 bg-black/60" />

                <div className="relative z-10 p-10 h-full flex flex-col justify-between text-white">
                  <div className="space-y-5">
                    <div className="inline-flex px-4 py-2 bg-white/10 backdrop-blur-md text-sm">
                      Dashboard Hôtelier
                    </div>

                    <h3 className="font-serif text-3xl font-bold leading-tight">
                      Gérez votre activité avec simplicité
                    </h3>

                    <p className="text-white/80 leading-relaxed text-lg">
                      Centralisez vos réservations, suivez vos performances et
                      améliorez votre visibilité depuis une seule plateforme.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className=" bg-white/10 backdrop-blur-md p-5">
                      <p className="text-3xl font-bold">+85%</p>
                      <p className="text-sm text-white/70">
                        Réservations mensuelles
                      </p>
                    </div>

                    <div className=" bg-white/10 backdrop-blur-md p-5">
                      <p className="text-3xl font-bold">24/7</p>
                      <p className="text-sm text-white/70">
                        Gestion accessible
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* MINI CARDS */}
              <div className="grid sm:grid-cols-2 gap-6">
                {hotelServices.map((service, index) => (
                  <div
                    key={index}
                    className="group border border-border bg-background p-8 hover:-translate-y-1 transition-all duration-500"
                  >
                    <div className="space-y-6">
                      <div
                        className={`w-14 h-14 rounded-2xl flex items-center justify-center ${service.bg} ${service.color}`}
                      >
                        {service.icon}
                      </div>

                      <div className="space-y-3">
                        <h3 className="text-2xl font-semibold">
                          {service.title}
                        </h3>

                        <p className="text-muted-foreground leading-relaxed">
                          {service.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
        {/* PROCESS SECTION */}
        {/* PROCESS SECTION */}
        <section className="py-28 relative">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto text-center space-y-5 mb-24">
              <h2 className="font-serif text-3xl  md:text-5xl font-bold">
                Comment fonctionne la plateforme
              </h2>

              <p className="text-muted-foreground text-lg leading-relaxed">
                Une expérience simple et rapide conçue pour vous accompagner à
                chaque étape.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {processSteps.map((step, index) => (
                <div
                  key={index}
                  className="group relative border border-border bg-background p-8 hover:-translate-y-2 transition-all duration-500"
                >
                  {/* BIG BACKGROUND NUMBER (garde effet branding) */}
                  <div className="absolute -top-10 right-4 text-8xl font-bold text-muted-foreground/10 select-none">
                    {`0${index + 1}`}
                  </div>

                  {/* glow effect */}
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition" />

                  <div className="relative z-10 space-y-6">
                    {/* ICON remplace le number UI */}
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center ${step.bg} ${step.color}`}
                    >
                      {step.icon}
                    </div>

                    <div className="space-y-3">
                      <h3 className="text-2xl font-semibold">{step.title}</h3>

                      <p className="text-muted-foreground leading-relaxed">
                        {step.description}
                      </p>
                    </div>

                    <div className={`h-1 w-12 rounded-full ${step.bg}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>{" "}
        {/* CTA */}
        <CTASection />
      </main>
    </div>
  );
}
