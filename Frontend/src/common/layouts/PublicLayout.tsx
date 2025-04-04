import { Outlet } from "react-router";
import NavegationMenu from "../components/NavegationMenu";
import { ModeToggle } from "../components/ModeToggle";
import { MenuItems, MenuListItem } from "../constants/MenuItems";
import PublicRoute from "../components/PublicRoute";

const PublicLayout = () => {
  return (
    <PublicRoute>
      <main>
        <ModeToggle />
        <NavegationMenu MenuItems={MenuItems} MenuListItem={MenuListItem} />
        <Outlet />
      </main>
    </PublicRoute>
  );
};

export default PublicLayout;
