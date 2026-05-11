"use client";

import { Building, CalendarCheck, Headset, Star } from "lucide-react";

export function Counters() {
  const stats = [
    {
      number: "120+",
      label: "Hôtels partenaires",
      icon: Building,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      number: "5 000+",
      label: "Réservations",
      icon: CalendarCheck,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      number: "4.7/5",
      label: "Satisfaction clients",
      icon: Star,
      color: "text-yellow-500",
      bg: "bg-yellow-500/10",
    },
    {
      number: "24/7",
      label: "Support disponible",
      icon: Headset,
      color: "text-violet-500",
      bg: "bg-violet-500/10",
    },
  ];

  return (
    <section className="relative -mt-10 z-20 px-4 sm:px-6 lg:px-20">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {stats.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={index}
                className="group relative overflow-hidden border border-border bg-background p-4 sm:p-6 lg:p-8 hover:-translate-y-1 transition-all duration-500"
              >
                <div className="relative z-10 flex flex-col items-center text-center gap-3 sm:gap-5">
                  {/* Icon */}
                  <div
                    className={`w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-2xl flex items-center justify-center ${item.bg} ${item.color}`}
                  >
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" />
                  </div>

                  {/* Number */}
                  <h3 className="text-xl sm:text-3xl lg:text-4xl font-bold leading-none">
                    {item.number}
                  </h3>

                  {/* Label */}
                  <p className="text-xs sm:text-sm lg:text-base text-muted-foreground leading-relaxed">
                    {item.label}
                  </p>

                  {/* Bottom line */}
                  <div
                    className={`h-1 w-8 sm:w-10 lg:w-12 rounded-full ${item.bg}`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
