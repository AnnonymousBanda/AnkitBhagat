'use client'

import { useEffect, useRef } from 'react'
import Matter from 'matter-js'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const DOMAINS = {
    web: {
        label: 'Web & Databases',
        color: '#A8D8EA',
        accent: '#5BB8D4',
    },
    ml: {
        label: 'ML / AI',
        color: '#D4EDDA',
        accent: '#4CAF82',
    },
    devops: {
        label: 'DevOps & Cloud',
        color: '#FFF3CD',
        accent: '#E6A817',
    },
    mobile: {
        label: 'Mobile',
        color: '#E8D5F5',
        accent: '#9B59B6',
    },
    game: {
        label: 'Game Dev',
        color: '#FFE0CC',
        accent: '#E8732A',
    },
    lang: {
        label: 'Languages',
        color: '#E8E8E8',
        accent: '#888888',
    },
} as const

type Domain = keyof typeof DOMAINS

const TECHS: { name: string; domain: Domain }[] = [
    { name: 'C', domain: 'lang' },
    { name: 'C++', domain: 'lang' },
    { name: 'CSharp', domain: 'lang' },
    { name: 'Java', domain: 'lang' },
    { name: 'JavaScript', domain: 'lang' },
    { name: 'TypeScript', domain: 'lang' },
    { name: 'Python', domain: 'lang' },

    { name: 'React', domain: 'web' },
    { name: 'Next.js', domain: 'web' },
    { name: 'Node.js', domain: 'web' },
    { name: 'Express', domain: 'web' },
    { name: 'GSAP', domain: 'web' },
    { name: 'Tailwind CSS', domain: 'web' },
    { name: 'NGINX', domain: 'web' },
    { name: 'MongoDB', domain: 'web' },
    { name: 'MySQL', domain: 'web' },
    { name: 'PostgresSQL', domain: 'web' },
    { name: 'Prisma', domain: 'web' },
    { name: 'Redis', domain: 'web' },
    { name: 'Firebase', domain: 'web' },
    { name: 'Git', domain: 'web' },

    { name: 'scikit-learn', domain: 'ml' },
    // { name: 'TensorFlow', domain: 'ml' },
    // { name: 'PyTorch', domain: 'ml' },
    // { name: 'OpenCV', domain: 'ml' },
    // { name: 'Keras', domain: 'ml' },
    // { name: 'HuggingFace', domain: 'ml' },

    { name: 'AWS', domain: 'devops' },
    { name: 'Docker', domain: 'devops' },
    // { name: 'Kubernetes', domain: 'devops' },
    // { name: 'Terraform', domain: 'devops' },
    { name: 'Github Actions', domain: 'devops' },
    { name: 'Linux', domain: 'devops' },

    { name: 'React Native', domain: 'mobile' },
    { name: 'Expo', domain: 'mobile' },
    // { name: 'Flutter', domain: 'mobile' },

    { name: 'Unity', domain: 'game' },
    // { name: 'Blender', domain: 'game' },
    // { name: 'HLSL', domain: 'game' },
]

// Block size: 90px on desktop, scales down to 54px on mobile
function calcBlockSize(W: number): number {
    return Math.round(Math.min(90, Math.max(54, W * 0.075)))
}

function calcLabelDims(blockSize: number) {
    const h = Math.round(blockSize * 0.58)
    const w = Math.round(blockSize * 2.2)
    return { w, h, r: h / 2 }
}

function calcIconPadding(blockSize: number): number {
    return Math.round(blockSize * 0.18)
}
function clampFontSize(W: number): number {
    const min = 8 * 10
    const max = 12 * 10

    const preferred = 6.4615 * 10 + 0.038462 * W

    return Math.min(Math.max(preferred, min), max)
}

function letterSpacing(W: number): number {
    return W >= 600 ? -0.8 * 16 : -0.55 * 16
}

function buildSim(canvas: HTMLCanvasElement, W: number, H: number) {
    canvas.width = W
    canvas.height = H

    const ctx = canvas.getContext('2d')!

    const BLOCK_SIZE = calcBlockSize(W)
    const ICON_PADDING = calcIconPadding(BLOCK_SIZE)
    const ICON_SIZE = BLOCK_SIZE - ICON_PADDING * 2
    const GAP = Math.round(BLOCK_SIZE * 0.11)
    const {
        w: LABEL_W,
        h: LABEL_H,
        r: LABEL_RADIUS,
    } = calcLabelDims(BLOCK_SIZE)
    const LABEL_DOT_R = Math.round(LABEL_H * 0.15)
    const LABEL_FONT_SIZE = Math.round(LABEL_H * 0.26)
    const BLOCK_RADIUS = Math.round(BLOCK_SIZE * 0.155)

    const FONT_SIZE = clampFontSize(W)
    const LINE_HEIGHT = FONT_SIZE * 0.8
    const LETTER_SP = letterSpacing(W)
    const HEADING_X = Math.round(W * 0.033)
    const HEADING_Y = Math.round(H * 0.175)
    const HEADING_TEXT = ['MY', 'ARSENAL']

    const { Engine, Runner, Bodies, Body, Composite, Mouse, MouseConstraint } =
        Matter

    const engine = Engine.create({ gravity: { y: 1.2 } })
    const world = engine.world

    const ground = Bodies.rectangle(W / 2, H + 10, W * 2, 50, {
        isStatic: true,
    })
    const ceiling = Bodies.rectangle(W / 2, -25, W * 2, 50, { isStatic: true })
    const wallL = Bodies.rectangle(-25, H / 2, 50, H * 2, { isStatic: true })
    const wallR = Bodies.rectangle(W + 25, H / 2, 50, H * 2, { isStatic: true })
    Composite.add(world, [ground, wallL, wallR])

    const cols = Math.max(1, Math.floor(W / (BLOCK_SIZE + GAP)))
    const startX = (W - cols * (BLOCK_SIZE + GAP)) / 2 + BLOCK_SIZE / 2

    type TechBlock = {
        kind: 'tech'
        body: Matter.Body
        domain: Domain
        img: HTMLImageElement
    }
    type LabelBlock = { kind: 'label'; body: Matter.Body; domain: Domain }
    type PhysicsBlock = TechBlock | LabelBlock

    const blocks: PhysicsBlock[] = []

    TECHS.forEach((tech, i) => {
        const col = i % cols
        const row = Math.floor(i / cols)
        const x = startX + col * (BLOCK_SIZE + GAP)
        const y = -row * (BLOCK_SIZE + GAP + 4) - BLOCK_SIZE

        const body = Bodies.rectangle(x, y, BLOCK_SIZE, BLOCK_SIZE, {
            restitution: 0.45,
            friction: 0.6,
            frictionAir: 0.01,
            angle: (Math.random() - 0.5) * 0.4,
            label: tech.name,
        })
        Body.setVelocity(body, { x: (Math.random() - 0.5) * 2, y: 0 })

        const img = new Image()
        img.src = `/assets/arsenal/${tech.name}.svg`

        blocks.push({ kind: 'tech', body, domain: tech.domain, img })
        Composite.add(world, body)
    })

    const domainKeys = Object.keys(DOMAINS) as Domain[]
    const totalTechRows = Math.ceil(TECHS.length / cols)

    domainKeys.forEach((domain, i) => {
        const spreadX = W * 0.15 + (i / (domainKeys.length - 1)) * (W * 0.7)
        const y =
            -(totalTechRows * (BLOCK_SIZE + GAP + 4)) - i * (LABEL_H + 20) - 80

        const body = Bodies.rectangle(spreadX, y, LABEL_W, LABEL_H, {
            restitution: 0.5,
            friction: 0.5,
            frictionAir: 0.015,
            density: 0.0005,
            angle: (Math.random() - 0.5) * 0.6,
            label: `__label__${domain}`,
        })
        Body.setVelocity(body, { x: (Math.random() - 0.5) * 3, y: 0 })

        blocks.push({ kind: 'label', body, domain })
        Composite.add(world, body)
    })

    const mouse = Mouse.create(canvas)
    const m = mouse as Matter.Mouse & {
        mousewheel: EventListener
        mousemove: EventListener
    }
    mouse.element.removeEventListener('wheel', m.mousewheel)
    mouse.element.removeEventListener('mousewheel', m.mousewheel)
    mouse.element.removeEventListener('DOMMouseScroll', m.mousewheel)
    mouse.element.removeEventListener('touchmove', m.mousemove)

    canvas.addEventListener(
        'wheel',
        (e: WheelEvent) => {
            mouse.position.x = e.clientX - canvas.getBoundingClientRect().left
            mouse.position.y = e.clientY - canvas.getBoundingClientRect().top
        },
        { passive: true },
    )

    // Only add mouse constraint on non-touch devices
    const isTouchDevice = () => {
        return (
            typeof window !== 'undefined' &&
            (navigator.maxTouchPoints > 0 ||
                ((navigator as Navigator & { msMaxTouchPoints?: number })
                    .msMaxTouchPoints ?? 0) > 0 ||
                'ontouchstart' in window)
        )
    }

    if (!isTouchDevice()) {
        const mc = MouseConstraint.create(engine, {
            mouse,
            constraint: { stiffness: 0.2, render: { visible: false } },
        })
        Composite.add(world, mc)
    }

    const drawHeading = () => {
        ctx.save()
        ctx.font = `900 ${FONT_SIZE}px 'Anybody', sans-serif`
        ctx.fillStyle = '#F5F5F5'
        ctx.textBaseline = 'top'
        ctx.letterSpacing = `${LETTER_SP}px`
        HEADING_TEXT.forEach((line, i) => {
            ctx.fillText(line, HEADING_X, HEADING_Y + i * LINE_HEIGHT)
        })
        ctx.restore()
    }

    const pillPath = (
        cx: number,
        cy: number,
        w: number,
        h: number,
        r: number,
    ) => {
        ctx.beginPath()
        ctx.moveTo(cx - w / 2 + r, cy - h / 2)
        ctx.lineTo(cx + w / 2 - r, cy - h / 2)
        ctx.arcTo(cx + w / 2, cy - h / 2, cx + w / 2, cy - h / 2 + r, r)
        ctx.lineTo(cx + w / 2, cy + h / 2 - r)
        ctx.arcTo(cx + w / 2, cy + h / 2, cx + w / 2 - r, cy + h / 2, r)
        ctx.lineTo(cx - w / 2 + r, cy + h / 2)
        ctx.arcTo(cx - w / 2, cy + h / 2, cx - w / 2, cy + h / 2 - r, r)
        ctx.lineTo(cx - w / 2, cy - h / 2 + r)
        ctx.arcTo(cx - w / 2, cy - h / 2, cx - w / 2 + r, cy - h / 2, r)
        ctx.closePath()
    }

    const drawBlocks = () => {
        for (const block of blocks) {
            const { x, y } = block.body.position
            const angle = block.body.angle
            const cfg = DOMAINS[block.domain]

            ctx.save()
            ctx.translate(x, y)
            ctx.rotate(angle)

            if (block.kind === 'tech') {
                const half = BLOCK_SIZE / 2
                ctx.beginPath()
                ctx.roundRect(
                    -half,
                    -half,
                    BLOCK_SIZE,
                    BLOCK_SIZE,
                    BLOCK_RADIUS,
                )
                ctx.fillStyle = cfg.color
                ctx.fill()
                ctx.strokeStyle = 'rgba(0,0,0,0.10)'
                ctx.lineWidth = 1
                ctx.stroke()

                if (block.img.complete && block.img.naturalWidth > 0) {
                    ctx.drawImage(
                        block.img,
                        -ICON_SIZE / 2,
                        -ICON_SIZE / 2,
                        ICON_SIZE,
                        ICON_SIZE,
                    )
                }
            } else {
                pillPath(0, 0, LABEL_W, LABEL_H, LABEL_RADIUS)
                ctx.fillStyle = cfg.color
                ctx.fill()

                pillPath(0, 0, LABEL_W, LABEL_H, LABEL_RADIUS)
                ctx.strokeStyle = cfg.accent
                ctx.lineWidth = 2
                ctx.stroke()

                const dotX = -LABEL_W / 2 + LABEL_H / 2
                ctx.beginPath()
                ctx.arc(dotX, 0, LABEL_DOT_R, 0, Math.PI * 2)
                ctx.fillStyle = cfg.accent
                ctx.fill()

                ctx.font = `700 ${LABEL_FONT_SIZE}px 'Anybody', sans-serif`
                ctx.fillStyle = '#111111'
                ctx.textAlign = 'center'
                ctx.textBaseline = 'middle'
                ctx.fillText(cfg.label.toUpperCase(), LABEL_DOT_R * 2, 0)
            }

            ctx.restore()
        }
    }

    const runner = Runner.create()
    let animId: number

    const draw = () => {
        animId = requestAnimationFrame(draw)
        ctx.fillStyle = '#000000'
        ctx.fillRect(0, 0, W, H)
        drawHeading()
        drawBlocks()
    }

    const destroy = () => {
        cancelAnimationFrame(animId)
        try {
            Runner.stop(runner)
        } catch {}
        Engine.clear(engine)
        Composite.clear(world, false)
    }

    return { runner, engine, world, ceiling, draw, destroy }
}

export default function Arsenal() {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const sectionRef = useRef<HTMLDivElement>(null)
    const triggerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        const section = sectionRef.current
        if (!canvas || !section) return

        let sim: ReturnType<typeof buildSim> | null = null
        let ceilingTimer: ReturnType<typeof setTimeout> | null = null
        let st: ReturnType<typeof ScrollTrigger.create> | null = null

        const init = () => {
            if (sim) sim.destroy()
            if (ceilingTimer) clearTimeout(ceilingTimer)
            if (st) {
                try {
                    st.kill()
                } catch {}
            }

            const W = section.clientWidth
            const H = section.clientHeight

            sim = buildSim(canvas, W, H)

            document.fonts
                .load(`900 ${clampFontSize(W)}px 'Anybody'`)
                .then(() => {
                    if (!sim) return
                    sim.draw()

                    gsap.registerPlugin(ScrollTrigger)
                    st = ScrollTrigger.create({
                        trigger: triggerRef.current,
                        start: 'top top',
                        onEnter: () => {
                            if (!sim) return
                            Matter.Runner.run(sim.runner, sim.engine)
                            ceilingTimer = setTimeout(() => {
                                if (sim)
                                    Matter.Composite.add(sim.world, [
                                        sim.ceiling,
                                    ])
                            }, 4000)
                        },
                        once: true,
                    })
                })
        }

        init()

        let resizeTimer: ReturnType<typeof setTimeout>
        const ro = new ResizeObserver(() => {
            clearTimeout(resizeTimer)
            resizeTimer = setTimeout(init, 200)
        })
        ro.observe(section)

        return () => {
            ro.disconnect()
            clearTimeout(resizeTimer)
            if (ceilingTimer) clearTimeout(ceilingTimer)
            if (sim) sim.destroy()
            if (st) {
                try {
                    st.kill()
                } catch {}
            }
            ScrollTrigger.getAll().forEach((s) => s.kill())
        }
    }, [])

    return (
        <section
            id="arsenal"
            ref={sectionRef}
            className="w-full h-screen bg-canvas-dark cursor-[url('/icons/cursor-dark.png')_0_0,_auto] relative overflow-hidden"
        >
            <div ref={triggerRef} className="absolute top-0 left-0 w-0 h-0" />
            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full"
            />
        </section>
    )
}
