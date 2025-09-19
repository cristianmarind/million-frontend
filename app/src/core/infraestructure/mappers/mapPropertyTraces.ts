import 'server-only'
import PropertyTrace from "../../domain/PropertyTrace";
import { components } from "../dtos/internalApiTypes"

export function mapPropertyTraces(dto: components["schemas"]["PropertyTraceDto"]): PropertyTrace {
  return {
    date: dto.date,
    event: dto.name,
    value: dto.value,
    tax: dto.tax
  };
}