'use client'

import React, { useEffect, useRef } from 'react'
import Image from 'next/image'

import { gsap } from 'gsap'
import Link from 'next/link'

const work = (): React.JSX.Element => {
    const headerRef = useRef<HTMLDivElement>(null)
    const shadowRef = useRef<HTMLImageElement>(null)

    useEffect(() => {
        const tl = gsap.timeline({ defaults: { ease: 'back.out(4)' } })
        tl.from(headerRef.current, {
            duration: 0.8,
            y: -200,
        })
        tl.from(
            shadowRef.current,
            {
                duration: 0.8,
                scale: 0,
            },
            '-=0.8',
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
                className={`w-full flex-center flex-col border-ink-dark gap-[3rem] ${reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'}`}
            >
                <div
                    className="lg:w-5/12 aspect-video bg-canvas-dark relative overflow-hidden rounded-md group bg-fixed bg-cover bg-center grayscale-0 hover:grayscale-0 transition-all duration-500"
                    style={{ backgroundImage: `url(${imageSrc})` }}
                ></div>

                <div
                    className={`lg:w-5/12 flex-center flex-col gap-[3rem] ${reverse ? 'text-right items-end!' : 'text-left items-start!'}`}
                >
                    <div
                        className={`-translate-x-1/4 ${reverse ? 'lg:translate-x-1/4' : ''}`}
                    >
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
                            className={`flex flex-wrap gap-[1rem] font-mono uppercase mt-[1rem] ${reverse ? 'justify-end!' : ''}`}
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
                                    'ReactNative.svg',
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
                                            src={`/assets/arsenal/${encodeURI(match)}`}
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

                        {githubLink && (
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
                        )}
                    </div>
                </div>
            </article>
        )
    }

    return (
        <section className="max-container">
            <div className="select-none w-full flex-center flex-col overflow-hidden gap-[3.5rem] mb-[10rem]">
                <div className="flex-center flex-col" ref={headerRef}>
                    <p className="uppercase font-extralight opacity-50 tracking-[0.48px]">
                        What I&apos;ve been involved in
                    </p>
                    <h1 className="uppercase display-header font-semibold">
                        Works
                    </h1>
                </div>
                <Image
                    src="/assets/shadow.png"
                    alt="shadow"
                    width={400}
                    height={400}
                    className="mt-[2rem] mb-[4rem]"
                    ref={shadowRef}
                />
            </div>

            <div className="w-full flex-center flex-col gap-[20rem]">
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
