'use client'

import {
    useEffect,
    useMemo,
    useRef,
    useReducer,
    useCallback,
    useState,
    KeyboardEvent,
} from 'react'
import commandData from './commands.json'

type LineType = 'input' | 'success' | 'error' | 'info' | 'muted' | 'link'

type CommandLine = {
    type: LineType
    content: string
    href?: string
    download?: boolean
}

type CommandDef = {
    name: string
    aliases?: string[]
    description?: string
    lines: CommandLine[]
}

type TerminalLine = CommandLine & { id: string }

type TerminalState = {
    lines: TerminalLine[]
    busy: boolean
}

type TerminalAction =
    | { type: 'PUSH'; line: Omit<TerminalLine, 'id'> }
    | { type: 'CLEAR' }
    | { type: 'SET_BUSY'; busy: boolean }

function buildRegistry(defs: CommandDef[]): Map<string, CommandDef> {
    const map = new Map<string, CommandDef>()
    for (const def of defs) {
        map.set(def.name, def)
        def.aliases?.forEach((a) => map.set(a, def))
    }
    return map
}

function parseInput(raw: string): { name: string; args: string[] } {
    const [name = '', ...args] = raw.trim().toLowerCase().split(/\s+/)
    return { name, args }
}

function useSoundEffects() {
    const play = useCallback(
        (freq: number, dur = 0.08, wave: OscillatorType = 'sine') => {
            if (typeof window === 'undefined') return
            try {
                const ctx = new window.AudioContext()
                const osc = ctx.createOscillator()
                const gain = ctx.createGain()
                osc.type = wave
                osc.frequency.value = freq
                osc.connect(gain)
                gain.connect(ctx.destination)
                gain.gain.setValueAtTime(0.03, ctx.currentTime)
                osc.start()
                osc.stop(ctx.currentTime + dur)
            } catch {}
        },
        [],
    )

    return {
        keystroke: () => play(420, 0.04, 'square'),
        success: () => play(640, 0.06, 'triangle'),
        error: () => play(160, 0.12, 'sawtooth'),
        link: () => play(880, 0.05, 'sine'),
    }
}

const uid = () => crypto.randomUUID()

function terminalReducer(
    state: TerminalState,
    action: TerminalAction,
): TerminalState {
    switch (action.type) {
        case 'PUSH':
            return {
                ...state,
                lines: [...state.lines, { ...action.line, id: uid() }],
            }
        case 'CLEAR':
            return { ...state, lines: [] }
        case 'SET_BUSY':
            return { ...state, busy: action.busy }
        default:
            return state
    }
}

const INITIAL_STATE: TerminalState = {
    busy: false,
    lines: [
        {
            id: uid(),
            type: 'info',
            content: 'ANKIT TERMINAL v26.5 INITIALIZED',
        },
        {
            id: uid(),
            type: 'success',
            content: 'TYPE "HELP" TO VIEW AVAILABLE COMMANDS.',
        },
    ],
}

const Comm = () => {
    const registry = useMemo(
        () => buildRegistry(commandData as CommandDef[]),
        [],
    )

    const [state, dispatch] = useReducer(terminalReducer, INITIAL_STATE)
    const [input, setInput] = useState('')
    const [time, setTime] = useState('')

    const historyRef = useRef<string[]>([])
    const historyIndexRef = useRef<number>(-1)

    const transcriptRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)
    const sfx = useSoundEffects()

    useEffect(() => {
        const fmt = new Intl.DateTimeFormat('en-IN', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        })
        const id = setInterval(() => setTime(fmt.format(new Date())), 1000)
        return () => clearInterval(id)
    }, [])

    useEffect(() => {
        transcriptRef.current?.scrollTo({
            top: transcriptRef.current.scrollHeight,
            behavior: 'smooth',
        })
    }, [state.lines])

    const pushLine = useCallback((line: Omit<TerminalLine, 'id'>) => {
        dispatch({ type: 'PUSH', line })
        if (line.type === 'success' || line.type === 'link') sfx.success()
        if (line.type === 'error') sfx.error()
    }, [])

    const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms))

    const pushTypingLines = useCallback(
        async (lines: CommandLine[], delay = 220) => {
            for (const line of lines) {
                dispatch({ type: 'PUSH', line })
                if (line.type === 'success' || line.type === 'link')
                    sfx.success()
                if (line.type === 'error') sfx.error()
                await wait(delay)
            }
        },
        [],
    )

    const executeCommand = useCallback(
        async (raw: string) => {
            const trimmed = raw.trim()
            if (!trimmed || state.busy) return

            dispatch({
                type: 'PUSH',
                line: { type: 'input', content: `> ${trimmed}` },
            })

            historyRef.current = [trimmed, ...historyRef.current.slice(0, 49)]
            historyIndexRef.current = -1

            dispatch({ type: 'SET_BUSY', busy: true })

            const { name } = parseInput(trimmed)

            if (name === 'clear' || name === 'cls') {
                dispatch({ type: 'CLEAR' })
                dispatch({ type: 'SET_BUSY', busy: false })
                return
            }

            const def = registry.get(name)

            if (!def) {
                pushLine({
                    type: 'error',
                    content: `COMMAND NOT FOUND: "${name}" — type 'help' for a list`,
                })
                dispatch({ type: 'SET_BUSY', busy: false })
                return
            }

            await pushTypingLines(def.lines)
            dispatch({ type: 'SET_BUSY', busy: false })
        },
        [state.busy, registry, pushLine, pushTypingLines],
    )

    const handleKeyDown = useCallback(
        async (e: KeyboardEvent<HTMLInputElement>) => {
            // History navigation
            if (e.key === 'ArrowUp') {
                e.preventDefault()
                const next = historyIndexRef.current + 1
                if (next < historyRef.current.length) {
                    historyIndexRef.current = next
                    setInput(historyRef.current[next])
                }
                return
            }

            if (e.key === 'ArrowDown') {
                e.preventDefault()
                const next = historyIndexRef.current - 1
                if (next < 0) {
                    historyIndexRef.current = -1
                    setInput('')
                } else {
                    historyIndexRef.current = next
                    setInput(historyRef.current[next])
                }
                return
            }

            if (e.key === 'Tab') {
                e.preventDefault()
                const partial = input.trim().toLowerCase()
                if (!partial) return
                const match = [...registry.keys()].find((k) =>
                    k.startsWith(partial),
                )
                if (match) setInput(match)
                return
            }

            sfx.keystroke()

            if (e.key !== 'Enter') return

            const trimmed = input.trim()
            if (!trimmed) return

            setInput('')
            await executeCommand(trimmed)
        },
        [input, registry, executeCommand],
    )

    const handleChipClick = useCallback(
        async (cmd: string) => {
            if (state.busy) return
            sfx.keystroke()
            setInput('')
            await executeCommand(cmd)
        },
        [state.busy, executeCommand],
    )

    return (
        <section className="max-container flex-center min-h-screen py-[15rem]">
            <div
                className="h-full w-full overflow-hidden rounded-[2rem] border-2 border-black bg-[#FFFFFF] shadow-[12px_12px_0px_#000]"
                onClick={() => inputRef.current?.focus()}
            >
                <div className="flex items-center justify-between border-b-2 border-black px-8 py-5 max-md:flex-col max-md:items-start max-md:gap-3">
                    <div>
                        <h2 className="text-ink-dark font-bold tracking-tight uppercase">
                            ANKIT TERMINAL v26.5
                        </h2>
                        <p className="mt-1 font-medium uppercase tracking-[0.18em] text-sm opacity-60">
                            Kolkata • IIT Patna • Batch 2027
                        </p>
                    </div>

                    <div className="flex items-center gap-3 font-medium uppercase tracking-[0.14em] text-sm">
                        <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse" />
                        <span>SYSTEM ONLINE</span>
                        <span className="opacity-50 tabular-nums">{time}</span>
                    </div>
                </div>

                <div
                    ref={transcriptRef}
                    className="h-[50vh] overflow-y-auto bg-canvas-light px-8 py-6 font-mono"
                    aria-live="polite"
                    aria-label="Terminal output"
                >
                    <div className="space-y-3">
                        {state.lines.map((line) => (
                            <TerminalLineComponent key={line.id} line={line} />
                        ))}

                        {state.busy && (
                            <div className="text-black/40 text-sm uppercase tracking-widest animate-pulse">
                                ···
                            </div>
                        )}
                    </div>
                </div>

                <div className="border-t-2 border-black px-8 py-6">
                    <div className="flex items-center gap-3">
                        <input
                            ref={inputRef}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="type a command..."
                            disabled={state.busy}
                            aria-label="Terminal input"
                            className="flex-1 border-none bg-transparent text-lg font-mono font-medium uppercase tracking-[0.06em] outline-none placeholder:text-black/25 disabled:opacity-40"
                        />
                    </div>

                    <p className="mt-2 text-sm font-mono text-black/30 uppercase tracking-widest">
                        ↑↓ history &nbsp;·&nbsp; TAB autocomplete &nbsp;·&nbsp;
                        ENTER execute
                    </p>

                    {/* Quick-access chips */}
                    <div className="mt-6 flex flex-wrap gap-2">
                        {[
                            'about',
                            'hire',
                            'whyhire',
                            'projects',
                            'stack',
                            'socials',
                            'contact',
                            'resume',
                        ].map((chip) => (
                            <button
                                key={chip}
                                onClick={() => handleChipClick(chip)}
                                disabled={state.busy}
                                className="cursor-pointer rounded-full border-2 border-black bg-white px-5 py-1.5 text-sm font-bold uppercase tracking-[0.08em] transition-all duration-150 hover:bg-canvas-dark hover:text-ink-light active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                {chip}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Blink keyframe — injected once */}
            <style>{`
                @keyframes blink {
                    0%, 100% { opacity: 1; }
                    50%       { opacity: 0; }
                }
            `}</style>
        </section>
    )
}

const LINE_STYLES: Record<LineType, string> = {
    input: 'text-black font-bold',
    success: 'text-green-700',
    error: 'text-red-600',
    info: 'text-blue-700',
    muted: 'text-black/35',
    link: 'text-green-700 underline underline-offset-2 cursor-pointer hover:text-green-500 transition-colors',
}

function TerminalLineComponent({ line }: { line: TerminalLine }) {
    const [visible, setVisible] = useState('')
    const sfx = useSoundEffects()

    useEffect(() => {
        let i = 0
        const id = setInterval(() => {
            setVisible(line.content.slice(0, i))
            i++
            if (i > line.content.length) clearInterval(id)
        }, 10)
        return () => clearInterval(id)
    }, [line.content])

    const className = `text-sm uppercase tracking-[0.05em] leading-[1.8] font-mono ${LINE_STYLES[line.type]}`

    if (line.type === 'link' && line.href) {
        return (
            <div className={className}>
                <a
                    href={line.href}
                    target={line.download ? '_self' : '_blank'}
                    rel="noopener noreferrer"
                    download={line.download || undefined}
                    onClick={() => sfx.link()}
                    className="inline-block"
                >
                    {visible}
                    <span className="ml-1 opacity-50 text-xs">↗</span>
                </a>
            </div>
        )
    }

    return <div className={className}>{visible}</div>
}

export default Comm
