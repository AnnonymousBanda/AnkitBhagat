'use client'

import React, { useEffect, useRef } from 'react'
import Matter from 'matter-js'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const TECHS = [
    'AWS',
    'C',
    'C++',
    'CSharp',
    'Docker',
    'Expo',
    'Express',
    'Firebase',
    'Git',
    'GSAP',
    'Java',
    'JavaScript',
    'MongoDB',
    'MySQL',
    'Next.js',
    'NGINX',
    'Node.js',
    'PostgresSQL',
    'Prisma',
    'Python',
    'ReactNative',
    'Redis',
    'scikit-learn',
    'Tailwind CSS',
    'TypeScript',
    'Unity',
]

const BLOCK_SIZE = 90
const ICON_PADDING = 16
const ICON_SIZE = BLOCK_SIZE - ICON_PADDING * 2

const BLOCK_COLORS = [
    '#F8F9FA',
    '#F0F2F5',
    '#F5F5F7',
    '#E9ECEF',
    '#FAF9F6',
    '#F2F2F2',
    '#FBFBFB',
    '#E5E5E5',
    '#FEFEFE',
    '#FDFCF0',
]

export default function Arsenal() {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const sectionRef = useRef<HTMLDivElement>(null)
    const headingRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        const section = sectionRef.current
        if (!canvas || !section) return

        const W = section.clientWidth
        const H = section.clientHeight
        canvas.width = W
        canvas.height = H

        const ctx = canvas.getContext('2d')!

        const {
            Engine,
            Runner,
            Bodies,
            Body,
            Composite,
            Mouse,
            MouseConstraint,
        } = Matter

        const engine = Engine.create({ gravity: { y: 1.2 } })
        const world = engine.world

        const ground = Bodies.rectangle(W / 2, H, W * 2, 50, { isStatic: true })
        const wallL = Bodies.rectangle(-25, H / 2, 50, H * 2, {
            isStatic: true,
        })
        const wallR = Bodies.rectangle(W + 25, H / 2, 50, H * 2, {
            isStatic: true,
        })
        Composite.add(world, [ground, wallL, wallR])

        const cols = Math.floor(W / (BLOCK_SIZE + 10))
        const startX = (W - cols * (BLOCK_SIZE + 10)) / 2 + BLOCK_SIZE / 2

        const blocks: {
            body: Matter.Body
            color: string
            img: HTMLImageElement
        }[] = []

        TECHS.forEach((tech, i) => {
            const col = i % cols
            const row = Math.floor(i / cols)
            const x = startX + col * (BLOCK_SIZE + 10)
            const y = -row * (BLOCK_SIZE + 14) - BLOCK_SIZE

            const body = Bodies.rectangle(x, y, BLOCK_SIZE, BLOCK_SIZE, {
                restitution: 0.45,
                friction: 0.6,
                frictionAir: 0.01,
                angle: (Math.random() - 0.5) * 0.4,
                label: tech,
            })
            Body.setVelocity(body, { x: (Math.random() - 0.5) * 2, y: 0 })

            const img = new Image()
            img.src = `/assets/arsenal/${tech}.svg`

            blocks.push({
                body,
                color: BLOCK_COLORS[i % BLOCK_COLORS.length],
                img,
            })
            Composite.add(world, body)
        })

        const mouse = Mouse.create(canvas)

        const matterMouse = mouse as Matter.Mouse & {
            mousewheel: EventListener
            mousemove: EventListener
        }

        mouse.element.removeEventListener('wheel', matterMouse.mousewheel)
        mouse.element.removeEventListener('mousewheel', matterMouse.mousewheel)
        mouse.element.removeEventListener(
            'DOMMouseScroll',
            matterMouse.mousewheel,
        )

        mouse.element.removeEventListener('touchmove', matterMouse.mousemove)

        const passiveWheel = (e: WheelEvent) => {
            ;(mouse as Matter.Mouse).position.x =
                e.clientX - canvas.getBoundingClientRect().left
            ;(mouse as Matter.Mouse).position.y =
                e.clientY - canvas.getBoundingClientRect().top
        }
        canvas.addEventListener('wheel', passiveWheel, { passive: true })

        const mc = MouseConstraint.create(engine, {
            mouse,
            constraint: { stiffness: 0.2, render: { visible: false } },
        })
        Composite.add(world, mc)

        const runner = Runner.create()

        let animId: number

        const draw = () => {
            animId = requestAnimationFrame(draw)

            ctx.fillStyle = '#000000'
            ctx.fillRect(0, 0, W, H)

            for (const { body, color, img } of blocks) {
                const { x, y } = body.position
                const angle = body.angle

                ctx.save()
                ctx.translate(x, y)
                ctx.rotate(angle)

                const half = BLOCK_SIZE / 2

                ctx.beginPath()
                ctx.roundRect(-half, -half, BLOCK_SIZE, BLOCK_SIZE, 14)
                ctx.fillStyle = color
                ctx.fill()

                ctx.strokeStyle = 'rgba(0,0,0,0.08)'
                ctx.lineWidth = 1
                ctx.stroke()

                if (img.complete && img.naturalWidth > 0) {
                    ctx.drawImage(
                        img,
                        -ICON_SIZE / 2,
                        -ICON_SIZE / 2,
                        ICON_SIZE,
                        ICON_SIZE,
                    )
                }

                ctx.restore()
            }
        }

        draw()

        gsap.registerPlugin(ScrollTrigger)
        const st = ScrollTrigger.create({
            trigger: headingRef.current,
            start: 'top 20%',
            onEnter: () => {
                Runner.run(runner, engine)
            },
            once: true,
        })

        return () => {
            cancelAnimationFrame(animId)
            canvas.removeEventListener('wheel', passiveWheel)
            try {
                Runner.stop(runner)
            } catch {}
            Engine.clear(engine)
            Composite.clear(world, false)
            try {
                st.kill()
            } catch {}
            ScrollTrigger.getAll().forEach((s) => s.kill())
        }
    }, [])

    return (
        <section
            ref={sectionRef}
            className="pt-[10rem] w-full min-h-screen box-content bg-canvas-dark cursor-[url('/icons/cursor-dark.png')_0_0,_auto] overflow-hidden"
        >
            <div className="max-container">
                <div className="w-full relative">
                    <div
                        ref={headingRef}
                        className="absolute top-0 left-0 pt-[7rem] z-10 pointer-events-none select-none"
                    >
                        <h1 className="display-header text-ink-light">
                            My
                            <br />
                            Arsenal
                        </h1>
                    </div>

                    <canvas
                        ref={canvasRef}
                        className="absolute inset-0 w-full h-screen"
                    />
                </div>
            </div>
        </section>
    )
}
