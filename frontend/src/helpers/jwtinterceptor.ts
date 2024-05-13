import axios, {AxiosInstance} from "axios";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../config";


const useAxiosWithInterceptor = (): AxiosInstance => {
    const jwtAxios = axios.create({ baseURL: BASE_URL });
    const navigate = useNavigate();
    
    jwtAxios.interceptors.response.use(
        (response) => {
            return response;
        },
    async (error) => { 
        const originalRequest = error.config;
        if (error.response.status === 401 || error.response.status === 403) {
            const goLogin = () => navigate("/login");
            goLogin();
        }
        throw error;
    }
    )
    return jwtAxios;
};

export default useAxiosWithInterceptor;