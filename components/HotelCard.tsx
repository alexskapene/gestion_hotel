import { Hotel } from "@/types/types";
import { useApp } from "@/context/AppContext";
import {
  Car,
  Coffee,
  MapPin,
  MapPinIcon,
  Phone,
  Star,
  Tv2Icon,
  Wifi,
} from "lucide-react";

const amenityIcons: Record<string, React.ReactNode> = {
  wifi: <Wifi className="w-3 h-3 " />,
  parking: <Car className="w-3 h-3 " />,
  restaurant: <Coffee className="w-3 h-3 " />,
  tv: <Tv2Icon className="w-3 h-3 " />,
  ac: <Phone className="w-3 h-3 " />,
};

export const HotelCard = ({ hotel }: { hotel: Hotel }) => {
  const { openHotel } = useApp();

  return (
    <article
      onClick={() => openHotel(hotel)}
      className="card-luxe group cursor-pointer flex flex-col shadow-md/5"
    >
      <div className="relative aspect-[4/3] overflow-hidden ">
        <img
          src={hotel.image[0]}
          alt={hotel.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />

        <div className="absolute top-4 right-4 flex items-center gap-1 px-3 py-1 rounded-full bg-foreground/80 text-primary-foreground text-xs font-semibold">
          <Star className="w-3 h-3 fill-current" />
          {hotel.rating}
        </div>
      </div>
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="font-display text-xl text-foreground mb-2">
          {hotel.name}
        </h3>

        <div className="flex flex-col justify-between gap-4 pt-3 border-t border-border">
          <div>
            <div className="w-full flex justify-between">
              <p className="text-xs text-muted-foreground">À partir de</p>
              <p className="flex items-center gap-1 text-muted-foreground text-sm">
                <MapPin className="w-3 h-3" />
                {hotel.city}
              </p>
            </div>
            <p className="font-display text-xl font-bold text-foreground mb-2">
              {hotel.price}$
              <span className="text-sm text-muted-foreground font-sans">
                {" "}
                / nuit
              </span>
            </p>
            <div className="flex gap-2">
              {hotel.amenities.map((amenity) => (
                <div
                  key={amenity}
                  className="w-7 h-7 rounded-full bg-muted flex items-center justify-center"
                >
                  {amenityIcons[amenity]}
                </div>
              ))}
            </div>
          </div>

          <div className="text-end">
            <span className="text-sm text-primary hover:font-medium group-hover:translate-x-1 transition-transform">
              Découvrir →
            </span>
          </div>
        </div>
      </div>
    </article>
  );
};
