// src/features/auth/hooks/use-google-login.ts
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation'; // Важно: next/navigation для App Router
import Cookies from 'js-cookie';
import {GoogleLoginDto} from "@/types/auth";
import {useAuth} from "@/contexts/AuthContext";

export const useGoogleLoginMutation = () => {
    const router = useRouter();
    const { continueWithGoogle } = useAuth();

    return useMutation({
        mutationFn: (data: GoogleLoginDto) => continueWithGoogle(data),
        onSuccess: (token: string) => {
            // 1. Сохраняем токен в куки.
            // Важно: secure: true для HTTPS, sameSite для безопасности.
            Cookies.set('accessToken', token, {
                expires: 7, // 7 дней (синхронизируйте с временем жизни токена на сервере)
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict'
            });

            // 2. Инвалидируем кэш пользователя (если есть query на получение профиля)
            // queryClient.invalidateQueries({ queryKey: ['me'] });

            // 3. Редирект в Dashboard
            router.push('/profile');
            router.refresh(); // Обновляем Server Components, чтобы они увидели новую куку
        },
        onError: (error) => {
            console.error('Auth Error:', error);
            // Здесь можно вызвать toast notification
        }
    });
};