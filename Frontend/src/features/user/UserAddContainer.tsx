import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "react-router";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useAddUserMutation } from "./services/UserService";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
import GoogleMap from "@/common/components/maps/GoogleMap";
import UserSchema from "./schemes/UserScheme";
import AddressSchema from "./schemes/AddressScheme";
import { Switch } from "@/components/ui/switch";
import AutocompleteAddress from "@/common/components/maps/AutocompleteAddress";

const UserAddContainer = () => {
  const MAX_SIZE = 1 * 1024 * 1024; // 1MB
  const navigate = useNavigate();
  const [addUser] = useAddUserMutation();
  const [activeAutocomplete, setActiveAutocomplete] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);

  const form = useForm<z.infer<typeof UserSchema>>({
    resolver: zodResolver(UserSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      role: "User",
      phoneNumber: "",
      status: "Active",
      address: {
        street: "",
        city: "",
        number: "",
        postalCode: "",
      },
    },
    mode: "onSubmit",
  });

  const onCancel = () => {
    navigate("/dashboard/users");
  };

  async function onSubmit(data: z.infer<typeof UserSchema>) {
    try {
      await addUser({
        ...data,
        address: {
          ...data.address,
          postalCode: String(data.address.postalCode),
        },
      }).unwrap();

      toast.success("User added successfully");
      navigate("/dashboard/users");
    } catch (err: any) {
      if (err && err.data && err.data.errors) {
        err.data.errors.forEach((error: any) => {
          const path = error.property.split(".").join(".");

          if (error.children && error.children.length > 0) {
            error.children.forEach((child: any) => {
              const childPath = path
                ? `${path}.${child.property}`
                : child.property;
              Object.values(child.constraints).forEach(
                (constraint: unknown) => {
                  form.setError(childPath, {
                    message: constraint as string,
                  });
                }
              );
            });
          } else {
            Object.values(error.constraints).forEach((constraint: unknown) => {
              form.setError(path, {
                message: constraint as string,
              });
            });
          }
        });
      } else if (err && err.data && err.data.error) {
        toast.error(err.data.error);
      } else {
        toast.error("Failed to add user");
      }
    }
  }

  const fillAddress = (address: z.infer<typeof AddressSchema>) => {
    if (!address) return;

    const schemaValidation = AddressSchema.safeParse(address);

    form.clearErrors("address");

    Object.values(schemaValidation.error?.errors || []).forEach((error) => {
      const path = `address.${error.path.join(".")}` as unknown;
      form.clearErrors(
        path as
          | "address.street"
          | "address.city"
          | "address.number"
          | "address.postalCode"
      );

      form.setError(
        path as
          | "address.street"
          | "address.city"
          | "address.number"
          | "address.postalCode",
        {
          message: `The search did not locate the ${error.path.join(
            "."
          )} in the address`,
        }
      );
    });

    form.setValue("address", {
      street: address.street || "",
      city: address.city || "",
      number: address.number || "",
      postalCode: address.postalCode || "",
      lat: address.lat || "",
      lng: address.lng || "",
    });
  };

  return (
    <div className="p-9">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-2 gap-4">
            <Avatar className="w-36 h-36 mx-auto bg-secondary">
              <AvatarImage src={avatarUrl} alt="@Avatar" />
              <AvatarFallback>@Avatar</AvatarFallback>
            </Avatar>
            <FormField
              control={form.control}
              name="avatar"
              render={(_) => (
                <FormItem>
                  <FormLabel htmlFor="avatar">Avatar</FormLabel>
                  <FormControl>
                    <Input
                      id="avatar"
                      className="cursor-pointer"
                      type="file"
                      accept="image/png, image/jpeg, image/jpg"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          if (
                            !["image/png", "image/jpeg", "image/jpg"].includes(
                              file.type
                            )
                          ) {
                            setAvatarUrl(undefined);
                            form.resetField("avatar");
                            form.setError("avatar", {
                              message:
                                "Invalid file type. Please upload an image.",
                            });
                          } else if (file.size > MAX_SIZE) {
                            setAvatarUrl(undefined);
                            form.resetField("avatar");
                            form.setError("avatar", {
                              message: "File size exceeds 1MB.",
                            });
                          } else {
                            form.clearErrors("avatar");
                            form.setValue("avatar", file);
                            setAvatarUrl(URL.createObjectURL(file));
                          }
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                  <FormDescription>
                    Upload an image file (e.g., JPEG, PNG) within the allowed
                    size limit.
                  </FormDescription>
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-3">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-col gap-3">
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-3">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-col gap-3">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-3">
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="User">User</SelectItem>
                        <SelectItem value="Admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-col gap-3">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-3">
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                    <FormDescription>(e.g., +52-0123456789)</FormDescription>
                  </FormItem>
                )}
              />
            </div>
          </div>
          <Separator />
          <div className="grid md:grid-cols-2 gap-4">
            <div className="grid gap-4">
              <div className="flex items-center justify-between mb-9">
                <Label htmlFor="address" className="w-3/4">
                  Address
                </Label>
                <div className="md:w-1/4">
                  <Switch
                    checked={activeAutocomplete}
                    onCheckedChange={setActiveAutocomplete}
                  />
                  <label htmlFor="address" className="ml-2">
                    Autocomplete
                  </label>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                {activeAutocomplete ? (
                  <AutocompleteAddress
                    onAddressSelect={fillAddress}
                    address={form.watch("address")}
                  />
                ) : (
                  <div className="flex flex-col gap-3">
                    <FormField
                      control={form.control}
                      name="address.street"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Street</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-4">
                <FormField
                  control={form.control}
                  name="address.city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex flex-col gap-4">
                <FormField
                  control={form.control}
                  name="address.number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex flex-col gap-4">
                <FormField
                  control={form.control}
                  name="address.postalCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Zip Code</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="rounded-md overflow-hidden min-h-60 relative">
              <GoogleMap
                fillAddress={fillAddress}
                address={form.watch("address")}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              className="w-1/3 cursor-pointer"
              onClick={onCancel}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="w-1/3 cursor-pointer"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default UserAddContainer;
