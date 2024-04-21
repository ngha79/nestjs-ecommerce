export interface InfoAddressUser {
  address: string;
  phoneNumber: string;
  userName: string;
  isAddressDefault?: boolean;
}

export interface IUpdateAddressUser {
  address?: string;
  phoneNumber?: string;
  userName?: string;
  isAddressDefault?: boolean;
}

export interface DeleteAddressDto {
  addressId: string;
}
