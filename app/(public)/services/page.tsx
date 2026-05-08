"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  CalendarCheck,
  CheckCircle,
  Headphones,
  MapPin,
  Search,
  ShieldCheck,
  Star,
} from "lucide-react";
import Link from "next/link";

const services = [
  {
    title: "Recherche intelligente",
    icon: <Search className="w-6 h-6" />,
    description:
      "Trouvez rapidement les meilleurs hôtels selon vos préférences.",
  },
  {
    title: "Réservation rapide",
    icon: <CalendarCheck className="w-6 h-6" />,
    description: "Réservez votre chambre en quelques clics seulement.",
  },
  {
    title: "Paiement sécurisé",
    icon: <ShieldCheck className="w-6 h-6" />,
    description: "Vos transactions sont protégées et fiables.",
  },
  {
    title: "Localisation précise",
    icon: <MapPin className="w-6 h-6" />,
    description: "Découvrez les hôtels proches de vous facilement.",
  },
  {
    title: "Avis clients",
    icon: <Star className="w-6 h-6" />,
    description: "Consultez des avis pour faire le meilleur choix.",
  },
  {
    title: "Support 24/7",
    icon: <Headphones className="w-6 h-6" />,
    description: "Une assistance disponible à tout moment.",
  },
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        {/* HERO */}
        <section className="bg-background py-16">
          <div className="container mx-auto px-4 text-center max-w-2xl space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold">Nos Services</h1>

            <p className="text-muted-foreground">
              Simplifiez votre réservation d’hôtel grâce à une plateforme
              moderne, rapide et sécurisée.
            </p>
          </div>
        </section>

        {/* CONTEXTE */}
        <section className="py-12 container mx-auto px-4 max-w-3xl text-center">
          <p className="text-muted-foreground leading-relaxed">
            Trouver un hébergement fiable peut être compliqué. Notre plateforme
            a été conçue pour vous offrir une expérience simple, rapide et
            sécurisée. Comparez, choisissez et réservez les meilleurs hôtels en
            toute confiance.
          </p>
        </section>

        {/* SERVICES */}
        <section className="py-12 container mx-auto px-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <Card
                key={index}
                className="rounded-2xl hover:shadow-lg transition"
              >
                <CardContent className="p-6 space-y-4">
                  <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary/10 text-primary">
                    {service.icon}
                  </div>

                  <h3 className="font-semibold text-lg">{service.title}</h3>

                  <p className="text-sm text-muted-foreground">
                    {service.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* COMMENT ÇA MARCHE */}
        <section className="py-16 bg-muted">
          <div className="container mx-auto px-4 text-center space-y-10">
            <h2 className="text-2xl font-bold">Comment ça marche ?</h2>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <div className="text-3xl font-bold text-primary">1</div>
                <h3 className="font-semibold">Recherchez</h3>
                <p className="text-sm text-muted-foreground">
                  Entrez votre destination et trouvez les hôtels disponibles.
                </p>
              </div>

              <div className="space-y-3">
                <div className="text-3xl font-bold text-primary">2</div>
                <h3 className="font-semibold">Comparez</h3>
                <p className="text-sm text-muted-foreground">
                  Consultez les prix, avis et services proposés.
                </p>
              </div>

              <div className="space-y-3">
                <div className="text-3xl font-bold text-primary">3</div>
                <h3 className="font-semibold">Réservez</h3>
                <p className="text-sm text-muted-foreground">
                  Finalisez votre réservation en toute sécurité.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* POURQUOI NOUS */}
        <section className="py-16 container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-8 text-center">
            <h2 className="text-2xl font-bold">
              Pourquoi choisir notre plateforme ?
            </h2>

            <div className="grid md:grid-cols-2 gap-6 text-left">
              {[
                "Plateforme simple et rapide",
                "Hôtels vérifiés et fiables",
                "Paiement sécurisé",
                "Support client disponible",
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle className="text-primary w-5 h-5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-primary text-primary-foreground text-center">
          <h2 className="text-2xl font-bold mb-4">
            Prêt à réserver votre hôtel ?
          </h2>

          <p className="mb-6 opacity-90">
            Découvrez les meilleures offres dès maintenant.
          </p>

          <Link href="/hotels">
            <Button size="lg" variant="secondary" className="rounded-full">
              Explorer les hôtels
            </Button>
          </Link>
        </section>
      </main>
    </div>
  );
}
