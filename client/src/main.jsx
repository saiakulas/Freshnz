import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";  // Import Provider
import {store} from "./redux/store.js"
import "./index.css";
import App from "./App.jsx";
import { ChakraProvider } from '@chakra-ui/react'

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>  {/* Wrap App with Provider */}
    <ChakraProvider>
      <App />
    </ChakraProvider>
    </Provider>
  </StrictMode>
);
