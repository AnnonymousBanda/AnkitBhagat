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

const FONT: string = '700 50px "Anybody", sans-serif'
const LINE_HEIGHT: number = 54

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

        const generated: LayoutLine[] = []
        let cursor: LayoutCursor = { segmentIndex: 0, graphemeIndex: 0 }
        let y = 0
        let isDone = false

        while (y + LINE_HEIGHT <= stageRect.height && !isDone) {
            const bandTop = y
            const bandBottom = y + LINE_HEIGHT

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
                y += LINE_HEIGHT
                continue
            }

            for (const slot of slots) {
                const width = slot.right - slot.left

                if (width < 40) continue

                const line = layoutNextLine(preparedRef.current, cursor, width)

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

            y += LINE_HEIGHT
        }

        setLines(generated)
    }, [])

    useEffect(() => {
        let isActive = true

        const init = async () => {
            preparedRef.current = prepareWithSegments(INTRO, FONT)
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
        }
    }, [])

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
        <section className="h-screen w-full pt-[10rem] px-[10rem] bg-canvas-medium overflow-hidden">
            <div
                className="max-container h-full flex items-center justify-center relative"
                ref={stageRef}
            >
                <Image
                    src="/assets/Ankit Bhagat.png"
                    alt="Ankit Bhagat"
                    width={400}
                    height={600}
                    draggable={false}
                    className={`absolute top-1/2 left-1/2 touch-none z-10 ${
                        isDragging
                            ? 'cursor-grabbing'
                            : 'cursor-grab transition-transform duration-[400ms] ease-out'
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
                            fontSize: '50px',
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
