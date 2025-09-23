import 'server-only'
import { components } from "../dtos/internalApiTypes"
import Owner from '../../domain/Owner';

export function mapOwner(dto: components["schemas"]["OwnerDto"]): Owner {
  return {
    name: dto.name,
    address: dto.address,
    photoUrl: dto.photo,
    birthday: dto.birthday,
  };
}