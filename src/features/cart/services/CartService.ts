import ENDPOINTS from "@/src/configs/api/endpoints";
import { Form, Order, OrderRequest } from "@/src/features/order/types";
import { ApiResponse } from "@/src/types/api";
import { ServiceDependencies } from "@/src/types/services";
import { STORAGE_KEYS } from "@/src/utils/storage";

export class CartServiceError extends Error {
	constructor(
		message: string,
		public code?: string,
	) {
		super(message);
		this.name = "OrderServiceError";
	}
}

class CartService {
	constructor(private deps: ServiceDependencies) {}

	async getCart(): Promise<ApiResponse<Order[]>> {
		return await this.deps.apiClient.get(ENDPOINTS.ORDER.CART);
	}

	async deleteCartItem(id: number): Promise<ApiResponse> {
		try {
			return await this.deps.apiClient.delete(ENDPOINTS.ORDER.INDEX, {
				body: JSON.stringify({ orderId: id }),
			});
		} catch (e) {
			throw e;
		}
	}

	async checkDiscountCode(discount: string): Promise<ApiResponse> {
		return await this.deps.apiClient.post(ENDPOINTS.ORDER.DISCOUNT, {
			discount,
		});
	}

	async sendPortal(data: any): Promise<ApiResponse> {
		return await this.deps.apiClient.post(ENDPOINTS.ORDER.PAY, data);
	}

	async processCreditPayment(): Promise<any> {
		const res: ApiResponse = await this.deps.apiClient.post(
			ENDPOINTS.ORDER.PAY,
			{ isCredit: true, method: "credit" },
		);
		return await this.deps.apiClient.post(ENDPOINTS.ORDER.PAYMENT_VERIFY, {
			authority: res.data?.authority,
		});
	}

	async reOrder(data: Form): Promise<void> {
		try {
			await this.deps.storage.setItem(
				STORAGE_KEYS.NEW_ORDER,
				JSON.stringify({
					...data,
					timestamp: new Date().toISOString(),
					step: {
						name: "address",
						index: 2,
					},
				}),
			);
		} catch (e) {
			throw e;
		}
	}
}
export default CartService;
