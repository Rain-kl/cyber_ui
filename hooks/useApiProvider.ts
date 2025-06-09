import { useCallback, useState } from "react";
import { API_URLS } from "@/utils/api";

type ApiProvider = "openai" | "backend";

export function useApiProvider() {
    const [provider, setProvider] = useState<ApiProvider>("openai");

    const getApiUrl = useCallback(() => {
        switch (provider) {
            case "openai":
                return API_URLS.CHAT;
            case "backend":
                return API_URLS.STREAM_ANSWER;
            default:
                return API_URLS.CHAT;
        }
    }, [provider]);

    const switchToOpenAI = useCallback(() => {
        setProvider("openai");
    }, []);

    const switchToBackend = useCallback(() => {
        setProvider("backend");
    }, []);

    return {
        provider,
        getApiUrl,
        switchToOpenAI,
        switchToBackend,
        isUsingOpenAI: provider === "openai",
        isUsingBackend: provider === "backend",
    };
}
