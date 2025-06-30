export default function PressPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white border-none p-10 rounded-xl shadow-xl max-w-2xl w-full text-center">
        <h1 className="text-3xl font-bold mb-4">Press & Media</h1>
        <p className="text-gray-600 mb-4">ZERO is revolutionizing car auctions with blockchain technology. We're open to interviews, features, and partnerships. For press inquiries, please contact <a href="mailto:press@zero.com" className="text-[#00296b] underline">press@zero.com</a>.</p>
        <h2 className="text-xl font-semibold mt-8 mb-2">Company Highlights</h2>
        <ul className="text-gray-700 mb-4 list-disc list-inside text-left">
          <li>First decentralized car auction platform</li>
          <li>Global team of blockchain and automotive experts</li>
          <li>Committed to transparency, security, and user empowerment</li>
        </ul>
        <p className="text-gray-600">For more information, visit our <a href="/about-us" className="text-[#00296b] underline">About</a> page or contact us directly.</p>
      </div>
    </div>
  )
} 