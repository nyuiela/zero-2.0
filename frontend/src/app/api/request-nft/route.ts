import { NextResponse } from 'next/server';

// List of available profile NFT images
const nftImages = [
  '/cars/1.png',
  '/cars/2.png',
  '/cars/3.png',
  '/cars/4.png',
  '/cars/5.png',
  '/cars/6.png',
  '/cars/7.png',
  '/cars/8.png',
];

export async function GET() {
  // Pick a random image
  const image = nftImages[Math.floor(Math.random() * nftImages.length)];
  return NextResponse.json({ image });
} 