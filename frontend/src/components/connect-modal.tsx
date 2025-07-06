import React from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import Link from 'next/link';


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
  infoBoxes?: InfoBox[];  
  primaryButton?: ButtonConfig;
  secondaryButton?: ButtonConfig;
  error?: string;
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
    error
  }) => {
    return (
      <div className="space-y-4">
        {/* Input field */}
        {inputPlaceholder && (
          <Input
            id={inputId}
            placeholder={inputPlaceholder}
            value={inputValue}
            onChange={(e) => onInputChange?.(e.target.value)}
            className="border-[#00296b] text-[#202626] focus:ring-[#00296b] focus:border-[#00296b] rounded-md"
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
            className={`w-full ${primaryButton.className} py-6`}
          >
            {primaryButton.text}
          </Button>
        )}
  
        {/* Secondary button */}
        {secondaryButton && (
          <>
            {secondaryButton.isLink ? (
              <div className="text-center -mt-4">
                <Link
                  onClick={secondaryButton.onClick}
                  className="w-full text-[12px] text-center text-gray-600 hover:bg-gray-50 border-none hover:text-gray-600 py-1 bg-transparent shadow-none underline"
                  href=""
                >
                  {secondaryButton.text}
                </Link>
              </div>
            ) : (
              <Button
                onClick={secondaryButton.onClick}
                variant={"default"}
                className={`w-full ${secondaryButton.className || "border-gray-300 text-gray-600 hover:bg-gray-50"} py-2`}
              >
                {secondaryButton.text}
              </Button>
            )}
          </>
        )}
      </div>
    );
  };
  
  export default AuthStepContent;