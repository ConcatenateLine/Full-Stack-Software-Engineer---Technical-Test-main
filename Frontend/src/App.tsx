import "./App.css";
import { Routes, Route } from "react-router";
import PublicLayout from "./common/layouts/PublicLayout";
import HomeContainer from "./features/home/HomeContainer";
import AuthContainer from "./features/auth/AuthContainer";
import PrivateLayout from "./common/layouts/PrivateLayout";
import UserContainer from "./features/user/UserContainer";

function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route index element={<HomeContainer />} />
        <Route path="/login" element={<AuthContainer />} />
      </Route>
      <Route path="/dashboard" element={<PrivateLayout />}>
        <Route index element={<UserContainer />} />
      </Route>
    </Routes>
  );
}

export default App;
