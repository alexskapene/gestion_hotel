import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import HotelProfileForm from "@/components/dashboard/HotelProfileForm";
import { HotelService } from "@/services/hotel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function HotelProfilePage() {
  const session = await auth();
  if (!session) redirect("/auth/login");

  const role = (session.user as any)?.role;
  if (role !== "HOTEL_OWNER") redirect("/auth/login");

  const userId = (session.user as any).id;
  const hotel = await HotelService.getHotelByOwner(userId);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h2 className="text-3xl font-serif font-bold">Profil de l'hôtel</h2>
        <p className="text-muted-foreground mt-1">Gérez les informations publiques de votre établissement.</p>
      </div>

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="font-serif">Informations</CardTitle>
        </CardHeader>
        <CardContent>
            <HotelProfileForm initial={hotel} />
        </CardContent>
      </Card>
    </div>
  );
}
