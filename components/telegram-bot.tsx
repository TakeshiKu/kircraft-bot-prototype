"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Send, MoreHorizontal } from "lucide-react"

type Screen =
  | "start"
  | "main-menu"
  | "catalog"
  | "catalog-page-2"
  | "product-list"
  | "product-card"
  | "collections"
  | "collection-products"
  | "collection-product-card"
  | "new-items"
  | "gallery"
  | "about"
  | "contact"

interface Product {
  id: number
  name: string
  description: string
  price: string
  category: string
}

interface TeamMember {
  id: number
  name: string
  role: string
  description: string
}

const products: Product[] = [
  { id: 1, name: "Классический бумажник", description: "Ручная работа из премиальной кожи растительного дубления", price: "8 900 ₽", category: "wallets" },
  { id: 2, name: "Тонкий картхолдер", description: "Минималистичный дизайн, вмещает до 6 карт", price: "4 500 ₽", category: "cardholders" },
  { id: 3, name: "Кожаный бейдж", description: "Профессиональный держатель для ID с ланьярдом", price: "3 500 ₽", category: "badges" },
  { id: 4, name: "Обложка для скетчбука", description: "Подходит для блокнотов A5, есть петля для ручки", price: "6 500 ₽", category: "sketchbooks" },
  { id: 5, name: "Органайзер для кабелей", description: "Держите ваши кабели в порядке и под защитой", price: "2 500 ₽", category: "accessories" },
  { id: 6, name: "Чехол для телефона", description: "Индивидуальный размер под ваше устройство", price: "5 500 ₽", category: "cases" },
]

const edgeCollection: Product[] = [
  { id: 101, name: "Edge Кошелёк", description: "Чёткие линии, современная эстетика", price: "9 500 ₽", category: "edge" },
  { id: 102, name: "Edge Картхолдер", description: "Геометрическая точность дизайна", price: "5 500 ₽", category: "edge" },
]

const tacticalCollection: Product[] = [
  { id: 201, name: "Tactical Кошелёк", description: "Прочность и надёжность в стильном исполнении", price: "11 000 ₽", category: "tactical" },
  { id: 202, name: "Tactical Органайзер", description: "MOLLE-совместимый подсумок", price: "7 500 ₽", category: "tactical" },
]

const team: TeamMember[] = [
  { id: 1, name: "Александр", role: "Мастер", description: "20 лет опыта работы с кожей. Специализируется на кошельках и картхолдерах." },
  { id: 2, name: "Мария", role: "Дизайнер", description: "Создаёт уникальные паттерны и дизайны для каждой коллекции." },
]

const galleryImages = [
  "Интерьер мастерской с естественным светом",
  "Процесс раскроя кожи",
  "Детали ручного шитья",
  "Коллекция готовых кошельков",
  "Техника обработки урезов",
]

export function TelegramBot() {
  const [screen, setScreen] = useState<Screen>("start")
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [selectedCollection, setSelectedCollection] = useState<string>("")
  const [newItemIndex, setNewItemIndex] = useState(0)
  const [galleryIndex, setGalleryIndex] = useState(0)
  const [teamIndex, setTeamIndex] = useState(0)

  const filteredProducts = products.filter(p => p.category === selectedCategory)
  const collectionProducts = selectedCollection === "edge" ? edgeCollection : tacticalCollection
  const newItems = products.slice(0, 3)

  const renderScreen = () => {
    switch (screen) {
      case "start":
        return (
          <div className="flex flex-col h-full">
            <div className="flex-1 flex flex-col items-center justify-center p-6 gap-6">
              <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center">
                <span className="text-3xl text-muted-foreground">КМ</span>
              </div>
              <div className="text-center">
                <h2 className="text-lg font-medium text-foreground">Кожевенная мастерская</h2>
                <p className="text-sm text-muted-foreground mt-2">
                  Добро пожаловать в мастерскую изделий ручной работы из кожи.
                  Нажмите «Начать», чтобы ознакомиться с нашими изделиями.
                </p>
              </div>
            </div>
            <div className="p-4">
              <Button
                className="w-full"
                onClick={() => setScreen("main-menu")}
              >
                Начать
              </Button>
            </div>
          </div>
        )

      case "main-menu":
        return (
          <div className="flex flex-col h-full">
            <div className="flex-1 p-4">
              <div className="bg-secondary/50 rounded-lg p-3 mb-4 max-w-[85%]">
                <p className="text-sm text-foreground">Добро пожаловать! Выберите раздел из меню ниже:</p>
              </div>
            </div>
            <div className="p-4 grid grid-cols-2 gap-2">
              <Button variant="outline" className="h-11" onClick={() => setScreen("catalog")}>
                Каталог
              </Button>
              <Button variant="outline" className="h-11" onClick={() => setScreen("collections")}>
                Коллекции
              </Button>
              <Button variant="outline" className="h-11" onClick={() => { setNewItemIndex(0); setScreen("new-items"); }}>
                Новинки
              </Button>
              <Button variant="outline" className="h-11" onClick={() => { setGalleryIndex(0); setScreen("gallery"); }}>
                Галерея
              </Button>
              <Button variant="outline" className="h-11" onClick={() => { setTeamIndex(0); setScreen("about"); }}>
                О мастерской
              </Button>
              <Button variant="outline" className="h-11" onClick={() => setScreen("contact")}>
                Написать мастеру
              </Button>
            </div>
          </div>
        )

      case "catalog":
        const categoryLabels: Record<string, string> = {
          wallets: "Кошельки",
          cardholders: "Картхолдеры",
          badges: "Бейджи",
          sketchbooks: "Скетчбуки",
          dockholders: "Докхолдеры",
          accessories: "Аксессуары",
          cases: "Кейсы",
          organizers: "Органайзеры",
        }
        return (
          <div className="flex flex-col h-full">
            <div className="flex-1 p-4">
              <div className="bg-secondary/50 rounded-lg p-3 mb-4 max-w-[85%]">
                <p className="text-sm text-foreground font-medium">Выберите категорию изделий:</p>
              </div>
            </div>
            <div className="p-4 space-y-2">
              <div className="grid grid-cols-2 gap-2">
                {["wallets", "cardholders", "badges", "sketchbooks", "dockholders", "accessories"].map((cat) => (
                  <Button
                    key={cat}
                    variant="outline"
                    className="h-11"
                    onClick={() => { setSelectedCategory(cat); setScreen("product-list"); }}
                  >
                    {categoryLabels[cat]}
                  </Button>
                ))}
              </div>
              <div className="flex items-center justify-between pt-2">
                <Button variant="ghost" onClick={() => setScreen("main-menu")}>
                  <ChevronLeft className="mr-1 size-4" /> Главное меню
                </Button>
                <Button variant="secondary" size="icon" className="h-11 w-11" onClick={() => setScreen("catalog-page-2")}>
                  <ChevronRight className="size-5" />
                </Button>
              </div>
            </div>
          </div>
        )

      case "catalog-page-2":
        const categoryLabels2: Record<string, string> = {
          cases: "Кейсы",
          organizers: "Органайзеры",
        }
        return (
          <div className="flex flex-col h-full">
            <div className="flex-1 p-4">
              <div className="bg-secondary/50 rounded-lg p-3 mb-4 max-w-[85%]">
                <p className="text-sm text-foreground font-medium">Ещё категории:</p>
              </div>
            </div>
            <div className="p-4 space-y-2">
              <div className="grid grid-cols-2 gap-2">
                {["cases", "organizers"].map((cat) => (
                  <Button
                    key={cat}
                    variant="outline"
                    className="h-11"
                    onClick={() => { setSelectedCategory(cat); setScreen("product-list"); }}
                  >
                    {categoryLabels2[cat]}
                  </Button>
                ))}
              </div>
              <div className="flex items-center justify-between pt-2">
                <Button variant="ghost" onClick={() => setScreen("main-menu")}>
                  <ChevronLeft className="mr-1 size-4" /> Главное меню
                </Button>
                <Button variant="secondary" size="icon" className="h-11 w-11" onClick={() => setScreen("catalog")}>
                  <ChevronLeft className="size-5" />
                </Button>
              </div>
            </div>
          </div>
        )

      case "product-list":
        const catLabels: Record<string, string> = {
          wallets: "Кошельки",
          cardholders: "Картхолдеры",
          badges: "Бейджи",
          sketchbooks: "Скетчбуки",
          dockholders: "Докхолдеры",
          accessories: "Аксессуары",
          cases: "Кейсы",
          organizers: "Органайзеры",
        }
        return (
          <div className="flex flex-col h-full">
            <div className="flex-1 p-4 overflow-auto">
              <div className="bg-secondary/50 rounded-lg p-3 mb-4 max-w-[85%]">
                <p className="text-sm text-foreground font-medium">{catLabels[selectedCategory] || selectedCategory}</p>
              </div>
              <div className="space-y-3">
                {filteredProducts.length > 0 ? filteredProducts.map((product) => (
                  <button
                    key={product.id}
                    className="w-full bg-card border border-border rounded-lg p-3 flex gap-3 items-center hover:bg-secondary/50 transition-colors text-left"
                    onClick={() => { setSelectedProduct(product); setScreen("product-card"); }}
                  >
                    <div className="w-14 h-14 bg-secondary rounded-md flex items-center justify-center shrink-0">
                      <span className="text-xs text-muted-foreground">ФОТО</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{product.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{product.description}</p>
                      <p className="text-sm font-semibold text-primary mt-1">{product.price}</p>
                    </div>
                  </button>
                )) : (
                  <p className="text-sm text-muted-foreground text-center py-8">В этой категории пока нет товаров.</p>
                )}
              </div>
            </div>
            <div className="p-4 flex gap-2">
              <Button variant="secondary" className="flex-1" onClick={() => setScreen("catalog")}>
                <ChevronLeft className="mr-1 size-4" /> Каталог
              </Button>
              <Button variant="ghost" className="flex-1" onClick={() => setScreen("main-menu")}>
                <ChevronLeft className="mr-1 size-4" /> Главное меню
              </Button>
            </div>
          </div>
        )

      case "product-card":
        return (
          <div className="flex flex-col h-full">
            <div className="flex-1 p-4 overflow-auto">
              <div className="bg-secondary rounded-lg aspect-square flex items-center justify-center mb-4">
                <span className="text-muted-foreground">Фото товара</span>
              </div>
              <h3 className="text-lg font-semibold text-foreground">{selectedProduct?.name}</h3>
              <p className="text-sm text-muted-foreground mt-2">{selectedProduct?.description}</p>
              <p className="text-xl font-bold text-primary mt-3">{selectedProduct?.price}</p>
            </div>
            <div className="p-4 space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <Button className="h-11">Заказать</Button>
                <Button variant="outline" className="h-11">Еще фото</Button>
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" className="flex-1" onClick={() => setScreen("product-list")}>
                  <ChevronLeft className="mr-1 size-4" /> Каталог
                </Button>
                <Button variant="ghost" className="flex-1" onClick={() => setScreen("main-menu")}>
                  <ChevronLeft className="mr-1 size-4" /> Главное меню
                </Button>
              </div>
            </div>
          </div>
        )

      case "collections":
        return (
          <div className="flex flex-col h-full">
            <div className="flex-1 p-4">
              <div className="bg-secondary/50 rounded-lg p-3 mb-4 max-w-[85%]">
                <p className="text-sm text-foreground font-medium">Выберите коллекцию:</p>
              </div>
            </div>
            <div className="p-4 space-y-2">
              <Button
                variant="outline"
                className="w-full h-11"
                onClick={() => { setSelectedCollection("edge"); setScreen("collection-products"); }}
              >
                Edge
              </Button>
              <Button
                variant="outline"
                className="w-full h-11"
                onClick={() => { setSelectedCollection("tactical"); setScreen("collection-products"); }}
              >
                Tactical
              </Button>
              <Button variant="ghost" className="w-full" onClick={() => setScreen("main-menu")}>
                <ChevronLeft className="mr-1 size-4" /> Главное меню
              </Button>
            </div>
          </div>
        )

      case "collection-products":
        return (
          <div className="flex flex-col h-full">
            <div className="flex-1 p-4 overflow-auto">
              <div className="bg-secondary/50 rounded-lg p-3 mb-4 max-w-[85%]">
                <p className="text-sm text-foreground font-medium">Коллекция {selectedCollection}</p>
              </div>
              <div className="space-y-3">
                {collectionProducts.map((product) => (
                  <button
                    key={product.id}
                    className="w-full bg-card border border-border rounded-lg p-3 flex gap-3 items-center hover:bg-secondary/50 transition-colors text-left"
                    onClick={() => { setSelectedProduct(product); setScreen("collection-product-card"); }}
                  >
                    <div className="w-14 h-14 bg-secondary rounded-md flex items-center justify-center shrink-0">
                      <span className="text-xs text-muted-foreground">ФОТО</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{product.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{product.description}</p>
                      <p className="text-sm font-semibold text-primary mt-1">{product.price}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            <div className="p-4 flex gap-2">
              <Button variant="secondary" className="flex-1" onClick={() => setScreen("collections")}>
                <ChevronLeft className="mr-1 size-4" /> Коллекции
              </Button>
              <Button variant="ghost" className="flex-1" onClick={() => setScreen("main-menu")}>
                <ChevronLeft className="mr-1 size-4" /> Главное меню
              </Button>
            </div>
          </div>
        )

      case "collection-product-card":
        return (
          <div className="flex flex-col h-full">
            <div className="flex-1 p-4 overflow-auto">
              <div className="bg-secondary rounded-lg aspect-square flex items-center justify-center mb-4">
                <span className="text-muted-foreground">Фото товара</span>
              </div>
              <h3 className="text-lg font-semibold text-foreground">{selectedProduct?.name}</h3>
              <p className="text-sm text-muted-foreground mt-2">{selectedProduct?.description}</p>
              <p className="text-xl font-bold text-primary mt-3">{selectedProduct?.price}</p>
            </div>
            <div className="p-4 space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <Button className="h-11">Заказать</Button>
                <Button variant="outline" className="h-11">Еще фото</Button>
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" className="flex-1" onClick={() => setScreen("collection-products")}>
                  <ChevronLeft className="mr-1 size-4" /> Коллекция
                </Button>
                <Button variant="ghost" className="flex-1" onClick={() => setScreen("main-menu")}>
                  <ChevronLeft className="mr-1 size-4" /> Главное меню
                </Button>
              </div>
            </div>
          </div>
        )

      case "new-items":
        const currentNewItem = newItems[newItemIndex]
        return (
          <div className="flex flex-col h-full">
            <div className="flex-1 p-4 overflow-auto">
              <div className="bg-secondary rounded-lg aspect-square flex items-center justify-center mb-4">
                <span className="text-muted-foreground">Фото товара</span>
              </div>
              <h3 className="text-lg font-semibold text-foreground">{currentNewItem?.name}</h3>
              <p className="text-sm text-muted-foreground mt-2">{currentNewItem?.description}</p>
              <p className="text-xl font-bold text-primary mt-3">{currentNewItem?.price}</p>
            </div>
            <div className="p-4 space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <Button className="h-11">Заказать</Button>
                <Button variant="outline" className="h-11">Еще фото</Button>
              </div>
              <div className="flex items-center justify-between">
                <Button variant="ghost" onClick={() => setScreen("main-menu")}>
                  <ChevronLeft className="mr-1 size-4" /> Главное меню
                </Button>
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-11 w-11"
                    disabled={newItemIndex === 0}
                    onClick={() => setNewItemIndex(i => Math.max(0, i - 1))}
                  >
                    <ChevronLeft className="size-5" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-11 w-11"
                    disabled={newItemIndex === newItems.length - 1}
                    onClick={() => setNewItemIndex(i => Math.min(newItems.length - 1, i + 1))}
                  >
                    <ChevronRight className="size-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )

      case "gallery":
        return (
          <div className="flex flex-col h-full">
            <div className="flex-1 p-4 flex flex-col">
              <div className="flex-1 bg-secondary rounded-lg flex items-center justify-center">
                <span className="text-muted-foreground text-center px-4">{galleryImages[galleryIndex]}</span>
              </div>
              <p className="text-center text-sm text-muted-foreground mt-3">
                {galleryIndex + 1} / {galleryImages.length}
              </p>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between">
                <Button variant="ghost" onClick={() => setScreen("main-menu")}>
                  <ChevronLeft className="mr-1 size-4" /> Главное меню
                </Button>
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-11 w-11"
                    disabled={galleryIndex === 0}
                    onClick={() => setGalleryIndex(i => Math.max(0, i - 1))}
                  >
                    <ChevronLeft className="size-5" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-11 w-11"
                    disabled={galleryIndex === galleryImages.length - 1}
                    onClick={() => setGalleryIndex(i => Math.min(galleryImages.length - 1, i + 1))}
                  >
                    <ChevronRight className="size-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )

      case "about":
        const currentMember = team[teamIndex]
        return (
          <div className="flex flex-col h-full">
            <div className="flex-1 p-4 overflow-auto">
              <div className="bg-secondary rounded-lg aspect-square flex items-center justify-center mb-4">
                <span className="text-muted-foreground">Фото команды</span>
              </div>
              <h3 className="text-lg font-semibold text-foreground">{currentMember?.name}</h3>
              <p className="text-sm text-primary font-medium">{currentMember?.role}</p>
              <p className="text-sm text-muted-foreground mt-2">{currentMember?.description}</p>
            </div>
            <div className="p-4 space-y-2">
              <Button variant="outline" className="w-full h-11">
                Наш канал
              </Button>
              <div className="flex items-center justify-between">
                <Button variant="ghost" onClick={() => setScreen("main-menu")}>
                  <ChevronLeft className="mr-1 size-4" /> Главное меню
                </Button>
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-11 w-11"
                    disabled={teamIndex === 0}
                    onClick={() => setTeamIndex(i => Math.max(0, i - 1))}
                  >
                    <ChevronLeft className="size-5" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-11 w-11"
                    disabled={teamIndex === team.length - 1}
                    onClick={() => setTeamIndex(i => Math.min(team.length - 1, i + 1))}
                  >
                    <ChevronRight className="size-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )

      case "contact":
        return (
          <div className="flex flex-col h-full">
            <div className="flex-1 flex flex-col items-center justify-center p-6 gap-6">
              <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center">
                <span className="text-2xl text-muted-foreground">М</span>
              </div>
              <div className="text-center">
                <h2 className="text-lg font-medium text-foreground">Связаться с мастером</h2>
                <p className="text-sm text-muted-foreground mt-2">
                  Есть вопросы по индивидуальным заказам или нашим изделиям? Свяжитесь напрямую.
                </p>
              </div>
            </div>
            <div className="p-4 space-y-2">
              <Button className="w-full h-11">
                Написать мастеру
              </Button>
              <Button variant="ghost" className="w-full" onClick={() => setScreen("main-menu")}>
                <ChevronLeft className="mr-1 size-4" /> Главное меню
              </Button>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="w-full max-w-sm mx-auto">
      {/* Phone Frame */}
      <div className="bg-card rounded-[2.5rem] p-2 shadow-2xl border border-border">
        {/* Screen */}
        <div className="bg-background rounded-[2rem] overflow-hidden">
          {/* Status Bar */}
          <div className="h-7 bg-card flex items-center justify-between px-6 text-xs text-muted-foreground">
            <span>9:41</span>
            <div className="flex items-center gap-1">
              <div className="w-4 h-2 border border-muted-foreground rounded-sm">
                <div className="w-2/3 h-full bg-muted-foreground rounded-sm" />
              </div>
            </div>
          </div>

          {/* Chat Header */}
          <div className="h-14 bg-card border-b border-border flex items-center px-4 gap-3">
            <button
              className="text-primary hover:text-primary/80 transition-colors"
              onClick={() => setScreen("main-menu")}
            >
              <ChevronLeft className="size-6" />
            </button>
            <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center">
              <span className="text-xs font-medium text-muted-foreground">КМ</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-foreground">Кожевенная мастерская</p>
              <p className="text-xs text-primary">бот</p>
            </div>
            <button className="text-muted-foreground hover:text-foreground transition-colors">
              <MoreHorizontal className="size-5" />
            </button>
          </div>

          {/* Chat Content */}
          <div className="h-[500px] bg-background">
            {renderScreen()}
          </div>

          {/* Input Bar */}
          <div className="h-14 bg-card border-t border-border flex items-center px-4 gap-3">
            <div className="flex-1 h-9 bg-secondary rounded-full px-4 flex items-center">
              <span className="text-sm text-muted-foreground">Сообщение</span>
            </div>
            <button className="w-9 h-9 bg-primary rounded-full flex items-center justify-center text-primary-foreground">
              <Send className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
