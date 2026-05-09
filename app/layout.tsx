import type { Metadata } from 'next'
import './globals.css'

import { Navbar } from '@/components'

export const metadata: Metadata = {
    title: 'Ankit Bhagat — Software Engineer',
    description:
        'Full-stack developer and ML engineer at IIT Patna. Building scalable digital infrastructure and AI-driven platforms.',
    keywords: [
        'Ankit Bhagat',
        'Ankit Bhagat IIT Patna',
        'Ankit Bhagat Portfolio',
        'Software Engineer',
        'Full-Stack Developer',
        'Machine Learning Engineer',
        'IIT Patna',
        'Next.js',
        'React',
        'Python',
        'Java DSA',
    ],
    authors: [{ name: 'Ankit Bhagat' }],
    creator: 'Ankit Bhagat',
    openGraph: {
        type: 'website',
        locale: 'en_IN',
        url: 'https://ankitbhagat.me',
        title: 'Ankit Bhagat — Software Engineer',
        description:
            'Engineering intelligent digital experiences. Building scalable web architecture and machine learning models at IIT Patna.',
        siteName: 'Ankit Bhagat',
        images: [
            {
                url: '/og-image.png',
                width: 1200,
                height: 630,
                alt: 'Ankit Bhagat — Software Engineer',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Ankit Bhagat — Software Engineer',
        description:
            'Engineering intelligent digital experiences. Building scalable web architecture and machine learning models at IIT Patna.',
        creator: '@Annonym_usBanda',
        images: ['/og-image.png'],
    },
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en">
            <body>
                <Navbar />
                {children}
            </body>
        </html>
    )
}
