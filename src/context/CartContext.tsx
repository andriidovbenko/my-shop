"use client"
import { createContext, useContext, useReducer, useEffect, ReactNode } from "react"
import type { CartItem } from "@/types"

interface CartState {
  items: CartItem[]
}

type CartAction =
  | { type: "ADD"; item: CartItem }
  | { type: "REMOVE"; productId: string }
  | { type: "UPDATE_QUANTITY"; productId: string; quantity: number }
  | { type: "CLEAR" }

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD": {
      const existing = state.items.find((i) => i.productId === action.item.productId)
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.productId === action.item.productId
              ? { ...i, quantity: i.quantity + action.item.quantity }
              : i
          ),
        }
      }
      return { items: [...state.items, action.item] }
    }
    case "REMOVE":
      return { items: state.items.filter((i) => i.productId !== action.productId) }
    case "UPDATE_QUANTITY":
      return {
        items: state.items.map((i) =>
          i.productId === action.productId ? { ...i, quantity: action.quantity } : i
        ),
      }
    case "CLEAR":
      return { items: [] }
    default:
      return state
  }
}

const STORAGE_KEY = "cart"

// Lazy initializer — reads localStorage synchronously at first render,
// so the persist effect never fires with an empty state.
function initCart(): CartState {
  if (typeof window === "undefined") return { items: [] }
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) return { items: JSON.parse(stored) }
  } catch {}
  return { items: [] }
}

interface CartContextType {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  totalItems: number
  totalPrice: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, undefined, initCart)

  // Persist to localStorage whenever cart changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items))
    } catch {}
  }, [state.items])

  const addItem = (item: CartItem) => dispatch({ type: "ADD", item })
  const removeItem = (productId: string) => dispatch({ type: "REMOVE", productId })
  const updateQuantity = (productId: string, quantity: number) =>
    dispatch({ type: "UPDATE_QUANTITY", productId, quantity })
  const clearCart = () => dispatch({ type: "CLEAR" })

  const totalItems = state.items.reduce((sum, i) => sum + i.quantity, 0)
  const totalPrice = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0)

  return (
    <CartContext.Provider
      value={{ items: state.items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error("useCart must be used within CartProvider")
  return context
}
