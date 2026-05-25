"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  CalendarDays,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  Mail,
  Phone,
  Save,
  ShieldCheck,
  Star,
  Wallet,
  XCircle,
} from "lucide-react";

export type ClientProfile = {
  id: string;
  username: string | null;
  email: string;
  phone: string | null;
  avatar: string | null;
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: {
    reservations: number;
    reviews: number;
  };
};

export type ClientProfileStats = {
  reservationCount: number;
  reviewCount: number;
  totalSpent: number;
};

type Props = {
  initialProfile: ClientProfile;
  initialStats: ClientProfileStats;
  onProfileUpdated?: (profile: ClientProfile) => void;
};

export default function ClientProfileForm({
  initialProfile,
  initialStats,
  onProfileUpdated,
}: Props) {
  const { data: session, update: updateSession } = useSession();
  const [profile, setProfile] = useState(initialProfile);
  const [stats] = useState(initialStats);
  const [username, setUsername] = useState(profile.username || "");
  const [phone, setPhone] = useState(profile.phone || "");
  const [avatar, setAvatar] = useState(profile.avatar || "");
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState<
    "idle" | "checking" | "available" | "taken"
  >("idle");

  useEffect(() => {
    setProfile(initialProfile);
    setUsername(initialProfile.username || "");
    setPhone(initialProfile.phone || "");
    setAvatar(initialProfile.avatar || "");
  }, [initialProfile]);

  const displayName =
    profile.username || session?.user?.name || profile.email.split("@")[0];

  const initials = displayName.substring(0, 2).toUpperCase();

  const checkUsername = async (value: string) => {
    const trimmed = value.trim();
    if (!trimmed || trimmed === (profile.username || "")) {
      setUsernameStatus("idle");
      return;
    }

    setUsernameStatus("checking");
    try {
      const res = await fetch(
        `/api/clients/profile?checkUsername=${encodeURIComponent(trimmed)}`
      );
      const data = await res.json();
      setUsernameStatus(data.available ? "available" : "taken");
    } catch {
      setUsernameStatus("idle");
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword.length < 6) {
      toast.error("Le nouveau mot de passe doit contenir au moins 6 caractères");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas");
      return;
    }

    setChangingPassword(true);
    try {
      const res = await fetch("/api/clients/profile/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          confirmPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Échec du changement de mot de passe");
      }

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      toast.success("Mot de passe modifié avec succès");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Une erreur est survenue"
      );
    } finally {
      setChangingPassword(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (usernameStatus === "taken") {
      toast.error("Ce nom d'utilisateur est déjà pris");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/clients/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username.trim() || null,
          phone: phone.trim() || null,
          avatar: avatar.trim() || null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Échec de la mise à jour");
      }

      const updated: ClientProfile = {
        ...profile,
        ...data,
        _count: profile._count,
      };
      setProfile(updated);
      onProfileUpdated?.(updated);

      await updateSession({
        user: {
          ...session?.user,
          name: updated.username || session?.user?.name,
          username: updated.username,
        },
      });

      toast.success("Profil mis à jour avec succès");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Une erreur est survenue"
      );
    } finally {
      setSaving(false);
    }
  };

  const memberSince = format(new Date(profile.createdAt), "d MMMM yyyy", {
    locale: fr,
  });

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Réservations
            </CardTitle>
            <CalendarDays className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.reservationCount}
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avis publiés
            </CardTitle>
            <Star className="w-4 h-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.reviewCount}</div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total dépensé
            </CardTitle>
            <Wallet className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${(stats.totalSpent / 100).toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="border-none shadow-xl bg-card">
          <CardHeader>
            <CardTitle className="font-serif text-2xl">
              Informations personnelles
            </CardTitle>
            <CardDescription>
              Mettez à jour vos coordonnées et votre photo de profil.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pb-6 border-b border-border/50">
              <Avatar className="h-24 w-24 border-4 border-primary/20 shadow-lg">
                <AvatarImage src={avatar || undefined} alt={displayName} />
                <AvatarFallback className="text-2xl font-bold bg-primary/5 text-primary">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <h4 className="font-bold text-lg">{displayName}</h4>
                <div className="flex flex-wrap gap-2">
                  {profile.isVerified ? (
                    <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Compte vérifié
                    </Badge>
                  ) : (
                    <Badge variant="secondary">Non vérifié</Badge>
                  )}
                  {!profile.isActive && (
                    <Badge variant="destructive">
                      <XCircle className="w-3 h-3 mr-1" />
                      Compte inactif
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  Membre depuis le {memberSince}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="avatar">URL de la photo de profil</Label>
              <Input
                id="avatar"
                type="url"
                placeholder="https://..."
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                className="h-11"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="username">Nom d&apos;utilisateur</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setUsernameStatus("idle");
                  }}
                  onBlur={(e) => checkUsername(e.target.value)}
                  placeholder="Votre pseudo"
                  className="h-11"
                />
                {usernameStatus === "checking" && (
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Vérification...
                  </p>
                )}
                {usernameStatus === "available" && (
                  <p className="text-xs text-green-600">
                    Ce nom est disponible
                  </p>
                )}
                {usernameStatus === "taken" && (
                  <p className="text-xs text-destructive">
                    Ce nom d&apos;utilisateur est déjà pris
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Adresse email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    disabled
                    className="h-11 pl-10 bg-muted/50"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  L&apos;email ne peut pas être modifié ici.
                </p>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="phone">Numéro de téléphone</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+243 ..."
                    className="h-11 pl-10"
                  />
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter className="bg-muted/10 border-t border-border p-6 flex justify-end">
            <Button
              type="submit"
              disabled={saving || usernameStatus === "taken"}
              className="bg-primary hover:bg-primary/90 gap-2 px-8"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Enregistrement...
                </>
              ) : (
                <>
                  Enregistrer les modifications
                  <Save className="w-4 h-4" />
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>

      <form onSubmit={handlePasswordSubmit}>
        <Card className="border-none shadow-xl bg-card">
          <CardHeader>
            <CardTitle className="font-serif text-2xl flex items-center gap-2">
              <KeyRound className="w-6 h-6 text-primary" />
              Sécurité du compte
            </CardTitle>
            <CardDescription>
              Modifiez votre mot de passe pour protéger votre compte.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Mot de passe actuel</Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  type={showCurrentPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-11 pr-10"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  tabIndex={-1}
                >
                  {showCurrentPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="space-y-2">
                <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="h-11 pr-10"
                    autoComplete="new-password"
                    minLength={6}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    tabIndex={-1}
                  >
                    {showNewPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Minimum 6 caractères
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="h-11 pr-10"
                    autoComplete="new-password"
                    minLength={6}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {confirmPassword && newPassword !== confirmPassword && (
                  <p className="text-xs text-destructive">
                    Les mots de passe ne correspondent pas
                  </p>
                )}
              </div>
            </div>
          </CardContent>

          <CardFooter className="bg-muted/10 border-t border-border p-6 flex justify-end">
            <Button
              type="submit"
              disabled={
                changingPassword ||
                !currentPassword ||
                !newPassword ||
                !confirmPassword ||
                newPassword !== confirmPassword
              }
              className="bg-primary hover:bg-primary/90 px-8"
            >
              {changingPassword ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Modification...
                </>
              ) : (
                "Changer le mot de passe"
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
