"use client"

import { useState, type ReactNode } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { ChevronLeft, ChevronRight, Send, MoreHorizontal, Minus, Plus } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type Screen =
  | "start"
  | "main-menu"
  | "catalog"
  | "catalog-page-2"
  | "product-list"
  | "product-card"
  | "product-detail"
  | "collections"
  | "collection-products"
  | "collection-product-card"
  | "new-items"
  | "gallery"
  | "about"
  | "color-select"
  | "hardware-select"
  | "cart"
  | "checkout"
  | "post-order-demo"
  | "post-order-new"
  | "post-order-confirmed"
  | "post-order-clarification"
  | "post-order-in-progress"
  | "post-order-shipped"
  | "post-order-rejected"
  | "post-order-payment-received"

interface Product {
  id: number
  name: string
  description: string
  price: string
  category: string
  material?: string
  dimensions?: string
  features?: string
}

interface TeamMember {
  id: number
  name: string
  role: string
  description: string
}

interface CartPosition {
  product: Product
  color: string
  hardware: string
  quantity: number
}

const products: Product[] = [
  { id: 1, name: "Классический бумажник", description: "Ручная работа из премиальной кожи растительного дубления.", price: "8 900 ₽", category: "wallets", material: "Натуральная кожа", dimensions: "21 × 10 × 2 см", features: "Отделения для купюр и карт" },
  { id: 2, name: "Тонкий картхолдер", description: "Минималистичный дизайн, вмещает до 6 карт.", price: "4 500 ₽", category: "cardholders", material: "Натуральная кожа", dimensions: "10 × 7 см" },
  { id: 3, name: "Кожаный бейдж", description: "Профессиональный держатель для ID с ланьярдом", price: "3 500 ₽", category: "badges" },
  { id: 4, name: "Обложка для скетчбука", description: "Подходит для блокнотов A5, есть петля для ручки", price: "6 500 ₽", category: "sketchbooks" },
  { id: 5, name: "Органайзер для кабелей", description: "Держите ваши кабели в порядке и под защитой", price: "2 500 ₽", category: "accessories" },
  { id: 6, name: "Чехол для телефона", description: "Индивидуальный размер под ваше устройство", price: "5 500 ₽", category: "cases" },
]

const edgeCollection: Product[] = [
  { id: 101, name: "Edge Кошелёк", description: "Чёткие линии, современная эстетика.", price: "9 500 ₽", category: "edge", material: "Натуральная кожа", dimensions: "20 × 9 см" },
  { id: 102, name: "Edge Картхолдер", description: "Геометрическая точность, до 5 карт.", price: "5 500 ₽", category: "edge", material: "Натуральная кожа", dimensions: "9 × 6 см" },
]

const tacticalCollection: Product[] = [
  { id: 201, name: "Tactical Кошелёк", description: "Прочность и надёжность, водоотталкивающая пропитка.", price: "11 000 ₽", category: "tactical", material: "Усиленная кожа", dimensions: "22 × 11 см" },
  { id: 202, name: "Tactical Органайзер", description: "MOLLE-совместимый подсумок.", price: "7 500 ₽", category: "tactical", material: "Усиленная кожа", dimensions: "12 × 8 × 4 см" },
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

const COLOR_OPTIONS = [
  { name: "Чёрный", subtitle: "Флотер" },
  { name: "Коричневый", subtitle: "Гладкая кожа" },
  { name: "Синий", subtitle: "Наппа" },
  { name: "Бордовый", subtitle: "Гладкая кожа" },
]
const HARDWARE_OPTIONS = [
  { name: "Латунь", subtitle: "Классика" },
  { name: "Серебро", subtitle: "Матовое" },
  { name: "Никель", subtitle: "Глянец" },
  { name: "Чёрный матовый", subtitle: "Современный стиль" },
]

function parsePrice(priceStr: string): number {
  const cleaned = priceStr.replace(/\s/g, "").replace(/[^\d]/g, "")
  return parseInt(cleaned, 10) || 0
}

export function TelegramBot() {
  const [screen, setScreen] = useState<Screen>("start")
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [selectedCollection, setSelectedCollection] = useState<string>("")
  const [newItemIndex, setNewItemIndex] = useState(0)
  const [galleryIndex, setGalleryIndex] = useState(0)
  const [teamIndex, setTeamIndex] = useState(0)
  const [orderModalOpen, setOrderModalOpen] = useState(false)
  const [orderModalProduct, setOrderModalProduct] = useState<Product | null>(null)
  const [orderSuccessVisible, setOrderSuccessVisible] = useState(false)
  const [orderFromCart, setOrderFromCart] = useState(false)
  const [productPhotoIndex, setProductPhotoIndex] = useState(0)
  const [detailFromScreen, setDetailFromScreen] = useState<Screen>("product-card")
  const [selectedColor, setSelectedColor] = useState(COLOR_OPTIONS[0].name)
  const [selectedHardware, setSelectedHardware] = useState(HARDWARE_OPTIONS[0].name)
  const [paramSelectReturnScreen, setParamSelectReturnScreen] = useState<Screen>("product-card")
  const [colorSelectIndex, setColorSelectIndex] = useState(0)
  const [hardwareSelectIndex, setHardwareSelectIndex] = useState(0)
  const [catalogProductIndex, setCatalogProductIndex] = useState(0)
  const [collectionProductIndex, setCollectionProductIndex] = useState(0)
  const [cartItems, setCartItems] = useState<CartPosition[]>([])
  const [addToCartModalOpen, setAddToCartModalOpen] = useState(false)
  const [addToCartModalProduct, setAddToCartModalProduct] = useState<Product | null>(null)
  const [addToCartSuccessVisible, setAddToCartSuccessVisible] = useState(false)
  const [checkoutStep, setCheckoutStep] = useState(1)
  const [checkoutName, setCheckoutName] = useState("")
  const [checkoutPhone, setCheckoutPhone] = useState("")
  const [checkoutCity, setCheckoutCity] = useState("")
  const [checkoutAddress, setCheckoutAddress] = useState("")
  const [checkoutComment, setCheckoutComment] = useState("")
  const [demoOrderId, setDemoOrderId] = useState("1024")
  const [demoMasterComment, setDemoMasterComment] = useState("Уточните, пожалуйста, желаемый цвет фурнитуры.")

  const PRODUCT_PHOTOS_COUNT = 3

  const openColorSelect = (from: Screen) => {
    setParamSelectReturnScreen(from)
    const idx = COLOR_OPTIONS.findIndex((c) => c.name === selectedColor)
    setColorSelectIndex(idx >= 0 ? idx : 0)
    setScreen("color-select")
  }
  const openHardwareSelect = (from: Screen) => {
    setParamSelectReturnScreen(from)
    const idx = HARDWARE_OPTIONS.findIndex((h) => h.name === selectedHardware)
    setHardwareSelectIndex(idx >= 0 ? idx : 0)
    setScreen("hardware-select")
  }

  const openProductDetail = (from: Screen) => {
    setDetailFromScreen(from)
    setScreen("product-detail")
  }

  const addToCart = (product: Product) => {
    setCartItems((prev) => [...prev, { product, color: selectedColor, hardware: selectedHardware, quantity: 1 }])
  }
  const openAddToCartModal = (product: Product) => {
    setAddToCartModalProduct(product)
    setAddToCartSuccessVisible(false)
    setAddToCartModalOpen(true)
  }
  const closeAddToCartModal = () => {
    setAddToCartModalOpen(false)
    setAddToCartModalProduct(null)
    setAddToCartSuccessVisible(false)
  }
  const confirmAddToCart = () => {
    if (addToCartModalProduct) {
      addToCart(addToCartModalProduct)
      setAddToCartSuccessVisible(true)
    }
  }
  const continueShopping = () => {
    closeAddToCartModal()
  }
  const goToCartFromModal = () => {
    closeAddToCartModal()
    setScreen("cart")
  }
  const openOrderModal = (product: Product | null) => {
    setOrderModalProduct(product)
    setOrderSuccessVisible(false)
    setOrderModalOpen(true)
  }
  const closeOrderModal = () => {
    setOrderModalOpen(false)
    setOrderModalProduct(null)
    setOrderSuccessVisible(false)
    setOrderFromCart(false)
  }
  const confirmOrder = () => {
    if (orderFromCart) {
      setCartItems([])
      setOrderFromCart(false)
    } else if (orderModalProduct) {
      setCartItems((prev) => [...prev, { product: orderModalProduct, color: selectedColor, hardware: selectedHardware, quantity: 1 }])
    }
    setOrderSuccessVisible(true)
  }
  const openOrderFromCart = () => {
    setCheckoutStep(1)
    setScreen("checkout")
  }
  const submitCheckoutOrder = () => {
    setCartItems([])
    setCheckoutStep(5)
  }
  const resetCheckoutAndReturn = () => {
    setCheckoutStep(1)
    setCheckoutName("")
    setCheckoutPhone("")
    setCheckoutCity("")
    setCheckoutAddress("")
    setCheckoutComment("")
    setScreen("main-menu")
  }
  const removeCartItem = (index: number) => {
    setCartItems((prev) => prev.filter((_, i) => i !== index))
  }
  const editCartItem = (pos: CartPosition, index: number) => {
    setCartItems((prev) => prev.filter((_, i) => i !== index))
    setSelectedProduct(pos.product)
    setSelectedColor(pos.color)
    setSelectedHardware(pos.hardware)
    setProductPhotoIndex(0)
    setScreen("product-card")
  }
  const clearCart = () => {
    setCartItems([])
  }
  const updateCartItemQuantity = (index: number, delta: number) => {
    setCartItems((prev) => {
      const next = [...prev]
      const pos = next[index]
      const q = (pos.quantity ?? 1) + delta
      if (q < 1) {
        return next.filter((_, i) => i !== index)
      }
      next[index] = { ...pos, quantity: q }
      return next
    })
  }
  const continueBrowsing = () => {
    closeOrderModal()
  }
  const goToMainMenuFromSuccess = () => {
    setScreen("main-menu")
    closeOrderModal()
  }

  const filteredProducts = products.filter(p => p.category === selectedCategory)
  const collectionProducts = selectedCollection === "edge" ? edgeCollection : tacticalCollection
  const newItems = products.slice(0, 3)

  const renderScreen = () => {
    switch (screen) {
      case "start":
        return (
          <div className="flex flex-col h-full">
            <div className="flex-1 flex flex-col items-center justify-center p-6 gap-6">
              <div className="w-20 h-20 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-border">
                <img src="/logo.png" alt="Кожевенная мастерская" className="w-full h-full object-cover" />
              </div>
              <div className="text-center">
                <h2 className="text-lg font-medium text-foreground">Kircraft</h2>
                <p className="text-sm text-muted-foreground mt-2">
                  Изделия из натуральной кожи ручной работы.
                  Нажмите «Начать», чтобы открыть каталог.
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
            <div className="flex-1 flex flex-col p-4">
              <div className="flex-1 flex items-center justify-center min-h-0">
                <div className="w-32 h-32 rounded-full overflow-hidden flex-shrink-0 bg-background [&_img]:mix-blend-multiply">
                  <img src="/logo-menu.png" alt="Kircraft" className="w-full h-full object-cover" />
                </div>
              </div>
              <div className="max-w-[85%] w-full mx-auto p-1">
                <p className="text-sm text-foreground text-center">Выберите раздел</p>
              </div>
            </div>
            <div className="p-4 pt-2 grid grid-cols-2 gap-2">
              <Button variant="outline" className="h-11" onClick={() => setScreen("catalog")}>
                Каталог
              </Button>
              <Button variant="outline" className="h-11" onClick={() => setScreen("collections")}>
                Коллекции
              </Button>
              <Button variant="outline" className="h-11" onClick={() => { setNewItemIndex(0); setProductPhotoIndex(0); setScreen("new-items"); }}>
                Новинки
              </Button>
              <Button variant="outline" className="h-11" onClick={() => { setGalleryIndex(0); setScreen("gallery"); }}>
                Галерея
              </Button>
              <Button variant="outline" className="h-11">
                Написать мастеру
              </Button>
              <Button variant="outline" className="h-11" onClick={() => { setTeamIndex(0); setScreen("about"); }}>
                О мастерской
              </Button>
            </div>
            {cartItems.length > 0 && (
              <div className="px-4 pt-1.5 pb-4">
                <Button
                  variant="outline"
                  className="w-full h-11 rounded-lg flex items-center justify-center gap-2"
                  onClick={() => setScreen("cart")}
                >
                  <span aria-hidden>🛒</span>
                  <span>Корзина ({cartItems.length})</span>
                </Button>
              </div>
            )}
          </div>
        )

      case "post-order-demo":
        return (
          <div className="flex flex-col h-full min-h-0">
            <div className="flex-1 p-4 overflow-auto min-h-0">
              <h3 className="text-base font-semibold text-foreground mb-2">Post-order flow</h3>
              <p className="text-xs text-muted-foreground mb-4">Демо-навигация по сценариям после заказа</p>
              <div className="space-y-2">
                <Button variant="outline" className="w-full h-11 justify-start rounded-lg" onClick={() => setScreen("post-order-new")}>
                  Новый заказ у мастера
                </Button>
                <Button variant="outline" className="w-full h-11 justify-start rounded-lg" onClick={() => setScreen("post-order-confirmed")}>
                  Заказ подтверждён
                </Button>
                <Button variant="outline" className="w-full h-11 justify-start rounded-lg" onClick={() => setScreen("post-order-clarification")}>
                  Требуется уточнение
                </Button>
                <Button variant="outline" className="w-full h-11 justify-start rounded-lg" onClick={() => setScreen("post-order-in-progress")}>
                  Заказ в работе
                </Button>
                <Button variant="outline" className="w-full h-11 justify-start rounded-lg" onClick={() => setScreen("post-order-shipped")}>
                  Заказ отправлен
                </Button>
                <Button variant="outline" className="w-full h-11 justify-start rounded-lg" onClick={() => setScreen("post-order-rejected")}>
                  Заказ отклонён
                </Button>
                <Button variant="outline" className="w-full h-11 justify-start rounded-lg" onClick={() => setScreen("post-order-payment-received")}>
                  Оплата получена
                </Button>
              </div>
            </div>
            <div className="p-4 pt-2 shrink-0 border-t border-border">
              <Button variant="outline" className="w-full h-11 rounded-lg" onClick={() => setScreen("main-menu")}>
                Главное меню
              </Button>
            </div>
          </div>
        )

      case "post-order-new":
        return (
          <div className="flex flex-col h-full min-h-0">
            <div className="flex-1 p-4 overflow-auto min-h-0">
              <h3 className="text-base font-semibold text-foreground">Новый заказ</h3>
              <p className="text-xs text-muted-foreground mt-1 mb-4">Заказ #{demoOrderId}</p>
              <div className="space-y-3 text-sm">
                <p className="text-foreground font-medium">Иван Петров</p>
                <p className="text-muted-foreground">Телефон — +7 999 123-45-67</p>
                <p className="text-muted-foreground">Город — Москва</p>
                <p className="text-muted-foreground">Адрес — ул. Примерная, д. 1, кв. 10</p>
                <p className="text-muted-foreground">Комментарий — Позвонить перед доставкой</p>
              </div>
              <div className="mt-4 pt-3 border-t border-border space-y-2 text-sm">
                <p className="text-foreground font-medium">Товары</p>
                <p className="text-foreground">Классический бумажник × 1 — 8 900 ₽</p>
                <p className="text-xs text-muted-foreground">Цвет кожи — Бордовый, Фурнитура — Латунь</p>
                <p className="text-foreground">Тонкий картхолдер × 1 — 4 500 ₽</p>
                <p className="text-xs text-muted-foreground">Цвет кожи — Чёрный, Фурнитура — Латунь</p>
              </div>
              <p className="text-base font-bold text-foreground mt-3 pt-2 border-t border-border">Итого: 13 400 ₽</p>
            </div>
            <div className="p-4 pt-2 flex flex-col gap-2 shrink-0 border-t border-border">
              <Button className="w-full h-11 rounded-lg" onClick={() => setScreen("post-order-confirmed")}>
                Подтвердить заказ
              </Button>
              <Button variant="outline" className="w-full h-11 rounded-lg" onClick={() => setScreen("post-order-clarification")}>
                Запросить уточнение
              </Button>
              <Button variant="outline" className="w-full h-11 rounded-lg" onClick={() => setScreen("post-order-rejected")}>
                Отклонить
              </Button>
              <Button variant="outline" className="w-full h-11 rounded-lg" onClick={() => setScreen("post-order-demo")}>
                Назад
              </Button>
            </div>
          </div>
        )

      case "post-order-confirmed":
        return (
          <div className="flex flex-col h-full min-h-0">
            <div className="flex-1 p-4 overflow-auto min-h-0">
              <h3 className="text-base font-semibold text-foreground">Заказ подтверждён</h3>
              <p className="text-xs text-muted-foreground mt-1 mb-4">Заказ #{demoOrderId}</p>
              <div className="space-y-3 text-sm text-muted-foreground">
                <p>Мастер подтвердил ваш заказ.</p>
                <p>Следующий шаг — оплата. Перейдите к оплате, когда будете готовы.</p>
              </div>
            </div>
            <div className="p-4 pt-2 flex flex-col gap-2 shrink-0 border-t border-border">
              <Button className="w-full h-11 rounded-lg" onClick={() => setScreen("main-menu")}>
                Перейти к оплате
              </Button>
              <Button variant="outline" className="w-full h-11 rounded-lg" onClick={() => setScreen("main-menu")}>
                Главное меню
              </Button>
            </div>
          </div>
        )

      case "post-order-clarification":
        return (
          <div className="flex flex-col h-full min-h-0">
            <div className="flex-1 p-4 overflow-auto min-h-0">
              <h3 className="text-base font-semibold text-foreground">Требуется уточнение</h3>
              <p className="text-xs text-muted-foreground mt-1 mb-4">Заказ #{demoOrderId}</p>
              <p className="text-sm text-muted-foreground mb-4">
                Мастер оставил комментарий к вашему заказу. Свяжитесь с ним для уточнения деталей.
              </p>
              <div className="rounded-lg border border-border bg-muted/30 p-3">
                <p className="text-xs font-medium text-foreground mb-1">Комментарий мастера:</p>
                <p className="text-sm text-muted-foreground">{demoMasterComment}</p>
              </div>
            </div>
            <div className="p-4 pt-2 flex flex-col gap-2 shrink-0 border-t border-border">
              <Button className="w-full h-11 rounded-lg" onClick={() => setScreen("main-menu")}>
                Связаться с мастером
              </Button>
              <Button variant="outline" className="w-full h-11 rounded-lg" onClick={() => setScreen("main-menu")}>
                Главное меню
              </Button>
            </div>
          </div>
        )

      case "post-order-in-progress":
        return (
          <div className="flex flex-col h-full min-h-0">
            <div className="flex-1 p-4 overflow-auto min-h-0">
              <h3 className="text-base font-semibold text-foreground">Заказ в работе</h3>
              <p className="text-xs text-muted-foreground mt-1 mb-4">Заказ #{demoOrderId}</p>
              <p className="text-sm text-muted-foreground">Ваш заказ принят в работу.</p>
            </div>
            <div className="p-4 pt-2 shrink-0 border-t border-border">
              <Button variant="outline" className="w-full h-11 rounded-lg" onClick={() => setScreen("main-menu")}>
                Главное меню
              </Button>
            </div>
          </div>
        )

      case "post-order-shipped":
        return (
          <div className="flex flex-col h-full min-h-0">
            <div className="flex-1 p-4 overflow-auto min-h-0">
              <h3 className="text-base font-semibold text-foreground">Заказ отправлен</h3>
              <p className="text-xs text-muted-foreground mt-1 mb-4">Заказ #{demoOrderId}</p>
              <p className="text-sm text-muted-foreground">Ваш заказ передан в доставку.</p>
            </div>
            <div className="p-4 pt-2 shrink-0 border-t border-border">
              <Button variant="outline" className="w-full h-11 rounded-lg" onClick={() => setScreen("main-menu")}>
                Главное меню
              </Button>
            </div>
          </div>
        )

      case "post-order-rejected":
        return (
          <div className="flex flex-col h-full min-h-0">
            <div className="flex-1 p-4 overflow-auto min-h-0">
              <h3 className="text-base font-semibold text-foreground">Заказ отклонён</h3>
              <p className="text-xs text-muted-foreground mt-1 mb-4">Заказ #{demoOrderId}</p>
              <div className="space-y-3 text-sm text-muted-foreground">
                <p>К сожалению, мастер не может принять этот заказ.</p>
                <p>Свяжитесь с нами для уточнения деталей или оформите новый заказ.</p>
              </div>
            </div>
            <div className="p-4 pt-2 flex flex-col gap-2 shrink-0 border-t border-border">
              <Button className="w-full h-11 rounded-lg" onClick={() => setScreen("main-menu")}>
                Связаться с мастером
              </Button>
              <Button variant="outline" className="w-full h-11 rounded-lg" onClick={() => setScreen("main-menu")}>
                Главное меню
              </Button>
            </div>
          </div>
        )

      case "post-order-payment-received":
        return (
          <div className="flex flex-col h-full min-h-0">
            <div className="flex-1 p-4 overflow-auto min-h-0">
              <h3 className="text-base font-semibold text-foreground">Оплата получена</h3>
              <p className="text-xs text-muted-foreground mt-1 mb-4">Заказ #{demoOrderId}</p>
              <div className="space-y-3 text-sm text-muted-foreground">
                <p>Мы получили ваш платеж.</p>
                <p>Заказ передан мастеру и будет изготовлен в ближайшее время.</p>
              </div>
            </div>
            <div className="p-4 pt-2 shrink-0 border-t border-border">
              <Button variant="outline" className="w-full h-11 rounded-lg" onClick={() => setScreen("main-menu")}>
                Главное меню
              </Button>
            </div>
          </div>
        )

      case "cart": {
        const cartTotal = cartItems.reduce(
          (sum, pos) => sum + parsePrice(pos.product.price) * (pos.quantity ?? 1),
          0
        )
        const totalFormatted = cartTotal.toLocaleString("ru-RU")
        return (
          <div className="flex flex-col h-full min-h-0">
            <div className="flex-1 p-4 overflow-auto min-h-0">
              <h3 className="text-base font-semibold text-foreground mb-4">Корзина</h3>
              {cartItems.length === 0 ? (
                <p className="text-sm text-muted-foreground py-6 text-center">Корзина пуста</p>
              ) : (
                <div className="space-y-0">
                  {cartItems.map((pos, i) => {
                    const q = pos.quantity ?? 1
                    return (
                      <div key={i} className="py-4 border-b border-border last:border-b-0">
                        <p className="text-sm font-medium text-foreground">{pos.product.name}</p>
                        <p className="text-base font-bold text-primary mt-0.5">
                          {pos.product.price}{q > 1 ? ` × ${q}` : ""}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1.5">Цвет кожи — {pos.color}</p>
                        <p className="text-xs text-muted-foreground">Фурнитура — {pos.hardware}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs text-muted-foreground">Количество</span>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 shrink-0 rounded-lg"
                              onClick={() => updateCartItemQuantity(i, -1)}
                              aria-label="Уменьшить"
                            >
                              <Minus className="size-4" />
                            </Button>
                            <span className="text-sm font-medium tabular-nums min-w-[1.5rem] text-center">{q}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 shrink-0 rounded-lg"
                              onClick={() => updateCartItemQuantity(i, 1)}
                              aria-label="Увеличить"
                            >
                              <Plus className="size-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-3">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-9 flex-1 rounded-lg text-sm"
                            onClick={() => editCartItem(pos, i)}
                          >
                            Изменить
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-9 flex-1 rounded-lg text-sm"
                            onClick={() => removeCartItem(i)}
                          >
                            Удалить
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
              {cartItems.length > 0 && (
                <p className="text-base font-bold text-foreground mt-4 pt-3 border-t border-border">
                  Итого: {totalFormatted} ₽
                </p>
              )}
            </div>
            <div className="p-4 pt-2 flex flex-col gap-2 shrink-0 border-t border-border">
              {cartItems.length > 0 ? (
                <>
                  <div className="grid grid-cols-2 gap-2">
                    <Button className="h-11 rounded-lg" onClick={openOrderFromCart}>
                      Оформить заказ
                    </Button>
                    <Button variant="outline" className="h-11 rounded-lg" onClick={() => setScreen("main-menu")}>
                      Продолжить покупки
                    </Button>
                  </div>
                  <Button variant="outline" className="w-full h-11 rounded-lg" onClick={clearCart}>
                    Очистить корзину
                  </Button>
                  <Button variant="outline" className="w-full h-11 rounded-lg" onClick={() => setScreen("main-menu")}>
                    Главное меню
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" className="w-full h-11 rounded-lg" onClick={() => setScreen("main-menu")}>
                    Продолжить покупки
                  </Button>
                  <Button variant="outline" className="w-full h-11 rounded-lg" onClick={() => setScreen("main-menu")}>
                    Главное меню
                  </Button>
                </>
              )}
            </div>
          </div>
        )
      }

      case "checkout": {
        const checkoutCartTotal = cartItems.reduce(
          (sum, pos) => sum + parsePrice(pos.product.price) * (pos.quantity ?? 1),
          0
        )
        const checkoutTotalFormatted = checkoutCartTotal.toLocaleString("ru-RU")
        const renderOrderSummary = (compact?: boolean, showTotal = true) => (
          <div className="space-y-3">
            <p className="text-sm font-medium text-foreground">Ваш заказ</p>
            {cartItems.map((pos, i) => {
              const q = pos.quantity ?? 1
              const lineTotal = parsePrice(pos.product.price) * q
              return (
                <div key={i} className={compact ? "text-sm" : ""}>
                  <p className="text-foreground">
                    {pos.product.name} × {q} — {lineTotal.toLocaleString("ru-RU")} ₽
                  </p>
                  <p className="text-xs text-muted-foreground">Цвет кожи — {pos.color}</p>
                  <p className="text-xs text-muted-foreground">Цвет фурнитуры — {pos.hardware}</p>
                </div>
              )
            })}
            {showTotal && (
              <p className="text-base font-bold text-foreground pt-2 border-t border-border">
                Итого: {checkoutTotalFormatted} ₽
              </p>
            )}
          </div>
        )
        const checkoutLayout = (title: string, children: ReactNode, buttons: ReactNode) => (
          <div className="flex flex-col h-full min-h-0">
            <div className="flex-1 p-4 overflow-auto min-h-0">
              <h3 className="text-base font-semibold text-foreground mb-4">{title}</h3>
              {children}
            </div>
            <div className="p-4 pt-2 flex flex-col gap-2 shrink-0 border-t border-border">
              {buttons}
            </div>
          </div>
        )
        if (checkoutStep === 1) {
          return checkoutLayout(
            "Оформление заказа",
            <div className="rounded-lg border border-border bg-muted/30 p-3">{renderOrderSummary()}</div>,
            <>
              <Button className="w-full h-11 rounded-lg" onClick={() => setCheckoutStep(2)}>
                Продолжить
              </Button>
              <Button variant="outline" className="w-full h-11 rounded-lg" onClick={() => setScreen("cart")}>
                Назад в корзину
              </Button>
            </>
          )
        }
        if (checkoutStep === 2) {
          return checkoutLayout(
            "Контактные данные",
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm">Имя</Label>
                <Input
                  placeholder="Введите имя"
                  value={checkoutName}
                  onChange={(e) => setCheckoutName(e.target.value)}
                  className="h-11 rounded-lg"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Телефон</Label>
                <Input
                  type="tel"
                  placeholder="+7 ..."
                  value={checkoutPhone}
                  onChange={(e) => setCheckoutPhone(e.target.value)}
                  className="h-11 rounded-lg"
                />
                <Button variant="outline" className="w-full h-11 rounded-lg" onClick={() => setCheckoutPhone("+7 999 123-45-67")}>
                  Поделиться номером
                </Button>
              </div>
            </div>,
            <>
              <Button className="w-full h-11 rounded-lg" onClick={() => setCheckoutStep(3)}>
                Продолжить
              </Button>
              <Button variant="outline" className="w-full h-11 rounded-lg" onClick={() => setCheckoutStep(1)}>
                Назад
              </Button>
            </>
          )
        }
        if (checkoutStep === 3) {
          return checkoutLayout(
            "Доставка",
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm">Город</Label>
                <Input
                  placeholder="Город"
                  value={checkoutCity}
                  onChange={(e) => setCheckoutCity(e.target.value)}
                  className="h-11 rounded-lg"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Адрес доставки</Label>
                <Input
                  placeholder="Улица, дом, квартира"
                  value={checkoutAddress}
                  onChange={(e) => setCheckoutAddress(e.target.value)}
                  className="h-11 rounded-lg"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">Комментарий к заказу (необязательно)</Label>
                <Input
                  placeholder="Комментарий"
                  value={checkoutComment}
                  onChange={(e) => setCheckoutComment(e.target.value)}
                  className="h-11 rounded-lg"
                />
              </div>
            </div>,
            <>
              <Button className="w-full h-11 rounded-lg" onClick={() => setCheckoutStep(4)}>
                Продолжить
              </Button>
              <Button variant="outline" className="w-full h-11 rounded-lg" onClick={() => setCheckoutStep(2)}>
                Назад
              </Button>
            </>
          )
        }
        if (checkoutStep === 4) {
          return checkoutLayout(
            "Подтверждение заказа",
            <div className="space-y-4">
              <div className="rounded-lg border border-border bg-muted/30 p-3">{renderOrderSummary(true, false)}</div>
              <div className="text-sm space-y-1 pt-2 border-t border-border">
                <p className="text-foreground">Имя — {checkoutName || "—"}</p>
                <p className="text-foreground">Телефон — {checkoutPhone || "—"}</p>
                <p className="text-foreground">Город — {checkoutCity || "—"}</p>
                <p className="text-foreground">Адрес — {checkoutAddress || "—"}</p>
                {checkoutComment ? <p className="text-foreground">Комментарий — {checkoutComment}</p> : null}
              </div>
              <p className="text-base font-bold text-foreground pt-2 border-t border-border">
                Итого: {checkoutTotalFormatted} ₽
              </p>
            </div>,
            <>
              <Button className="w-full h-11 rounded-lg" onClick={submitCheckoutOrder}>
                Подтвердить заказ
              </Button>
              <Button variant="outline" className="w-full h-11 rounded-lg" onClick={() => setCheckoutStep(3)}>
                Назад
              </Button>
            </>
          )
        }
        return checkoutLayout(
          "Заказ принят",
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>Мы передали заказ мастеру на подтверждение.</p>
            <p>После подтверждения с вами свяжутся для уточнения деталей и оплаты.</p>
            <p className="text-xs">Обычно это занимает до одного рабочего дня.</p>
          </div>,
          <>
            <Button className="w-full h-11 rounded-lg" onClick={resetCheckoutAndReturn}>
              Продолжить покупки
            </Button>
            <Button variant="outline" className="w-full h-11 rounded-lg" onClick={resetCheckoutAndReturn}>
              Главное меню
            </Button>
          </>
        )
      }

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
            <div className="flex-1 flex flex-col justify-end p-4 pb-2">
              <div className="max-w-[85%] w-full mx-auto p-1">
                <p className="text-sm text-foreground font-medium text-center">Выберите категорию</p>
              </div>
            </div>
            <div className="p-4 pt-2 space-y-1.5">
              <div className="grid grid-cols-2 gap-2">
                {["wallets", "cardholders", "badges", "sketchbooks", "dockholders", "accessories"].map((cat) => (
                  <Button
                    key={cat}
                    variant="outline"
                    className="h-11"
                    onClick={() => { setSelectedCategory(cat); setCatalogProductIndex(0); setProductPhotoIndex(0); setScreen("product-list"); }}
                  >
                    {categoryLabels[cat]}
                  </Button>
                ))}
              </div>
              <div className="flex items-center w-full gap-2">
                <Button variant="outline" size="icon" className="h-9 flex-1 min-w-0" disabled aria-label="Предыдущая страница">
                  <ChevronLeft className="size-4" />
                </Button>
                <span className="text-xs text-muted-foreground tabular-nums min-w-[3ch] text-center shrink-0">1 / 2</span>
                <Button variant="outline" size="icon" className="h-9 flex-1 min-w-0" onClick={() => setScreen("catalog-page-2")} aria-label="Следующая страница">
                  <ChevronRight className="size-4" />
                </Button>
              </div>
              <Button variant="outline" className="w-full h-11" onClick={() => setScreen("main-menu")}>
                Главное меню
              </Button>
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
            <div className="flex-1 flex flex-col justify-end p-4 pb-2">
              <div className="max-w-[85%] w-full mx-auto p-1">
                <p className="text-sm text-foreground font-medium text-center">Выберите категорию</p>
              </div>
            </div>
            <div className="p-4 pt-2 space-y-1.5">
              <div className="grid grid-cols-2 gap-2">
                {["cases", "organizers"].map((cat) => (
                  <Button
                    key={cat}
                    variant="outline"
                    className="h-11"
                    onClick={() => { setSelectedCategory(cat); setCatalogProductIndex(0); setProductPhotoIndex(0); setScreen("product-list"); }}
                  >
                    {categoryLabels2[cat]}
                  </Button>
                ))}
              </div>
              <div className="flex items-center w-full gap-2">
                <Button variant="outline" size="icon" className="h-9 flex-1 min-w-0" onClick={() => setScreen("catalog")} aria-label="Предыдущая страница">
                  <ChevronLeft className="size-4" />
                </Button>
                <span className="text-xs text-muted-foreground tabular-nums min-w-[3ch] text-center shrink-0">2 / 2</span>
                <Button variant="outline" size="icon" className="h-9 flex-1 min-w-0" disabled aria-label="Следующая страница">
                  <ChevronRight className="size-4" />
                </Button>
              </div>
              <Button variant="outline" className="w-full h-11" onClick={() => setScreen("main-menu")}>
                Главное меню
              </Button>
            </div>
          </div>
        )

      case "product-list": {
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
        const listTotal = filteredProducts.length
        const currentListProduct = filteredProducts[catalogProductIndex]
        if (listTotal === 0) {
          return (
            <div className="flex flex-col h-full min-h-0">
              <div className="flex-1 p-2 overflow-hidden min-h-0 flex flex-col">
                <p className="text-sm font-medium text-foreground mb-2 shrink-0">{catLabels[selectedCategory] || selectedCategory}</p>
                <p className="text-sm text-muted-foreground text-center py-8">В этой категории пока нет товаров.</p>
              </div>
              <div className="p-2 pt-0 flex flex-col gap-2 shrink-0">
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" className="h-9" onClick={() => setScreen("catalog")}>
                    <ChevronLeft className="mr-1 size-4" /> Каталог
                  </Button>
                  <Button variant="outline" className="h-9" onClick={() => setScreen("main-menu")}>
                    Главное меню
                  </Button>
                </div>
              </div>
            </div>
          )
        }
        return (
          <div className="flex flex-col h-full min-h-0">
            <div className="flex-1 p-2 overflow-hidden min-h-0 flex flex-col">
              <p className="text-sm font-medium text-foreground mb-2 shrink-0">{catLabels[selectedCategory] || selectedCategory}</p>
              <div className="flex-1 min-h-0 flex flex-col">
                <div className="flex-1 min-h-[120px] bg-secondary rounded-lg w-full aspect-[3/4] max-h-[272px] flex items-center justify-center overflow-hidden shrink-0">
                  <span className="text-muted-foreground text-sm">Фото {productPhotoIndex + 1} / {PRODUCT_PHOTOS_COUNT}</span>
                </div>
                <div className="mt-2 space-y-1 shrink-0">
                  <h3 className="text-base font-semibold text-foreground leading-tight">{currentListProduct.name}</h3>
                  <p className="text-base font-bold text-primary">{currentListProduct.price}</p>
                  <div className="flex items-center justify-between gap-2 py-0.5">
                    <span className="text-xs text-muted-foreground">Цвет кожи: {selectedColor}</span>
                    <Button variant="ghost" size="sm" className="h-7 text-xs shrink-0" onClick={() => openColorSelect("product-list")}>Изменить</Button>
                  </div>
                  <div className="flex items-center justify-between gap-2 py-0.5">
                    <span className="text-xs text-muted-foreground">Цвет фурнитуры: {selectedHardware}</span>
                    <Button variant="ghost" size="sm" className="h-7 text-xs shrink-0" onClick={() => openHardwareSelect("product-list")}>Изменить</Button>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-2 pt-0 flex flex-col gap-2 shrink-0">
              <div className="grid grid-cols-2 gap-2">
                <Button className="h-9" onClick={() => openAddToCartModal(currentListProduct)}>В корзину</Button>
                <Button variant="outline" className="h-9" onClick={() => setProductPhotoIndex((i) => (i + 1) % PRODUCT_PHOTOS_COUNT)}>Еще фото</Button>
              </div>
              <div className="flex items-center w-full gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 flex-1 min-w-0"
                  disabled={catalogProductIndex === 0}
                  onClick={() => { setCatalogProductIndex((i) => Math.max(0, i - 1)); setProductPhotoIndex(0); }}
                  aria-label="Предыдущий"
                >
                  <ChevronLeft className="size-4" />
                </Button>
                <span className="text-xs text-muted-foreground tabular-nums min-w-[3ch] text-center shrink-0">
                  {catalogProductIndex + 1} / {listTotal}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 flex-1 min-w-0"
                  disabled={catalogProductIndex === listTotal - 1}
                  onClick={() => { setCatalogProductIndex((i) => Math.min(listTotal - 1, i + 1)); setProductPhotoIndex(0); }}
                  aria-label="Следующий"
                >
                  <ChevronRight className="size-4" />
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" className="h-9" onClick={() => setScreen("catalog")}>
                  <ChevronLeft className="mr-1 size-4" /> Каталог
                </Button>
                <Button variant="outline" className="h-9" onClick={() => { setSelectedProduct(currentListProduct); openProductDetail("product-list"); }}>
                  О товаре
                </Button>
              </div>
            </div>
          </div>
        )
      }

      case "product-card":
        return (
          <div className="flex flex-col h-full min-h-0">
            <div className="flex-1 p-2 overflow-hidden min-h-0 flex flex-col">
              <div className="flex-1 min-h-[120px] bg-secondary rounded-lg w-full aspect-[3/4] max-h-[272px] flex items-center justify-center overflow-hidden shrink-0">
                <span className="text-muted-foreground text-sm">Фото {productPhotoIndex + 1} / {PRODUCT_PHOTOS_COUNT}</span>
              </div>
              <div className="mt-2 space-y-1 shrink-0">
                <h3 className="text-base font-semibold text-foreground leading-tight">{selectedProduct?.name}</h3>
                <p className="text-base font-bold text-primary">{selectedProduct?.price}</p>
                <div className="flex items-center justify-between gap-2 py-0.5">
                  <span className="text-xs text-muted-foreground">Цвет кожи: {selectedColor}</span>
                  <Button variant="ghost" size="sm" className="h-7 text-xs shrink-0" onClick={() => openColorSelect("product-card")}>Изменить</Button>
                </div>
                <div className="flex items-center justify-between gap-2 py-0.5">
                  <span className="text-xs text-muted-foreground">Цвет фурнитуры: {selectedHardware}</span>
                  <Button variant="ghost" size="sm" className="h-7 text-xs shrink-0" onClick={() => openHardwareSelect("product-card")}>Изменить</Button>
                </div>
              </div>
            </div>
            <div className="p-2 pt-0 flex flex-col gap-2 shrink-0">
              <div className="grid grid-cols-2 gap-2">
                <Button className="h-9" onClick={() => selectedProduct && openAddToCartModal(selectedProduct)}>В корзину</Button>
                <Button variant="outline" className="h-9" onClick={() => setProductPhotoIndex(i => (i + 1) % PRODUCT_PHOTOS_COUNT)}>Еще фото</Button>
              </div>
              <div className="flex items-center w-full gap-2">
                <Button variant="outline" size="icon" className="h-9 flex-1 min-w-0" disabled aria-label="Предыдущий">
                  <ChevronLeft className="size-4" />
                </Button>
                <span className="text-xs text-muted-foreground tabular-nums min-w-[3ch] text-center shrink-0">1 / 1</span>
                <Button variant="outline" size="icon" className="h-9 flex-1 min-w-0" disabled aria-label="Следующий">
                  <ChevronRight className="size-4" />
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" className="h-9" onClick={() => setScreen("main-menu")}>Главное меню</Button>
                <Button variant="outline" className="h-9" onClick={() => openProductDetail("product-card")}>О товаре</Button>
              </div>
            </div>
          </div>
        )

      case "product-detail": {
        const detailProduct = selectedProduct
        const featuresList = detailProduct?.features
          ? detailProduct.features.split(",").map((s) => s.trim()).filter(Boolean)
          : ["Ручная работа", "Индивидуальная упаковка"]
        return detailProduct ? (
          <div className="flex flex-col h-full min-h-0">
            <div className="flex-1 p-3 overflow-auto min-h-0 flex flex-col">
              <h3 className="text-base font-semibold text-foreground mb-3">О товаре</h3>
              <div className="space-y-4 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground leading-snug">{detailProduct.description}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-foreground mb-1">Материал</p>
                  <p className="text-xs text-muted-foreground">{detailProduct.material ?? "—"}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-foreground mb-1">Размеры</p>
                  <p className="text-xs text-muted-foreground">{detailProduct.dimensions ?? "—"}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-foreground mb-1">Особенности</p>
                  <ul className="list-none space-y-1 text-xs text-muted-foreground">
                    {featuresList.map((item, i) => (
                      <li key={i} className="flex gap-2 leading-snug">
                        <span className="shrink-0">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <div className="p-3 pt-2 flex flex-col gap-2 border-t border-border shrink-0">
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" className="h-10" onClick={() => setScreen(detailFromScreen)}>
                  <ChevronLeft className="mr-1 size-4" /> Назад
                </Button>
                <Button variant="outline" className="h-10" onClick={() => setScreen("main-menu")}>Главное меню</Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col h-full items-center justify-center p-4">
            <p className="text-sm text-muted-foreground">Товар не выбран</p>
            <Button variant="outline" className="mt-4" onClick={() => setScreen("main-menu")}>Главное меню</Button>
          </div>
        )
      }

      case "collections":
        return (
          <div className="flex flex-col h-full">
            <div className="flex-1 flex flex-col justify-end p-4 pb-2">
              <div className="max-w-[85%] w-full mx-auto p-1">
                <p className="text-sm text-foreground font-medium text-center">Выберите коллекцию</p>
              </div>
            </div>
            <div className="p-4 pt-2 space-y-1.5">
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  className="h-11"
                  onClick={() => { setSelectedCollection("edge"); setCollectionProductIndex(0); setScreen("collection-products"); }}
                >
                  Edge
                </Button>
                <Button
                  variant="outline"
                  className="h-11"
                  onClick={() => { setSelectedCollection("tactical"); setCollectionProductIndex(0); setScreen("collection-products"); }}
                >
                  Tactical
                </Button>
              </div>
              <div className="flex items-center w-full gap-2">
                <Button variant="outline" size="icon" className="h-9 flex-1 min-w-0" disabled aria-label="Предыдущая страница">
                  <ChevronLeft className="size-4" />
                </Button>
                <span className="text-xs text-muted-foreground tabular-nums min-w-[3ch] text-center shrink-0">1 / 1</span>
                <Button variant="outline" size="icon" className="h-9 flex-1 min-w-0" disabled aria-label="Следующая страница">
                  <ChevronRight className="size-4" />
                </Button>
              </div>
              <Button variant="outline" className="w-full h-11" onClick={() => setScreen("main-menu")}>
                Главное меню
              </Button>
            </div>
          </div>
        )

      case "collection-products": {
        const collectionListTotal = collectionProducts.length
        const currentCollectionProduct = collectionProducts[collectionProductIndex]
        if (collectionListTotal === 0) {
          return (
            <div className="flex flex-col h-full min-h-0">
              <div className="flex-1 p-2 overflow-hidden min-h-0 flex flex-col">
                <p className="text-sm font-medium text-foreground mb-2 shrink-0">Коллекция {selectedCollection}</p>
                <p className="text-sm text-muted-foreground text-center py-8">В этой коллекции пока нет товаров.</p>
              </div>
              <div className="p-2 pt-0 flex flex-col gap-2 shrink-0">
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" className="h-9" onClick={() => setScreen("collections")}>
                    <ChevronLeft className="mr-1 size-4" /> Коллекции
                  </Button>
                  <Button variant="outline" className="h-9" onClick={() => setScreen("main-menu")}>
                    Главное меню
                  </Button>
                </div>
              </div>
            </div>
          )
        }
        return (
          <div className="flex flex-col h-full min-h-0">
            <div className="flex-1 p-2 overflow-hidden min-h-0 flex flex-col">
              <p className="text-sm font-medium text-foreground mb-2 shrink-0">Коллекция {selectedCollection}</p>
              <div className="flex-1 min-h-0 flex flex-col">
                <div className="flex-1 min-h-[120px] bg-secondary rounded-lg w-full aspect-[3/4] max-h-[272px] flex items-center justify-center overflow-hidden shrink-0">
                  <span className="text-muted-foreground text-sm">Фото {productPhotoIndex + 1} / {PRODUCT_PHOTOS_COUNT}</span>
                </div>
                <div className="mt-2 space-y-1 shrink-0">
                  <h3 className="text-base font-semibold text-foreground leading-tight">{currentCollectionProduct.name}</h3>
                  <p className="text-base font-bold text-primary">{currentCollectionProduct.price}</p>
                  <div className="flex items-center justify-between gap-2 py-0.5">
                    <span className="text-xs text-muted-foreground">Цвет кожи: {selectedColor}</span>
                    <Button variant="ghost" size="sm" className="h-7 text-xs shrink-0" onClick={() => openColorSelect("collection-products")}>Изменить</Button>
                  </div>
                  <div className="flex items-center justify-between gap-2 py-0.5">
                    <span className="text-xs text-muted-foreground">Цвет фурнитуры: {selectedHardware}</span>
                    <Button variant="ghost" size="sm" className="h-7 text-xs shrink-0" onClick={() => openHardwareSelect("collection-products")}>Изменить</Button>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-2 pt-0 flex flex-col gap-2 shrink-0">
              <div className="grid grid-cols-2 gap-2">
                <Button className="h-9" onClick={() => openAddToCartModal(currentCollectionProduct)}>В корзину</Button>
                <Button variant="outline" className="h-9" onClick={() => setProductPhotoIndex((i) => (i + 1) % PRODUCT_PHOTOS_COUNT)}>Еще фото</Button>
              </div>
              <div className="flex items-center w-full gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 flex-1 min-w-0"
                  disabled={collectionProductIndex === 0}
                  onClick={() => { setCollectionProductIndex((i) => Math.max(0, i - 1)); setProductPhotoIndex(0); }}
                  aria-label="Предыдущий"
                >
                  <ChevronLeft className="size-4" />
                </Button>
                <span className="text-xs text-muted-foreground tabular-nums min-w-[3ch] text-center shrink-0">
                  {collectionProductIndex + 1} / {collectionListTotal}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 flex-1 min-w-0"
                  disabled={collectionProductIndex === collectionListTotal - 1}
                  onClick={() => { setCollectionProductIndex((i) => Math.min(collectionListTotal - 1, i + 1)); setProductPhotoIndex(0); }}
                  aria-label="Следующий"
                >
                  <ChevronRight className="size-4" />
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" className="h-9" onClick={() => setScreen("collections")}>
                  <ChevronLeft className="mr-1 size-4" /> Коллекции
                </Button>
                <Button variant="outline" className="h-9" onClick={() => { setSelectedProduct(currentCollectionProduct); openProductDetail("collection-products"); }}>
                  О товаре
                </Button>
              </div>
            </div>
          </div>
        )
      }

      case "collection-product-card":
        return (
          <div className="flex flex-col h-full min-h-0">
            <div className="flex-1 p-2 overflow-hidden min-h-0 flex flex-col">
              <div className="flex-1 min-h-[120px] bg-secondary rounded-lg w-full aspect-[3/4] max-h-[272px] flex items-center justify-center overflow-hidden shrink-0">
                <span className="text-muted-foreground text-sm">Фото {productPhotoIndex + 1} / {PRODUCT_PHOTOS_COUNT}</span>
              </div>
              <div className="mt-2 space-y-1 shrink-0">
                <h3 className="text-base font-semibold text-foreground leading-tight">{selectedProduct?.name}</h3>
                <p className="text-base font-bold text-primary">{selectedProduct?.price}</p>
                <div className="flex items-center justify-between gap-2 py-0.5">
                  <span className="text-xs text-muted-foreground">Цвет кожи: {selectedColor}</span>
                  <Button variant="ghost" size="sm" className="h-7 text-xs shrink-0" onClick={() => openColorSelect("collection-product-card")}>Изменить</Button>
                </div>
                <div className="flex items-center justify-between gap-2 py-0.5">
                  <span className="text-xs text-muted-foreground">Цвет фурнитуры: {selectedHardware}</span>
                  <Button variant="ghost" size="sm" className="h-7 text-xs shrink-0" onClick={() => openHardwareSelect("collection-product-card")}>Изменить</Button>
                </div>
              </div>
            </div>
            <div className="p-2 pt-0 flex flex-col gap-2 shrink-0">
              <div className="grid grid-cols-2 gap-2">
                <Button className="h-9" onClick={() => selectedProduct && openAddToCartModal(selectedProduct)}>В корзину</Button>
                <Button variant="outline" className="h-9" onClick={() => setProductPhotoIndex(i => (i + 1) % PRODUCT_PHOTOS_COUNT)}>Еще фото</Button>
              </div>
              <div className="flex items-center w-full gap-2">
                <Button variant="outline" size="icon" className="h-9 flex-1 min-w-0" disabled aria-label="Предыдущий">
                  <ChevronLeft className="size-4" />
                </Button>
                <span className="text-xs text-muted-foreground tabular-nums min-w-[3ch] text-center shrink-0">1 / 1</span>
                <Button variant="outline" size="icon" className="h-9 flex-1 min-w-0" disabled aria-label="Следующий">
                  <ChevronRight className="size-4" />
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" className="h-9" onClick={() => setScreen("main-menu")}>Главное меню</Button>
                <Button variant="outline" className="h-9" onClick={() => openProductDetail("collection-product-card")}>О товаре</Button>
              </div>
            </div>
          </div>
        )

      case "new-items":
        const currentNewItem = newItems[newItemIndex]
        const newItemsTotal = newItems.length
        return (
          <div className="flex flex-col h-full min-h-0">
            <div className="flex-1 p-2 overflow-hidden min-h-0 flex flex-col">
              <div className="flex-1 min-h-[120px] bg-secondary rounded-lg w-full aspect-[3/4] max-h-[272px] flex items-center justify-center overflow-hidden shrink-0">
                <span className="text-muted-foreground text-sm">Фото {productPhotoIndex + 1} / {PRODUCT_PHOTOS_COUNT}</span>
              </div>
              <div className="mt-2 space-y-1 shrink-0">
                <h3 className="text-base font-semibold text-foreground leading-tight">{currentNewItem?.name}</h3>
                <p className="text-base font-bold text-primary">{currentNewItem?.price}</p>
                <div className="flex items-center justify-between gap-2 py-0.5">
                  <span className="text-xs text-muted-foreground">Цвет кожи: {selectedColor}</span>
                  <Button variant="ghost" size="sm" className="h-7 text-xs shrink-0" onClick={() => openColorSelect("new-items")}>Изменить</Button>
                </div>
                <div className="flex items-center justify-between gap-2 py-0.5">
                  <span className="text-xs text-muted-foreground">Цвет фурнитуры: {selectedHardware}</span>
                  <Button variant="ghost" size="sm" className="h-7 text-xs shrink-0" onClick={() => openHardwareSelect("new-items")}>Изменить</Button>
                </div>
              </div>
            </div>
            <div className="p-2 pt-0 flex flex-col gap-2 shrink-0">
              <div className="grid grid-cols-2 gap-2">
                <Button className="h-9" onClick={() => currentNewItem && openAddToCartModal(currentNewItem)}>В корзину</Button>
                <Button variant="outline" className="h-9" onClick={() => setProductPhotoIndex(i => (i + 1) % PRODUCT_PHOTOS_COUNT)}>Еще фото</Button>
              </div>
              <div className="flex items-center w-full gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 flex-1 min-w-0"
                  disabled={newItemIndex === 0}
                  onClick={() => { setNewItemIndex(i => Math.max(0, i - 1)); setProductPhotoIndex(0); }}
                  aria-label="Предыдущий товар"
                >
                  <ChevronLeft className="size-4" />
                </Button>
                <span className="text-xs text-muted-foreground tabular-nums min-w-[3ch] text-center shrink-0">
                  {newItemIndex + 1} / {newItemsTotal}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 flex-1 min-w-0"
                  disabled={newItemIndex === newItemsTotal - 1}
                  onClick={() => { setNewItemIndex(i => Math.min(newItemsTotal - 1, i + 1)); setProductPhotoIndex(0); }}
                  aria-label="Следующий товар"
                >
                  <ChevronRight className="size-4" />
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" className="h-9" onClick={() => setScreen("main-menu")}>Главное меню</Button>
                <Button variant="outline" className="h-9" onClick={() => { if (currentNewItem) { setSelectedProduct(currentNewItem); openProductDetail("new-items"); } }}>О товаре</Button>
              </div>
            </div>
          </div>
        )

      case "color-select": {
        const currentColor = COLOR_OPTIONS[colorSelectIndex]
        const colorTotal = COLOR_OPTIONS.length
        return (
          <div className="flex flex-col h-full min-h-0">
            <div className="flex-1 p-3 overflow-hidden min-h-0 flex flex-col">
              <p className="text-sm font-medium text-foreground mb-3 shrink-0">Выберите цвет</p>
              <div className="flex-1 min-h-0 flex flex-col">
                <div className="bg-card border border-border rounded-lg overflow-hidden shrink-0">
                  <div className="aspect-[4/3] bg-secondary flex items-center justify-center">
                    <span className="text-xs text-muted-foreground">Образец кожи</span>
                  </div>
                </div>
                <p className="text-sm text-foreground mt-3 shrink-0">Цвет кожи: {currentColor.name}</p>
              </div>
            </div>
            <div className="p-3 pt-0 flex flex-col gap-3 shrink-0">
              <Button className="w-full h-10" onClick={() => { setSelectedColor(currentColor.name); setScreen(paramSelectReturnScreen); }}>
                Выбрать
              </Button>
              <div className="flex items-center w-full gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 flex-1 min-w-0"
                  disabled={colorSelectIndex === 0}
                  onClick={() => setColorSelectIndex((i) => Math.max(0, i - 1))}
                  aria-label="Предыдущий"
                >
                  <ChevronLeft className="size-4" />
                </Button>
                <span className="text-xs text-muted-foreground tabular-nums min-w-[3ch] text-center shrink-0">
                  {colorSelectIndex + 1} / {colorTotal}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 flex-1 min-w-0"
                  disabled={colorSelectIndex === colorTotal - 1}
                  onClick={() => setColorSelectIndex((i) => Math.min(colorTotal - 1, i + 1))}
                  aria-label="Следующий"
                >
                  <ChevronRight className="size-4" />
                </Button>
              </div>
              <Button variant="outline" className="w-full h-10" onClick={() => setScreen(paramSelectReturnScreen)}>
                <ChevronLeft className="mr-1 size-4" /> Назад
              </Button>
            </div>
          </div>
        )
      }

      case "hardware-select": {
        const currentHardware = HARDWARE_OPTIONS[hardwareSelectIndex]
        const hardwareTotal = HARDWARE_OPTIONS.length
        return (
          <div className="flex flex-col h-full min-h-0">
            <div className="flex-1 p-3 overflow-hidden min-h-0 flex flex-col">
              <p className="text-sm font-medium text-foreground mb-3 shrink-0">Выберите фурнитуру</p>
              <div className="flex-1 min-h-0 flex flex-col">
                <div className="bg-card border border-border rounded-lg overflow-hidden shrink-0">
                  <div className="aspect-[4/3] bg-secondary flex items-center justify-center">
                    <span className="text-xs text-muted-foreground">Образец фурнитуры</span>
                  </div>
                </div>
                <p className="text-sm text-foreground mt-3 shrink-0">Цвет фурнитуры: {currentHardware.name}</p>
              </div>
            </div>
            <div className="p-3 pt-0 flex flex-col gap-3 shrink-0">
              <Button className="w-full h-10" onClick={() => { setSelectedHardware(currentHardware.name); setScreen(paramSelectReturnScreen); }}>
                Выбрать
              </Button>
              <div className="flex items-center w-full gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 flex-1 min-w-0"
                  disabled={hardwareSelectIndex === 0}
                  onClick={() => setHardwareSelectIndex((i) => Math.max(0, i - 1))}
                  aria-label="Предыдущий"
                >
                  <ChevronLeft className="size-4" />
                </Button>
                <span className="text-xs text-muted-foreground tabular-nums min-w-[3ch] text-center shrink-0">
                  {hardwareSelectIndex + 1} / {hardwareTotal}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 flex-1 min-w-0"
                  disabled={hardwareSelectIndex === hardwareTotal - 1}
                  onClick={() => setHardwareSelectIndex((i) => Math.min(hardwareTotal - 1, i + 1))}
                  aria-label="Следующий"
                >
                  <ChevronRight className="size-4" />
                </Button>
              </div>
              <Button variant="outline" className="w-full h-10" onClick={() => setScreen(paramSelectReturnScreen)}>
                <ChevronLeft className="mr-1 size-4" /> Назад
              </Button>
            </div>
          </div>
        )
      }

      case "gallery":
        return (
          <div className="flex flex-col h-full min-h-0">
            <div className="flex-1 p-4 flex flex-col min-h-0">
              <div className="flex-1 bg-secondary rounded-lg flex items-center justify-center min-h-0">
                <span className="text-muted-foreground text-center px-4 text-sm">{galleryImages[galleryIndex]}</span>
              </div>
            </div>
            <div className="p-3 pt-0 flex flex-col gap-2 shrink-0">
              <div className="flex items-center w-full gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 flex-1 min-w-0"
                  disabled={galleryIndex === 0}
                  onClick={() => setGalleryIndex(i => Math.max(0, i - 1))}
                  aria-label="Предыдущее"
                >
                  <ChevronLeft className="size-4" />
                </Button>
                <span className="text-xs text-muted-foreground tabular-nums min-w-[3ch] text-center shrink-0">
                  {galleryIndex + 1} / {galleryImages.length}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 flex-1 min-w-0"
                  disabled={galleryIndex === galleryImages.length - 1}
                  onClick={() => setGalleryIndex(i => Math.min(galleryImages.length - 1, i + 1))}
                  aria-label="Следующее"
                >
                  <ChevronRight className="size-4" />
                </Button>
              </div>
              <Button variant="outline" className="w-full h-10" onClick={() => setScreen("main-menu")}>
                Главное меню
              </Button>
            </div>
          </div>
        )

      case "about": {
        const currentMember = team[teamIndex]
        const teamTotal = team.length
        return (
          <div className="flex flex-col h-full min-h-0">
            <div className="flex-1 p-3 overflow-hidden min-h-0 flex flex-col">
              <div className="flex-1 min-h-[120px] bg-secondary rounded-lg w-full aspect-[3/4] max-h-[272px] flex items-center justify-center overflow-hidden shrink-0">
                <span className="text-muted-foreground text-sm">Фото команды</span>
              </div>
              <div className="mt-3 space-y-1 shrink-0">
                <h3 className="text-base font-semibold text-foreground leading-tight">{currentMember?.name}</h3>
                <p className="text-sm text-primary font-medium">{currentMember?.role}</p>
                <p className="text-xs text-muted-foreground leading-snug line-clamp-3 mt-1">{currentMember?.description}</p>
              </div>
            </div>
            <div className="p-3 pt-0 flex flex-col gap-3 shrink-0">
              <div className="flex items-center w-full gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 flex-1 min-w-0"
                  disabled={teamIndex === 0}
                  onClick={() => setTeamIndex((i) => Math.max(0, i - 1))}
                  aria-label="Предыдущий"
                >
                  <ChevronLeft className="size-4" />
                </Button>
                <span className="text-xs text-muted-foreground tabular-nums min-w-[3ch] text-center shrink-0">
                  {teamIndex + 1} / {teamTotal}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 flex-1 min-w-0"
                  disabled={teamIndex === teamTotal - 1}
                  onClick={() => setTeamIndex((i) => Math.min(teamTotal - 1, i + 1))}
                  aria-label="Следующий"
                >
                  <ChevronRight className="size-4" />
                </Button>
              </div>
              <Button className="w-full h-10" onClick={() => window.open("https://t.me/kircraft", "_blank")}>
                Наш Telegram-канал
              </Button>
              <Button variant="outline" className="w-full h-10" onClick={() => setScreen("main-menu")}>
                Главное меню
              </Button>
            </div>
          </div>
        )
      }
    }
  }

  return (
    <div className="w-full max-w-sm mx-auto">
      <Dialog open={orderModalOpen} onOpenChange={(open) => { if (!open) closeOrderModal() }}>
        <DialogContent className="w-[min(368px,calc(100%-2rem))] max-w-full p-5 pb-5 rounded-xl box-border" showCloseButton={false}>
          {orderSuccessVisible ? (
            <>
              <DialogHeader>
                <DialogTitle>Заказ принят</DialogTitle>
                <p className="text-sm text-muted-foreground pt-1">Мастер свяжется с вами в Telegram.</p>
              </DialogHeader>
              <DialogFooter className="flex flex-row gap-3 pt-3 flex-wrap sm:flex-nowrap">
                <Button
                  className="flex-1 min-h-11 min-w-0 rounded-lg text-sm"
                  onClick={continueBrowsing}
                >
                  Продолжить
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 min-h-11 min-w-0 rounded-lg text-sm overflow-hidden"
                  onClick={goToMainMenuFromSuccess}
                >
                  <span className="truncate block">Главное меню</span>
                </Button>
              </DialogFooter>
            </>
          ) : orderFromCart ? (
            <>
              <DialogHeader>
                <DialogTitle>Оформить заказ</DialogTitle>
                <p className="text-sm text-muted-foreground mt-2">
                  Итого: {cartItems.reduce((s, p) => s + parsePrice(p.product.price) * (p.quantity ?? 1), 0).toLocaleString("ru-RU")} ₽
                </p>
              </DialogHeader>
              <DialogFooter className="flex flex-row gap-3 pt-3">
                <Button className="flex-1 h-11 min-w-0 rounded-lg" onClick={confirmOrder}>
                  Подтвердить
                </Button>
                <Button variant="outline" className="flex-1 h-11 min-w-0 rounded-lg" onClick={closeOrderModal}>
                  Отмена
                </Button>
              </DialogFooter>
            </>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle>Ваш заказ</DialogTitle>
                {orderModalProduct && (
                  <div className="rounded-lg border border-border bg-muted/30 py-2 px-3 mt-2">
                    <p className="text-sm font-medium text-foreground truncate">
                      {orderModalProduct.name} — {orderModalProduct.price}
                    </p>
                  </div>
                )}
              </DialogHeader>
              <DialogFooter className="flex flex-row gap-3 pt-3">
                <Button className="flex-1 h-11 min-w-0 rounded-lg" onClick={confirmOrder}>
                  Подтвердить
                </Button>
                <Button variant="outline" className="flex-1 h-11 min-w-0 rounded-lg" onClick={closeOrderModal}>
                  Отмена
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
      <Dialog open={addToCartModalOpen} onOpenChange={(open) => { if (!open) closeAddToCartModal() }}>
        <DialogContent className="w-[min(368px,calc(100%-2rem))] max-w-full p-5 pb-5 rounded-xl box-border overflow-hidden" showCloseButton={false}>
          {addToCartSuccessVisible ? (
            <>
              <DialogHeader>
                <DialogTitle>Товар добавлен в корзину</DialogTitle>
              </DialogHeader>
              <DialogFooter className="grid grid-cols-2 gap-2 pt-3 w-full min-w-0">
                <Button
                  className="h-11 min-w-0 rounded-lg text-sm overflow-hidden text-ellipsis whitespace-nowrap"
                  onClick={continueShopping}
                >
                  Продолжить покупки
                </Button>
                <Button
                  variant="outline"
                  className="h-11 min-w-0 rounded-lg text-sm overflow-hidden text-ellipsis whitespace-nowrap"
                  onClick={goToCartFromModal}
                >
                  Перейти в корзину
                </Button>
              </DialogFooter>
            </>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle>Добавить в корзину</DialogTitle>
                {addToCartModalProduct && (
                  <div className="space-y-1 mt-2">
                    <p className="text-sm font-medium text-foreground">{addToCartModalProduct.name}</p>
                    <p className="text-base font-bold text-primary">{addToCartModalProduct.price}</p>
                    <p className="text-xs text-muted-foreground pt-1">Цвет кожи: {selectedColor}</p>
                    <p className="text-xs text-muted-foreground">Цвет фурнитуры: {selectedHardware}</p>
                  </div>
                )}
              </DialogHeader>
              <DialogFooter className="flex flex-row gap-3 pt-3">
                <Button className="flex-1 h-11 min-w-0 rounded-lg" onClick={confirmAddToCart}>
                  Подтвердить
                </Button>
                <Button variant="outline" className="flex-1 h-11 min-w-0 rounded-lg" onClick={closeAddToCartModal}>
                  Отмена
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
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
            <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0 bg-secondary">
              <img src="/logo.png" alt="" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-foreground">Kircraft</p>
              <p className="text-xs text-primary">бот</p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded"
                  aria-label="Меню"
                >
                  <MoreHorizontal className="size-5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-[200px]">
                <DropdownMenuItem onClick={() => setScreen("post-order-demo")}>
                  Сценарии после заказа (демо)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
