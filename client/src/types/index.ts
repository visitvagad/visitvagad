export interface IUser {
    id: string;
    name: string;
    email: string;
    role: "user" | "editor" | "admin";
}

export interface IPlace {
    _id: string;
    name: string;
    description: string;
    district: "Banswara" | "Dungarpur";
    category: "temple" | "nature" | "tribal" | "waterfall" | "historical" | "spiritual";
    image: string;
    featured: boolean;
    trending: boolean;
    bestSeason?: "Summer" | "Monsoon" | "Winter";
    coordinates: {
        latitude: number;
        longitude: number;
    };
}
