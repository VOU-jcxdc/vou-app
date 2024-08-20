enum VoucherType {
  RATE = 'rate',
  AMOUNT = 'amount',
}

enum VoucherStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

enum VoucherUsageMode {
  ONLINE = 'online',
  OFFLINE = 'offline',
}

interface Voucher {
  id: string;
  name: string;
  description: string;
  code: string;
  type: VoucherType;
  value: number;
  status: VoucherStatus;
  duration: number;
  createdOn: string;
  updatedOn: string;
  brandId: string;
  usageMode: VoucherUsageMode;
}

interface EventsVouchers {
  id: string;
  eventId: string;
  voucherId: string;
  quantity: number;
  createdOn: string;
  updatedOn: string;
}

type EventsVouchersResponse = EventsVouchers & {
  voucher: Voucher;
};

interface AccountsVouchers {
  id: string;
  accountId: string;
  voucherId: string;
  quantity: number;
  assignedOn: string;
  updatedOn: string;
  status: string;
}

type AccountsVouchersResponse = AccountsVouchers & {
  voucher: Voucher;
};

export {
  AccountsVouchers,
  AccountsVouchersResponse,
  EventsVouchers,
  EventsVouchersResponse,
  Voucher,
  VoucherUsageMode,
};
