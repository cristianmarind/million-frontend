import PropertyTrace from "./PropertyTrace";

export default interface Property {
    name: string;
    address: string;
    price: number;
    ownerId: string;
    year: number;
    imageUrls: string[];
    propertyTraces: PropertyTrace[]
}