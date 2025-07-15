'use client'
import React from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import Link from 'next/link';
import { UserButton } from '@civic/auth-web3/react';
import { useRouter } from 'next/navigation';


type InfoBoxType = 'green' | 'blue' | 'yellow' | 'red';


interface InfoBoxProps {
  type: InfoBoxType;
  children: React.ReactNode;
}

interface InfoBox {
  type: InfoBoxType;
  content: React.ReactNode;
}

interface ButtonConfig {
  text: string;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  variant?: string;
  isLink?: boolean;
}

interface AuthStepContentProps {
  inputPlaceholder?: string;
  inputValue?: string;
  onInputChange?: (value: string) => void;
  inputId?: string;  
  infoBoxes?: Array<{ type: InfoBoxType; content: React.ReactNode }>;  
  primaryButton?: {
    text: string;
    onClick: () => void;
    disabled?: boolean;
    className?: string;
  };
  secondaryButton?: {
    text: string;
    onClick: () => void;
    isLink?: boolean;
    variant?: string;
  };
  error?: string;
  civicButtonProps?: React.ComponentProps<typeof Button>;
  civicUserButton?: React.ReactNode; // New prop for Civic UserButton
}

const InfoBox: React.FC<InfoBoxProps> = ({ type, children }) => {
  const styles: Record<InfoBoxType, string> = {
    green: "bg-green-50 border border-green-200 text-green-800",
    blue: "bg-blue-50 border border-blue-200 text-blue-800",
    yellow: "bg-yellow-50 border border-yellow-200 text-yellow-800",
    red: "bg-red-50 border border-red-200 text-red-800"
  };

  return (
    <div className={`${styles[type]} rounded-lg p-3`}>
      {children}
    </div>
  );
};


const AuthStepContent: React.FC<AuthStepContentProps> = ({
    inputPlaceholder,
    inputValue,
    onInputChange,
    inputId,  
    infoBoxes = [],
    primaryButton,
    secondaryButton,  
    error,
    civicButtonProps,
    civicUserButton
  }) => {
    const router = useRouter();

    const handleConnectWallet = () => {
      // Placeholder for actual wallet connection logic
      console.log("Connecting wallet...");
      // After successful connection, you might want to close the modal
      // setOpen(false); 
      // router.push('/dashboard'); // Example navigation
    };

    const handleCancel = () => {
      // Placeholder for cancel logic
      console.log("Cancelling...");
      // setOpen(false); // Assuming setOpen is available in the parent component
    };

    return (
      <div className="space-y-4">
        {/* Input field */}
        {inputPlaceholder && (
          <Input
            id={inputId}
            placeholder={inputPlaceholder}
            value={inputValue}
            onChange={(e) => onInputChange?.(e.target.value)}
            className="border-[#00296b] text-[#202626] focus:ring-[#00296b] focus:border-[#00296b] rounded-sm"
          />
        )}
        {/* Info boxes */}
        {infoBoxes.map((box, index) => (
          <InfoBox key={index} type={box.type}>
            {box.content}
          </InfoBox>
        ))}
  
        {/* Error message */}
        {error && <p className="text-red-500 text-sm">{error}</p>}
  
        {/* Primary button */}
        {primaryButton && (
          <Button
            onClick={primaryButton.onClick}
            disabled={primaryButton.disabled}
            className={`w-full ${primaryButton.className} py-6 rounded-sm`}
          >
            {primaryButton.text}
          </Button>
        )}

        {/* Divider and Civic Auth Button */}
        <div className="flex items-center my-2 mb-6">
          <div className="flex-grow border-t border-gray-300" />
          <span className="mx-2 text-xs text-gray-500">or</span>
          <div className="flex-grow border-t border-gray-300" />
        </div>
        {/* Render Civic UserButton if provided, else fallback to old button */}
        {civicUserButton ? (
          civicUserButton
        ) : civicButtonProps && (
          <Button variant={"default"} {...civicButtonProps} className="w-full py-6 rounded-sm text-white bg-[#00296b] hover:bg-[#00296b]/95 text-md font-semibold cursor-pointer mt-2"><Link href="/login">Sign in with Civic</Link></Button>
        )}
  
        {/* Secondary button */}
        {secondaryButton && (
          <Button
            onClick={secondaryButton.onClick}
            variant={secondaryButton.variant as any}
            className="w-full py-2 rounded-sm mt-2"
            asChild={secondaryButton.isLink}
          >
            {secondaryButton.text}
          </Button>
        )}
      </div>
    );
  };
  
  export default AuthStepContent;