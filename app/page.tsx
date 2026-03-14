import { Suspense } from "react"
import { TelegramBot } from "@/components/telegram-bot"

export default function Home() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-4">
      <Suspense fallback={<div className="text-muted-foreground text-sm">Загрузка…</div>}>
        <TelegramBot />
      </Suspense>
    </main>
  )
}
