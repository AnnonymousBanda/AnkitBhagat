'use client'

import React, { useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const work = (): React.JSX.Element => {
    const sectionRef = useRef<HTMLElement>(null)
    const headerRef = useRef<HTMLDivElement>(null)
    const shadowRef = useRef<HTMLImageElement>(null)
    const headerDescRef = useRef<HTMLParagraphElement>(null)

    gsap.registerPlugin(ScrollTrigger)

    useEffect(() => {
        const getResponsiveY = () => {
            const width = window.innerWidth
            if (width < 400) return -175
            if (width < 768) return -260
            return -350
        }

        const tl = gsap.timeline({
            defaults: {
                ease: 'elastic.out(1,0.4)',
            },
            scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top 40%',
                toggleActions: 'play none none none',
                // markers: true,
            },
        })

        tl.from(headerRef.current, {
            duration: 2.5,
            y: getResponsiveY(),
        })
        tl.from(
            shadowRef.current,
            {
                duration: 2.5,
                width: 0,
            },
            '-=2.5',
        )
        tl.from(
            headerDescRef.current,
            {
                duration: 0.8,
                y: -50,
                opacity: 0,
                ease: 'back,in',
            },
            '-=1.5',
        )
    }, [])

    interface ProjectProps {
        year: string
        role: string
        title: string
        description: string[]
        techStack: string[]
        liveLink?: string
        githubLink?: string
        imageSrc: string
        reverse?: boolean
    }

    const projectsData: ProjectProps[] = [
        {
            title: 'IIT Patna Official Website',
            year: '2025',
            role: 'Lead Developer',
            description: [
                'Legacy infrastructure overhaul. Scaled for 10,000+ active users',
                'Containerized routing system. Zero-downtime deployment architecture',
                'Centralized data lakes into high-performance Next.js portal',
            ],
            techStack: [
                'Next.js',
                'GSAP',
                'ExpressJS',
                'MySQL',
                'Redis',
                'Docker',
                'NGINX',
            ],
            liveLink: 'https://iitp.ac.in',
            githubLink: '',
            imageSrc: '/assets/works/iitp.png',
        },
        {
            title: 'ATTRACK',
            year: '2025',
            role: 'FULL-STACK MOBILE DEVELOPER',
            description: [
                'Real-time attendance analytics',
                'Live Google Sheets schedule syncing for IIT Patna Students',
                'Microsoft & Google secure auth integration',
            ],
            techStack: [
                'React Native',
                'Expo',
                'ExpressJS',
                'MySQL',
                'Redis',
                'Prisma',
                'Docker',
                'NGINX',
            ],
            liveLink: 'https://atttrack.online',
            githubLink: 'https://github.com/annonymousbanda/atttrack',
            imageSrc: '/assets/works/atttrack.png',
        },
        {
            title: 'SHRINKIT',
            year: '2024',
            role: 'PYTHON DEVELOPER',
            description: [
                'Headless Telegram bot pipeline. On-the-fly media compression',
                '50% spatial dimension reduction',
                'Bandwidth optimization. Minimized overhead with minimal quality loss',
            ],
            techStack: ['Python', 'Telegram API', 'FFmpeg'],
            liveLink: 'https://t.me/nnonymous_bot',
            githubLink: 'https://github.com/annonymousbanda/shrinkit',
            imageSrc: '/assets/works/shrinkit.png',
        },
        {
            title: 'FLAPPY BIRD',
            year: '2023',
            role: 'GAME DEVELOPER',
            description: [
                'Native C# environment. 2D physics-based arcade simulation',
                'Custom collision mechanics. Real-time rigid body dynamics',
                'Continuous state rendering. Fluid high-framerate logic execution',
            ],
            techStack: ['CSharp', 'Unity'],
            liveLink:
                'https://github.com/AnnonymousBanda/FlappyBird/raw/main/Flappy%20Bird.apk',
            githubLink: 'https://github.com/annonymousbanda/flappybird',
            imageSrc: '/assets/works/flappy.png',
        },
    ]

    const ProjectCard = ({
        year,
        role,
        title,
        description,
        techStack,
        liveLink,
        githubLink,
        imageSrc,
        reverse = false,
    }: ProjectProps) => {
        return (
            <article
                className={`w-full h-fit flex-center flex-col border-ink-dark gap-[3rem] ${reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'}`}
            >
                <div
                    className="lg:w-5/12 w-full min-h-[40rem] aspect-video bg-canvas-dark relative overflow-hidden rounded-md group bg-fixed bg-cover bg-center grayscale-0 hover:grayscale-0 transition-all duration-500"
                    style={{ backgroundImage: `url(${imageSrc})` }}
                ></div>

                <div
                    className={`lg:w-5/12 w-full flex-center flex-col gap-[3rem] text-left items-start! ${reverse ? 'lg:text-right lg:items-end!' : ''}`}
                >
                    <div>
                        <span className="font-mono text-[1.4rem] tracking-widest uppercase opacity-60">
                            [ {year} {'//'} {role} ]
                        </span>

                        <h1 className="font-display font-extrabold uppercase tracking-[-0.05em]">
                            {title}
                        </h1>
                    </div>

                    <div>
                        <div className="flex flex-col justify-items-start gap-[1rem]">
                            {description.map((point, index) => (
                                <p
                                    key={index}
                                    className="font-sans leading-relaxed font-extralight"
                                >
                                    {point}
                                </p>
                            ))}
                        </div>

                        <div
                            className={`flex flex-wrap gap-[1rem] font-mono uppercase mt-[1rem] ${reverse ? 'lg:justify-end!' : ''}`}
                        >
                            {techStack.map((tech, index) => {
                                const AVAILABLE_ICONS = [
                                    'AWS.svg',
                                    'C.svg',
                                    'C++.svg',
                                    'CSharp.svg',
                                    'Docker.svg',
                                    'Expo.svg',
                                    'Express.svg',
                                    'Firebase.svg',
                                    'Git.svg',
                                    'GSAP.svg',
                                    'Java.svg',
                                    'JavaScript.svg',
                                    'MongoDB.svg',
                                    'MySQL.svg',
                                    'Next.js.svg',
                                    'NGINX.svg',
                                    'Node.js.svg',
                                    'PostgresSQL.svg',
                                    'Prisma.svg',
                                    'Python.svg',
                                    'React Native.svg',
                                    'Redis.svg',
                                    'scikit-learn.svg',
                                    'Tailwind CSS.svg',
                                    'TypeScript.svg',
                                    'Unity.svg',
                                ]

                                const normalize = (s: string) =>
                                    s.toLowerCase().replace(/[^a-z0-9#+]/g, '')

                                const match = AVAILABLE_ICONS.find(
                                    (file) =>
                                        normalize(
                                            file.replace(/\.svg$/i, ''),
                                        ) === normalize(tech),
                                )

                                if (!match) return null

                                return (
                                    <div
                                        key={index}
                                        className="flex items-center justify-center"
                                    >
                                        <Image
                                            src={`/assets/arsenal/${match}`}
                                            alt={tech}
                                            width={40}
                                            height={40}
                                            className="object-contain"
                                        />
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    <div className="flex gap-[1rem] font-primary font-bold uppercase text-[1.4rem] tracking-widest">
                        {liveLink && (
                            <Link
                                href={liveLink as string}
                                target="_blank"
                                className="group relative inline-flex items-center justify-center py-[0.5rem] px-[2rem] cursor-pointer font-mono text-[1.4rem] uppercase tracking-[4px] font-bold text-ink-dark overflow-hidden"
                            >
                                <span className="absolute left-[-20px] opacity-0 transition-all duration-150 ease-in group-hover:left-[5px] group-hover:opacity-100">
                                    [
                                </span>
                                <span className="transition-transform duration-150 group-hover:scale-90">
                                    explore
                                </span>
                                <span className="absolute right-[-20px] opacity-0 transition-all duration-150 ease-in group-hover:right-[5px] group-hover:opacity-100">
                                    ]
                                </span>
                            </Link>
                        )}

                        {githubLink ? (
                            <Link
                                href={githubLink as string}
                                target="_blank"
                                className="group relative inline-flex items-center justify-center py-[0.5rem] px-[2rem] cursor-pointer font-mono text-[1.4rem] uppercase tracking-[4px] font-bold text-ink-dark overflow-hidden"
                            >
                                <span className="absolute left-[-20px] opacity-0 transition-all duration-150 ease-in group-hover:left-[5px] group-hover:opacity-100">
                                    [
                                </span>
                                <span className="transition-transform duration-150 group-hover:scale-90">
                                    code
                                </span>
                                <span className="absolute right-[-20px] opacity-0 transition-all duration-150 ease-in group-hover:right-[5px] group-hover:opacity-100">
                                    ]
                                </span>
                            </Link>
                        ) : (
                            <div className="group relative inline-flex items-center justify-center py-[0.5rem] px-[2rem] cursor-not-allowed font-mono text-[1.4rem] uppercase tracking-[4px] font-bold text-ink-dark">
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 opacity-0 pointer-events-none group-hover:animate-pop-fade z-20">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="text-ink-dark"
                                    >
                                        <rect
                                            x="3"
                                            y="11"
                                            width="18"
                                            height="11"
                                            rx="2"
                                            ry="2"
                                        />
                                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                    </svg>
                                </div>

                                <span className="absolute left-[-20px] opacity-0 transition-all duration-150 ease-in group-hover:left-[5px] group-hover:opacity-100 text-ink-dark/40">
                                    [
                                </span>
                                <div className="absolute top-1/2 left-[10%] w-[80%] h-[2px] bg-ink-dark scale-x-0 origin-center transition-transform duration-200 group-hover:scale-x-100 z-10" />
                                <span className="transition-transform duration-150 group-hover:scale-90 group-hover:opacity-40">
                                    code
                                </span>
                                <span className="absolute right-[-20px] opacity-0 transition-all duration-150 ease-in group-hover:right-[5px] group-hover:opacity-100 text-ink-dark/40">
                                    ]
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </article>
        )
    }

    return (
        <section
            className="pb-[30rem] lg:pb-[22rem] md:pb-[16rem] sm:pb-[12rem] max-[450px]:pb-[10rem] max-container"
            ref={sectionRef}
        >
            <div className="select-none w-fit mx-auto flex-center flex-col overflow-hidden gap-[3.5rem] lg:gap-[2.5rem] md:gap-[2rem] sm:gap-[1.5rem] max-[450px]:gap-[1.2rem] lg:pb-[8rem] md:pb-[6rem] sm:pb-[4rem] pb-[0rem]">
                <div
                    className="flex-center flex-col relative top-[-18rem] gap-0"
                    ref={headerRef}
                >
                    <div className="w-full flex items-end justify-between px-[2px] min-[400px]:px-[2.5px] min-[600px]:px-[5px]">
                        <svg
                            width="4"
                            className="h-[400px] max-md:h-[300px] max-[399px]:h-[200px]"
                        >
                            <line
                                x1="1"
                                y1="0"
                                x2="1"
                                y2="400"
                                stroke="black"
                                strokeWidth="1.5"
                            />
                        </svg>
                        <p
                            className="uppercase w-full px-[10px] text-base md:text-2xl font-extralight opacity-50 tracking-[0.48px] absolute left-1/2 -translate-x-1/2 mb-[1rem] text-center"
                            ref={headerDescRef}
                        >
                            What I&apos;ve been involved in
                        </p>
                        <svg
                            width="4"
                            className="h-[400px] max-md:h-[300px] max-[399px]:h-[200px]"
                        >
                            <line
                                x1="1"
                                y1="0"
                                x2="1"
                                y2="400"
                                stroke="black"
                                strokeWidth="1.5"
                            />
                        </svg>
                    </div>
                    <h1 className="uppercase display-header font-semibold">
                        Work
                    </h1>
                </div>
                <Image
                    src="/assets/shadow.png"
                    alt="shadow"
                    width={3}
                    height={1}
                    className="mt-[6rem] max-md:mt-[4rem] max-[399px]:mt-[2rem] lg:mb-[3rem] md:mb-[2rem] sm:mb-[1.5rem] min-[450px]:mb-[1.2rem] mb-[0rem] w-full h-auto relative top-[-18rem]"
                    ref={shadowRef}
                />
            </div>

            <div className="w-full flex-center flex-col gap-[20rem] lg:gap-[16rem] md:gap-[12rem] max-[600px]:gap-[10rem]">
                {projectsData.map((project, index) => (
                    <ProjectCard
                        key={index}
                        {...project}
                        reverse={index % 2 === 0}
                    />
                ))}
            </div>
        </section>
    )
}

export default work
