import React from 'react'
import Link from 'next/link'

const navbar = (): React.JSX.Element => {
    return (
        <nav className="w-screen fixed top-0 left-0 z-1000 border-b border-b-canvas-dark bg-canvas-light">
            <div className="max-container py-[1rem] flex-center justify-between!">
                <div className="flex flex-col gap-0 select-none">
                    <h3 className="font-black tracking-[-0.18rem] uppercase text-[2rem] leading-[1.6rem]">
                        Ankit
                    </h3>
                    <h3 className="font-black tracking-[-0.18rem] uppercase text-[2rem] leading-[1.6rem]">
                        Bhagat
                    </h3>
                </div>

                <div className="flex-center gap-[1rem]">
                    <p className="uppercase tracking-[2.8px] font-normal scale-75">
                        {'// work'}
                    </p>
                    <span
                        aria-hidden="true"
                        className="h-[4.5rem] w-px shrink-0 bg-ink-dark"
                    />

                    <p className="uppercase tracking-[2.8px] font-normal scale-75">
                        {'// arsenal'}
                    </p>

                    <span
                        aria-hidden="true"
                        className="h-[4.5rem] w-px shrink-0 bg-ink-dark"
                    />

                    <p className="uppercase tracking-[2.8px] font-normal scale-75">
                        {'// stats'}
                    </p>

                    <span
                        aria-hidden="true"
                        className="h-[4.5rem] w-px shrink-0 bg-ink-dark"
                    />

                    <p className="uppercase tracking-[2.8px] font-normal scale-75">
                        {'// comm'}
                    </p>
                </div>

                <button className="relative overflow-hidden group border-2 bg-ink-dark px-[1.7rem] py-[0.7rem] cursor-pointer">
                    <div className="absolute inset-0 border-ink-dark bg-canvas-light origin-center scale-x-0 transition-transform duration-300 ease-out group-hover:scale-x-100" />
                    <Link
                        href={process.env.NEXT_PUBLIC_RESUME_LINK as string}
                        target="_blank"
                        className="relative z-10 block uppercase tracking-[3.2px] text-[1.4rem] font-normal text-ink-light transition-colors duration-300 group-hover:text-canvas-dark"
                    >
                        Resume
                    </Link>
                </button>
            </div>
        </nav>
    )
}

export default navbar
