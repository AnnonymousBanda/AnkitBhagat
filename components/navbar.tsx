'use client'

import React, { useCallback, useRef } from 'react'
import Link from 'next/link'

const scrollToId = (id: string) => {
    const el = document.getElementById(id)
    if (!el) return
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function ScrambleText({ text }: { text: string }) {
    const containerRef = useRef<HTMLSpanElement | null>(null)
    const rafRef = useRef<number | null>(null)
    const intervalRef = useRef<number | null>(null)
    const timeoutRef = useRef<number | null>(null)

    const startScramble = useCallback(() => {
        if (!containerRef.current) return
        const el = containerRef.current
        const original = (el.dataset.orig ?? text) as string
        el.dataset.orig = original
        const len = original.length
        const duration = 600

        const indices: number[] = []
        for (let i = 0; i < len; i++)
            if (/[A-Za-z0-9]/.test(original[i])) indices.push(i)

        if (indices.length <= 1) return

        const chars = indices.map((i) => original[i])

        const shuffle = (arr: string[]) => {
            const a = arr.slice()
            for (let i = a.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1))
                const tmp = a[i]
                a[i] = a[j]
                a[j] = tmp
            }
            return a
        }

        if (intervalRef.current) window.clearInterval(intervalRef.current)
        if (timeoutRef.current) window.clearTimeout(timeoutRef.current)

        intervalRef.current = window.setInterval(() => {
            const s = shuffle(chars)
            const out = Array.from(original)
            let si = 0
            for (const idx of indices) {
                out[idx] = s[si++]
            }
            el.textContent = out.join('')
        }, 80)

        timeoutRef.current = window.setTimeout(() => {
            if (intervalRef.current) window.clearInterval(intervalRef.current)
            intervalRef.current = null
            el.textContent = original
        }, duration)
    }, [text])

    const stopScramble = useCallback(() => {
        if (!containerRef.current) return
        const el = containerRef.current
        if (rafRef.current) cancelAnimationFrame(rafRef.current)
        if (intervalRef.current) window.clearInterval(intervalRef.current)
        if (timeoutRef.current) window.clearTimeout(timeoutRef.current)
        intervalRef.current = null
        timeoutRef.current = null
        el.textContent = el.dataset.orig ?? text
    }, [text])

    return (
        <span
            ref={containerRef}
            onMouseEnter={startScramble}
            onFocus={startScramble}
            onMouseLeave={stopScramble}
            onBlur={stopScramble}
            data-orig={text}
            className="inline-block transition-colors duration-200 mono whitespace-nowrap"
            style={{ fontFeatureSettings: 'tnum' }}
        >
            {text}
        </span>
    )
}

const NavLink = ({ id, label }: { id: string; label: string }) => {
    return (
        <a
            href={`#${id}`}
            onClick={(e) => {
                e.preventDefault()
                scrollToId(id)
            }}
            className="uppercase tracking-[2.2px] font-normal text-[1.05rem] md:text-[1.3rem] lg:text-[1.5rem] px-1"
        >
            <ScrambleText text={label} />
        </a>
    )
}

const navbar = (): React.JSX.Element => {
    return (
        <nav className="w-screen fixed top-0 left-0 z-50 border-b border-b-canvas-dark bg-canvas-light">
            <div className="max-container py-[0.75rem] md:py-[1rem] flex-center justify-between!">
                <div className="flex flex-col gap-0 md:gap-0 lg:gap-0 select-none">
                    <h3 className="font-black tracking-[-0.12rem] uppercase text-[1.6rem] md:text-[2rem] leading-[1.3rem] md:leading-[1.75rem] lg:leading-[1.75rem]">
                        Ankit
                    </h3>
                    <h3 className="font-black tracking-[-0.12rem] uppercase text-[1.6rem] md:text-[2rem] leading-[1.3rem] md:leading-[1.75rem] lg:leading-[1.75rem]">
                        Bhagat
                    </h3>
                </div>

                <div className="hidden md:flex items-center gap-[1.2rem]">
                    <NavLink id="work" label="// work" />
                    <span
                        aria-hidden
                        className="h-[3.6rem] w-px shrink-0 bg-ink-dark"
                    />
                    <NavLink id="arsenal" label="// arsenal" />
                    <span
                        aria-hidden
                        className="h-[3.6rem] w-px shrink-0 bg-ink-dark"
                    />
                    <NavLink id="comm" label="// comm" />
                </div>

                <div className="md:hidden"></div>

                <button className="relative overflow-hidden group border-2 bg-ink-dark px-[1.2rem] md:px-[1.7rem] py-[0.5rem] md:py-[0.7rem] cursor-pointer">
                    <div className="absolute inset-0 border-ink-dark bg-canvas-light origin-center scale-x-0 transition-transform duration-300 ease-out group-hover:scale-x-100" />
                    <Link
                        href={process.env.NEXT_PUBLIC_RESUME_LINK as string}
                        target="_blank"
                        className="relative z-10 block uppercase tracking-[3.2px] text-[1rem] md:text-[1.4rem] font-normal text-ink-light transition-colors duration-300 group-hover:text-canvas-dark"
                    >
                        Resume
                    </Link>
                </button>
            </div>
        </nav>
    )
}

export default navbar
