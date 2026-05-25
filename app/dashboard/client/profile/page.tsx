"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import ClientProfileForm, {
  type ClientProfile,
  type ClientProfileStats,
} from "@/components/dashboard/ClientProfileForm";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export default function ClientProfilePage() {
  const { data: session, status } = useSession();
  const [profile, setProfile] = useState<ClientProfile | null>(null);
  const [stats, setStats] = useState<ClientProfileStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/auth/login");
    }

    if (session?.user?.id) {
      fetchProfile();
    }
  }, [session, status]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/clients/profile");

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "Erreur lors du chargement du profil");
      }

      const data = await response.json();
      setProfile(data.profile);
      setStats(data.stats);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Une erreur est survenue"
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="h-10 bg-muted rounded animate-pulse max-w-md" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-28 bg-muted rounded animate-pulse" />
          ))}
        </div>
        <div className="h-96 bg-muted rounded animate-pulse" />
      </div>
    );
  }

  if (error || !profile || !stats) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">
            Mon Profil
          </h1>
        </div>
        <Card className="border-red-200 bg-red-50/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
              <p className="text-red-700">
                {error || "Impossible de charger le profil"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-serif font-bold text-foreground">
          Mon Profil
        </h1>
        <p className="text-muted-foreground mt-1">
          Consultez et modifiez vos informations personnelles.
        </p>
      </div>

      <ClientProfileForm
        initialProfile={profile}
        initialStats={stats}
        onProfileUpdated={setProfile}
      />
    </div>
  );
}
