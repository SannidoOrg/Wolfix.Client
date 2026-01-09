// src/features/auth/components/google-login-button.tsx
'use client'; // ОБЯЗАТЕЛЬНО для Next.js App Router при использовании ивентов

import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import {useGoogleLoginMutation} from "@/hooks/auth/use-google-login";
import {FC} from "react";

interface GoogleLoginButtonProps {
    className?: string;
}

export const GoogleLoginButton: FC<GoogleLoginButtonProps> = ({className}) => {
    const { mutate, isPending, error } = useGoogleLoginMutation();

    const handleSuccess = (response: CredentialResponse) => {
        if (response.credential) {
            console.log('Google ID Token received, sending to server...');
            // Отправляем токен на ваш C# Endpoint
            mutate({ idToken: response.credential });
        }
    };

    const handleError = () => {
        console.error('Google Sign-In failed locally');
    };

    return (
        <div className={className}>
            {/* GoogleLogin рендерит iframe.
        В Next.js важно убедиться, что родительский контейнер имеет ширину.
      */}
            <div className="w-full max-w-sm">
                <GoogleLogin
                    onSuccess={handleSuccess}
                    onError={handleError}
                    theme="outline"
                    size="large"
                    text="continue_with"
                    width="100%" // Растягиваем на ширину контейнера
                    useOneTap // Включает смарт-попап справа сверху
                />
            </div>

            {isPending && (
                <span className="text-xs text-blue-600 animate-pulse font-medium">
          Проверка данных на сервере...
        </span>
            )}

            {error && (
                <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md w-full max-w-sm">
                    Ошибка входа: {error.message}
                </div>
            )}
        </div>
    );
};