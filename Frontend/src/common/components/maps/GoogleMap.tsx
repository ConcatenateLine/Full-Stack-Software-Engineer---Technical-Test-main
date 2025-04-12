import AddressSchema from "@/features/user/schemes/AddressScheme";
import Debounce from "@/lib/Debounce";
import { AdvancedMarker, APIProvider, Map } from "@vis.gl/react-google-maps";
import { Loader } from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

interface GoogleMapProps {
  fillAddress: (address: z.infer<typeof AddressSchema>) => void;
  customCenter?: { lat: number; lng: number };
}

const GoogleMap = ({ fillAddress, customCenter }: GoogleMapProps) => {
  const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const GEOAPIFY_API_KEY = import.meta.env.VITE_GEOAPIFY_API_KEY;
  const position =
    customCenter && customCenter.lat && customCenter.lng
      ? customCenter
      : {
          lat: 17.061164631400896,
          lng: -96.72569859941957,
        };
  const [center, setCenter] = useState<
    { lat: number; lng: number } | undefined
  >(undefined);
  const [zoom, setZoom] = useState<number | undefined>(undefined);
  const [markers, setMarkers] = useState<{ lat: number; lng: number }[]>(
    customCenter ? [customCenter] : []
  );

  const [isLoading, setLoading] = useState(false);

  const onclick = (e: any) => {
    const newMarker = {
      lat: e.detail.latLng.lat,
      lng: e.detail.latLng.lng,
    };

    try {
      setMarkers((_) => [newMarker]);

      setLoading(true);
      handleAddress(newMarker.lat, newMarker.lng);
    } catch (error) {
      console.error("Error loading address");
      toast.error("The address could not be loaded");
    }
  };

  const handleAddress = useCallback(
    Debounce((lat: number, lng: number) => {
      reverseGeocode(lat, lng);
    }, 1000),
    []
  );

  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const controller = new AbortController();
      const signal = controller.signal;

      const response = await fetch(
        `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lng}&apiKey=${GEOAPIFY_API_KEY}`,
        { signal }
      );
      const data = await response.json();

      const { county, state, street, housenumber, postcode } =
        data.features[0].properties;

      const address = {
        city: `${county}, ${state}`,
        street: street,
        number: housenumber,
        postalCode: postcode,
        lat: String(lat),
        lng: String(lng),
      };

      fillAddress(address);
    } catch (error) {
      console.error("Error fetching address");
      toast.error("The address could not be identified");
    } finally {
      setLoading(false);
    }
  };

  const onclickMarker = (e: { lat: number; lng: number }) => {
    try {
      setCenter(e);
      setZoom(17);
    } catch (error) {}
  };

  return (
    <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center z-10 bg-black/25">
          <Loader className="h-14 w-14 animate-spin text-white" />
        </div>
      )}
      <Map
        zoomControl
        defaultCenter={position}
        defaultZoom={12}
        mapId="MAP_ADDRESS_SELECTOR"
        onClick={onclick}
        center={center}
        zoom={zoom}
        onZoomChanged={(_) => {
          setZoom(undefined);
        }}
        onCenterChanged={(_) => {
          setCenter(undefined);
        }}
      >
        {markers.map((marker, index) => (
          <AdvancedMarker
            key={`marker-${index}`}
            position={marker}
            onClick={() => onclickMarker(marker)}
          />
        ))}
      </Map>
    </APIProvider>
  );
};

export default GoogleMap;
