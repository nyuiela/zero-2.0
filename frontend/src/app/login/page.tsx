'use client'

import { useState, useEffect } from 'react';
import { useUser, UserButton } from '@civic/auth-web3/react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/authStore';
import { toast } from 'sonner';

export default function LoginPage() {
  const router = useRouter();
  const civicUserContext = useUser();
  const { setCivicUser, setCivicWalletAddress } = useAuthStore();
  const [walletReady, setWalletReady] = useState(false);
  const [walletLoading, setWalletLoading] = useState(false);
  const [signing, setSigning] = useState(false);
  const [signed, setSigned] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle Civic redirect callback
  useEffect(() => {
    // Check if we're returning from Civic redirect
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');
    
    if (code && state) {
      console.log('🔄 Returning from Civic redirect');
      // Civic will handle the callback automatically
    }
  }, []);

  // Handle wallet creation after Civic login
  useEffect(() => {
    async function ensureWallet() {
      if (!civicUserContext.user || civicUserContext.isLoading) {
        return;
      }

      setWalletLoading(true);
      setError(null);
      
      try {
        if (
          (civicUserContext as any).ethereum &&
          typeof (civicUserContext as any).ethereum.address === 'string' &&
          (civicUserContext as any).ethereum.wallet
        ) {
          console.log('✅ Wallet already available');
          setWalletReady(true);
          setCivicWalletAddress((civicUserContext as any).ethereum.address);
        } else if ((civicUserContext as any).createWallet && typeof (civicUserContext as any).createWallet === 'function') {
          console.log('🔄 Creating wallet...');
          await (civicUserContext as any).createWallet();
          
          // Poll for wallet availability
          let tries = 0;
          const maxTries = 10;
          const pollInterval = 300;

          function checkWalletReady() {
            if (
              (civicUserContext as any).ethereum &&
              typeof (civicUserContext as any).ethereum.address === 'string' &&
              (civicUserContext as any).ethereum.wallet
            ) {
              console.log('✅ Wallet ready!');
              setWalletReady(true);
              setCivicWalletAddress((civicUserContext as any).ethereum.address);
            } else if (tries < maxTries) {
              tries++;
              setTimeout(checkWalletReady, pollInterval);
            } else {
              setError('Failed to create Civic embedded wallet.');
            }
            setWalletLoading(false);
          }

          checkWalletReady();
        } else {
          setError('Civic embedded wallet not available.');
          setWalletLoading(false);
        }
      } catch (err: any) {
        setError(err?.message || 'Failed to create Civic embedded wallet.');
        setWalletLoading(false);
      }
    }

    if (civicUserContext.authStatus === 'authenticated' && civicUserContext.user) {
      setCivicUser(civicUserContext.user);
      ensureWallet();
    }
  }, [civicUserContext, setCivicUser, setCivicWalletAddress]);

  const handleSignMessage = async () => {
    setSigning(true);
    setError(null);
    
    try {
      if (
        civicUserContext.user &&
        (civicUserContext as any).ethereum &&
        typeof (civicUserContext as any).ethereum.address === 'string' &&
        (civicUserContext as any).ethereum.wallet
      ) {
        const message = `Sign in to ZERO at ${new Date().toISOString()}`;
        const signature = await (civicUserContext as any).ethereum.wallet.signMessage({
          message,
          account: (civicUserContext as any).ethereum.address,
        });
        
        setSigned(true);
        setCivicUser({ ...civicUserContext.user, signature });
        toast.success('Authentication complete!');
        
        // Redirect to home page after successful sign
        setTimeout(() => {
          router.push('/');
        }, 1500);
      } else {
        setError('Civic embedded wallet not available.');
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to sign message.');
    } finally {
      setSigning(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-200 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 -mt-42 py-24">
        <h1 className="text-2xl font-bold text-center mb-6">Login to ZERO</h1>
        
        {!civicUserContext.user ? (
          <div className="text-center">
            <p className="mb-4 text-gray-600">Sign in with your preferred method</p>
            <div className="space-y-4">
              {/* Civic UserButton for login */}
              <div className="w-full">
                <UserButton className="w-full py-3 px-4 mt-4 rounded-lg hover:bg-blue-700 transition-colors" />
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-center">
              <h2 className="text-lg font-semibold mb-2">Welcome, {civicUserContext.user.name}!</h2>
              <p className="text-sm text-gray-600 mb-4">Complete your authentication</p>
            </div>

            {walletLoading ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <p>Preparing your wallet...</p>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600">{error}</p>
              </div>
            ) : signed ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-600">✅ Message signed successfully!</p>
                <p className="text-sm text-green-600 mt-1">Redirecting to home page...</p>
              </div>
            ) : walletReady ? (
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-600">
                    <strong>Wallet Address:</strong> {(civicUserContext as any).ethereum?.address}
                  </p>
                </div>
                <button
                  onClick={handleSignMessage}
                  disabled={signing}
                  className="w-full py-3 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                >
                  {signing ? 'Signing...' : 'Sign Message & Complete Login'}
                </button>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-600">Setting up your wallet...</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 