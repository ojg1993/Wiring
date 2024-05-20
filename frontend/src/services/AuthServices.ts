import { StepIconClassKey } from "@mui/material";
import { AuthServiceProps } from "../@types/auth-service";
import { BASE_URL } from "../config";
import axios from "axios";
import { useState } from "react";

export function useAuthService(): AuthServiceProps {

    const getInitialAuthStatus = () => {
        const loggedIn = localStorage.getItem("isAuthenticated");
        return loggedIn !== null && loggedIn === "true";
        }
    
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>((getInitialAuthStatus))

    const getUserDetails =async () => {
        try {
            const userId = localStorage.getItem("userId");
            const accessToken = localStorage.getItem("access_token");
            const response = await axios.get(`${BASE_URL}/account/?user_id=${userId}`,
                { headers: { Authorization: `Bearer ${accessToken}` } }
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

    const getUserIdFromToken = (access:StepIconClassKey) => {
        const token = access
        const tokenParts = token.split('.');
        const encodedPayload = tokenParts[1];
        const decodedPayload = atob(encodedPayload);
        const payLoadData = JSON.parse(decodedPayload);
        const userId = payLoadData.user_id;

        return userId;
    }
    const login = async (username: string, password: string) => {
        try {
            const response = await axios.post(`${BASE_URL}/token/`, {
                username,
                password,
            });
            console.log(response);
            const { access, refresh } = response.data;
            
            localStorage.setItem("access_token", access);
            localStorage.setItem("refresh_token", refresh);
            localStorage.setItem("userId", getUserIdFromToken(access));
            localStorage.setItem("isAuthenticated", "true");
            setIsAuthenticated(true);
            getUserDetails()

        } catch (error) {
            setIsAuthenticated(false);
            localStorage.setItem("isAuthenticated", "false");

            return error;
        }
    }
    const logout = () => { 
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("userId");
        localStorage.removeItem("username");
        localStorage.setItem("isAuthenticated", "false");
        setIsAuthenticated(false);
    }
    return {login, logout, isAuthenticated};
}