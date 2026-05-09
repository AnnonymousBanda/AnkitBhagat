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
        description: string
        techStack: string[]
        liveLink?: string
        githubLink?: string
        imageSrc: string
        reverse?: boolean
    }

    const projectsData: ProjectProps[] = [
        {
            title: 'IITP Portal',
            year: '2026',
            role: 'SYSTEM ARCHITECTURE',
            description:
                'Complete digital infrastructure overhaul and domain migration for the institute. Engineered for high availability and zero-downtime deployment.',
            techStack: ['Next.js', 'Tailwind CSS', 'TypeScript', 'NGINX'],
            liveLink: 'https://iitp.ac.in',
            githubLink: '',
            imageSrc: '/assets/project.png',
        },
        {
            title: 'EcoPulse',
            year: '2025',
            role: 'FULL-STACK & IOT',
            description:
                'AI-driven platform for real-time soil health monitoring and predictive plant disease detection. Integrates hardware sensor data with cloud-based inference.',
            techStack: ['Python', 'Machine Learning', 'IoT Sensors', 'Render'],
            liveLink: '#',
            githubLink: '#',
            imageSrc: '/assets/project.png',
        },
        {
            title: 'ShrinkIt',
            year: '2026',
            role: 'BACKEND & AUTOMATION',
            description:
                'Automated Telegram bot engineered for high-efficiency video compression. Utilizes headless processing to reduce payload size without quality degradation.',
            techStack: ['Python', 'AWS'],
            liveLink: '',
            githubLink: '#',
            imageSrc: '/assets/project.png',
        },
        {
            title: 'MNIST SVM',
            year: '2026',
            role: 'MACHINE LEARNING',
            description:
                'Multi-class predictive model for handwritten digit recognition. Achieved a 98% validation accuracy utilizing Support Vector Machines with an RBF kernel.',
            techStack: ['Python', 'Scikit-Learn', 'SVM'],
            liveLink: '',
            githubLink: '#',
            imageSrc: '/assets/project.png',
        },
        {
            title: 'Urban Valuation',
            year: '2026',
            role: 'PREDICTIVE MODELING',
            description:
                'End-to-end machine learning pipeline predicting Bengaluru real estate valuations. Served via Flask API with an 87% confidence threshold.',
            techStack: ['Python', 'Flask', 'Pandas'],
            liveLink: '',
            githubLink: '#',
            imageSrc: '/assets/project.png',
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
                    className="lg:w-5/12 aspect-video bg-canvas-dark relative overflow-hidden rounded-md group bg-fixed bg-cover bg-center grayscale hover:grayscale-0 transition-all duration-500"
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
                        <p className="font-sans leading-relaxed font-extralight">
                            {description}
                        </p>

                        <div
                            className={`flex flex-wrap gap-[1rem] font-mono uppercase mt-[1rem] ${reverse ? 'justify-end!' : ''}`}
                        >
                            {techStack.map((tech, index) => {
                                const AVAILABLE_ICONS = [
                                    'AWS.svg',
                                    'C.svg',
                                    'CPP.svg',
                                    'CSharp.svg',
                                    'Docker.svg',
                                    'Express.svg',
                                    'Firebase.svg',
                                    'Git.svg',
                                    'Java.svg',
                                    'JavaScript.svg',
                                    'MongoDB.svg',
                                    'MySQL.svg',
                                    'Next.js.svg',
                                    'NGINX.svg',
                                    'Node.js.svg',
                                    'PostgresSQL.svg',
                                    'Python.svg',
                                    'Redis.svg',
                                    'scikit-learn.svg',
                                    'Tailwind CSS.svg',
                                    'TypeScript.svg',
                                ]

                                const normalize = (s: string) =>
                                    s.toLowerCase().replace(/[^a-z0-9]/g, '')

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
                                    explorer
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
