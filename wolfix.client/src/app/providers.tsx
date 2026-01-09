"use client";

import { GlobalContextProvider } from "../contexts/GlobalContext";
import { AuthContextProvider } from "../contexts/AuthContext";
import { ProductContextProvider } from "../contexts/ProductContext";
import { UserContextProvider } from "../contexts/UserContext";
import {useState} from "react";
import {QueryClient} from "@tanstack/query-core";
import {GoogleOAuthProvider} from "@react-oauth/google";
import {QueryClientProvider} from "@tanstack/react-query";

export function Providers({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 60 * 1000,
                refetchOnWindowFocus: false,
            },
        },
    }));

    return (
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
            <QueryClientProvider client={queryClient}>
                <GlobalContextProvider>
                    <AuthContextProvider>
                        <ProductContextProvider>
                            <UserContextProvider>
                                {children}
                            </UserContextProvider>
                        </ProductContextProvider>
                    </AuthContextProvider>
                </GlobalContextProvider>
            </QueryClientProvider>
        </GoogleOAuthProvider>
    );
}