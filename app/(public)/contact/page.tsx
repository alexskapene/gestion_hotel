"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Twitter,
} from "lucide-react";
import { useState } from "react";

export default function ContactPage() {
  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    phone: "",
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
    alert("Message envoyé !");
    setForm({
      firstname: "",
      lastname: "",
      phone: "",
      email: "",
      message: "",
    });
  };

  const contactInfos = [
    {
      icon: Mail,
      label: "Email",
      value: "contact@hotelapp.com",
      desc: "Réponse sous 24h",
      color: "text-indigo-400",
      bg: "bg-indigo-500/10",
    },
    {
      icon: Phone,
      label: "Téléphone",
      value: "+243 900 000 000",
      desc: "Lun - Ven, 9h - 18h",
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
    },
    {
      icon: MapPin,
      label: "Localisation",
      value: "Ituri, RD Congo",
      desc: "Support régional",
      color: "text-rose-400",
      bg: "bg-rose-500/10",
    },
  ];

  const socials = [
    { icon: Facebook },
    { icon: Instagram },
    { icon: Twitter },
    { icon: Linkedin },
  ];

  return (
    <div className="min-h-screen bg-background">
      <main className="w-full">
        {/* HERO */}
        <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
            style={{ backgroundImage: "url('/room.jpg')" }}
          />

          <div className="absolute inset-0 bg-black/75" />

          <div className="relative z-10 container mx-auto px-6 text-center text-white space-y-6">
            <h1 className="font-serif text-4xl md:text-6xl font-bold max-w-4xl mx-auto">
              Contactez <span className="text-primary">notre équipe</span> pour
              toute assistance
            </h1>

            <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
              Nous sommes disponibles pour répondre à toutes vos questions et
              vous accompagner rapidement.
            </p>
          </div>
        </section>

        {/* CONTACT SECTION */}
        <section className="py-28 container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-stretch">
            {/* LEFT */}
            <div className="space-y-10 flex flex-col justify-between">
              <div>
                <h2 className="font-serif text-3xl md:text-4xl font-bold">
                  Parlons ensemble pour mieux vous accompagner
                </h2>

                <p className="text-muted-foreground mt-3 leading-relaxed">
                  Nous sommes à votre écoute pour vous accompagner, répondre à
                  vos questions et vous guider dans toutes vos démarches.
                </p>
              </div>

              {/* CONTACT INFOS */}
              <div className="space-y-6">
                {contactInfos.map((item, i) => (
                  <div key={i} className="flex items-start gap-5">
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center ${item.bg} ${item.color}`}
                    >
                      <item.icon className="w-6 h-6" />
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-widest text-muted-foreground">
                        {item.label}
                      </p>

                      <p className="text-lg font-semibold">{item.value}</p>

                      <p className="text-sm text-muted-foreground">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* SOCIALS */}
              <div className="space-y-3">
                <p className="text-sm uppercase tracking-widest text-muted-foreground">
                  Suivez-nous
                </p>

                <div className="flex gap-4">
                  {socials.map((s, i) => (
                    <div
                      key={i}
                      className="w-11 h-11 flex items-center justify-center rounded-xl bg-muted/30 text-muted-foreground hover:bg-primary hover:text-white transition-all duration-300 cursor-pointer"
                    >
                      <s.icon className="w-5 h-5" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT FORM */}
            <Card className="border border-border bg-background">
              <CardContent className="p-8 space-y-6">
                <div className="space-y-2">
                  <h3 className="font-serif text-3xl font-bold">
                    Envoyer un message
                  </h3>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* NAMES */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest text-muted-foreground">
                        Prénom
                      </label>

                      <Input
                        name="firstname"
                        placeholder="Jean"
                        onChange={handleChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest text-muted-foreground">
                        Nom
                      </label>

                      <Input
                        name="lastname"
                        placeholder="Dupont"
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  {/* PHONE */}
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-muted-foreground">
                      Téléphone
                    </label>

                    <Input
                      name="phone"
                      placeholder="+243 900 000 000"
                      onChange={handleChange}
                    />
                  </div>

                  {/* EMAIL */}
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-muted-foreground">
                      Email
                    </label>

                    <Input
                      name="email"
                      placeholder="contact@email.com"
                      onChange={handleChange}
                    />
                  </div>

                  {/* MESSAGE */}
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-muted-foreground">
                      Message
                    </label>

                    <Textarea
                      name="message"
                      placeholder="Écrivez votre message..."
                      rows={20}
                      className="rounded-none resize-none"
                      onChange={handleChange}
                    />
                  </div>

                  {/* BUTTON */}
                  <Button
                    type="submit"
                    className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/80 text-lg font-semibold"
                  >
                    Envoyer
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
}
