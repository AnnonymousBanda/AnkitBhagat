import Image from 'next/image'

const Hero = () => {
    return (
        <section className="min-h-screen w-full bg-canvas-medium">
            <div className="max-container flex items-center justify-center py-[10rem]">
                <h1 className="font-bold leading-[0.85] text-justify uppercase break-words px-[10rem]">
                    <Image
                        src="/assets/Ankit Bhagat.png"
                        alt="Ankit Bhagat"
                        width={400}
                        height={600}
                        className="float-left mr-8 mb-4 pointer-events-none"
                        style={{
                            shapeOutside: 'url("/assets/Ankit Bhagat.png")',
                            shapeMargin: '1.5rem',
                        }}
                    />
                    ANKIT HERE. RAISED IN KOLKATA. LEVELING UP AT IIT PATNA.
                    I&apos;VE BEEN WRITING CODE SINCE I WAS A KID IN 2016. I
                    REFUSE TO PICK JUST ONE SIDE. ML, APP DEV, GAME DEV,
                    WEB—I&apos;VE DONE IT ALL AND I&apos;M READY FOR MORE. I
                    BUILD DIGITAL EXPERIENCES THAT ARE TOO LOUD TO IGNORE. IF
                    YOU&apos;RE TIRED OF BASIC SITES, YOU&apos;RE IN THE RIGHT
                    PLACE. SCROLL DOWN TO WITNESS THE EVOLUTION.
                </h1>
            </div>
        </section>
    )
}

export default Hero
