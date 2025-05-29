import { User } from '@/src/features/user/types';

export const DEFAULT_USER: User = {
  id: 0,
  name: '',
  lastName: '',
  nationalCode: '',
  phoneNumber: '',
  role: 'USER',
  walletBalance: 0,
  profilePic: { url: '' }
} as const