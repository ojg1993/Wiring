export interface Server { 
    id: number; 
    name: string;
    server: string;
    description: string; 
    category: string; 
    icon: string; 
    banner: string;
    channel_server: {
        id: numberl;
        server: number;
        name: string;
        topic: string;
        owner: number;
    }[];
}