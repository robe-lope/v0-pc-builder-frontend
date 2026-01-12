import type { BuildComponent, CompatibilityWarning } from "./types"

export function checkCompatibility(components: BuildComponent[]): CompatibilityWarning[] {
  const warnings: CompatibilityWarning[] = []

  const cpu = components.find((c) => c.category === "cpu")?.product
  const motherboard = components.find((c) => c.category === "motherboard")?.product
  const ram = components.find((c) => c.category === "ram")?.product
  const gpu = components.find((c) => c.category === "gpu")?.product
  const psu = components.find((c) => c.category === "psu")?.product
  const caseProduct = components.find((c) => c.category === "case")?.product

  // CPU Socket vs Motherboard Socket
  if (cpu && motherboard) {
    if (cpu.socket !== motherboard.socket) {
      warnings.push({
        type: "error",
        message: `El socket del CPU (${cpu.socket}) no es compatible con el motherboard (${motherboard.socket})`,
        categories: ["cpu", "motherboard"],
      })
    }
  }

  // RAM Type vs Motherboard
  if (ram && motherboard) {
    if (ram.ramType !== motherboard.ramType) {
      warnings.push({
        type: "error",
        message: `El tipo de RAM (${ram.ramType}) no es compatible con el motherboard (${motherboard.ramType})`,
        categories: ["ram", "motherboard"],
      })
    }

    // RAM Speed vs Motherboard
    const ramSpeed = Number.parseInt(ram.specs.speed as string)
    if (motherboard.maxRamSpeed && ramSpeed > motherboard.maxRamSpeed) {
      warnings.push({
        type: "warning",
        message: `La RAM seleccionada (${ramSpeed}MHz) supera la frecuencia máxima soportada por el motherboard (${motherboard.maxRamSpeed}MHz)`,
        categories: ["ram", "motherboard"],
      })
    }
  }

  // Power consumption vs PSU wattage
  if (psu) {
    let totalPower = 0
    components.forEach((c) => {
      if (c.product?.powerConsumption) {
        totalPower += c.product.powerConsumption * c.quantity
      }
    })

    // Add 20% overhead
    const recommendedPower = totalPower * 1.2

    if (psu.psuWattage && psu.psuWattage < totalPower) {
      warnings.push({
        type: "error",
        message: `La fuente (${psu.psuWattage}W) es insuficiente para el consumo estimado (${Math.round(totalPower)}W)`,
        categories: ["psu"],
      })
    } else if (psu.psuWattage && psu.psuWattage < recommendedPower) {
      warnings.push({
        type: "warning",
        message: `Se recomienda una fuente de al menos ${Math.round(recommendedPower)}W. Consumo estimado: ${Math.round(totalPower)}W`,
        categories: ["psu"],
      })
    }
  }

  // Form factor motherboard vs case
  if (motherboard && caseProduct) {
    const caseSupportsFormFactor = (caseProduct.specs.formFactor as string)
      .split(",")
      .map((f) => f.trim())
      .includes(motherboard.formFactor || "")

    if (!caseSupportsFormFactor) {
      warnings.push({
        type: "error",
        message: `El gabinete no soporta el form factor del motherboard (${motherboard.formFactor})`,
        categories: ["motherboard", "case"],
      })
    }
  }

  return warnings
}

export function calculateBuildPrice(components: BuildComponent[]): {
  totalsByStore: Record<string, number>
  grandTotal: number
  bestPricePerComponent: Record<string, { storeId: string; price: number }>
} {
  const totalsByStore: Record<string, number> = {}
  const bestPricePerComponent: Record<string, { storeId: string; price: number }> = {}
  let grandTotal = 0

  components.forEach((component) => {
    if (component.product && component.quantity > 0) {
      // Find best price for this component
      const prices = component.product.prices.filter((p) => p.stock)
      if (prices.length > 0) {
        const bestPrice = prices.reduce((min, p) => (p.price < min.price ? p : min))
        bestPricePerComponent[component.product.id] = {
          storeId: bestPrice.storeId,
          price: bestPrice.price * component.quantity,
        }

        // Add to store totals
        if (!totalsByStore[bestPrice.storeId]) {
          totalsByStore[bestPrice.storeId] = 0
        }
        totalsByStore[bestPrice.storeId] += bestPrice.price * component.quantity
        grandTotal += bestPrice.price * component.quantity
      }
    }
  })

  return { totalsByStore, grandTotal, bestPricePerComponent }
}
