import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'YourTube – Watch, Share, Discover',
  description: 'The home for video content. Watch millions of videos, discover creators, and share with the world.',
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><rect fill='%23FF0000' width='24' height='24' rx='5'/><polygon fill='white' points='10,7 17,12 10,17'/></svg>",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-yt-bg text-yt-text antialiased">
        {children}
      </body>
    </html>
  )
}
