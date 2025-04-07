export default function Footer() {
  return (
    <footer className="bg-neutral-800 text-white py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between text-sm">
          <div className="mb-3 md:mb-0">
            <p>© {new Date().getFullYear()} Financial Projection & Valuation Tool. All rights reserved.</p>
          </div>
          <div className="flex space-x-4">
            <a href="#" className="text-neutral-300 hover:text-white">Privacy Policy</a>
            <a href="#" className="text-neutral-300 hover:text-white">Terms of Service</a>
            <a href="#" className="text-neutral-300 hover:text-white">Contact Support</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
