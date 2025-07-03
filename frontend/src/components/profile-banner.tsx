import Image from 'next/image';
import React from 'react';

interface ProfileBannerProps {
  image: string | null;
  height?: string; // e.g., 'h-32', 'h-20'
}

export function ProfileBanner({ image, height = 'h-32' }: ProfileBannerProps) {
  return (
    <div className={`w-full max-w-xl ${height} rounded-xl overflow-hidden border-4 border-yellow-400 shadow-lg bg-white flex items-center justify-center relative`}>
      {image ? (
        <Image
          src={image}
          alt="Profile NFT"
          fill
          className="object-cover w-full h-full"
          priority
        />
      ) : (
        <span className="w-full text-3xl font-bold text-shadow-indigo-50 text-[#00296b] flex items-center justify-center h-full">ZE | RO</span>
      )}
    </div>
  );
}

export default ProfileBanner; 