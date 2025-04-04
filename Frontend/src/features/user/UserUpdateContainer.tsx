import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
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

const formSchema = z.object({
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters long")
    .max(50, "First name must be at most 50 characters long")
    .optional(),
  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters long")
    .max(50, "Last name must be at most 50 characters long")
    .optional(),
  email: z.string().email("Invalid email address").optional(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .optional(),
  role: z.enum(["Admin", "User"]).optional(),
  phoneNumber: z
    .string()
    .min(10, "Phone number must be at least 10 digits long")
    .optional(),
  status: z.enum(["Active", "Inactive"]).optional(),
  address: z.object({
    street: z
      .string()
      .min(2, "Street must be at least 2 characters long")
      .max(50, "Street must be at most 50 characters long")
      .optional(),
    city: z
      .string()
      .min(2, "City must be at least 2 characters long")
      .max(50, "City must be at most 50 characters long")
      .optional(),
    number: z
      .string()
      .min(1, "Number must be at least 1 character long")
      .max(50, "Number must be at most 50 characters long")
      .optional(),
    postalCode: z
      .string()
      .min(5, "Zip code must be at least 5 digits long")
      .max(5, "Zip code must be at most 5 digits long")
      .optional(),
  }),
});

const UserUpdateContainer = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const user = useSelector((state: RootState) =>
    state.user.data.find((user) => user.id === Number(id))
  );

  const [updateUser] = useUpdateUserMutation();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: user?.firstName ?? "",
      lastName: user?.lastName ?? "",
      email: user?.email ?? "",
      password: user?.password ?? undefined,
      role: "User", // Develop role to User
      phoneNumber: user?.phoneNumber ?? "",
      status: user?.status === "Active" ? "Active" : "Inactive",
      address: {
        street: user?.address?.street ?? "",
        city: user?.address?.city ?? "",
        number: user?.address?.number ?? "",
        postalCode: user?.address?.postalCode
          ? String(user.address.postalCode)
          : "",
      },
    },
    mode: "onSubmit",
  });

  const onCancel = () => {
    navigate("/dashboard");
  };

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      await updateUser({
        id: Number(id),
        firstName: data.firstName || undefined,
        lastName: data.lastName || undefined,
        email: data.email || undefined,
        password: data.password || undefined,
        role: data.role || "User",
        phoneNumber: data.phoneNumber || undefined,
        status: data.status || undefined,
        address: {
          street: data.address?.street || "",
          city: data.address?.city || "",
          number: data.address?.number || "",
          postalCode: data.address?.postalCode
            ? Number(data.address.postalCode)
            : 0,
        },
      }).unwrap();

      toast.success("User updated successfully");
      navigate("/dashboard");
    } catch (err: any) {
      console.log(err);

      if (err && err.data && err.data.errors) {
        // Handle validation errors
        err.data.errors.forEach((error: any) => {
          // Handle nested properties
          const path = error.property.split(".").join(".");

          if (error.children && error.children.length > 0) {
            // Handle nested errors
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
            // Handle direct constraints
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

  return (
    <div className="p-9">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
              <Label htmlFor="role">Role</Label>
              <Select {...form.register("role")} defaultValue={user?.role}>
                <SelectTrigger id="role" className="w-full">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="status">Status</Label>
              <Select {...form.register("status")} defaultValue={user?.status}>
                <SelectTrigger id="status" className="w-full">
                  <SelectValue placeholder="Select a status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
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
                  </FormItem>
                )}
              />
            </div>
          </div>
          <Separator />
          <Label htmlFor="address">Address</Label>
          <div className="grid grid-cols-2 gap-4">
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
          <div className="flex gap-2">
            <Button
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

export default UserUpdateContainer;
