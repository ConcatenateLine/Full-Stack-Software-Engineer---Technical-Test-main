import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Provider } from "react-redux";
import { store } from "./features/store";
import { BrowserRouter as Router } from "react-router";
import { ThemeProvider } from "./common/components/ThemeProvider.tsx";
import { appStarted } from "./features/store/actions/AppStarted.ts";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <Provider store={store}>
        <Router>
          <App />
        </Router>
      </Provider>
    </ThemeProvider>
  </StrictMode>
);

store.dispatch(appStarted());

export default App;
