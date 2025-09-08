"use client";

import { GlobalContextProvider } from "../contexts/GlobalContext";
import { AuthContextProvider } from "../contexts/AuthContext";
import { ProductContextProvider } from "../contexts/ProductContext";
import { UserContextProvider } from "../contexts/UserContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <GlobalContextProvider>
      <AuthContextProvider>
        <ProductContextProvider>
          <UserContextProvider>
            {children}
          </UserContextProvider>
        </ProductContextProvider>
      </AuthContextProvider>
    </GlobalContextProvider>
  );
}