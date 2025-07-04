import { Address } from "viem";

export const isAddressEqual = (
  fromChain: any,
  fromAddress: Address,
  toChain: any,
  toAddress: Address
): boolean => {
  return fromAddress.toLowerCase() === toAddress.toLowerCase();
}; 