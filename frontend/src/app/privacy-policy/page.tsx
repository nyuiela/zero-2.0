export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white border-none p-10 rounded-xl shadow-xl max-w-2xl w-full">
        <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
        <p className="text-gray-600 mb-4">We value your privacy. This policy explains how ZERO collects, uses, and protects your information.</p>
        <h2 className="text-xl font-semibold mt-6 mb-2">Information We Collect</h2>
        <ul className="text-gray-700 mb-4 list-disc list-inside">
          <li>Wallet addresses and transaction data</li>
          <li>Email addresses (if you subscribe or contact us)</li>
          <li>Usage data (for improving our platform)</li>
        </ul>
        <h2 className="text-xl font-semibold mt-6 mb-2">How We Use Your Information</h2>
        <ul className="text-gray-700 mb-4 list-disc list-inside">
          <li>To provide and improve our services</li>
          <li>To communicate with you</li>
          <li>To ensure security and prevent fraud</li>
        </ul>
        <h2 className="text-xl font-semibold mt-6 mb-2">Your Rights</h2>
        <ul className="text-gray-700 mb-4 list-disc list-inside">
          <li>You can request deletion of your data at any time</li>
          <li>We do not sell your data to third parties</li>
        </ul>
        <p className="text-gray-600">For questions, contact <a href="mailto:privacy@zero.com" className="text-[#00296b] underline">privacy@zero.com</a>.</p>
      </div>
    </div>
  )
} 