export type CdekPickupPoint = {
  id: string
  name: string
  address: string
}

export type CdekPickupPointQuote = {
  pvz: CdekPickupPoint
  cost: number
  eta: string
}

function hashString(input: string): number {
  // Детерминированный "хэш" для мока, чтобы результаты менялись от города.
  let hash = 0
  for (let i = 0; i < input.length; i++) {
    hash = (hash * 31 + input.charCodeAt(i)) >>> 0
  }
  return hash
}

export function mockCdekGetPickupPointsAndQuotes(city: string): CdekPickupPointQuote[] {
  const normalized = city.trim()
  const h = hashString(normalized.toLowerCase())

  const variants = [
    { suffix: "Центральный", street: "ул. Ленина", house: 12 },
    { suffix: "Северный", street: "проспект Мира", house: 5 },
    { suffix: "Южный", street: "ул. Гагарина", house: 27 },
  ]

  // Выбираем 3 варианта детерминированно от города.
  const start = h % variants.length
  const selected = [0, 1, 2].map((i) => variants[(start + i) % variants.length])

  return selected.map((v, idx) => {
    const pvzIndexSeed = (h + idx * 97) % 1000
    const baseCost = 430
    const variableCost = 120 * ((pvzIndexSeed % 5) + 1) // 120..720
    const cost = baseCost + variableCost

    const etaDaysMin = 2 + (pvzIndexSeed % 3) // 2..4
    const etaDaysMax = etaDaysMin + 1 + ((pvzIndexSeed >> 2) % 2) // +1..+2

    const pvz: CdekPickupPoint = {
      id: `pvz_${h}_${idx}`,
      name: `ПВЗ ${normalized || "город"} • ${v.suffix}`,
      address: `${normalized || "город"}, ${v.street}, д. ${v.house}`,
    }

    return {
      pvz,
      cost,
      eta: `${etaDaysMin}-${etaDaysMax} дня`,
    }
  })
}

