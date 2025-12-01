'use client';
import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

export default function ProfileRedirect({ children }) {
    const { user } = useAuth();
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        // Allow access to these routes without profile completion
        const allowedRoutes = ['/profile-complete', '/login', '/signup', '/'];

        // Only redirect if:
        // 1. User is logged in
        // 2. Profile is not completed
        // 3. We're not already on an allowed route
        if (user && user.profileCompleted === false && !allowedRoutes.includes(pathname)) {
            console.log('[ProfileRedirect] Redirecting to profile-complete from:', pathname);
            router.push('/profile-complete');
        }
    }, [user, pathname, router]);

    return <>{children}</>;
}
