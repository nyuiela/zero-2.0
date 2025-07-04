import { useConfigState } from "../state/config-store";

export const useModal = (modalName: string) => {
  const displayTokenNetworkSelector = useConfigState.useDisplayTokenNetworkSelector();
  const setDisplayTokenNetworkSelector = useConfigState.useSetDisplayTokenNetworkSelector();
  const displayTransactions = useConfigState.useDisplayTransactions();
  const setDisplayTransactions = useConfigState.useSetDisplayTransactions();
  const walletDrawer = useConfigState.useWalletDrawer();
  const setWalletDrawer = useConfigState.useSetWalletDrawer();

  const open = () => {
    switch (modalName) {
      case "TokenSelector":
        setDisplayTokenNetworkSelector(true);
        break;
      case "NetworkSelector":
        setDisplayTokenNetworkSelector(true);
        break;
      case "Activity":
        setDisplayTransactions(true);
        break;
      case "Settings":
        // TODO: Implement settings modal
        break;
      case "RecipientAddress":
        // TODO: Implement recipient address modal
        break;
      case "Wallet":
        setWalletDrawer(true);
        break;
      default:
        console.warn(`Modal ${modalName} not implemented`);
    }
  };

  const close = () => {
    switch (modalName) {
      case "TokenSelector":
      case "NetworkSelector":
        setDisplayTokenNetworkSelector(false);
        break;
      case "Activity":
        setDisplayTransactions(false);
        break;
      case "Settings":
        // TODO: Implement settings modal close
        break;
      case "RecipientAddress":
        // TODO: Implement recipient address modal close
        break;
      case "Wallet":
        setWalletDrawer(false);
        break;
      default:
        console.warn(`Modal ${modalName} not implemented`);
    }
  };

  const isOpen = () => {
    switch (modalName) {
      case "TokenSelector":
      case "NetworkSelector":
        return displayTokenNetworkSelector;
      case "Activity":
        return displayTransactions;
      case "Settings":
        return false; // TODO: Implement settings modal state
      case "RecipientAddress":
        return false; // TODO: Implement recipient address modal state
      case "Wallet":
        return walletDrawer;
      default:
        return false;
    }
  };

  return {
    open,
    close,
    isOpen: isOpen(),
  };
}; 