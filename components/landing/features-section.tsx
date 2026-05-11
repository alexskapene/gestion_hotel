import { CreditCard, Headset, Search, ShieldCheck } from "lucide-react";

export function FeaturesSection() {
  const features = [
    {
      title: "Hôtels vérifiés",
      description:
        "Tous nos hôtels sont sélectionnés et vérifiés pour garantir une qualité fiable et un confort optimal.",
      icon: ShieldCheck,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      title: "Recherche rapide",
      description:
        "Trouvez facilement l’hôtel idéal grâce à un système de recherche rapide et simple à utiliser.",
      icon: Search,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      title: "Paiement sécurisé",
      description:
        "Vos paiements sont protégés par des systèmes sécurisés et fiables pour une tranquillité totale.",
      icon: CreditCard,
      color: "text-violet-500",
      bg: "bg-violet-500/10",
    },
    {
      title: "Support 24/7",
      description:
        "Notre équipe est disponible à tout moment pour vous aider avant, pendant et après votre séjour.",
      icon: Headset,
      color: "text-orange-500",
      bg: "bg-orange-500/10",
    },
  ];

  return (
    <section className="relative w-full">
      {/* HERO SECTION */}
      <div className="relative h-[65vh] w-full overflow-hidden">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center scale-105"
          style={{
            backgroundImage: "url('/hero.jpg')",
          }}
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/70" />

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-white px-6 text-center">
          <h2 className="font-serif text-4xl md:text-6xl font-bold max-w-4xl leading-tight">
            Pourquoi choisir notre plateforme ?
          </h2>

          <p className="mt-6 text-white/80 text-lg md:text-xl max-w-3xl leading-relaxed">
            Une expérience de réservation moderne, rapide et sécurisée pensée
            pour vous offrir plus de confort et de simplicité à chaque étape.
          </p>
        </div>
      </div>

      {/* FLOATING CARDS */}
      <div className="relative z-20 -mt-20 px-6 md:px-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={index}
                className="group relative overflow-hidden border border-border bg-background p-8 hover:-translate-y-2 transition-all duration-500"
              >
                <div className="relative z-10 flex flex-col items-center text-center gap-5">
                  {/* Icon */}
                  <div
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center ${item.bg} ${item.color}`}
                  >
                    <Icon className="w-7 h-7" />
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-semibold">{item.title}</h3>

                  {/* Description */}
                  <p className="text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>

                  {/* Bottom Line */}
                  <div className={`h-1 w-12 rounded-full ${item.bg}`} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
