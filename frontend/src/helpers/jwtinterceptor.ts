import axios, {AxiosInstance} from "axios";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../config";
import { useAuthService } from "../services/AuthServices";


const useAxiosWithInterceptor = (): AxiosInstance => {
    const jwtAxios = axios.create({ baseURL: BASE_URL });
    const navigate = useNavigate();
    const { logout } = useAuthService();
    
    jwtAxios.interceptors.response.use(
        (response) => {
            return response;
        },
    async (error) => { 
        const originalRequest = error.config;
        if (error.response?.status === 401 || error.response?.status === 403) {
            axios.defaults.withCredentials = true;
            try {
                const response = await axios.post(`${BASE_URL}/token/refresh/`);

                if (response.status === 200) { 
                return jwtAxios(originalRequest);
                }
            } catch (error) {
                logout()
                navigate("/login");
                throw Promise.reject(error);
            }
        }
        throw error;
        }
    )
    return jwtAxios;
};

export default useAxiosWithInterceptor;