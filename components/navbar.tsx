import React from 'react'
import Link from 'next/link'

const navbar = (): React.JSX.Element => {
    return (
        <nav className="w-screen fixed top-0 left-0 z-1000 border-b border-b-canvas-dark bg-canvas-light">
            <div className="max-container py-[1rem] flex-center justify-between!">
                <h3 className="font-display font-black tracking-[-0.12rem] uppercase text-[2.4rem]">
                    Ankit Bhagat - SE
                </h3>

                <div className="flex-center gap-[2rem]">
                    <p className="uppercase tracking-[2.8px] font-normal">
                        {'// work'}
                    </p>
                    <span
                        aria-hidden="true"
                        className="h-[4.5rem] w-px shrink-0 bg-ink-dark"
                    />

                    <p className="uppercase tracking-[2.8px] font-normal">
                        {'// arsenal'}
                    </p>

                    <span
                        aria-hidden="true"
                        className="h-[4.5rem] w-px shrink-0 bg-ink-dark"
                    />

                    <p className="uppercase tracking-[2.8px] font-normal">
                        {'// stats'}
                    </p>

                    <span
                        aria-hidden="true"
                        className="h-[4.5rem] w-px shrink-0 bg-ink-dark"
                    />

                    <p className="uppercase tracking-[2.8px] font-normal">
                        {'// comm'}
                    </p>
                </div>

                <button className="relative overflow-hidden group border-2 bg-ink-dark px-[1.5rem] py-[0.5rem] cursor-pointer">
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
