
'use client';

import { useRouter, useParams } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardRedirectPage() {
    const router = useRouter();
    const params = useParams();
    const lang = params.lang;

    useEffect(() => {
        // Redirect any traffic from the old dashboard to the user's profile.
        router.replace(`/${lang}/profile`);
    }, [router, lang]);

    return (
        <div className="flex h-screen items-center justify-center">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
        </div>
    );
}
