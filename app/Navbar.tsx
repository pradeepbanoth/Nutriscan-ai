export default function Navbar() {
  return (
    <nav className="bg-white border-b border-orange-100">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-orange-500 flex items-center justify-center">
            <span className="text-white font-black">P</span>
          </div>

          <h1 className="text-xl font-black">
            PAUSTICA
            <span className="text-orange-500">AI</span>
          </h1>
        </div>

        <div className="flex items-center gap-6">
          <a href="#" className="text-gray-500 hover:text-black">
            Features
          </a>

          <a href="#" className="text-gray-500 hover:text-black">
            Pricing
          </a>

          <a
            href="/scan"
            className="bg-orange-500 text-white px-5 py-2 rounded-full"
          >
            Get Started
          </a>
        </div>

      </div>
    </nav>
  );
}