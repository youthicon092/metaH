export default function NumbersSection() {
  return (
    <section className="py-20 bg-black">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-5xl font-bold mb-16">
          <span className="text-yellow-400">NUMBERS</span>
          <br />
          FOR META HEROIC
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gray-900/50 p-8 rounded-lg">
            <p className="text-yellow-400 text-7xl font-bold mb-4">88%</p>
            <p className="text-gray-400">average annual return</p>
          </div>

          <div className="bg-gray-900/50 p-8 rounded-lg">
            <p className="text-yellow-400 text-7xl font-bold mb-4">33</p>
            <p className="text-gray-400">years of historical data</p>
          </div>

          <div className="bg-gray-900/50 p-8 rounded-lg">
            <p className="text-yellow-400 text-7xl font-bold mb-4">15k</p>
            <p className="text-gray-400">assets monitored daily</p>
          </div>
        </div>
      </div>
    </section>
  )
}
