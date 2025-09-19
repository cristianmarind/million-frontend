import 'server-only'
import Property from "../../domain/Property";
import { components } from "../dtos/internalApiTypes"
import { mapPropertyTraces } from "./mapPropertyTraces";

export function mapProperty(dto: components["schemas"]["PropertyDto"]): Property {
  return {
    name: dto.name,
    address: dto.address,
    price: dto.price,
    ownerId: dto.ownerId,
    year: dto.year,
    imageUrls: dto.imageUrls || [],
    propertyTraces: dto.propertyTraces.map(mapPropertyTraces) || [],
  };
}