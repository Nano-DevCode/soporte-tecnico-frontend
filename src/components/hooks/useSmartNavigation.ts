import { useLocation, useNavigate } from "react-router";
import { useCallback } from "react";

export const useSmartNavigation = (defaultFallbackUrl: string) => {
    const location = useLocation();
    const navigate = useNavigate();

    const navigateSmartBack = useCallback((fallbackOverride?: string) => {
        if (location.key !== "default") {
            navigate(-1);
        } else {
            navigate(fallbackOverride || defaultFallbackUrl, { replace: true });
        }
    }, [location.key, navigate, defaultFallbackUrl]);

    const navigateFallback = useCallback((fallbackOverride?: string) => {
        navigate(fallbackOverride || defaultFallbackUrl, { replace: true });
    }, [navigate, defaultFallbackUrl]);

    return { navigateSmartBack, navigateFallback };
};