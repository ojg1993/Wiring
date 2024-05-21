export interface AuthServiceProps {
    login: (username: string, password: string) => void;
    logout: () => void;
    isAuthenticated: boolean;
    refreshAccessToken: () => Promise<void>;
}