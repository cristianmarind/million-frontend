import PropertyTrace from "./PropertyTrace";

export default interface Property {
    id: string;
    name: string;
    address: string;
    category: number;
    isNear?: boolean;
    price: number;
    ownerId: string;
    year: number;
    imageUrls: string[];
    propertyTraces: PropertyTrace[]
}