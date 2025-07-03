export default function RoiStructure() {
  const levels = [
    { level: "L1", stake: "SELF STAKE 10$", roi: "12%" },
    { level: "L2", stake: "SELF STAKE 20$ & 5 REFERS", roi: "8%" },
    { level: "L3-4", stake: "SELF STAKE 50$ & 15 REFERS", roi: "6-4%" },
    { level: "L5-6", stake: "SELF STAKE 80$ & 25 REFERS", roi: "3%" },
    { level: "L7-8", stake: "SELF STAKE 100$ & 50 REFERS", roi: "2%" },
    { level: "L9-14", stake: "SELF STAKE 150$ & 75 REFERS", roi: "1%" },
    { level: "L15-20", stake: "SELF STAKE 200$ & 100 REFERS", roi: "0.5%" },
  ]

  return (
    <section className="py-20 bg-black">
      <div className="container mx-auto px-4">
        <h3 className="text-center text-yellow-400 text-2xl font-bold mb-2">DAILY ROI</h3>
        <h2 className="text-center text-5xl font-bold mb-12">META HEROIC</h2>
        <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto">
          Earn up to 12% ROI from referrals through our innovative multi-level structure
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-gray-900/50 rounded-lg border border-gray-800 p-6">
            <h3 className="text-xl font-bold mb-6">ROI Structure</h3>
            <div className="space-y-4">
              <div className="p-2 border-b border-gray-800 flex justify-between">
                <p className="text-yellow-400">L1</p>
                <p className="text-white font-bold">12%</p>
              </div>
              <div className="p-2 border-b border-gray-800 flex justify-between">
                <p className="text-yellow-400">L2</p>
                <p className="text-white font-bold">8%</p>
              </div>
              <div className="p-2 border-b border-gray-800 flex justify-between">
                <p className="text-yellow-400">L3</p>
                <p className="text-white font-bold">6%</p>
              </div>
              <div className="p-2 border-b border-gray-800 flex justify-between">
                <p className="text-yellow-400">L4</p>
                <p className="text-white font-bold">4%</p>
              </div>
              <div className="p-2 border-b border-gray-800 flex justify-between">
                <p className="text-yellow-400">L5-6</p>
                <p className="text-white font-bold">3%</p>
              </div>
              <div className="p-2 border-b border-gray-800 flex justify-between">
                <p className="text-yellow-400">L7-8</p>
                <p className="text-white font-bold">2%</p>
              </div>
              <div className="p-2 border-b border-gray-800 flex justify-between">
                <p className="text-yellow-400">L9-14</p>
                <p className="text-white font-bold">1%</p>
              </div>
              <div className="p-2 flex justify-between">
                <p className="text-yellow-400">L15-20</p>
                <p className="text-white font-bold">0.5%</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-6">Target to Unlock Multi-Levels</h3>
            <div className="space-y-4">
              {levels.map((level, index) => (
                <div key={index} className="bg-yellow-900/70 rounded-lg p-4 flex justify-between items-center">
                  <div>
                    <p className="text-yellow-400 font-bold">{level.level}</p>
                    <p className="text-white text-sm">{level.roi} ROI</p>
                  </div>
                  <p className="text-white">{level.stake}</p>
                </div>
              ))}

              <div className="bg-gray-900/50 rounded-lg p-6 mt-8 flex items-start gap-4">
                <div className="bg-yellow-400 rounded-full p-2 mt-1 flex-shrink-0">
                  <span className="text-black">!</span>
                </div>
                <p className="text-gray-300 text-sm">
                  With our multi-level structure, users can earn up to 12% ROI from referrals. The more you stake and
                  refer, the higher levels you can unlock.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
