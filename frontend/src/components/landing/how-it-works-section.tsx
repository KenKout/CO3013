import Link from "next/link"

export function HowItWorksSection() {
  const steps = [
    { number: "1.", text: "Select an available classroom" },
    { number: "2.", text: "Choose a time slot" },
    { number: "3.", text: "Confirm and receive notification" }
  ]

  return (
    <section className="py-20 text-center bg-muted/30">
      <div className="container max-w-[1100px] mx-auto px-5">
        <h2 
          className="text-3xl md:text-4xl lg:text-5xl font-bold mb-14 text-foreground"
          style={{ fontFamily: 'var(--font-heading, Orbitron, sans-serif)' }}
        >
          How it work?
        </h2>
        
        {/* Steps */}
        <div className="flex flex-col md:flex-row justify-between items-start mb-14 gap-8 md:gap-0">
          {steps.map((step, index) => (
            <div 
              key={index}
              className="flex flex-col items-center w-full md:w-[30%]"
            >
              <span 
                className="text-5xl md:text-6xl font-bold text-foreground leading-none mb-5"
                style={{ fontFamily: 'var(--font-heading, Orbitron, sans-serif)' }}
              >
                {step.number}
              </span>
              <p className="text-base md:text-lg text-foreground">
                {step.text}
              </p>
            </div>
          ))}
        </div>
        
        <Link 
          href="/spaces"
          className="inline-block px-7 py-3 rounded-lg font-bold transition-all duration-300 bg-foreground text-background border-2 border-foreground hover:bg-background hover:text-foreground text-base"
        >
          Get started now!
        </Link>
      </div>
    </section>
  )
}