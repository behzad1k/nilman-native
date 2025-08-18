import { apiClient } from '@/src/configs/api/apiClient';
import ENDPOINTS from '@/src/configs/api/endpoints';
import { Service } from '@/src/features/service/types';
import { ApiResponse } from '@/src/types/api';
import { ServiceDependencies } from '@/src/types/services';

class ServiceService {
  constructor(private deps: ServiceDependencies) {}

  async getAllServices(): Promise<ApiResponse<Service[]>> {
    return await this.deps.apiClient.get<ApiResponse<Service[]>>(ENDPOINTS.SERVICE.INDEX);
  }
}

export default ServiceService;