import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "App";

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// Material Dashboard 2 React Context Provider
import { MaterialUIControllerProvider } from "context";
import { ContextProvider } from "api/LocalStorage";
import { WebSocketProvider } from "api/webSocketContext";

const container = document.getElementById("app");
const root = createRoot(container);

const queryClient = new QueryClient();

root.render(
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <MaterialUIControllerProvider>
        <ContextProvider>
          <WebSocketProvider>
            <App />
          </WebSocketProvider>
        </ContextProvider>
      </MaterialUIControllerProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

