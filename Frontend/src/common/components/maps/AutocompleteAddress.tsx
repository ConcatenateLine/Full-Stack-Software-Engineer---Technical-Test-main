import { useState, useRef, useCallback, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { Loader2, Search } from "lucide-react";
import AddressSchema from "@/features/user/schemes/AddressScheme";
import Debounce from "@/lib/Debounce";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";

interface AutocompleteAddressProps {
  onAddressSelect: (address: z.infer<typeof AddressSchema>) => void;
  address?: z.infer<typeof AddressSchema>;
}

const AutocompleteAddress: React.FC<AutocompleteAddressProps> = ({
  onAddressSelect,
  address,
}) => {
  const GEOAPIFY_API_KEY = import.meta.env.VITE_GEOAPIFY_API_KEY;
  const [loading, setLoading] = useState(false);
  const [predictions, setPredictions] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  const handleInputChange = async (inputValue: string) => {
    if (!inputValue || inputValue === "") {
      setPredictions([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(
          inputValue
        )}$&limit=10&type=street&filter=countrycode:auto&bias=countrycode:auto&format=json&apiKey=${GEOAPIFY_API_KEY}`
      );

      console.log("response");
      console.log(response);

      const data = await response.json();
      setPredictions(data.results || []);
    } catch (error) {
      console.error("Error fetching predictions:", error);
    } finally {
      setLoading(false);
      setOpen(true);
    }
  };

  const handleSelect = async (prediction: any) => {
    setOpen(false);
    try {
      const { county, state, street, housenumber, postcode, lat, lon } =
        prediction;

      const address = {
        city: `${county}, ${state}`,
        street: street,
        number: housenumber,
        postalCode: postcode,
        lat: String(lat),
        lng: String(lon),
      };
      onAddressSelect(address);
      setPredictions([]);
      setOpen(false);
    } catch (error) {
      console.error("Error fetching place details");
      toast.error("The address could not be loaded");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = useCallback(
    Debounce((e: React.ChangeEvent<HTMLInputElement>) => {
      setLoading(true);
      handleInputChange(e.target.value);
    }, 1000),
    []
  );

  useEffect(() => {
    if (address && address.street) {
      setValue(address.street);
    }
  }, [address]);

  return (
    <div className="relative">
      <Label htmlFor="street" className="mb-2">
        Street
      </Label>
      <Input
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          handleSearch(e);
        }}
        placeholder="Search address..."
        className="w-full"
      />
      {loading ? (
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 top-6">
          <Loader2 className="h-4 w-4 animate-spin" />
        </div>
      ) : (
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 top-6">
          <Search className="h-4 w-4" />
        </div>
      )}

      <Collapsible
        open={open}
        onOpenChange={setOpen}
        className="w-full space-y-2 absolute bg-background border-muted rounded-b-2xl overflow-hidden"
      >
        <CollapsibleContent className="border-x-2 border-b-2">
          <ScrollArea className="h-52 w-full">
            {predictions.map((prediction) => (
              <>
                <div
                  key={prediction.place_id}
                  className="p-2 hover:bg-secondary cursor-pointer"
                  onClick={() => handleSelect(prediction)}
                >
                  <div className="font-medium">{prediction.formatted}</div>
                </div>
                <Separator />
              </>
            ))}
            {predictions.length === 0 && (
              <div className="p-2 text-muted-foreground">No results</div>
            )}
            <ScrollBar orientation="vertical" />
          </ScrollArea>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default AutocompleteAddress;
