// TODO: replace with Supabase
import type { Store, Product, Build } from "./types"

export const mockStores: Store[] = [
  {
    id: "hdgamers",
    name: "HDGamers",
    location: "CABA, Buenos Aires",
  },
  {
    id: "compragamer",
    name: "CompraGamer",
    location: "CABA, Buenos Aires",
  },
  {
    id: "mexx",
    name: "Mexx",
    location: "Rosario, Santa Fe",
  },
  {
    id: "venex",
    name: "Venex",
    location: "CABA, Buenos Aires",
  },
  {
    id: "maximus",
    name: "Maximus Gaming",
    location: "Córdoba",
  },
]

export const mockProducts: Product[] = [
  // CPUs
  {
    id: "cpu-1",
    name: "AMD Ryzen 7 7800X3D",
    category: "cpu",
    brand: "AMD",
    image: "/amd-ryzen-cpu-processor.jpg",
    socket: "AM5",
    powerConsumption: 120,
    specs: {
      cores: 8,
      threads: 16,
      baseClock: "4.2 GHz",
      boostClock: "5.0 GHz",
      cache: "96MB",
      tdp: "120W",
    },
    prices: [
      { storeId: "hdgamers", price: 459900, stock: true, updatedDaysAgo: 1 },
      { storeId: "compragamer", price: 465000, stock: true, updatedDaysAgo: 2 },
      { storeId: "venex", price: 472000, stock: false, updatedDaysAgo: 3 },
    ],
  },
  {
    id: "cpu-2",
    name: "Intel Core i5-13600K",
    category: "cpu",
    brand: "Intel",
    image: "/intel-core-i5-cpu-processor.jpg",
    socket: "LGA1700",
    powerConsumption: 125,
    specs: {
      cores: 14,
      threads: 20,
      baseClock: "3.5 GHz",
      boostClock: "5.1 GHz",
      cache: "24MB",
      tdp: "125W",
    },
    prices: [
      { storeId: "hdgamers", price: 289900, stock: true, updatedDaysAgo: 1 },
      { storeId: "compragamer", price: 295000, stock: true, updatedDaysAgo: 1 },
      { storeId: "mexx", price: 292000, stock: true, updatedDaysAgo: 2 },
    ],
  },
  // Motherboards
  {
    id: "mobo-1",
    name: "ASUS ROG STRIX B650E-E GAMING",
    category: "motherboard",
    brand: "ASUS",
    image: "/asus-motherboard-pcb.jpg",
    socket: "AM5",
    ramType: "DDR5",
    ramSlots: 4,
    maxRamSpeed: 6400,
    formFactor: "ATX",
    specs: {
      chipset: "B650E",
      memorySlots: 4,
      maxMemory: "128GB",
      m2Slots: 3,
      pcie: "5.0",
    },
    prices: [
      { storeId: "hdgamers", price: 389900, stock: true, updatedDaysAgo: 2 },
      { storeId: "compragamer", price: 395000, stock: true, updatedDaysAgo: 1 },
    ],
  },
  {
    id: "mobo-2",
    name: "MSI PRO B760M-A WIFI",
    category: "motherboard",
    brand: "MSI",
    image: "/msi-motherboard-micro-atx.jpg",
    socket: "LGA1700",
    ramType: "DDR5",
    ramSlots: 4,
    maxRamSpeed: 5600,
    formFactor: "Micro-ATX",
    specs: {
      chipset: "B760",
      memorySlots: 4,
      maxMemory: "128GB",
      m2Slots: 2,
      pcie: "4.0",
    },
    prices: [
      { storeId: "mexx", price: 149900, stock: true, updatedDaysAgo: 1 },
      { storeId: "venex", price: 152000, stock: true, updatedDaysAgo: 3 },
    ],
  },
  // GPUs
  {
    id: "gpu-1",
    name: "NVIDIA GeForce RTX 4070 Ti",
    category: "gpu",
    brand: "NVIDIA",
    image: "/nvidia-rtx-graphics-card.jpg",
    powerConsumption: 285,
    specs: {
      memory: "12GB GDDR6X",
      coreClock: "2310 MHz",
      boostClock: "2610 MHz",
      cudaCores: 7680,
      tdp: "285W",
    },
    prices: [
      { storeId: "hdgamers", price: 1099900, stock: true, updatedDaysAgo: 1 },
      { storeId: "compragamer", price: 1115000, stock: true, updatedDaysAgo: 2 },
      { storeId: "maximus", price: 1089000, stock: true, updatedDaysAgo: 1 },
    ],
  },
  {
    id: "gpu-2",
    name: "AMD Radeon RX 7800 XT",
    category: "gpu",
    brand: "AMD",
    image: "/amd-radeon-graphics-card.jpg",
    powerConsumption: 263,
    specs: {
      memory: "16GB GDDR6",
      gameClock: "2124 MHz",
      boostClock: "2430 MHz",
      streamProcessors: 3840,
      tdp: "263W",
    },
    prices: [
      { storeId: "hdgamers", price: 759900, stock: true, updatedDaysAgo: 2 },
      { storeId: "venex", price: 765000, stock: false, updatedDaysAgo: 5 },
    ],
  },
  // RAM
  {
    id: "ram-1",
    name: "Corsair Vengeance DDR5 32GB (2x16GB) 6000MHz",
    category: "ram",
    brand: "Corsair",
    image: "/corsair-ram-memory-ddr5.jpg",
    ramType: "DDR5",
    specs: {
      capacity: "32GB (2x16GB)",
      speed: "6000MHz",
      cas: "CL30",
      voltage: "1.35V",
    },
    prices: [
      { storeId: "hdgamers", price: 229900, stock: true, updatedDaysAgo: 1 },
      { storeId: "compragamer", price: 235000, stock: true, updatedDaysAgo: 1 },
      { storeId: "mexx", price: 239000, stock: true, updatedDaysAgo: 3 },
    ],
  },
  {
    id: "ram-2",
    name: "G.Skill Trident Z5 RGB DDR5 32GB (2x16GB) 6400MHz",
    category: "ram",
    brand: "G.Skill",
    image: "/g-skill-rgb-ram-memory.jpg",
    ramType: "DDR5",
    specs: {
      capacity: "32GB (2x16GB)",
      speed: "6400MHz",
      cas: "CL32",
      voltage: "1.35V",
      rgb: "Sí",
    },
    prices: [
      { storeId: "hdgamers", price: 259900, stock: true, updatedDaysAgo: 2 },
      { storeId: "venex", price: 265000, stock: true, updatedDaysAgo: 1 },
    ],
  },
  // Storage
  {
    id: "storage-1",
    name: "Samsung 990 PRO 2TB NVMe M.2",
    category: "storage",
    brand: "Samsung",
    image: "/samsung-nvme-ssd-m-2.jpg",
    specs: {
      capacity: "2TB",
      interface: "PCIe 4.0 x4 NVMe",
      formFactor: "M.2 2280",
      readSpeed: "7450 MB/s",
      writeSpeed: "6900 MB/s",
    },
    prices: [
      { storeId: "hdgamers", price: 289900, stock: true, updatedDaysAgo: 1 },
      { storeId: "compragamer", price: 295000, stock: true, updatedDaysAgo: 2 },
      { storeId: "maximus", price: 292000, stock: true, updatedDaysAgo: 1 },
    ],
  },
  // PSU
  {
    id: "psu-1",
    name: "Corsair RM850e 850W 80+ Gold Modular",
    category: "psu",
    brand: "Corsair",
    image: "/corsair-power-supply-psu.jpg",
    psuWattage: 850,
    specs: {
      wattage: "850W",
      efficiency: "80+ Gold",
      modular: "Full Modular",
      pfc: "Active",
    },
    prices: [
      { storeId: "hdgamers", price: 189900, stock: true, updatedDaysAgo: 1 },
      { storeId: "compragamer", price: 195000, stock: true, updatedDaysAgo: 2 },
      { storeId: "mexx", price: 192000, stock: true, updatedDaysAgo: 1 },
    ],
  },
  {
    id: "psu-2",
    name: "EVGA SuperNOVA 750 G6 750W 80+ Gold",
    category: "psu",
    brand: "EVGA",
    image: "/evga-power-supply-unit.jpg",
    psuWattage: 750,
    specs: {
      wattage: "750W",
      efficiency: "80+ Gold",
      modular: "Full Modular",
      pfc: "Active",
    },
    prices: [
      { storeId: "venex", price: 169900, stock: true, updatedDaysAgo: 2 },
      { storeId: "maximus", price: 165000, stock: true, updatedDaysAgo: 1 },
    ],
  },
  // Cases
  {
    id: "case-1",
    name: "NZXT H7 Flow ATX Mid Tower",
    category: "case",
    brand: "NZXT",
    image: "/nzxt-pc-case-black-mesh.jpg",
    formFactor: "ATX",
    specs: {
      type: "Mid Tower",
      formFactor: "ATX, Micro-ATX, Mini-ITX",
      fans: "3x 120mm included",
      radiatorSupport: "360mm front, 280mm top",
    },
    prices: [
      { storeId: "hdgamers", price: 159900, stock: true, updatedDaysAgo: 1 },
      { storeId: "compragamer", price: 165000, stock: true, updatedDaysAgo: 3 },
    ],
  },
  // Coolers
  {
    id: "cooler-1",
    name: "Noctua NH-D15 chromax.black",
    category: "cooler",
    brand: "Noctua",
    image: "/noctua-cpu-cooler-black.jpg",
    specs: {
      type: "Air",
      height: "165mm",
      fans: "2x 140mm",
      tdp: "220W",
      sockets: "AM4, AM5, LGA1700, LGA1200",
    },
    prices: [
      { storeId: "hdgamers", price: 129900, stock: true, updatedDaysAgo: 2 },
      { storeId: "mexx", price: 135000, stock: true, updatedDaysAgo: 1 },
      { storeId: "venex", price: 132000, stock: true, updatedDaysAgo: 4 },
    ],
  },
]

export const mockUser = {
  id: "user-1",
  name: "Juan Pérez",
  email: "juan@example.com",
}

export const mockBuilds: Build[] = [
  {
    id: "build-1",
    name: "Mi Build Gaming",
    createdAt: new Date("2024-01-15"),
    components: [
      { category: "cpu", product: mockProducts[0], quantity: 1 },
      { category: "motherboard", product: mockProducts[2], quantity: 1 },
      { category: "gpu", product: mockProducts[4], quantity: 1 },
      { category: "ram", product: mockProducts[6], quantity: 1 },
      { category: "storage", product: mockProducts[8], quantity: 1 },
      { category: "psu", product: mockProducts[9], quantity: 1 },
      { category: "case", product: mockProducts[11], quantity: 1 },
      { category: "cooler", product: mockProducts[12], quantity: 1 },
      { category: "other", product: null, quantity: 0 },
    ],
  },
]
