import clsx from "clsx";

import { useAddressProfile } from "../hooks/use-address-profile";
import { useFromChain, useToChain } from "../hooks/use-chain";
import { useModal } from "../hooks/use-modal";
import { useRecipient, useSender } from "../hooks/use-recipient";
import { isAddressEqual } from "../utils/is-address-equal";

import { IconWallet } from "./icons/IconWallet";

export const Recipient = () => {
  const sender = useSender();
  const recipient = useRecipient();
  const from = useFromChain();
  const to = useToChain();
  const recipientAddressModal = useModal("RecipientAddress");

  const recipientProfile = useAddressProfile(to, recipient);

  return (
    <div
      className="flex items-center justify-between shrink-0"
      onClick={!sender ? () => {} : () => recipientAddressModal.open()}
    >
      {!sender ? (
        <span className={"text-xs text-muted-foreground"}>{/* empty */}</span>
      ) : (
        <div
          className={clsx(
            `h-5 flex justify-center items-center gap-1 px-2 py-1 mr-0.5 rounded-full cursor-pointer hover:scale-105 transition-all bg-card`,
            recipient &&
              !isAddressEqual(from, sender, to, `0x${recipient}`) &&
              "bg-card text-foreground"
          )}
        >
          {recipient && !isAddressEqual(from, sender, to, `0x${recipient}`) ? (
            <>
              <span className="text-[10px] font-button leading-none">
                {recipientProfile.data?.name
                  ? recipientProfile.data?.name
                  : `${recipient.slice(0, 4)}...${recipient.slice(
                      recipient.length - 4
                    )}`}
              </span>
              <IconWallet className="w-3 h-3 fill-foreground" />
            </>
          ) : (
            <IconWallet className="w-3 h-3 fill-muted-foreground" />
          )}
        </div>
      )}
    </div>
  );
}; 