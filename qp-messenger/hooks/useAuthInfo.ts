// hooks/useSecureStore.ts
import { useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';

export function useAuthInfo<T = any>(key: string) {
    const [user, setUser] = useState<T | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    // Load value on mount
    useEffect(() => {
        const load = async () => {
            try {
                const storedValue = await SecureStore.getItemAsync(key);
                console.log("Stored value", storedValue);
                if (storedValue) {
                    setUser(JSON.parse(storedValue));
                }
            } catch (error) {
                console.error(`Error reading ${key} from SecureStore`, error);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [key]);

    // Save new value
    const save = async (newValue: T) => {
        try {
            await SecureStore.setItemAsync(key, JSON.stringify(newValue));
            setUser(newValue);
        } catch (error) {
            console.error(`Error saving ${key} to SecureStore`, error);
        }
    };

    // Remove value
    const remove = async () => {
        try {
            await SecureStore.deleteItemAsync(key);
            setUser(null);
        } catch (error) {
            console.error(`Error removing ${key} from SecureStore`, error);
        }
    };

    return { user, save, remove, loading };
}
