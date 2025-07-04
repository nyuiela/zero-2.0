import { useInjectedStore } from "../hooks/use-injected-store";

import { ActivityButton } from "./ActivityButton";
import { BuyButton } from "./BuyButton";
import { SettingsButton } from "./SettingsButton";

export const SwapBridgeHeader = () => {
  const app = useInjectedStore((s) => s.app);
  const supportsOnRamp = useInjectedStore((s) => s.supportsOnRamp);

  return (
    <div className="flex items-center justify-between p-4 border-b border-border">
      <div className="flex items-center gap-2">
        {app.icon && (
          <img
            src={app.icon}
            alt={app.name}
            className="w-6 h-6 rounded-full"
          />
        )}
        <h1 className="text-lg font-semibold">{app.name}</h1>
      </div>
      
      <div className="flex items-center gap-2">
        <ActivityButton />
        <SettingsButton />
        {supportsOnRamp && <BuyButton />}
      </div>
    </div>
  );
}; 