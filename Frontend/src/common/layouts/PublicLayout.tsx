import { Outlet } from "react-router";
import NavegationMenu from "../components/NavegationMenu";
import { ModeToggle } from "../components/ModeToggle";
import { MenuItems, MenuListItem } from "../constants/MenuItems";
import PublicRoute from "../components/PublicRoute";
import { Toaster } from "sonner";

const PublicLayout = () => {
  return (
    <PublicRoute>
      <main>
        <ModeToggle />
        <NavegationMenu MenuItems={MenuItems} MenuListItem={MenuListItem} />
        <Outlet />
        <Toaster />
      </main>
    </PublicRoute>
  );
};

export default PublicLayout;
