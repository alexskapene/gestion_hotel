"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MapPin, Phone, Send, MessageSquare } from "lucide-react";
import { useState } from "react";
import { CTASection } from "@/components/landing/cta-section";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(form);
    alert("Message envoyé ! Nous vous répondrons sous peu.");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="w-full">
        {/* HERO SECTION */}
        <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: "url('/room.jpg')",
            }}
          />
          <div className="absolute inset-0 bg-black/70" />

          <div className="relative z-10 container mx-auto px-6 text-center text-white space-y-6">
            <h1 className="font-serif text-4xl md:text-6xl font-bold leading-tight max-w-4xl mx-auto">
              Besoin d&apos;aide ? <span className="text-primary">Contactez-nous</span>
            </h1>
            <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
              Notre équipe est à votre disposition pour répondre à toutes vos questions et vous accompagner dans votre réservation.
            </p>
          </div>
        </section>

        {/* CONTACT SECTION */}
        <section className="py-24 container mx-auto px-6">
          <div className="grid lg:grid-cols-12 gap-16">
            {/* INFOS - Floating Pattern Style */}
            <div className="lg:col-span-5 space-y-12">
              <div className="space-y-4">
                <h2 className="font-serif text-3xl font-bold italic">Parlons de votre prochain séjour</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Que vous ayez une question spécifique sur un hôtel ou que vous souhaitiez en savoir plus sur notre plateforme, nous sommes là pour vous.
                </p>
              </div>

              <div className="grid gap-6">
                {[
                  { icon: Mail, label: "Email", value: "contact@hotelapp.com", desc: "Réponse sous 24h" },
                  { icon: Phone, label: "Téléphone", value: "+243 900 000 000", desc: "Lun - Ven, 9h - 18h" },
                  { icon: MapPin, label: "Bureau", value: "Ituri, RD Congo", desc: "Province de l'Ituri" },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4 p-6 bg-muted/50 border border-border rounded-none group hover:border-primary transition-colors duration-300">
                    <div className="w-12 h-12 bg-foreground text-primary flex items-center justify-center shrink-0">
                      <item.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">{item.label}</p>
                      <p className="font-bold text-lg">{item.value}</p>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* FORMULAIRE */}
            <div className="lg:col-span-7">
              <Card className="bg-foreground border border-white/10 text-white shadow-2xl rounded-none p-4 md:p-8">
                <CardContent className="p-4 md:p-8 space-y-8">
                  <div className="space-y-2">
                    <h3 className="font-serif text-3xl font-bold text-primary flex items-center gap-3">
                      <MessageSquare className="w-8 h-8" />
                      Envoyez un message
                    </h3>
                    <p className="text-white/60">Remplissez le formulaire ci-dessous et nous vous recontacterons très rapidement.</p>
                  </div>

                  <form onSubmit={handleSubmit} className="grid gap-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-wider text-white/50">Votre Nom</label>
                        <Input
                          name="name"
                          placeholder="Ex: Jean Dupont"
                          className="bg-white/5 border-white/10 text-white placeholder:text-white/20 h-12 rounded-none focus:ring-primary"
                          value={form.name}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-wider text-white/50">Votre Email</label>
                        <Input
                          type="email"
                          name="email"
                          placeholder="Ex: jean@email.com"
                          className="bg-white/5 border-white/10 text-white placeholder:text-white/20 h-12 rounded-none focus:ring-primary"
                          value={form.email}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-semibold uppercase tracking-wider text-white/50">Votre Message</label>
                      <Textarea
                        name="message"
                        placeholder="Comment pouvons-nous vous aider ?"
                        rows={6}
                        className="bg-white/5 border-white/10 text-white placeholder:text-white/20 rounded-none focus:ring-primary resize-none"
                        value={form.message}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <Button type="submit" className="w-full h-14 bg-primary text-primary-foreground hover:bg-primary/80 rounded-full text-lg font-bold">
                      <Send className="w-5 h-5 mr-2" />
                      Envoyer le message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* BOTTOM CTA - Using Home Pattern */}
        <CTASection />
      </main>
    </div>
  );
}
