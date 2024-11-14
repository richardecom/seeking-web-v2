// /context/UserContext.tsx
import { User } from '@/app/types/user';
import { UpdateProfile } from '@/hooks/ProfileHooks';
import { toast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';



interface UserContextType {
    currentUser: User | null;
    login: (userData: User) => void;
    logout: () => void;
    updateBasic: (data: any, option:string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const router = useRouter();
    const [currentUser, setUser] = useState<User | null>(null);
    
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const cookieString = document.cookie;
        const cookies = Object.fromEntries(cookieString.split('; ').map(cookie => {
            const [name, ...rest] = cookie.split('=');
            return [name, decodeURIComponent(rest.join('='))];
        }));
        const jwtToken = cookies['jwt'];
        if (storedUser && jwtToken) {
            setUser(JSON.parse(storedUser));
        }

        // checkSession()
    }, []);

    const checkSession = async () =>{
        try {
            const data = await fetch(`http://localhost:3000/api/check-session`);
            const result = await data.json()
            setUser(result.data)
        } catch (error) {
          return null;
        }
    }

    const login = (userData: User) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    const updateBasic = async (formData: any, option: string) => {
        if (!currentUser) return;
        try {
            
            const result = await UpdateProfile(formData, option);
            if (result.status === 201) {
                login(result.data)
                toast({
                    className: "success_message",
                    description: result.message,
                });
            } else if (result.status === 401) {
                logout();
                router.push("/");
            } else {
                toast({
                    className: "error_message",
                    description: result.message,
                });
            }
        } catch (error) {
            toast({
                className: "error_message",
                description: "An unexpected error occurred. Please try again later.",
            });
        }
    };

    return (
        <UserContext.Provider value={{ currentUser, login, logout, updateBasic }}>
            {children}
        </UserContext.Provider>
    );
};
