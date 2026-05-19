"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Search,
  BedDouble,
  Users,
  Wifi,
  Car,
  Coffee,
  Tv,
  Wind,
  Edit,
  Trash2,
  MoreVertical,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const amenityIcons: Record<string, React.ReactNode> = {
  wifi: <Wifi className="w-3 h-3" />,
  tv: <Tv className="w-3 h-3" />,
  ac: <Wind className="w-3 h-3" />,
  parking: <Car className="w-3 h-3" />,
  restaurant: <Coffee className="w-3 h-3" />,
};

const statusConfig = {
  available: { label: "Disponible", class: "bg-primary/10 text-primary" },
  occupied: { label: "Occupée", class: "bg-accent/10 text-accent" },
  maintenance: { label: "Maintenance", class: "bg-destructive/10 text-destructive" },
};

interface Room {
  id: number;
  number: string;
  type: string;
  price: number;
  capacity: number;
  status: string;
  amenities: string[];
  image: string;
  description: string;
}

interface RoomsPageClientProps {
  rooms: Room[];
}

export function RoomsPageClient({ rooms }: RoomsPageClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");

  const filteredRooms = rooms.filter((room) => {
    const matchesSearch =
      room.number.includes(searchQuery) ||
      room.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || room.status === filterStatus;
    const matchesType = filterType === "all" || room.type === filterType;
    return matchesSearch && matchesStatus && matchesType;
  });

  const roomTypes = [...new Set(rooms.map((r) => r.type))];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold">Gestion des Chambres</h2>
          <p className="text-muted-foreground">
            {rooms.length} chambres au total - {rooms.filter((r) => r.status === "available").length} disponibles
          </p>
        </div>
        <Button className="rounded-full w-fit">
          <Plus className="w-4 h-4 mr-2" />
          Ajouter une Chambre
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher par numéro ou type..."
            className="rounded-full pl-11"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-full sm:w-40 rounded-full">
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="available">Disponible</SelectItem>
            <SelectItem value="occupied">Occupée</SelectItem>
            <SelectItem value="maintenance">Maintenance</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-full sm:w-48 rounded-full">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les types</SelectItem>
            {roomTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Rooms Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRooms.map((room) => {
          const status = statusConfig[room.status as keyof typeof statusConfig];
          return (
            <Card key={room.id} className="rounded-2xl overflow-hidden group">
              <div className="relative">
                <div
                  className="h-48 bg-cover bg-center"
                  style={{ backgroundImage: `url(${room.image})` }}
                />
                <Badge className={`absolute top-4 left-4 rounded-full ${status.class}`}>
                  {status.label}
                </Badge>
                <div className="absolute top-4 right-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="icon" variant="secondary" className="rounded-full w-8 h-8">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Edit className="w-4 h-4 mr-2" />
                        Modifier
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Supprimer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              <CardContent className="p-5 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">{room.type}</h3>
                    <p className="text-sm text-muted-foreground">Chambre {room.number}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-serif text-xl font-bold text-primary">${room.price}</p>
                    <p className="text-xs text-muted-foreground">/nuit</p>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground line-clamp-2">
                  {room.description}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="w-4 h-4" />
                    <span>{room.capacity} personne(s)</span>
                  </div>
                  <div className="flex gap-1">
                    {room.amenities.map((amenity) => (
                      <div
                        key={amenity}
                        className="w-6 h-6 rounded-full bg-muted flex items-center justify-center"
                        title={amenity}
                      >
                        {amenityIcons[amenity]}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button variant="outline" className="flex-1 rounded-full" size="sm">
                    <Edit className="w-4 h-4 mr-2" />
                    Modifier
                  </Button>
                  {room.status === "available" && (
                    <Button className="flex-1 rounded-full bg-primary" size="sm">
                      Marquer Occupée
                    </Button>
                  )}
                  {room.status === "occupied" && (
                    <Button className="flex-1 rounded-full bg-accent text-accent-foreground" size="sm">
                      Libérer
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredRooms.length === 0 && (
        <Card className="rounded-2xl">
          <CardContent className="py-12 text-center">
            <BedDouble className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-semibold text-lg mb-2">Aucune chambre trouvée</h3>
            <p className="text-muted-foreground">
              Aucune chambre ne correspond à vos critères de recherche.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
