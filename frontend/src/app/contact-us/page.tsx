export default function ContactUsPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white border-none rounded-xl shadow-xl flex max-w-3xl w-full overflow-hidden">
        {/* Left: Car image and details */}
        <div className="hidden md:flex flex-col justify-center items-center bg-[#00296b] text-white p-8 w-1/2">
          <img src="/public/story1.jpg" alt="Car" className="w-full h-48 object-cover rounded mb-6" />
          <div className="space-y-2">
            <div><b>Email:</b> support@zero.com</div>
            <div><b>Phone:</b> +1 323-407-8523</div>
            <div><b>Location:</b> 1234 Blockchain Ave, Los Angeles, CA</div>
          </div>
        </div>
        {/* Right: Contact form */}
        <div className="flex-1 p-8">
          <h1 className="text-3xl font-bold mb-6">Contact Us</h1>
          <form className="space-y-4">
            <div>
              <label className="block font-semibold mb-1">Name</label>
              <input className="w-full border border-gray-300 rounded px-3 py-2" placeholder="Your Name" />
            </div>
            <div>
              <label className="block font-semibold mb-1">Email</label>
              <input className="w-full border border-gray-300 rounded px-3 py-2" placeholder="Your Email" />
            </div>
            <div>
              <label className="block font-semibold mb-1">Message</label>
              <textarea className="w-full border border-gray-300 rounded px-3 py-2" rows={4} placeholder="Your Message" />
            </div>
            <button type="submit" className="bg-[#00296b] text-white px-6 py-2 rounded">Send</button>
          </form>
        </div>
      </div>
    </div>
  )
} 