import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden px-4 sm:px-6 lg:px-8 py-16 md:py-20 lg:py-24">

      {/* Background Image with Opacity */}
      {/* <img 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
        src= "/medicalBackground.jpg"
      ></img> */}

      <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-white/30"></div>
      <div className="relative mx-auto max-w-7xl z-10">
        <div className="grid items-center gap-8 md:gap-12 lg:grid-cols-2">
          <div className="relative space-y-8 text-center lg:text-left">
            {/* Good Health Logo Text */}
            <div className="flex justify-center lg:justify-start">
              <img 
                className="h-auto max-w-full"
                src="/BlueLogo.png"
                alt="GoodHealth Logo"
              />
            </div>
            {/* Tagline */}
            <div className="space-y-6">
              <p className="mx-auto text-xl font-normal text-foreground sm:text-2xl md:text-3xl lg:mx-0 max-w-lg">
                Apoyo clínico impulsada por inteligencia artificial que acompaña al psicólogo en tiempo real.
              </p>
              
              {/* CTA Buttons */}
              <div className="flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start">
                <Button size="lg" className="bg-secondary text-white hover:bg-secondary/90 min-h-[56px] px-10 rounded-full font-bold text-base">
                  Registrarse
                </Button>
                <Button size="lg" className="bg-secondary text-white hover:bg-secondary/90 min-h-[56px] px-10 rounded-full font-bold text-base">
                  Iniciar sesión
                </Button>
              </div>
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <div className="relative h-64 w-64 sm:h-80 sm:w-80 md:h-96 md:w-96">
              {/* Outer blue ring */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 p-7 shadow-2xl">
                {/* Inner green/teal ring */}
                <div className="h-full w-full rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 p-2">
                  {/* White center circle */}
                  <div className="flex h-full w-full items-center justify-center rounded-full">
                    {/* Brain icon container */}
                    <div className="flex h-full w-full items-center justify-center p-8">
                      <img src="/tinyLogoWhite.png" alt="ChatHub Logo" className="dark:block hidden" />
                      <img src="/tinyLogoWhite.png" alt="ChatHub Logo" className="dark:hidden" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}