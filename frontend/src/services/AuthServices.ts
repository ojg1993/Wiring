import { AuthServiceProps } from "../@types/auth-service";
import { BASE_URL } from "../config";
import axios from "axios";

export function useAuthService(): AuthServiceProps {
    const login = async (username: string, password: string) => {
        try {
            const response = await axios.post(`${BASE_URL}/token/`, {
                username,
                password,
            });
            console.log(response);

        } catch (error) {
            return error;
        }
    }
    const logout = () => { return true; }
    return {login, logout};
}