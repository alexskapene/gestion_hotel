"use client";

import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Hotel, 
  Users, 
  CalendarCheck, 
  Wallet, 
  ArrowUpRight, 
  ArrowDownRight,
  TrendingUp,
  Clock
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from "recharts";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const data = [
  { name: "Jan", total: 1200 },
  { name: "Feb", total: 1900 },
  { name: "Mar", total: 1500 },
  { name: "Apr", total: 2400 },
  { name: "May", total: 3100 },
  { name: "Jun", total: 2800 },
  { name: "Jul", total: 4200 },
];

const hotelData = [
  { name: "Hotel Plaza", value: 400 },
  { name: "Ocean View", value: 300 },
  { name: "Mountain Inn", value: 300 },
  { name: "City Center", value: 200 },
];

const COLORS = ["var(--primary)", "oklch(0.75 0.12 260)", "oklch(0.62 0.25 10)", "oklch(0.45 0.02 260)"];

const recentBookings = [
  {
    id: "BK-8291",
    client: "Alex Smith",
    hotel: "Hotel Plaza",
    date: "2024-05-08",
    amount: "$320.00",
    status: "Confirmé",
  },
  {
    id: "BK-8292",
    client: "Sarah Connor",
    hotel: "Ocean View",
    date: "2024-05-08",
    amount: "$540.00",
    status: "En attente",
  },
  {
    id: "BK-8293",
    client: "James Bond",
    hotel: "Mountain Inn",
    date: "2024-05-07",
    amount: "$210.00",
    status: "Confirmé",
  },
  {
    id: "BK-8294",
    client: "Maria Garcia",
    hotel: "Hotel Plaza",
    date: "2024-05-07",
    amount: "$450.00",
    status: "Annulé",
  },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">Vue d&apos;ensemble</h1>
          <p className="text-muted-foreground mt-1">
            Bienvenue, voici les dernières statistiques de Zua Place.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">Exporter</Button>
          <Button size="sm" className="bg-primary hover:bg-primary/90">
            Gérer les Hôtels
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-none shadow-sm bg-card hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Revenu Total</CardTitle>
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Wallet className="w-4 h-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,231.89</div>
            <p className="text-xs text-green-500 flex items-center mt-1">
              <ArrowUpRight className="w-3 h-3 mr-1" />
              +20.1% par rapport au mois dernier
            </p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-card hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Réservations</CardTitle>
            <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
              <CalendarCheck className="w-4 h-4 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+2350</div>
            <p className="text-xs text-green-500 flex items-center mt-1">
              <ArrowUpRight className="w-3 h-3 mr-1" />
              +180.1% par rapport au mois dernier
            </p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-card hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Hôtels Actifs</CardTitle>
            <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
              <Hotel className="w-4 h-4 text-accent" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+122</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <Clock className="w-3 h-3 mr-1" />
              +2 en attente d&apos;approbation
            </p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-card hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Nouveaux Clients</CardTitle>
            <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center">
              <Users className="w-4 h-4 text-purple-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+573</div>
            <p className="text-xs text-red-500 flex items-center mt-1">
              <ArrowDownRight className="w-3 h-3 mr-1" />
              -4% par rapport au mois dernier
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
        {/* Revenue Chart */}
        <Card className="lg:col-span-4 border-none shadow-sm overflow-hidden">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-serif">Croissance des revenus</CardTitle>
                <CardDescription>Performance financière sur les 7 derniers mois</CardDescription>
              </div>
              <TrendingUp className="text-primary w-5 h-5" />
            </div>
          </CardHeader>
          <CardContent className="h-[300px] w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="oklch(0.9 0.01 260)" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: "oklch(0.45 0.02 260)", fontSize: 12 }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: "oklch(0.45 0.02 260)", fontSize: 12 }} 
                />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: "12px", 
                    border: "none", 
                    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" 
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="total" 
                  stroke="var(--primary)" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorTotal)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Hotel Performance */}
        <Card className="lg:col-span-3 border-none shadow-sm overflow-hidden">
          <CardHeader>
            <CardTitle className="text-lg font-serif">Top Établissements</CardTitle>
            <CardDescription>Répartition des réservations par hôtel</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hotelData} layout="vertical">
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fill: "oklch(0.45 0.02 260)", fontSize: 12 }}
                  width={100}
                />
                <Tooltip cursor={{ fill: "transparent" }} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                  {hotelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Bookings Table */}
      <Card className="border-none shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl font-serif">Réservations Récentes</CardTitle>
            <CardDescription>Vous avez 12 nouvelles réservations aujourd&apos;hui.</CardDescription>
          </div>
          <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">Voir tout</Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Client</TableHead>
                <TableHead>Hôtel</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Montant</TableHead>
                <TableHead>Statut</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentBookings.map((booking) => (
                <TableRow key={booking.id} className="group transition-colors">
                  <TableCell className="font-medium">{booking.client}</TableCell>
                  <TableCell>{booking.hotel}</TableCell>
                  <TableCell>{booking.date}</TableCell>
                  <TableCell className="font-semibold">{booking.amount}</TableCell>
                  <TableCell>
                    <Badge 
                      variant="secondary"
                      className={
                        booking.status === "Confirmé" ? "bg-green-100 text-green-700 hover:bg-green-100" :
                        booking.status === "En attente" ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-100" :
                        "bg-red-100 text-red-700 hover:bg-red-100"
                      }
                    >
                      {booking.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}