export default function HelpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white border-none p-10 rounded-xl shadow-xl max-w-2xl w-full">
        <h1 className="text-3xl font-bold mb-4">Help & Support</h1>
        <ul className="text-left text-gray-700 space-y-3">
          <li><b>How to register?</b> Go to Brands and click Register Brand.</li>
          <li><b>How to bid?</b> Go to Auctions, select a car, and place your bid.</li>
          <li><b>How to contact support?</b> Use the Contact Us page or email support@zero.com.</li>
          <li><b>More questions?</b> See our <a href="/faq" className="text-[#00296b] underline">FAQ</a>.</li>
        </ul>
      </div>
    </div>
  )
} 