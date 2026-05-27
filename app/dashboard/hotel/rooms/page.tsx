"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import AddRoomModal from "@/components/dashboard/AddRoomModal"
import { 
  Plus, 
  Search, 
  BedDouble, 
  Users, 
  DollarSign,
  Edit,
  Trash2,
  MoreVertical,
  Loader2
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"

interface Room {
  id: string
  roomNumber: string
  title: string
  description: string
  price: number
  capacity: number
  bedCount?: number
  bathroomCount?: number
  size?: number
  status: string
  isActive: boolean
  category: {
    name: string
  }
  images: any[]
  amenities: any[]
  reservations: any[]
}

export default function HotelRoomsPage() {
  const { data: session, status } = useSession()
  const [rooms, setRooms] = useState<Room[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [hotelId, setHotelId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/auth/login")
    }

    if (session?.user?.id) {
      fetchRooms()
    }
  }, [session, status, refreshKey])

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        const res = await fetch("/api/hotels/me")
        if (!res.ok) return
        const data = await res.json()
        if (data?.id) setHotelId(data.id)
        else if (data?.hotel?.id) setHotelId(data.hotel.id)
      } catch (e) {
        // ignore
      }
    }

    if (session?.user?.id) fetchHotel()
  }, [session])

  const fetchRooms = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/hotels/rooms", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Erreur lors du chargement des chambres")
      }

      const data = await response.json()
      setRooms(data.rooms || [])
      setCategories(data.categories || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteRoom = async (roomId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette chambre ?")) return

    try {
      const response = await fetch(`/api/rooms/${roomId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Erreur lors de la suppression")
      }

      toast.success("Chambre supprimée avec succès")
      setRefreshKey((prev) => prev + 1)
    } catch (error) {
      toast.error("Erreur lors de la suppression de la chambre")
      console.error(error)
    }
  }

  const filteredRooms = rooms.filter((room) =>
    room.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    room.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; className: string }> = {
      AVAILABLE: { label: "Disponible", className: "bg-green-100 text-green-800" },
      OCCUPIED: { label: "Occupée", className: "bg-blue-100 text-blue-800" },
      MAINTENANCE: { label: "Maintenance", className: "bg-yellow-100 text-yellow-800" },
    }
    const config = statusMap[status] || { label: status, className: "bg-gray-100 text-gray-800" }
    return <Badge className={config.className}>{config.label}</Badge>
  }

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="h-10 bg-muted rounded animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-64 bg-muted rounded animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-8">
        <div className="text-center py-12">
          <p className="text-destructive font-semibold mb-4">{error}</p>
          <Button onClick={() => setRefreshKey((prev) => prev + 1)}>Réessayer</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-serif font-bold text-foreground">
            Mes Chambres
          </h2>
          <p className="text-muted-foreground mt-1">
            Gérez vos chambres et leurs tarifs
          </p>
        </div>
        <AddRoomModal
          categories={categories}
          hotelId={hotelId || ""}
          onRoomAdded={() => setRefreshKey((prev) => prev + 1)}
        />
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher par numéro ou titre..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Rooms Grid */}
      {filteredRooms.length === 0 ? (
        <Card className="rounded-2xl">
          <CardContent className="p-12 text-center">
            <BedDouble className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">Aucune chambre trouvée</p>
            <AddRoomModal
              categories={categories}
              hotelId={hotelId || ""}
              onRoomAdded={() => setRefreshKey((prev) => prev + 1)}
            />
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRooms.map((room) => (
            <Card key={room.id} className="rounded-2xl overflow-hidden hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                {/* Room Image Placeholder */}
                <div className="bg-gradient-to-br from-slate-100 to-slate-200 h-40 flex items-center justify-center relative">
                  {room.images.length > 0 ? (
                    <img
                      src={room.images[0]?.imageUrl}
                      alt={room.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <BedDouble className="w-12 h-12 text-muted-foreground" />
                  )}
                  <div className="absolute top-2 right-2">
                    {getStatusBadge(room.status)}
                  </div>
                </div>

                {/* Room Info */}
                <div className="p-4 space-y-3">
                  {/* Header */}
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-muted-foreground">Chambre {room.roomNumber}</p>
                      <h3 className="text-lg font-semibold">{room.title}</h3>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/hotel/rooms/${room.id}`}>
                            <Edit className="w-4 h-4 mr-2" />
                            Éditer
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => handleDeleteRoom(room.id)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Category */}
                  <p className="text-sm text-muted-foreground">
                    {room.category?.name}
                  </p>

                  {/* Description */}
                  {room.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {room.description}
                    </p>
                  )}

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-2 pt-2 border-t">
                    <div className="text-center">
                      <Users className="w-4 h-4 mx-auto text-muted-foreground mb-1" />
                      <p className="text-xs font-medium">{room.capacity}</p>
                      <p className="text-xs text-muted-foreground">personnes</p>
                    </div>
                    <div className="text-center">
                      <BedDouble className="w-4 h-4 mx-auto text-muted-foreground mb-1" />
                      <p className="text-xs font-medium">{room.bedCount || "-"}</p>
                      <p className="text-xs text-muted-foreground">lits</p>
                    </div>
                    <div className="text-center">
                      <DollarSign className="w-4 h-4 mx-auto text-muted-foreground mb-1" />
                      <p className="text-xs font-medium">${room.price}</p>
                      <p className="text-xs text-muted-foreground">/nuit</p>
                    </div>
                  </div>

                  {/* Reservations */}
                  {room.reservations.length > 0 && (
                    <div className="pt-2 border-t">
                      <p className="text-xs text-muted-foreground">
                        {room.reservations.length} réservation(s)
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

