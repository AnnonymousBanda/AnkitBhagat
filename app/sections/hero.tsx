'use client'

import Image from 'next/image'
import {
    prepareWithSegments,
    layoutNextLine,
    type PreparedTextWithSegments,
    type LayoutCursor,
} from '@chenglou/pretext'

import {
    getWrapHull,
    transformWrapPoints,
    carveTextLineSlots,
    getPolygonIntervalForBand,
    type Point,
    type Rect,
} from '@/pretext/wrap-geometry'

import { useEffect, useRef, useState, useCallback } from 'react'

type LayoutLine = {
    x: number
    y: number
    width: number
    text: string
}

const INTRO: string =
    'ANKIT HERE. RAISED IN KOLKATA. LEVELING UP AT IIT PATNA. I’VE BEEN WRITING CODE SINCE I WAS A KID IN 2016. I REFUSE TO PICK JUST ONE SIDE. ML, APP DEV, GAME DEV, WEB—I’VE DONE IT ALL AND I’M READY FOR MORE. I BUILD DIGITAL EXPERIENCES THAT ARE TOO LOUD TO IGNORE. IF YOU’RE TIRED OF BASIC SITES, YOU’RE IN THE RIGHT PLACE. SCROLL DOWN TO WITNESS THE EVOLUTION.'

const Hero = () => {
    const stageRef = useRef<HTMLDivElement>(null)
    const avatarRef = useRef<HTMLImageElement>(null)

    const preparedRef = useRef<PreparedTextWithSegments | null>(null)
    const hullRef = useRef<Point[] | null>(null)

    const [lines, setLines] = useState<LayoutLine[]>([])
    const [isLoaded, setIsLoaded] = useState(false)

    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
    const [isDragging, setIsDragging] = useState(false)
    const dragStart = useRef({ x: 0, y: 0, offsetX: 0, offsetY: 0 })

    const [config, setConfig] = useState({
        fontSize: 42,
        lineHeight: 46,
        imgW: 380,
        imgH: 570,
    })

    const calculateLayout = useCallback(() => {
        if (
            !preparedRef.current ||
            !hullRef.current ||
            !stageRef.current ||
            !avatarRef.current
        )
            return

        const stage = stageRef.current
        const avatar = avatarRef.current

        const stageRect = stage.getBoundingClientRect()
        const avatarRect = avatar.getBoundingClientRect()

        const relativeRect: Rect = {
            x: avatarRect.left - stageRect.left,
            y: avatarRect.top - stageRect.top,
            width: avatarRect.width,
            height: avatarRect.height,
        }

        const transformedHull = transformWrapPoints(
            hullRef.current,
            relativeRect,
            0,
        )

        let bestStartY = 0
        let finalGenerated: LayoutLine[] = []

        // Multi-pass simulation to calculate the exact vertical center
        for (let pass = 0; pass < 4; pass++) {
            const generated: LayoutLine[] = []
            let cursor: LayoutCursor = { segmentIndex: 0, graphemeIndex: 0 }
            let y = bestStartY
            let isDone = false

            // We allow Y to run past the stage height during probing so we can measure the true height
            while (y < stageRect.height * 2 && !isDone) {
                const bandTop = y
                const bandBottom = y + config.lineHeight

                const blocked = getPolygonIntervalForBand(
                    transformedHull,
                    bandTop,
                    bandBottom,
                    0,
                    0,
                )

                const slots = carveTextLineSlots(
                    { left: 0, right: stageRect.width },
                    blocked ? [blocked] : [],
                )

                slots.sort((a, b) => a.left - b.left)

                if (!slots.length) {
                    y += config.lineHeight
                    continue
                }

                for (const slot of slots) {
                    const width = slot.right - slot.left

                    if (width < Math.max(30, config.fontSize * 0.6)) continue

                    const line = layoutNextLine(
                        preparedRef.current,
                        cursor,
                        width,
                    )

                    if (!line) {
                        isDone = true
                        break
                    }

                    generated.push({
                        x: slot.left,
                        y,
                        width,
                        text: line.text,
                    })

                    cursor = line.end
                }

                y += config.lineHeight
            }

            finalGenerated = generated

            // After calculating the layout, measure it and correct the Y offset to center it
            if (generated.length > 0) {
                const firstY = generated[0].y
                const lastY =
                    generated[generated.length - 1].y + config.lineHeight
                const textHeight = lastY - firstY

                const desiredFirstY = (stageRect.height - textHeight) / 2
                const correction = desiredFirstY - firstY

                // If it's perfectly centered (within 2 pixels), lock it in and stop looping
                if (Math.abs(correction) < 2) break

                bestStartY += correction
            } else {
                break
            }
        }

        // Filter out any lines that ended up getting pushed totally off-screen
        setLines(
            finalGenerated.filter(
                (line) =>
                    line.y >= -config.lineHeight && line.y <= stageRect.height,
            ),
        )
    }, [config.lineHeight, config.fontSize])

    useEffect(() => {
        let isActive = true

        const updateConfig = () => {
            const w = window.innerWidth
            if (w < 640) {
                setConfig({
                    fontSize: 20,
                    lineHeight: 24,
                    imgW: 180,
                    imgH: 270,
                })
            } else if (w < 1024) {
                setConfig({
                    fontSize: 28,
                    lineHeight: 32,
                    imgW: 260,
                    imgH: 390,
                })
            } else if (w < 1440) {
                setConfig({
                    fontSize: 34,
                    lineHeight: 38,
                    imgW: 320,
                    imgH: 480,
                })
            } else {
                setConfig({
                    fontSize: 42,
                    lineHeight: 46,
                    imgW: 380,
                    imgH: 570,
                })
            }
        }

        updateConfig()
        window.addEventListener('resize', updateConfig)

        const init = async () => {
            const points = await getWrapHull('/assets/Ankit Bhagat.png', {
                smoothRadius: 6,
                mode: 'mean',
            })
            if (isActive) {
                hullRef.current = points
                setIsLoaded(true)
            }
        }

        init()

        return () => {
            isActive = false
            window.removeEventListener('resize', updateConfig)
        }
    }, [])

    useEffect(() => {
        preparedRef.current = prepareWithSegments(
            INTRO,
            `700 ${config.fontSize}px "Anybody", sans-serif`,
        )
        calculateLayout()
    }, [config, calculateLayout])

    useEffect(() => {
        if (!isLoaded) return

        let frameId: number
        let lastAvatarX = 0
        let lastAvatarY = 0
        let lastStageW = 0
        let lastStageH = 0

        const tick = () => {
            if (avatarRef.current && stageRef.current) {
                const aRect = avatarRef.current.getBoundingClientRect()
                const sRect = stageRef.current.getBoundingClientRect()

                if (
                    aRect.x !== lastAvatarX ||
                    aRect.y !== lastAvatarY ||
                    sRect.width !== lastStageW ||
                    sRect.height !== lastStageH
                ) {
                    calculateLayout()
                    lastAvatarX = aRect.x
                    lastAvatarY = aRect.y
                    lastStageW = sRect.width
                    lastStageH = sRect.height
                }
            }
            frameId = requestAnimationFrame(tick)
        }

        tick()

        return () => cancelAnimationFrame(frameId)
    }, [isLoaded, calculateLayout])

    const onPointerDown = (e: React.PointerEvent<HTMLImageElement>) => {
        setIsDragging(true)
        dragStart.current = {
            x: e.clientX,
            y: e.clientY,
            offsetX: dragOffset.x,
            offsetY: dragOffset.y,
        }
        e.currentTarget.setPointerCapture(e.pointerId)
    }

    const onPointerMove = (e: React.PointerEvent<HTMLImageElement>) => {
        if (!isDragging) return
        setDragOffset({
            x: dragStart.current.offsetX + (e.clientX - dragStart.current.x),
            y: dragStart.current.offsetY + (e.clientY - dragStart.current.y),
        })
    }

    const onPointerUp = (e: React.PointerEvent<HTMLImageElement>) => {
        setIsDragging(false)
        setDragOffset({ x: 0, y: 0 })
        e.currentTarget.releasePointerCapture(e.pointerId)
    }

    return (
        <section className="h-screen w-full pt-12 px-4 sm:pt-20 sm:px-8 lg:pt-24 lg:px-12 xl:px-24 bg-canvas-medium overflow-hidden">
            <div
                className="h-full w-full flex items-center justify-center relative"
                ref={stageRef}
            >
                <Image
                    src="/assets/Ankit Bhagat.png"
                    alt="Ankit Bhagat"
                    width={config.imgW}
                    height={config.imgH}
                    draggable={false}
                    className={`absolute top-1/2 left-1/2 touch-none z-10 ${
                        isDragging
                            ? 'cursor-grabbing'
                            : 'cursor-grab transition-transform duration-[500ms] cubic-bezier(0.34, 1.56, 0.64, 1)'
                    }`}
                    style={{
                        transform: `translate(calc(-50% + ${dragOffset.x}px), calc(-50% + ${dragOffset.y}px))`,
                    }}
                    ref={avatarRef}
                    onPointerDown={onPointerDown}
                    onPointerMove={onPointerMove}
                    onPointerUp={onPointerUp}
                    onPointerCancel={onPointerUp}
                    priority
                />

                {lines.map((line, index) => (
                    <span
                        key={index}
                        className="absolute uppercase font-bold leading-none whitespace-pre pointer-events-none text-[#000]"
                        style={{
                            left: line.x,
                            top: line.y,
                            width: line.width,
                            fontFamily: "'Anybody', sans-serif",
                            fontSize: `${config.fontSize}px`,
                        }}
                    >
                        {line.text}
                    </span>
                ))}
            </div>
        </section>
    )
}

export default Hero
