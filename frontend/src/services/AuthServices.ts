import { AuthServiceProps } from "../@types/auth-service";
import { BASE_URL } from "../config";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function useAuthService(): AuthServiceProps {
    const navigate = useNavigate();
    const getInitialAuthStatus = () => {
        const loggedIn = localStorage.getItem("isAuthenticated");
        return loggedIn !== null && loggedIn === "true";
        }
    
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>((getInitialAuthStatus))

    const getUserDetails = async () => {
        try {
            const userId = localStorage.getItem("user_id");
            const response = await axios.get(`${BASE_URL}/account/?user_id=${userId}`,
                { withCredentials: true}
            );
            const userDetails = response.data;

            localStorage.setItem("username", userDetails.username);
            localStorage.setItem("isAuthenticated", "true");
            setIsAuthenticated(true);
        } catch (error) {
            setIsAuthenticated(false);
            localStorage.setItem("isAuthenticated", "false");
            return error;
        }
    }
    
    const refreshAccessToken = async () => { 
        try {
            await axios.post(`${BASE_URL}/token/refresh/`, {}, {withCredentials: true});
        } catch(refreshError) {
            return Promise.reject(refreshError)
        }   
    }

    const register = async (username: string, password: string) => {
        try {
            const response = await axios.post(`${BASE_URL}/register/`, {
                username,
                password,
            }, {withCredentials: true});
            return response.status;

        } catch (error: any) {
            return error.response.status;
        }
    }

    const login = async (username: string, password: string) => {
        try {
            const response = await axios.post(`${BASE_URL}/token/`, {
                username,
                password,
            }, {withCredentials: true});
            const user_id = response.data.user_id
            localStorage.setItem("user_id", user_id);
            localStorage.setItem("isAuthenticated", "true");
            setIsAuthenticated(true);
            getUserDetails()

        } catch (error: any) {
            setIsAuthenticated(false);
            localStorage.setItem("isAuthenticated", "false");

            return error.response.status;
        }
    }
    const logout = async () => { 
        setIsAuthenticated(false);
        localStorage.setItem("isAuthenticated", "false");
        localStorage.removeItem("username")
        localStorage.removeItem("user_id")
        navigate("/");

        try {
            await axios.post(`${BASE_URL}/logout/`, {}, {withCredentials: true});
        } catch(refreshError) {
            return Promise.reject(refreshError)
        }   

    }
    return {login, logout, isAuthenticated, refreshAccessToken, register};
}