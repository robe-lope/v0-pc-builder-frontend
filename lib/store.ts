'use client';

import { useMemo } from "react"
import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { BuildComponent, Product, CompatibilityWarning, ComponentCategory } from "./types"
import { checkCompatibility, calculateBuildPrice } from "./compatibility"

interface BuildState {
  components: BuildComponent[]
  warnings: CompatibilityWarning[]

  // Actions
  addComponent: (category: ComponentCategory, product: Product) => void
  removeComponent: (category: ComponentCategory, productId?: string) => void
  updateQuantity: (category: ComponentCategory, productId: string, quantity: number) => void
  clearBuild: () => void
  loadBuild: (components: BuildComponent[]) => void
}

const initialComponents: BuildComponent[] = [
  { category: "cpu", product: null, quantity: 1 },
  { category: "motherboard", product: null, quantity: 1 },
  { category: "gpu", product: null, quantity: 1 },
  { category: "ram", product: null, quantity: 1 },
  { category: "storage", product: null, quantity: 1 },
  { category: "psu", product: null, quantity: 1 },
  { category: "case", product: null, quantity: 1 },
  { category: "cooler", product: null, quantity: 1 },
  { category: "other", product: null, quantity: 0 },
]

export const useBuildStore = create<BuildState>()(
  persist(
    (set) => ({
      components: initialComponents,
      warnings: [],

      addComponent: (category, product) =>
        set((state) => {
          const newComponents = [...state.components]
          const index = newComponents.findIndex((c) => c.category === category)

          if (index !== -1) {
            // For categories that allow multiple (ram, storage, other)
            if (["ram", "storage", "other"].includes(category)) {
              // Check if this product is already in the build
              const existingIndex = newComponents.findIndex(
                (c) => c.category === category && c.product?.id === product.id,
              )
              if (existingIndex !== -1) {
                newComponents[existingIndex].quantity += 1
              } else {
                // Add as new entry
                newComponents.push({ category, product, quantity: 1 })
              }
            } else {
              // Single component categories - replace
              newComponents[index] = { category, product, quantity: 1 }
            }
          }

          const warnings = checkCompatibility(newComponents)
          return { components: newComponents, warnings }
        }),

      removeComponent: (category, productId) =>
        set((state) => {
          let newComponents = [...state.components]

          if (productId) {
            // Remove specific product
            newComponents = newComponents.map((c) => {
              if (c.category === category && c.product?.id === productId) {
                return { category, product: null, quantity: 0 }
              }
              return c
            })
          } else {
            // Remove all from category
            const index = newComponents.findIndex((c) => c.category === category)
            if (index !== -1) {
              newComponents[index] = { category, product: null, quantity: 0 }
            }
          }

          const warnings = checkCompatibility(newComponents)
          return { components: newComponents, warnings }
        }),

      updateQuantity: (category, productId, quantity) =>
        set((state) => {
          const newComponents = state.components.map((c) => {
            if (c.category === category && c.product?.id === productId) {
              return { ...c, quantity: Math.max(0, quantity) }
            }
            return c
          })

          const warnings = checkCompatibility(newComponents)
          return { components: newComponents, warnings }
        }),

      clearBuild: () =>
        set({
          components: initialComponents,
          warnings: [],
        }),

      loadBuild: (components) =>
        set({
          components,
          warnings: checkCompatibility(components),
        }),
    }),
    {
      name: "pc-build-storage",
    },
  ),
)

// Selector hooks for better performance
export const useBuildComponents = () => useBuildStore((state) => state.components)
export const useBuildWarnings = () => useBuildStore((state) => state.warnings)

// Use shallow equality for action selectors to avoid creating new objects
export const useBuildActions = () => {
  const addComponent = useBuildStore((state) => state.addComponent)
  const removeComponent = useBuildStore((state) => state.removeComponent)
  const updateQuantity = useBuildStore((state) => state.updateQuantity)
  const clearBuild = useBuildStore((state) => state.clearBuild)
  const loadBuild = useBuildStore((state) => state.loadBuild)
  
  return useMemo(() => ({ 
    addComponent, 
    removeComponent, 
    updateQuantity, 
    clearBuild, 
    loadBuild 
  }), [addComponent, removeComponent, updateQuantity, clearBuild, loadBuild])
}

// Helper to calculate build totals - memoized to prevent infinite loops
export const useBuildTotals = () => {
  const components = useBuildStore((state) => state.components)
  
  return useMemo(() => calculateBuildPrice(components), [components])
}
