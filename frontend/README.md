# ZERO: Decentralized Car Auction Platform

## Inspiration

The inspiration for ZERO came from the need to bring transparency, trust, and global accessibility to the car auction industry. Traditional car auctions are often opaque, centralized, and limited by geography. By leveraging blockchain technology, we envisioned a platform where anyone, anywhere, can buy, sell, or bid on vehicles with full confidence in the process and data integrity.

## What it does

ZERO is a decentralized car auction platform that allows users to:
- Register car brands and list vehicles for auction
- Browse and filter live auctions
- View detailed car and auction information
- Place bids using their crypto wallet (wallet-based authentication)
- Manage their profile and withdraw earnings
- Experience a seamless, global, and trustless auction process

## How we built it

- **Frontend:** Built with Next.js (App Router), TypeScript, and Tailwind CSS for a modern, responsive, and accessible UI.
- **State Management:** Utilized Zustand for global state (auth, user, auctions).
- **Blockchain Integration:** Used wagmi and ethers.js to connect to Ethereum-compatible networks (Base Sepolia testnet), interact with smart contracts, and handle wallet authentication.
- **API Layer:** Implemented Next.js API routes as proxies to securely communicate with backend services and smart contracts.
- **Sample Data:** Included rich mock data for cars, brands, and auctions to enable rapid prototyping and testing.
- **Componentization:** Modular UI components for cards, forms, dialogs, and navigation, ensuring reusability and scalability.
- **Design:** Consistent blue/white color palette, text-based logo, and a clean, user-friendly layout.
- **AI-Powered Rebuild:** The project was rebuilt and documented using **Bolt AI**, which enabled rapid, accurate, and detailed code and documentation generation.

## Challenges we ran into

- Integrating wallet-based authentication and ensuring a smooth user experience for both crypto-native and new users.
- Designing proxy API routes that securely and efficiently forward requests to backend services while handling authentication tokens.
- Managing complex auction and bidding flows, including real-time updates and error handling.
- Ensuring accessibility and responsiveness across all devices and browsers.
- Maintaining a clean, scalable codebase with clear separation of concerns.

## Accomplishments that we're proud of

- Seamless wallet-based authentication and onboarding flow
- Fully decentralized auction process with transparent smart contract integration
- Intuitive, modern UI/UX with a focus on accessibility
- Comprehensive sample data and documentation for rapid prototyping
- Successfully leveraging **Bolt AI** to accelerate development and documentation

## What we learned

- The importance of clear, modular component design for scalability
- Best practices for integrating blockchain and wallet authentication in modern web apps
- How to design robust API proxy layers for secure frontend-backend communication
- The value of detailed documentation and sample data for onboarding and collaboration
- The power of AI tools like **Bolt AI** in accelerating and improving the software development lifecycle

## What's next for ZERO

- Expand support for more cryptocurrencies and networks
- Add real-time auction updates and notifications
- Implement advanced search and filtering for auctions
- Launch a mobile-first PWA version
- Integrate user reputation and review systems
- Open source the smart contracts and backend for community contributions
- Continue leveraging AI tools to enhance development, testing, and user support

---

> **This project was rebuilt and documented with the help of Bolt AI, ensuring accuracy, speed, and best practices throughout the codebase and documentation.**
