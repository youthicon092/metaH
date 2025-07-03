import { Button } from "@/components/ui/button"

export default function TermsSection() {
  return (
    <section className="py-20 bg-black">
      <div className="container mx-auto px-4 text-center">
        <h3 className="text-yellow-400 text-2xl font-bold mb-2">IMPORTANT</h3>
        <h2 className="text-4xl font-bold mb-4">Terms & Conditions</h2>
        <p className="text-gray-400 mb-12">Please read and understand our terms carefully before using our platform</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-gray-900/30 border border-gray-800 rounded-lg p-6">
            <div className="bg-gray-800 p-4 rounded-md w-12 h-12 flex items-center justify-center mx-auto mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="text-yellow-400"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-4">Legal Compliance</h3>
            <p className="text-gray-400 text-sm">
              USERS MUST COMPLY WITH ALL APPLICABLE LAWS & REGULATIONS IN THEIR JURISDICTION.
            </p>
          </div>

          <div className="bg-gray-900/30 border border-gray-800 rounded-lg p-6">
            <div className="bg-gray-800 p-4 rounded-md w-12 h-12 flex items-center justify-center mx-auto mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="text-yellow-400"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="12" y1="1" x2="12" y2="23" />
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-4">Fee Agreement</h3>
            <p className="text-gray-400 text-sm">USERS AGREE TO PAY THESE FEES AS APPLICABLE.</p>
          </div>

          <div className="bg-gray-900/30 border border-gray-800 rounded-lg p-6">
            <div className="bg-gray-800 p-4 rounded-md w-12 h-12 flex items-center justify-center mx-auto mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="text-yellow-400"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-4">Account Security</h3>
            <p className="text-gray-400 text-sm">
              USERS ARE RESPONSIBLE FOR MAINTAINING THE SECURITY & CONFIDENTIALITY OF THEIR ACCOUNT CREDENTIALS.
            </p>
          </div>
        </div>

        <Button className="bg-yellow-400 text-black hover:bg-yellow-500 px-8 py-2 text-lg font-medium">
          Read Full Terms
        </Button>
      </div>
    </section>
  )
}
