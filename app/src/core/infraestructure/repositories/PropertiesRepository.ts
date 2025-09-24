import 'server-only'
import { IRepositoryProperties, IGetPropertiesProperties } from "../../application/interfaces/IPropertiesServices";
import { components } from "../dtos/internalApiTypes"
import Property from "../../domain/Property";
import InternalApiClient from "../clients/InternalApiClient";
import { mapProperty } from "../mappers/mapProperty";

export default class PropertiesRepository implements IRepositoryProperties {
    static instance: PropertiesRepository;
    private client!: InternalApiClient;

    constructor() {
        if (PropertiesRepository.instance) {
            return PropertiesRepository.instance;
        }
        this.client = new InternalApiClient();

        return this;
    }

    async fetchByFilterAsync(options: IGetPropertiesProperties): Promise<Property[]> {
        try {
            const data = await this.client.fetchData(`properties/find`, options);

            if (!data || !Array.isArray(data)) {
                console.warn('PropertiesRepository: Received invalid data format', data);
                return [];
            }

            const properties = data as components["schemas"]["PropertyDto"][];

            return properties.map(mapProperty);
        } catch (error) {
            console.error('PropertiesRepository: Error fetching properties', {
                options,
                error: error instanceof Error ? error.message : String(error)
            });
            return []; 
        }
    }
}