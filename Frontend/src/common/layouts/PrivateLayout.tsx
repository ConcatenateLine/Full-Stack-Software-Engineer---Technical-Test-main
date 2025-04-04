import { useLogoutMutation } from "@/features/auth/services/AuthService";
import { Outlet, useLocation, useNavigate } from "react-router";
import PrivateRoute from "../components/PrivateRoute";

const PrivateLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [logout] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logout("Logout").unwrap();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <PrivateRoute>
      <div className="flex min-h-screen">
        <aside className="w-64 bg-sidebar">navegation</aside>
        <main className="flex-1 p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">{location.pathname}</h1>
            <button
              onClick={handleLogout}
              className="text-red-500 hover:text-red-700"
            >
              Logout
            </button>
          </div>
          <Outlet />
        </main>
      </div>
    </PrivateRoute>
  );
};

export default PrivateLayout;
