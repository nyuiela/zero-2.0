import {
    ActiveDeploymentStatus,
    AmountTooLargeRouteErrorDto,
    AmountTooSmallRouteErrorDto,
    BridgeConfigDto,
    CctpBridgeV2FastDto,
    CctpBridgeV2StandardDto,
    DeploymentStatus,
    DisabledRouteErrorDto,
    GenericRouteErrorDto,
    PasswordRequiredDto,
    PausedRouteErrorDto,
    RouteProvider,
    RouteQuoteDto,
    RouteStepForcedWithdrawalDto,
    RouteStepReceiveDto,
    RouteStepTransactionDto,
    RouteStepType,
    RouteStepWaitDto,
    TransactionStatus,
    TrialDeploymentStatus,
  } from "../types";
  import { InjectedState } from "../state/injected-provider";
  import {
    AcrossBridge,
    ArbitrumDepositBridge,
    ArbitrumWithdrawalBridge,
    CcipBridge,
    CctpBridge,
    Confirmation,
    ConfirmedTx,
    EcoBridge,
    FailedCall,
    HyperlaneBridge,
    LzBridge,
    NotSubmittedCall,
    NotSubmittedSafeTx,
    OptimismDepositBridge,
    OptimismForcedWithdrawalBridge,
    OptimismInteropBridge,
    OptimismWithdrawalBridge,
    RelayBridge,
    SignetDepositBridge,
    SubmittedTx,
    Transaction,
  } from "@/types/transaction";
  
  const withdrawals: RouteProvider[] = [
    RouteProvider.ArbitrumWithdrawal,
    RouteProvider.OptimismWithdrawal,
  ];
  
  const deposits: RouteProvider[] = [
    RouteProvider.ArbitrumDeposit,
    RouteProvider.OptimismDeposit,
  ];
  
  export const isDeposit = (
    tx: Pick<Transaction, "provider">
  ): tx is OptimismDepositBridge | ArbitrumDepositBridge => {
    return deposits.includes(tx.provider);
  };
  export const isWithdrawal = (
    tx: Pick<Transaction, "provider">
  ): tx is OptimismWithdrawalBridge | ArbitrumWithdrawalBridge => {
    return withdrawals.includes(tx.provider);
  };
  
  export const isForcedWithdrawal = (
    tx: Pick<Transaction, "provider">
  ): tx is OptimismForcedWithdrawalBridge => {
    return RouteProvider.OptimismForcedWithdrawal === tx.provider;
  };
  
  export const isArbitrumDeposit = (
    tx: Pick<Transaction, "provider">
  ): tx is ArbitrumDepositBridge => {
    return RouteProvider.ArbitrumDeposit === tx.provider;
  };
  
  export const isArbitrumWithdrawal = (
    tx: Pick<Transaction, "provider">
  ): tx is ArbitrumWithdrawalBridge => {
    return RouteProvider.ArbitrumWithdrawal === tx.provider;
  };
  
  export const isOptimismDeposit = (
    tx: Pick<Transaction, "provider">
  ): tx is OptimismDepositBridge => {
    return RouteProvider.OptimismDeposit === tx.provider;
  };
  
  export const isOptimismWithdrawal = (
    tx: Pick<Transaction, "provider">
  ): tx is OptimismWithdrawalBridge => {
    return RouteProvider.OptimismWithdrawal === tx.provider;
  };
  
  export const isOptimismForcedWithdrawal = (
    tx: Pick<Transaction, "provider">
  ): tx is OptimismForcedWithdrawalBridge => {
    return RouteProvider.OptimismForcedWithdrawal === tx.provider;
  };
  
  export const isCctpBridge = (
    tx: Pick<Transaction, "provider">
  ): tx is CctpBridge => {
    return RouteProvider.Cctp === tx.provider;
  };
  
  export const isCctpV2Bridge = (
    tx: Pick<Transaction, "provider">
  ): tx is CctpBridgeV2FastDto | CctpBridgeV2StandardDto => {
    return (
      tx.provider === RouteProvider.CctpV2Fast ||
      tx.provider === RouteProvider.CctpV2Standard
    );
  };
  
  export const isAcrossBridge = (
    tx: Pick<Transaction, "provider">
  ): tx is AcrossBridge => {
    return RouteProvider.Across === tx.provider;
  };
  
  export const isHyperlaneBridge = (
    tx: Pick<Transaction, "provider">
  ): tx is HyperlaneBridge => {
    return RouteProvider.Hyperlane === tx.provider;
  };
  
  export const isLzBridge = (
    tx: Pick<Transaction, "provider">
  ): tx is LzBridge => {
    return (
      RouteProvider.Lz === tx.provider || RouteProvider.Stargate === tx.provider
    );
  };
  
  export const isOpInteropBridge = (
    tx: Pick<Transaction, "provider">
  ): tx is OptimismInteropBridge => {
    return RouteProvider.OptimismInterop === tx.provider;
  };
  
  export const isEcoBridge = (
    tx: Pick<Transaction, "provider">
  ): tx is EcoBridge => {
    return RouteProvider.Eco === tx.provider;
  };
  
  export const isRelayBridge = (
    tx: Pick<Transaction, "provider">
  ): tx is RelayBridge => {
    return RouteProvider.Relay === tx.provider;
  };
  
  export const isSignetDeposit = (
    tx: Pick<Transaction, "provider">
  ): tx is SignetDepositBridge => {
    return RouteProvider.Signet === tx.provider;
  };
  
  export const isCcipBridge = (
    tx: Pick<Transaction, "provider">
  ): tx is CcipBridge => {
    return RouteProvider.Ccip === tx.provider;
  };
  
  export const isActive = (
    s: TrialDeploymentStatus | ActiveDeploymentStatus
  ): s is ActiveDeploymentStatus => {
    return s.status === DeploymentStatus.active;
  };
  
  export const isTrial = (
    s: TrialDeploymentStatus | ActiveDeploymentStatus
  ): s is TrialDeploymentStatus => {
    return s.status === DeploymentStatus.trial;
  };
  
  type RouteQuote =
    | RouteQuoteDto
    | GenericRouteErrorDto
    | AmountTooLargeRouteErrorDto
    | AmountTooSmallRouteErrorDto
    | PausedRouteErrorDto
    | DisabledRouteErrorDto;
  
  type RouteQuoteError =
    | GenericRouteErrorDto
    | AmountTooLargeRouteErrorDto
    | AmountTooSmallRouteErrorDto
    | PausedRouteErrorDto
    | DisabledRouteErrorDto;
  
  export const isRouteQuoteError = (a: RouteQuote): a is RouteQuoteError => {
    return !!(a as any).type;
  };
  
  export const isAmountTooLargeRouteError = (
    a: RouteQuote
  ): a is AmountTooLargeRouteErrorDto => {
    return isRouteQuoteError(a) && a.type === "AmountTooLarge";
  };
  
  export const isAmountTooSmallRouteError = (
    a: RouteQuote
  ): a is AmountTooSmallRouteErrorDto => {
    return isRouteQuoteError(a) && a.type === "AmountTooSmall";
  };
  
  export const isGenericRouteError = (
    a: RouteQuote
  ): a is GenericRouteErrorDto => {
    return isRouteQuoteError(a) && a.type === "GenericError";
  };
  
  export const isRouteQuote = (a: RouteQuote | undefined): a is RouteQuoteDto => {
    if (!a) return false;
    return !!(a as RouteQuoteDto).initiatingTransaction;
  };
  
  type RouteStepDto =
    | RouteStepWaitDto
    | RouteStepReceiveDto
    | RouteStepTransactionDto
    | RouteStepForcedWithdrawalDto;
  
  export const isRouteWaitStep = (a: RouteStepDto): a is RouteStepWaitDto => {
    return a.type === RouteStepType.Wait;
  };
  
  export const isRouteReceiveStep = (
    a: RouteStepDto
  ): a is RouteStepReceiveDto => {
    return a.type === RouteStepType.Receive;
  };
  
  export const isRouteForcedWithdrawalStep = (
    a: RouteStepDto
  ): a is RouteStepForcedWithdrawalDto => {
    return a.type === RouteStepType.ForcedWithdrawal;
  };
  
  export const isRouteTransactionStep = (
    a: RouteStepDto
  ): a is RouteStepTransactionDto => {
    const options: RouteStepType[] = [
      RouteStepType.Initiate,
      RouteStepType.Prove,
      RouteStepType.Finalize,
    ];
    return options.includes(a.type);
  };
  
  export const isPasswordRequiredDto = (
    x: InjectedState | BridgeConfigDto | PasswordRequiredDto
  ): x is PasswordRequiredDto => {
    return (x as PasswordRequiredDto).passwordRequired === true;
  };
  
  export const isInjectedState = (x: InjectedState | {}): x is InjectedState => {
    return !!(x as InjectedState).id;
  };
  
  export const isSubmittedTx = (x: Confirmation): x is SubmittedTx => {
    return (x as SubmittedTx).type === "submitted-tx";
  };
  
  export const isNotSubmittedSafeTx = (
    x: Confirmation
  ): x is NotSubmittedSafeTx => {
    return (x as NotSubmittedSafeTx).type === "not-submitted-safe-tx";
  };
  
  export const isNotSubmittedCall = (x: Confirmation): x is NotSubmittedCall => {
    return (x as NotSubmittedCall).type === "not-submitted-call";
  };
  
  export const isConfirmedTx = (x: Confirmation): x is ConfirmedTx => {
    return (
      !!(x as ConfirmedTx).timestamp &&
      !!(x as ConfirmedTx).status &&
      !!(x as ConfirmedTx).transactionHash
    );
  };
  
  export const isConfirmedSuccessTx = (x: Confirmation): x is ConfirmedTx => {
    return (
      !(x as any).type &&
      !!(x as ConfirmedTx).timestamp &&
      !!(x as ConfirmedTx).transactionHash &&
      (x as ConfirmedTx).transactionHash !== "0x" &&
      (x as ConfirmedTx).status === TransactionStatus.confirmed
    );
  };
  
  export const isConfirmedFailedTx = (x: Confirmation): x is ConfirmedTx => {
    return (
      !(x as any).type &&
      !!(x as ConfirmedTx).timestamp &&
      !!(x as ConfirmedTx).transactionHash &&
      (x as ConfirmedTx).status !== TransactionStatus.confirmed
    );
  };
  
  export const isFailedCall = (x: Confirmation): x is FailedCall => {
    return (x as FailedCall).type === "failed-call";
  };
  