"use client"

import { useRouter, useSearchParams } from "next/navigation"

export function BackButton() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const returnTo = searchParams.get("returnTo")

  const handleBack = () => {
    if (returnTo && returnTo.startsWith("/")) {
      router.push(returnTo)
    } else if (typeof window !== "undefined" && window.history.length > 1) {
      router.back()
    } else {
      router.push("/")
    }
  }

  return (
    <button
      type="button"
      onClick={handleBack}
      className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground mb-4"
    >
      ← Назад
    </button>
  )
}
