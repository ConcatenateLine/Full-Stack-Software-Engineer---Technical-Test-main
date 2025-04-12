import { ColumnDef, Row } from "@tanstack/react-table";
import { z } from "zod";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  BotIcon,
  CheckCircle2Icon,
  Edit2Icon,
  LoaderIcon,
  MoreVerticalIcon,
  ShieldIcon,
  Trash2Icon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import CustomAlertDialog from "@/common/components/CustomAlertDialog";

export const schema = z.object({
  id: z.number(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  status: z.string(),
  role: z.string(),
  phoneNumber: z.string(),
  address: z.object({
    street: z.string(),
    number: z.string(),
    city: z.string(),
    postalCode: z.string(),
  }),
});

const UserColumns = (operations: {
  edit: (row: Row<z.infer<typeof schema>>) => void;
  delete: (row: Row<z.infer<typeof schema>>) => void;
}): ColumnDef<z.infer<typeof schema>>[] => {
  return [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => {
        return <p className="text-muted-foreground">{row.original.id}</p>;
      },
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => {
        return (
          <p className="text-left">
            {row.original.firstName + " " + row.original.lastName}
          </p>
        );
      },
      enableHiding: false,
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => (
        <div className="text-left underline underline-offset-4">
          {row.original.email}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge
          variant="outline"
          className="flex gap-1 px-1.5 text-muted-foreground [&_svg]:size-3"
        >
          {row.original.status === "Active" ? (
            <CheckCircle2Icon className="text-green-500 dark:text-green-400" />
          ) : (
            <LoaderIcon />
          )}
          {row.original.status}
        </Badge>
      ),
    },
    {
      accessorKey: "phoneNumber",
      header: () => <div className="w-full text-right">Phone Number</div>,
      cell: ({ row }) => (
        <div className="text-right">{row.original.phoneNumber}</div>
      ),
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => (
        <Badge
          variant="outline"
          className="flex gap-1 px-1.5 text-muted-foreground [&_svg]:size-3"
        >
          {row.original.role === "Admin" ? (
            <ShieldIcon className="text-green-500 dark:text-green-400" />
          ) : (
            <BotIcon />
          )}
          {row.original.role}
        </Badge>
      ),
    },
    {
      accessorKey: "address",
      header: () => <div className="w-full text-right">Address</div>,
      cell: ({ row }) =>
        row.original.address ? (
          <div className="text-right">
            {row.original.address.street}, {row.original.address.number},{" "}
            {row.original.address.postalCode} {row.original.address.city},
          </div>
        ) : (
          <div className="text-right">No Address</div>
        ),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex size-8 text-muted-foreground data-[state=open]:bg-muted cursor-pointer"
              size="icon"
            >
              <MoreVerticalIcon />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-32">
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => operations.edit(row)}
            >
              <Edit2Icon /> Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />

            <CustomAlertDialog
              title="Are you sure you want to delete this user?"
              description={`${row.original.firstName} ${row.original.lastName}`}
              action={() => operations.delete(row)}
              cancel={() => {}}
              button={
                <Button
                  variant="ghost"
                  className="cursor-pointer w-full justify-start p-0"
                >
                  <Trash2Icon /> Delete
                </Button>
              }
            />
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];
};

export default UserColumns;
