import Link from 'next/link'

const footer = () => {
    return (
        <footer className="w-full bg-canvas-medium border-t border-t-canvas-dark">
            <div className="max-container flex flex-row items-center justify-between py-[10rem]">
                <div className="flex flex-col gap-[2rem]">
                    <div>
                        <h1 className="tracking-[-0.25rem] text-[6rem] font-extrabold uppercase leading-[1]">
                            Ankit Bhagat
                        </h1>
                        <p className="uppercase">Kolkata - IIT Patna</p>
                    </div>

                    <p className="uppercase font-mono opacity-75 tracking-wider">
                        © 2026 Ankit Bhagat. Built without AI.
                    </p>
                </div>
                <div className="flex flex-col gap-[1rem] items-end">
                    <Link
                        href="https://github.com/annonymousbanda"
                        target="_blank"
                        className="w-fit"
                    >
                        <h3 className="uppercase font-extrabold">github</h3>
                    </Link>
                    <Link
                        href="https://leetcode.com/annonymousbanda"
                        target="_blank"
                        className="w-fit"
                    >
                        <h3 className="uppercase font-extrabold">leetcode</h3>
                    </Link>
                    <Link
                        href="https://www.linkedin.com/in/ankit-bhagat-4836aa2a7/"
                        target="_blank"
                        className="w-fit"
                    >
                        <h3 className="uppercase font-extrabold">linkedin</h3>
                    </Link>
                    <Link
                        href="mailto:annonymous007banda@gmail.com"
                        target="_blank"
                        className="w-fit"
                    >
                        <h3 className="uppercase font-extrabold">email</h3>
                    </Link>
                </div>
            </div>
        </footer>
    )
}

export default footer
