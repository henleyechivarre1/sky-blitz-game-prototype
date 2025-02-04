import { SkyBlitz } from "@/components/SkyBlitz"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold mb-8">Sky Blitz Game</h1>
      <SkyBlitz />
    </main>
  )
}

