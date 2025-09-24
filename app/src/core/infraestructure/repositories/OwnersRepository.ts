import 'server-only'
import { components } from "../dtos/internalApiTypes"
import InternalApiClient from "../clients/InternalApiClient";
import { IGetOwnersProperties, IOwnerRepository } from '../../application/interfaces/IOwnersServices';
import { mapOwner } from '../mappers/mapOwner';
import Owner from '../../domain/Owner';

export default class OwnersRepository implements IOwnerRepository {
    static instance: OwnersRepository;
    private client!: InternalApiClient;

    constructor() {
        if (OwnersRepository.instance) {
            return OwnersRepository.instance;
        }
        this.client = new InternalApiClient();

        return this;
    }

    async fetchByFilterAsync(options: IGetOwnersProperties): Promise<Owner[]> {
        try {
            const data = await this.client.fetchData(`owners/find`, {
                ownerIdList: options.ownersId
            });
    
            const owners = data as components["schemas"]["OwnerDto"][];
    
            return owners.map(mapOwner)
        } catch (error) {
            console.error('OwnersRepository: Error fetching owners', error instanceof Error ? error.message : String(error));
            return [];
        }
    }
}