export interface User {
  id: number;
  name: string;
  lastName: string;
  nationalCode: string;
  phoneNumber: string;
  role: 'USER' | 'WORKER' | 'OPERATOR' | 'SUPER_ADMIN';
  walletBalance: number;
  profilePic: { url: string }
}
