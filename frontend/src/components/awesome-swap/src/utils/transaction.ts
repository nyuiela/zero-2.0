import {
    ArbitrumDepositEthDto,
    ArbitrumWithdrawalDto,
    BridgeWithdrawalDto,
    CcipBridgeDto,
    CctpBridgeDto,
    CctpBridgeV2FastDto,
    CctpBridgeV2StandardDto,
    ConfirmationDtoV2,
    EcoBridgeDto,
    ForcedWithdrawalDto,
    HyperlaneBridgeDto,
    LzBridgeV2Dto,
    OpInteropBridgeDto,
    PortalDepositDto,
    RelayBridgeDto,
    SignetDepositDto,
    TransactionStatus,
  } from "../types";
  
  import { AcrossBridgeDto } from "../types/across";
  
  type WithOverriddenSend<T> = Omit<
    T,
    | "send"
    | "deposit"
    | "bridge"
    | "mint"
    | "relay"
    | "fill"
    | "withdrawal"
    | "finalise"
  > & {
    send: Confirmation;
  };
  
  export interface SubmittedTx {
    type: "submitted-tx";
    transactionHash: string;
    timestamp: number;
  
    svm?: {
      blockhash: string;
      lastValidBlockHeight: number;
      signature: string;
    };
  }
  
  export const newSubmittedTx = (
    tx: Omit<SubmittedTx, "type" | "timestamp">
  ): SubmittedTx => ({
    ...tx,
    type: "submitted-tx",
    timestamp: Date.now(),
  });
  
  export interface NotSubmittedSafeTx {
    type: "not-submitted-safe-tx";
    safeTransactionHash: string;
    timestamp: number;
  }
  
  export const newNotSubmittedSafeTx = (
    tx: Omit<NotSubmittedSafeTx, "type" | "timestamp">
  ): NotSubmittedSafeTx => ({
    ...tx,
    type: "not-submitted-safe-tx",
    timestamp: Date.now(),
  });
  
  export interface NotSubmittedCall {
    type: "not-submitted-call";
    id: string;
    timestamp: number;
  }
  
  export const newNotSubmittedCall = (
    tx: Omit<NotSubmittedCall, "type" | "timestamp">
  ): NotSubmittedCall => ({
    ...tx,
    type: "not-submitted-call",
    timestamp: Date.now(),
  });
  
  export interface FailedCall {
    type: "failed-call";
    id: string;
    failed: true;
    timestamp: number;
  }
  
  export const newFailedCall = (
    tx: Omit<FailedCall, "type" | "timestamp">
  ): FailedCall => ({
    ...tx,
    type: "failed-call",
    timestamp: Date.now(),
  });
  
  export interface ConfirmedTx extends ConfirmationDtoV2 {}
  
  export const newMockConfirmedTx = (): ConfirmedTx => ({
    transactionHash: "0x",
    timestamp: Date.now(),
    status: TransactionStatus.confirmed,
  });
  
  export type NotSubmittedTx = NotSubmittedSafeTx | NotSubmittedCall;
  export type Confirmation =
    | NotSubmittedTx
    | SubmittedTx
    | ConfirmedTx
    | FailedCall;
  
  export type ArbitrumDepositBridge = WithOverriddenSend<ArbitrumDepositEthDto>;
  export type ArbitrumWithdrawalBridge =
    WithOverriddenSend<ArbitrumWithdrawalDto>;
  export type OptimismDepositBridge = WithOverriddenSend<PortalDepositDto>;
  export type OptimismWithdrawalBridge = WithOverriddenSend<BridgeWithdrawalDto>;
  export type OptimismForcedWithdrawalBridge = Omit<
    ForcedWithdrawalDto,
    "deposit" | "withdrawal"
  > & {
    deposit: OptimismDepositBridge;
    withdrawal?: OptimismWithdrawalBridge;
  };
  export type OptimismInteropBridge = WithOverriddenSend<OpInteropBridgeDto>;
  export type CctpBridge = WithOverriddenSend<CctpBridgeDto>;
  export type CctpV2FastBridge = WithOverriddenSend<CctpBridgeV2FastDto>;
  export type CctpV2StandardBridge = WithOverriddenSend<CctpBridgeV2StandardDto>;
  export type AcrossBridge = WithOverriddenSend<AcrossBridgeDto>;
  export type HyperlaneBridge = WithOverriddenSend<HyperlaneBridgeDto>;
  export type LzBridge = WithOverriddenSend<LzBridgeV2Dto>;
  export type CcipBridge = WithOverriddenSend<CcipBridgeDto>;
  export type RelayBridge = WithOverriddenSend<RelayBridgeDto>;
  export type EcoBridge = WithOverriddenSend<EcoBridgeDto>;
  export type SignetDepositBridge = WithOverriddenSend<SignetDepositDto>;
  
  export type Transaction =
    | ArbitrumDepositBridge
    | ArbitrumWithdrawalBridge
    | OptimismDepositBridge
    | OptimismForcedWithdrawalBridge
    | OptimismWithdrawalBridge
    | OptimismInteropBridge
    | CctpBridge
    | CctpV2FastBridge
    | CctpV2StandardBridge
    | AcrossBridge
    | HyperlaneBridge
    | LzBridge
    | CcipBridge
    | RelayBridge
    | EcoBridge
    | SignetDepositBridge;
  