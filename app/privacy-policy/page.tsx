import { readFileSync } from "fs"
import { join } from "path"
import { Suspense } from "react"
import ReactMarkdown from "react-markdown"
import { BackButton } from "./back-button"

export const metadata = {
  title: "Политика обработки персональных данных",
  description: "Политика обработки персональных данных сервиса Kircraft",
}

function getPrivacyPolicyContent(): string {
  const path = join(process.cwd(), "content", "privacy-policy.md")
  return readFileSync(path, "utf-8")
}

export default function PrivacyPolicyPage() {
  const content = getPrivacyPolicyContent()

  return (
    <main className="min-h-screen bg-background">
      <article className="mx-auto max-w-[700px] px-4 py-8 sm:px-6">
        <Suspense fallback={<span className="text-xs text-muted-foreground mb-4 inline-block">← Назад</span>}>
          <BackButton />
        </Suspense>
        <h1 className="text-2xl font-semibold text-foreground mb-8">
          Политика обработки персональных данных
        </h1>
        <div className="prose-policy text-foreground text-sm leading-relaxed [&_h2]:mt-6 [&_h2]:mb-3 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-foreground [&_h3]:mt-4 [&_h3]:mb-2 [&_h3]:text-base [&_h3]:font-medium [&_p]:mb-3 [&_p]:text-muted-foreground [&_ul]:mb-3 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:text-muted-foreground [&_li]:mb-1">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      </article>
    </main>
  )
}
