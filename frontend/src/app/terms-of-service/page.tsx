export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white border-none p-10 rounded-xl shadow-xl max-w-2xl w-full">
        <h1 className="text-3xl font-bold mb-4">Terms of Service</h1>
        <p className="text-gray-600 mb-6">Welcome to ZERO. By using our platform, you agree to the following terms. Please read them carefully.</p>
        <h2 className="text-xl font-semibold mt-6 mb-2">1. Introduction</h2>
        <p className="text-gray-700 mb-4">ZERO is a decentralized car auction platform. These terms govern your use of our website and services.</p>
        <h2 className="text-xl font-semibold mt-6 mb-2">2. User Responsibilities</h2>
        <ul className="text-gray-700 mb-4 list-disc list-inside">
          <li>You must be at least 18 years old to use ZERO.</li>
          <li>You are responsible for your wallet and account security.</li>
          <li>All information you provide must be accurate and up to date.</li>
        </ul>
        <h2 className="text-xl font-semibold mt-6 mb-2">3. Account and Eligibility</h2>
        <ul className="text-gray-700 mb-4 list-disc list-inside">
          <li>Wallet-based authentication is required to participate in auctions.</li>
          <li>ZERO reserves the right to suspend or terminate accounts for violations.</li>
        </ul>
        <h2 className="text-xl font-semibold mt-6 mb-2">4. Auction Rules</h2>
        <ul className="text-gray-700 mb-4 list-disc list-inside">
          <li>All bids are binding. Do not bid unless you intend to purchase.</li>
          <li>ZERO is not responsible for disputes between buyers and sellers.</li>
          <li>ZERO may remove listings that violate our policies.</li>
        </ul>
        <h2 className="text-xl font-semibold mt-6 mb-2">5. Intellectual Property</h2>
        <p className="text-gray-700 mb-4">All content, trademarks, and data on ZERO are the property of ZERO or its licensors. You may not use our content without permission.</p>
        <h2 className="text-xl font-semibold mt-6 mb-2">6. Limitation of Liability</h2>
        <p className="text-gray-700 mb-4">ZERO is provided "as is" without warranties. We are not liable for any damages or losses resulting from your use of the platform.</p>
        <h2 className="text-xl font-semibold mt-6 mb-2">7. Governing Law</h2>
        <p className="text-gray-700 mb-4">These terms are governed by the laws of the State of California, USA.</p>
        <h2 className="text-xl font-semibold mt-6 mb-2">8. Contact</h2>
        <p className="text-gray-700 mb-2">For questions about these terms, contact <a href="mailto:legal@zero.com" className="text-[#00296b] underline">legal@zero.com</a>.</p>
      </div>
    </div>
  )
} 