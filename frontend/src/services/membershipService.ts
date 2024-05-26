import useAxiosWithInterceptor from "../helpers/jwtinterceptor";
import { useState } from "react";
import { BASE_URL } from "../config";

interface IuseServer {
  joinServer: (serverId: number) => Promise<void>;
  leaveServer: (serverId: number) => Promise<void>;
  isMember: (serverId: number) => Promise<boolean>;
  isUserMember: boolean;
  error: Error | null;
  isLoading: boolean;
}

const useMembership = (): IuseServer => { 
    const jwtAxios = useAxiosWithInterceptor();
    const [error, setError] = useState<Error | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isUserMember, setIsUserMember] = useState<boolean>(false);

    const joinServer = async (serverId: number): Promise<void> => { 
        setIsLoading(true);
        try {
            await jwtAxios.post(
                `${BASE_URL}/membership/${serverId}/`,
                {},
                { withCredentials: true }
            );
            setIsUserMember(true);
        } catch (error:any) {
            setError(error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    }

    const leaveServer = async (serverId: number): Promise<void> => { 
        setIsLoading(true);
        try {
            await jwtAxios.delete(
                `${BASE_URL}/membership/${serverId}/remove_member/`,
                { withCredentials: true }
            );
            setIsUserMember(false);
        } catch (error:any) {
            setError(error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    }
    
    const isMember = async (serverId: number): Promise<void> => { 
        setIsLoading(true);
        try {
            const res = await jwtAxios.get(
                `${BASE_URL}/membership/${serverId}/is_member/`,
                { withCredentials: true }
            );
            setIsUserMember(res.data.is_member);
        } catch (error:any) {
            setError(error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    }

    return { joinServer, leaveServer, isMember, isUserMember, error, isLoading}
}

export default useMembership;