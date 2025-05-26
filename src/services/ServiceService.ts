import { apiClient } from '@/src/configs/api/apiClient';
import ENDPOINTS from '@/src/configs/api/endpoints';
import { ApiResponse } from '@/src/types/api';
import globalType from '@/src/types/globalType';

export const serviceService = {
  async getAllServices(): Promise<ApiResponse<globalType.Service[]>> {
    return await apiClient.get(ENDPOINTS.SERVICE.INDEX);;
  },
};
