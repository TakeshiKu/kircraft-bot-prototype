import { TelegramBot } from "@/components/telegram-bot"

export default function Home() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-4">
      <TelegramBot />
    </main>
  )
}
