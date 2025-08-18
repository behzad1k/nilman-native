import ENDPOINTS from '@/src/configs/api/endpoints';
import { Address, AddressQuery, AddressSearchResult, GeoAddress, Position } from '@/src/features/address/types';
import { ApiResponse } from '@/src/types/api';
import { ServiceDependencies } from '@/src/types/services';

export class AddressServiceError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'OrderServiceError';
  }
}

class AddressService {
  constructor(private deps: ServiceDependencies) {
  }
  async getAddresses(): Promise<ApiResponse<Address[]>> {
    return await this.deps.apiClient.get(ENDPOINTS.ADDRESS.INDEX)
  }

  async basicAddress(data: Partial<Address>, id: number = 0): Promise<ApiResponse<Address>> {
    return await this.deps.apiClient.post(ENDPOINTS.ADDRESS.INDEX + (id || ''), { ...data });
  }

  async deleteAddress(id: number): Promise<ApiResponse> {
    return await this.deps.apiClient.delete(ENDPOINTS.ADDRESS.INDEX + id.toString());
  }

  async geoCode(query: Position): Promise<ApiResponse<GeoAddress>> {
    return await this.deps.apiClient.get(ENDPOINTS.ADDRESS.GEO_CODE, { query: query });
  }

  async searchByQuery(query: AddressQuery): Promise<ApiResponse<AddressSearchResult[]>> {
    return await this.deps.apiClient.get(ENDPOINTS.ADDRESS.SIMPLE_SEARCH, { query: query });
  }
};
export default AddressService;