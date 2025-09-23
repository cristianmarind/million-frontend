import Owner from "../../domain/Owner";

export interface IGetOwnersProperties {
    ownersId: string[];
}

export interface IOwnerRepository {
    fetchByFilterAsync(options: IGetOwnersProperties): Promise<Owner[]>;
}

export interface IGetOwners {
  execute(
    repository: IOwnerRepository,
    options: IGetOwnersProperties
  ): Promise<Owner[]>;
}