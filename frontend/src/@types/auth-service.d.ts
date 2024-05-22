export interface AuthServiceProps {
    register: (username:string, password:string) => Promise<any>;
    login: (username: string, password: string) => void;
    logout: () => void;
    isAuthenticated: boolean;
    refreshAccessToken: () => Promise<void>;
}