export default function Roadmap() {
  const phases = [
    {
      title: "Launch Phase",
      year: "2025",
      items: ["Launch of Innovate (INV) Token", "Web3 Integration", "Metaverse Application", "Self-Exchange"],
    },
    {
      title: "Expansion Phase",
      year: "2025-26",
      items: ["Expansion of Trading Office", "Metaverse Financial Bank", "Gaming Platforms"],
    },
    {
      title: "Evolution Phase",
      year: "2026-27",
      items: ["Introduction of Heroic (HRC) Coin", "International partnerships", "Further app updates"],
    },
  ]

  return (
    <section className="py-20 bg-black">
      <div className="container mx-auto px-4 text-center">
        <h3 className="text-yellow-400 text-2xl font-bold mb-2">OUR</h3>
        <h2 className="text-5xl font-bold mb-16">Roadmap</h2>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-yellow-400 transform -translate-x-1/2"></div>

          <div className="space-y-24 relative">
            {phases.map((phase, index) => (
              <div key={index} className="relative">
                {/* Circle on timeline */}
                <div className="absolute left-1/2 top-0 w-4 h-4 bg-yellow-400 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                  <div className={`text-right ${index % 2 !== 0 ? "md:order-2" : ""}`}>
                    <h3 className="text-2xl font-bold mb-2">{phase.title}</h3>
                    <p className="text-gray-400">{phase.year}</p>
                  </div>

                  <div className={`text-left ${index % 2 !== 0 ? "md:order-1" : ""}`}>
                    <ul className="space-y-2">
                      {phase.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start">
                          <span className="text-yellow-400 mr-2">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
