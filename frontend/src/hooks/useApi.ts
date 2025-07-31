import { useCallback, useEffect, useState, useRef } from "react";

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

interface ApiOptions extends Omit<RequestInit, 'body' | 'method'> {
    method?: Method;
    body?: any;
    auto?: boolean;
}

interface ApiState<T> {
    data: T | null;
    loading: boolean;
    error: string | null;
    refetch: (opts?: Partial<ApiOptions>) => Promise<T | null>;
    post: (body: any, opts?: Partial<ApiOptions>) => Promise<T | null>;
    put: (body: any, opts?: Partial<ApiOptions>) => Promise<T | null>;
    patch: (body: any, opts?: Partial<ApiOptions>) => Promise<T | null>;
    del: (opts?: Partial<ApiOptions>) => Promise<T | null>;
    reset: () => void;
}

const useApi = <T = any>(endpoint: string, initOptions: ApiOptions = {}): ApiState<T> => {
    const [state, setState] = useState<Omit<ApiState<T>, "refetch" | "post" | "put" | "patch" | "del" | "reset">>({
        data: null,
        loading: false,
        error: null,
    });
    
    const isMountedRef = useRef(true);
    const abortControllerRef = useRef<AbortController | null>(null);

    useEffect(() => {
        isMountedRef.current = true;
        return () => {
            isMountedRef.current = false;
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, []);

    const fetchData = useCallback(async (options: ApiOptions = {}): Promise<T | null> => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        abortControllerRef.current = new AbortController();
        
        const mergedOptions = {
            method: 'GET' as Method,
            ...initOptions,
            ...options,
        };

        if (!isMountedRef.current) return null;

        setState(prev => ({ ...prev, loading: true, error: null }));

        try {
            const requestOptions: RequestInit = {
                ...mergedOptions,
                method: mergedOptions.method,
                signal: abortControllerRef.current.signal,
                headers: {
                    "Content-Type": "application/json",
                    ...(mergedOptions.headers || {}),
                },
            };

            if (mergedOptions.body && ['POST', 'PUT', 'PATCH'].includes(mergedOptions.method || 'GET')) {
                requestOptions.body = typeof mergedOptions.body === 'string' 
                    ? mergedOptions.body 
                    : JSON.stringify(mergedOptions.body);
            }

            const res = await fetch(`http://localhost:3000/${endpoint}`, requestOptions);
            
            if (!res.ok) {
                throw new Error(`HTTP error ${res.status}: ${res.statusText}`);
            }

            const contentType = res.headers.get('content-type');
            let data: T;
            
            if (contentType && contentType.includes('application/json')) {
                data = await res.json();
            } else {
                data = (await res.text()) as unknown as T;
            }

            if (isMountedRef.current) {
                setState({ data, loading: false, error: null });
            }
            
            return data;
        } catch (err: any) {
            if (err.name === 'AbortError') {
                return null;
            }
            
            if (isMountedRef.current) {
                setState({ data: null, loading: false, error: err.message });
            }
            return null;
        }
    }, [endpoint, initOptions]);

    useEffect(() => {
        if (initOptions.auto !== false) {
            fetchData();
        }
    }, [fetchData]);

    const refetch = useCallback((opts?: Partial<ApiOptions>) => {
        return fetchData(opts);
    }, [fetchData]);

    const post = useCallback((body: any, opts?: Partial<ApiOptions>) => {
        return fetchData({ ...opts, body, method: 'POST' });
    }, [fetchData]);

    const put = useCallback((body: any, opts?: Partial<ApiOptions>) => {
        return fetchData({ ...opts, body, method: 'PUT' });
    }, [fetchData]);

    const patch = useCallback((body: any, opts?: Partial<ApiOptions>) => {
        return fetchData({ ...opts, body, method: 'PATCH' });
    }, [fetchData]);

    const del = useCallback((opts?: Partial<ApiOptions>) => {
        return fetchData({ ...opts, method: 'DELETE' });
    }, [fetchData]);

    const reset = useCallback(() => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        setState({ data: null, loading: false, error: null });
    }, []);

    return { ...state, refetch, post, put, patch, del, reset };
};

export default useApi;
