import { useLocation, useNavigate } from "react-router";
import { useCallback } from "react";

export const useSmartNavigation = (defaultFallbackUrl: string) => {
    const location = useLocation();
    const navigate = useNavigate();

    const navigateSmartBack = useCallback((fallbackOverride?: string) => {
        if (location.key !== "default") {
            console.log('smartback')
            navigate(-1);
        } else {
            console.log('fallbackbackoverride')
            navigate(fallbackOverride || defaultFallbackUrl, { replace: true });
        }
    }, [location.key, navigate, defaultFallbackUrl]);

    const navigateFallback = useCallback((fallbackOverride?: string) => {
        console.log('fallbackback')
        navigate(fallbackOverride || defaultFallbackUrl, { replace: true });
    }, [navigate, defaultFallbackUrl]);

    return { navigateSmartBack, navigateFallback };
};