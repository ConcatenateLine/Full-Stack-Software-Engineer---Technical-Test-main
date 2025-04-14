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
import { useUpdateUserMutation } from "./services/UserService";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { useParams } from "react-router";
import CustomAlertDialog from "@/common/components/CustomAlertDialog";
import { LockKeyholeIcon } from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import GoogleMap from "@/common/components/maps/GoogleMap";
import AddressSchema from "./schemes/AddressScheme";
import UserSchema from "./schemes/UserScheme";
import { Switch } from "@/components/ui/switch";
import AutocompleteAddress from "@/common/components/maps/AutocompleteAddress";

const partialSchema = UserSchema.partial();

const UserUpdateContainer = () => {
  const MAX_SIZE = 1 * 1024 * 1024; // 1MB
  const navigate = useNavigate();
  const { id } = useParams();
  const user = useSelector((state: RootState) => state.user.selectedUser);
  const [activeAutocomplete, setActiveAutocomplete] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(
    user?.avatar as string | undefined
  );

  const [updateUser] = useUpdateUserMutation();
  const form = useForm<z.infer<typeof partialSchema>>({
    resolver: zodResolver(partialSchema),
    defaultValues: {
      firstName: user?.firstName ?? "",
      lastName: user?.lastName ?? "",
      email: user?.email ?? "",
      password: user?.password ?? undefined,
      role: user?.role ? (user.role as "Admin" | "User") : "User",
      phoneNumber: user?.phoneNumber ?? "",
      status: user?.status === "Active" ? "Active" : "Inactive",
      address: {
        street: user?.address?.street ?? "",
        city: user?.address?.city ?? "",
        number: user?.address?.number ?? "",
        postalCode: user?.address?.postalCode
          ? String(user.address.postalCode)
          : "",
        lat: user?.address?.lat ?? "",
        lng: user?.address?.lng ?? "",
      },
    },
    mode: "onSubmit",
  });

  const onCancel = () => {
    navigate("/dashboard/users");
  };

  async function onSubmit(data: z.infer<typeof partialSchema>) {
    try {
      await updateUser({
        id: Number(id),
        firstName: data.firstName || undefined,
        lastName: data.lastName || undefined,
        email: data.email || undefined,
        password: data.password || undefined,
        role: data.role || undefined,
        phoneNumber: data.phoneNumber || undefined,
        status: data.status || undefined,
        address: {
          street: data.address?.street || "",
          city: data.address?.city || "",
          number: data.address?.number || "",
          postalCode: data.address?.postalCode
            ? String(data.address.postalCode)
            : "",
          lat: data.address?.lat || "",
          lng: data.address?.lng || "",
        },
        avatar: data.avatar || undefined,
      }).unwrap();

      toast.success("User updated successfully");
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
      {user ? (
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
                              ![
                                "image/png",
                                "image/jpeg",
                                "image/jpg",
                              ].includes(file.type)
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
                      Upload an image file (e.g., JPEG, PNG, JPG) within the
                      allowed size limit.
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
                  disabled
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
                        <Input {...field} value={field.value || ""} />
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
                        defaultValue={user?.role}
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
                        defaultValue={user?.status}
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
            <div className="grid grid-cols-2 gap-4">
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
                <div className="flex flex-col gap-3">
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
                <div className="flex flex-col gap-3">
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
                <div className="flex flex-col gap-3">
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
                <div className="flex flex-col gap-3">
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

              <div className="w-1/3">
                {form.watch("password") !== undefined &&
                form.watch("password") !== "" ? (
                  <CustomAlertDialog
                    title="Are you sure you want to change the password for this user?"
                    description={`${user?.firstName} ${user?.lastName}`}
                    action={async () => {
                      const validate = await form.trigger();

                      if (validate) {
                        form.handleSubmit(onSubmit)();
                      }
                    }}
                    cancel={() => {
                      form.setValue("password", "");
                      form.trigger();
                    }}
                    button={
                      <Button
                        variant="ghost"
                        className="cursor-pointer w-full justify-start p-0"
                      >
                        <LockKeyholeIcon /> Change Password
                      </Button>
                    }
                  />
                ) : (
                  <Button
                    type="submit"
                    className="cursor-pointer w-full"
                    disabled={form.formState.isSubmitting}
                  >
                    {form.formState.isSubmitting ? "Submitting..." : "Submit"}
                  </Button>
                )}
              </div>
            </div>
          </form>
        </Form>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default UserUpdateContainer;
