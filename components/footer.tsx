import Link from 'next/link'

const footer = () => {
    return (
        <footer className="w-full bg-canvas-medium border-t border-t-canvas-dark">
            <div className="max-container flex flex-col md:flex-row items-start md:items-center justify-between py-[6rem] md:py-[8rem] lg:py-[10rem] gap-[3rem] md:gap-0">
                <div className="flex flex-col gap-[1.5rem] md:gap-[2rem] w-full md:w-auto">
                    <div>
                        <h1 className="tracking-[-0.25rem] text-[3.6rem] md:text-[5rem] lg:text-[7rem] font-extrabold uppercase leading-[1]">
                            Ankit Bhagat
                        </h1>
                        <p className="uppercase text-base md:text-xl">
                            Kolkata - IIT Patna
                        </p>
                    </div>

                    <p className="uppercase mono opacity-75 tracking-wider text-base md:text-lg">
                        © 2026 Ankit Bhagat. Built without AI.
                    </p>
                </div>
                <div className="flex flex-row md:flex-col gap-[1.2rem] items-start md:items-end w-full md:w-auto">
                    <Link
                        href="https://github.com/annonymousbanda"
                        target="_blank"
                        className="w-fit"
                    >
                        <h3 className="uppercase font-extrabold text-[1.2rem] md:text-[1.4rem] lg:text-[1.6rem]">
                            github
                        </h3>
                    </Link>
                    <Link
                        href="https://leetcode.com/annonymousbanda"
                        target="_blank"
                        className="w-fit"
                    >
                        <h3 className="uppercase font-extrabold text-[1.2rem] md:text-[1.4rem] lg:text-[1.6rem]">
                            leetcode
                        </h3>
                    </Link>
                    <Link
                        href="https://www.linkedin.com/in/ankit-bhagat-4836aa2a7/"
                        target="_blank"
                        className="w-fit"
                    >
                        <h3 className="uppercase font-extrabold text-[1.2rem] md:text-[1.4rem] lg:text-[1.6rem]">
                            linkedin
                        </h3>
                    </Link>
                    <Link
                        href="mailto:annonymous007banda@gmail.com"
                        target="_blank"
                        className="w-fit"
                    >
                        <h3 className="uppercase font-extrabold text-[1.2rem] md:text-[1.4rem] lg:text-[1.6rem]">
                            email
                        </h3>
                    </Link>
                </div>
            </div>
        </footer>
    )
}

export default footer
