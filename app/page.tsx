import { Arsenal, Comm, Hero, Work } from './sections'

export default function Home() {
    return (
        <main className="w-full">
            <Hero />
            <Work />
            <Arsenal />
            <Comm />
        </main>
    )
}
