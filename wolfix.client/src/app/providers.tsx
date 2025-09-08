"use client";

import { GlobalContextProvider } from "../contexts/GlobalContext";
import { AuthContextProvider } from "../contexts/AuthContext";
import { ProductContextProvider } from "../contexts/ProductContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <GlobalContextProvider>
      <AuthContextProvider>
        <ProductContextProvider>
            {children}
        </ProductContextProvider>
      </AuthContextProvider>
    </GlobalContextProvider>
  );
}