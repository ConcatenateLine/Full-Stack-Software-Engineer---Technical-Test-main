import "./App.css";
import { Routes, Route } from "react-router";
import PublicLayout from "./common/layouts/PublicLayout";
import HomeContainer from "./features/home/HomeContainer";
import AuthContainer from "./features/auth/AuthContainer";
import PrivateLayout from "./common/layouts/PrivateLayout";
import UserContainer from "./features/user/UserContainer";
import UserAddContainer from "./features/user/UserAddContainer";
import UserUpdateContainer from "./features/user/UserUpdateContainer";
import DashboardContainer from "./features/dashboard/DashboardContainer";

function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route index element={<HomeContainer />} />
        <Route path="/login" element={<AuthContainer />} />
      </Route>
      <Route path="/dashboard" element={<PrivateLayout />}>
        <Route index element={<DashboardContainer />} />
        <Route path="users" element={<UserContainer />} />
        <Route path="user/add" element={<UserAddContainer />} />
        <Route path="user/:id/edit" element={<UserUpdateContainer />} />
      </Route>
    </Routes>
  );
}

export default App;
