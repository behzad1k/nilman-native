import { apiClient } from '@/src/configs/api/apiClient';
import ENDPOINTS from '@/src/configs/api/endpoints';
import { Service } from '@/src/features/service/serviceTypes';
import { ApiResponse } from '@/src/types/api';

export const ServiceService = {
  async getAllServices(): Promise<ApiResponse<Service[]>> {
    return await apiClient.get(ENDPOINTS.SERVICE.INDEX);;
  },
};
