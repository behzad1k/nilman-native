import { Form, Step } from '@/src/features/order/types';
import { User } from '@/src/features/user/types';

export const DEFAULT_USER: User = {
  id: 0,
  name: '',
  lastName: '',
  nationalCode: '',
  phoneNumber: '',
  role: 'USER',
  walletBalance: 0,
  profilePic: { url: '' },
  isWorkerChoosable: true
} as const

export const DEFAULT_FORM: Form = {
  service: null,
  attributeStep: undefined,
  attributes: [],
  address: null,
  price: 0,
  worker: null,
  date: null,
  time: null,
  discount: undefined,
  isUrgent: false,
  isMulti: false,
  options: {}
} as const;

export const STEPS: Step[] = [
  {
    index: 0,
    name: 'service',
  },
  {
    index: 1,
    name: 'attribute',
  },
  {
    index: 2,
    name: 'address',
  },
  {
    index: 3,
    name: 'worker',
  },
];
