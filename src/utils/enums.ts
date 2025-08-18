export enum Roles  {
  SUPER_ADMIN = 'SUPER_ADMIN',
  OPERATOR = 'OPERATOR',
  WORKER = 'WORKER',
  USER = 'USER',
};
export enum OrderStatus  {
  Created = 'Created',
  AwaitingPayment = 'AwaitingPayment',
  Paid = 'Paid',
  Assigned = 'Assigned',
  InProgress = 'InProgress',
  Canceled = 'Canceled',
  Done = 'Done'
};
export enum OrderStatusNames  {
  Created = 'سبد خرید',
  Paid = 'پرداخت شده',
  Assigned = 'محول شده',
  InProgress = 'در حال انجام',
  Canceled = 'کنسل شده',
  Done = 'تمام شده'
};

export enum dataTypes {
  string = 'varchar',
  number = 'number',
  datetime = 'datetime',
  boolean = 'boolean',
  text = 'text',
  integer = 'integer',
  float = 'float'
}

export enum PaymentMethods {
  card = 'card',
  ap = 'ap',
  sep = 'sep',
  zarinpal = 'zarinpal',
  credit = 'credit',
}

export enum Portals {
  Ap = 'ap',
  Sep = 'sep',
  ZarinPal = 'zarinPal',
}

export enum PaymentMethodNames {
  Card = 'کارت به کارت',
  Ap = 'آسان پرداخت',
  Sep = 'سامان پرداخت',
  ZarinPal = 'زرین پال',
  Credit = 'کیف پول',
};
export enum ServiceEnum {
  Nail = 'ناخن',
  Feet = 'پا',
  Hand = 'دست'
};

export enum Themes {
  dark = 'dark',
  light = 'light',
  system = 'system'
}