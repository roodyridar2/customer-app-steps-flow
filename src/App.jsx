import { useState, useEffect, useLayoutEffect, useRef, useMemo, useCallback, Fragment } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ─── Tabs ────────────────────────────────────────────────────────────────────
// ─── Tabs ────────────────────────────────────────────────────────────────────
const tabs = [
  { id: 'wash-fold',    label: 'Wash & Fold',   short: 'Wash',    icon: '/service/Wash and fold.png',   color: '#DBEAFE', dot: '#3B82F6' },
  { id: 'clean-press',  label: 'Clean & Press', short: 'Clean',   icon: '/service/clean and press.png', color: '#DCFCE7', dot: '#22C55E' },
  { id: 'press-only',   label: 'Press Only',    short: 'Press',   icon: '/service/press only.png',      color: '#FEF9C3', dot: '#EAB308' },
  { id: 'bed-bath',     label: 'Bed & Bath',    short: 'Bed',     icon: '/service/bed-bath.png',        color: '#E0F2FE', dot: '#0284C7' },
  { id: 'bags-shoes',   label: 'Bags & Shoes',  short: 'Bags',    icon: '/service/bags and shoes.png',  color: '#FCE7F3', dot: '#EC4899' },
  { id: 'premium-care', label: 'Premium Care',  short: 'Premium', icon: '/service/premium care.png',    color: '#EDE9FE', dot: '#8B5CF6' },
  { id: '5-service',    label: '5 Service',     short: '×5',      icon: null,                           color: '#CCFBF1', dot: '#14B8A6' },
]

// ─── Status steps definitions from assets/screens ────────────────────────────
// Common Pre-Process Steps
const STEP_ORDER_PLACED = {
  id: 'order-placed',
  label: 'Order Placed',
  icon: '/status/order-placed.png',
}
const STEP_DRIVER_EN_ROUTE = {
  id: 'driver-en-route',
  label: 'Driver En Route',
  icon: '/status/driver-en-route.png',
}
const STEP_COLLECTED_TRANSIT = {
  id: 'collected-transit',
  label: 'Collected & In Transit',
  icon: '/status/collected-transit.png',
}
const STEP_ARRIVED_FACILITY = {
  id: 'arrived-facility',
  label: 'Arrived at Facility',
  icon: '/status/arrived-facility.png',
}

// Common Post-Process Steps
const STEP_QUALITY_CHECK = {
  id: 'quality-check',
  label: 'Quality Check',
  icon: '/status/quality-check.png',
  isQualityCheck: true,
}
const STEP_OUT_FOR_DELIVERY = {
  id: 'out-for-delivery',
  label: 'Out for Delivery',
  icon: '/status/out-of-delivery.png',
}
const STEP_DELIVERED = {
  id: 'delivered',
  label: 'Delivered',
  icon: '/status/delivered.png',
}

// 1. Wash & Fold Service Steps
// process -> sorting, Washing & Tumble Drying, Neat Folding
const WASH_FOLD_STEPS = [
  STEP_ORDER_PLACED,
  STEP_DRIVER_EN_ROUTE,
  STEP_COLLECTED_TRANSIT,
  STEP_ARRIVED_FACILITY,
  { id: 'sorting', label: 'Sorting', icon: '/status/sorted.png', isProcess: true },
  { id: 'washing-drying', label: 'Washing & Tumble Drying', icon: '/status/washed.png', isProcess: true },
  { id: 'neat-folding', label: 'Neat Folding', icon: '/status/neat-folding.png', isProcess: true },
  STEP_QUALITY_CHECK,
  STEP_OUT_FOR_DELIVERY,
  STEP_DELIVERED,
]

// 2. Clean & Press Service Steps
// process -> Itemization & Stain Check, Cleaning & Care, Pressing & Hanging
const CLEAN_PRESS_STEPS = [
  STEP_ORDER_PLACED,
  STEP_DRIVER_EN_ROUTE,
  STEP_COLLECTED_TRANSIT,
  STEP_ARRIVED_FACILITY,
  { id: 'itemization-stain', label: 'Itemization & Stain Check', icon: '/status/itemization-stain.png', isProcess: true },
  { id: 'cleaning-care', label: 'Cleaning & Care', icon: '/status/cleaning-care.png', isProcess: true },
  { id: 'pressing-hanging', label: 'Pressing & Hanging', icon: '/status/Iconed.png', isProcess: true },
  STEP_QUALITY_CHECK,
  STEP_OUT_FOR_DELIVERY,
  STEP_DELIVERED,
]

// 3. Press Only Service Steps
// process -> Itemization & Garment Prep, Steam Ironing
const PRESS_ONLY_STEPS = [
  STEP_ORDER_PLACED,
  STEP_DRIVER_EN_ROUTE,
  STEP_COLLECTED_TRANSIT,
  STEP_ARRIVED_FACILITY,
  { id: 'itemization-prep', label: 'Itemization & Garment Prep', icon: '/status/itemization-prep.png', isProcess: true },
  { id: 'steam-ironing', label: 'Steam Ironing', icon: '/status/Iconed.png', isProcess: true },
  STEP_QUALITY_CHECK,
  STEP_OUT_FOR_DELIVERY,
  STEP_DELIVERED,
]

// 4. Bed & Bath Service Steps
// process -> Sorting & Sanitization Prep, Thermal Sanitization Wash, Flatwork Ironing & Folding
const BED_BATH_STEPS = [
  STEP_ORDER_PLACED,
  STEP_DRIVER_EN_ROUTE,
  STEP_COLLECTED_TRANSIT,
  STEP_ARRIVED_FACILITY,
  { id: 'sorting-sanitization', label: 'Sorting & Sanitization Prep', icon: '/status/sorting-sanitization.png', isProcess: true },
  { id: 'thermal-wash', label: 'Thermal Sanitization Wash', icon: '/status/thermal-wash.png', isProcess: true },
  { id: 'flatwork-ironing', label: 'Flatwork Ironing & Folding', icon: '/status/flatwork-iron.png', isProcess: true },
  STEP_QUALITY_CHECK,
  STEP_OUT_FOR_DELIVERY,
  STEP_DELIVERED,
]

// 5. Bag & Shoe Care Service Steps
// process -> Specialist Inspection, Deep Cleaning & Sole Care, Conditioning & Polishing
const BAGS_SHOES_STEPS = [
  STEP_ORDER_PLACED,
  STEP_DRIVER_EN_ROUTE,
  STEP_COLLECTED_TRANSIT,
  STEP_ARRIVED_FACILITY,
  { id: 'specialist-inspection', label: 'Specialist Inspection', icon: '/status/specialist-inspection.png', isProcess: true },
  { id: 'sole-care', label: 'Deep Cleaning & Sole Care', icon: '/status/sole-care.png', isProcess: true },
  { id: 'conditioning-polishing', label: 'Conditioning & Polishing', icon: '/status/conditioning-polishing.png', isProcess: true },
  STEP_QUALITY_CHECK,
  STEP_OUT_FOR_DELIVERY,
  STEP_DELIVERED,
]

// 6. Otee Markat (Premium Care) Steps
// process -> VIP Assessment, Quote Confirmation, Eco Solvent & Hand Cleaning, Hand-Finishing & Restoration, Premium Packaging
const PREMIUM_CARE_STEPS = [
  STEP_ORDER_PLACED,
  STEP_DRIVER_EN_ROUTE,
  STEP_COLLECTED_TRANSIT,
  STEP_ARRIVED_FACILITY,
  { id: 'vip-assessment', label: 'VIP Assessment', icon: '/status/vip-assessment.png', isProcess: true },
  { id: 'quote-confirmation', label: 'Quote Confirmation', icon: '/status/confirm.png', isProcess: true },
  { id: 'eco-cleaning', label: 'Eco Solvent & Hand Cleaning', icon: '/status/eco-cleaning.png', isProcess: true },
  { id: 'hand-restoration', label: 'Hand-Finishing & Restoration', icon: '/status/hand-restoration.png', isProcess: true },
  { id: 'premium-packaging', label: 'Premium Packaging', icon: '/status/packed.png', isProcess: true },
  STEP_QUALITY_CHECK,
  STEP_OUT_FOR_DELIVERY,
  STEP_DELIVERED,
]

// Backward-compatibility references
const NINE_STEPS = WASH_FOLD_STEPS
const steps = WASH_FOLD_STEPS

// ─── Process Compaction Helpers ───────────────────────────────────────────────
function isProcessStep(step) {
  return Boolean(step && step.isProcess)
}

function buildProcessSteps(rawSteps, isCompact) {
  if (!isCompact || !rawSteps) {
    return {
      displaySteps: rawSteps,
      processGroupIndex: -1,
      hasProcess: false,
      startIndex: -1,
      endIndex: -1,
      subSteps: [],
    }
  }

  const processIndices = []
  rawSteps.forEach((s, idx) => {
    if (isProcessStep(s)) {
      processIndices.push(idx)
    }
  })

  if (processIndices.length === 0) {
    return {
      displaySteps: rawSteps,
      processGroupIndex: -1,
      hasProcess: false,
      startIndex: -1,
      endIndex: -1,
      subSteps: [],
    }
  }

  const startIndex = processIndices[0]
  const endIndex = processIndices[processIndices.length - 1]
  const subSteps = rawSteps.slice(startIndex, endIndex + 1)

  const before = rawSteps.slice(0, startIndex)
  const after = rawSteps.slice(endIndex + 1)

  const processGroup = {
    id: 'process-group',
    label: 'Processing',
    isProcessGroup: true,
    subSteps,
    startIndex,
    endIndex,
    icon: subSteps[0]?.icon || '/status/washed.png',
  }

  const displaySteps = [...before, processGroup, ...after]
  const processGroupIndex = before.length

  return {
    displaySteps,
    processGroupIndex,
    hasProcess: true,
    startIndex,
    endIndex,
    subSteps,
  }
}

function mapRawToDisplayStep(rawActiveStep, startIndex, endIndex, processGroupIndex) {
  if (processGroupIndex === -1 || startIndex === -1) return rawActiveStep

  if (rawActiveStep < startIndex) {
    return rawActiveStep
  }
  if (rawActiveStep <= endIndex) {
    return processGroupIndex
  }
  const stepsAfterProcess = rawActiveStep - endIndex - 1
  return processGroupIndex + 1 + stepsAfterProcess
}

// ─── Services Data mapped from assets/screens ────────────────────────────────
const servicesData = {
  'wash-fold': {
    id: 'wash-fold',
    title: 'Wash and Fold',
    serviceName: 'Wash & Fold',
    price: '35,001',
    currency: 'IQD',
    status: 'Pending',
    serviceIcons: ['/service/Wash and fold.png'],
    accentColor: '#38BDF8',
    themeColor: '#0EA5E9',
    badgeColor: '#EFF6FF',
    badgeBorder: '#BFDBFE',
    badgeText: '#1B2F6E',
    steps: WASH_FOLD_STEPS,
  },
  'clean-press': {
    id: 'clean-press',
    title: 'Clean and Press',
    serviceName: 'Clean & Press',
    price: '2,199',
    currency: 'IQD',
    status: 'Pending',
    serviceIcons: ['/service/clean and press.png'],
    accentColor: '#22C55E',
    themeColor: '#16A34A',
    badgeColor: '#F0FDF4',
    badgeBorder: '#BBF7D0',
    badgeText: '#166534',
    steps: CLEAN_PRESS_STEPS,
  },
  'press-only': {
    id: 'press-only',
    title: 'Press only',
    serviceName: 'Press Only',
    price: '2,000',
    currency: 'IQD',
    status: 'Pending',
    serviceIcons: ['/service/press only.png'],
    accentColor: '#EAB308',
    themeColor: '#CA8A04',
    badgeColor: '#FEFCE8',
    badgeBorder: '#FEF08A',
    badgeText: '#854D0E',
    steps: PRESS_ONLY_STEPS,
  },
  'bed-bath': {
    id: 'bed-bath',
    title: 'Bed and Bath',
    serviceName: 'Bed & Bath',
    price: '18,500',
    currency: 'IQD',
    status: 'Pending',
    serviceIcons: ['/service/bed-bath.png'],
    accentColor: '#0EA5E9',
    themeColor: '#0284C7',
    badgeColor: '#F0F9FF',
    badgeBorder: '#BAE6FD',
    badgeText: '#0369A1',
    steps: BED_BATH_STEPS,
  },
  'bags-shoes': {
    id: 'bags-shoes',
    title: 'Bags and shoes',
    serviceName: 'Bags & Shoes',
    price: '1,200',
    currency: 'IQD',
    status: 'Pending',
    serviceIcons: ['/service/bags and shoes.png'],
    accentColor: '#EC4899',
    themeColor: '#DB2777',
    badgeColor: '#FDF2F8',
    badgeBorder: '#FBCFE8',
    badgeText: '#9D174D',
    steps: BAGS_SHOES_STEPS,
  },
  'premium-care': {
    id: 'premium-care',
    title: 'Premium care',
    serviceName: 'Premium Care',
    price: '6,300',
    currency: 'IQD',
    status: 'Pending',
    serviceIcons: ['/service/premium care.png'],
    accentColor: '#8B5CF6',
    themeColor: '#7C3AED',
    badgeColor: '#F5F3FF',
    badgeBorder: '#DDD6FE',
    badgeText: '#5B21B6',
    steps: PREMIUM_CARE_STEPS,
  },
  '2-service': {
    id: '2-service',
    title: '2 Services ordered',
    serviceName: '2 Services',
    price: '36,201',
    currency: 'IQD',
    status: 'Pending',
    serviceIcons: ['/service/Wash and fold.png', '/service/clean and press.png'],
    subServiceIds: ['wash-fold', 'clean-press'],
    accentColor: '#F59E0B',
    themeColor: '#D97706',
    badgeColor: '#FFFBEB',
    badgeBorder: '#FDE68A',
    badgeText: '#92400E',
    steps: WASH_FOLD_STEPS,
  },
  '5-service': {
    id: '5-service',
    title: '5 Services ordered',
    serviceName: '5 Services',
    price: '45,200',
    currency: 'IQD',
    status: 'Pending',
    serviceIcons: [
      '/service/Wash and fold.png',
      '/service/press only.png',
      '/service/clean and press.png',
      '/service/bags and shoes.png',
      '/service/premium care.png',
    ],
    subServiceIds: ['wash-fold', 'press-only', 'clean-press', 'bags-shoes', 'premium-care'],
    accentColor: '#14B8A6',
    themeColor: '#0D9488',
    badgeColor: '#F0FDFA',
    badgeBorder: '#99F6E4',
    badgeText: '#115E59',
    steps: WASH_FOLD_STEPS,
  },
}

// ─── Crisp QR Code SVG matching screenshots ──────────────────────────────────
const QR_PATTERN = [
  '111111101010101111111',
  '100000100110001000001',
  '101110101001101011101',
  '101110100101001011101',
  '101110101110001011101',
  '100000100011101000001',
  '111111101010101111111',
  '000000001101000000000',
  '101011110010110101011',
  '010100011100011010010',
  '110110101010101101101',
  '001001100011100011010',
  '101011110101011101011',
  '000000001010100000000',
  '111111101101101111111',
  '100000100010001000001',
  '101110101101101011101',
  '101110100110001011101',
  '101110101010101011101',
  '100000100101101000001',
  '111111101110001111111',
]

function QRCodeSVG() {
  return (
    <svg viewBox="0 0 21 21" className="w-full h-full" shapeRendering="crispEdges">
      {QR_PATTERN.map((row, y) =>
        row.split('').map((cell, x) =>
          cell === '1' ? (
            <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill="#111827" />
          ) : null
        )
      )}
    </svg>
  )
}

// ─── Dried icon matching screenshot hanging shirt ────────────────────────────
function DriedSVG({ dim }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke={dim ? '#CBD5E1' : '#64748B'}
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-[24px] h-[24px]"
    >
      <path d="M3 6h18" strokeWidth="1.2" strokeDasharray="2 1.5" />
      <path d="M8 4v2.5M16 4v2.5" strokeWidth="1.8" />
      <path d="M7 7l2-1.5h6l2 1.5 2.5 1.8-1.8 2.2-1.7-.8v8H9v-8l-1.7.8-1.8-2.2z" />
    </svg>
  )
}

// ─── Quality Check icon ───────────────────────────────────────────────────────
function QualityCheckSVG({ dim }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke={dim ? '#CBD5E1' : '#64748B'}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-[24px] h-[24px]"
    >
      <rect x="5" y="4" width="14" height="17" rx="2.5" />
      <path d="M9 4.5a1.5 1.5 0 0 1 3-1 1.5 1.5 0 0 1 3 1" />
      <path d="M8.5 12.5l2.5 2.5 4.5-4.5" strokeWidth="2" />
    </svg>
  )
}

// ─── Status bar (shared) ──────────────────────────────────────────────────────
function StatusBar() {
  return (
    <div
      className="shrink-0 flex items-center justify-between px-7"
      style={{ height: 48, paddingTop: 14 }}
    >
      {/* Time — left */}
      <span className="text-[14px] font-bold text-black" style={{ zIndex: 30, position: 'relative' }}>
        9:41
      </span>

      {/* Icons — right */}
      <div className="flex items-center gap-1.5 text-black" style={{ zIndex: 30, position: 'relative' }}>
        {/* Wifi */}
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="w-[15px] h-[15px]">
          <path d="M1.5 8.5a13 13 0 0121 0" strokeLinecap="round"/>
          <path d="M5 12a10 10 0 0114 0" strokeLinecap="round"/>
          <path d="M8.5 15.5a6 6 0 017 0" strokeLinecap="round"/>
          <circle cx="12" cy="19" r="1" fill="currentColor"/>
        </svg>
        {/* Signal bars */}
        <svg viewBox="0 0 18 14" fill="currentColor" className="w-[15px] h-[12px]">
          <rect x="0" y="9"  width="3" height="5"  rx="0.5"/>
          <rect x="5" y="6"  width="3" height="8"  rx="0.5"/>
          <rect x="10" y="3" width="3" height="11" rx="0.5"/>
          <rect x="15" y="0" width="3" height="14" rx="0.5" opacity="0.3"/>
        </svg>
        {/* Battery */}
        <div className="flex items-center" style={{ gap: 1 }}>
          <div className="relative border border-black rounded-[3.5px]" style={{ width: 23, height: 11.5 }}>
            <div className="absolute rounded-[2px] bg-black" style={{ left: 2, top: 2, bottom: 2, right: '25%' }}/>
          </div>
          <div className="bg-black rounded-r-[2px]" style={{ width: 2, height: 5 }}/>
        </div>
      </div>
    </div>
  )
}

// ─── Status style options ───────────────────────────────────────────────────
const styleOptions = [
  { id: 'overlap',      label: 'Overlap Stack' },
  { id: 'stepper',      label: 'Service Below' },
  { id: 'service-icon', label: 'Icon Below' },
  { id: 'list',         label: 'List' },
]

// ─── Global Line Styles ───────────────────────────────────────────────────────
const lineStyles = [
  { id: 'solid',        label: 'Solid' },
  { id: 'dashed',       label: 'Dashed' },
  { id: 'dotted',       label: 'Dotted' },
  { id: 'rail',         label: 'Split Rail' },
  { id: 'segments',     label: 'Segments' },
  { id: 'nodes',        label: 'Nodes' },
  { id: 'numbers',      label: 'Num Circle' },
  { id: 'num-mono',     label: '01 Mono' },
  { id: 'num-stepper',  label: 'Connected' },
  { id: 'num-squircle', label: 'Squircle' },
]

// ─── Modular Timeline Line Component (swappable across all styles) ────────────
function TimelineLine({ activeStep, totalSteps = steps.length, rowHeight = 44, lineStyle = 'nodes', stepTops = null }) {
  const getTop = (i) => (stepTops && stepTops[i] !== undefined ? stepTops[i] : i * rowHeight)
  const totalLineH = stepTops && stepTops.length > 1 ? (stepTops[totalSteps - 1] - stepTops[0]) : (totalSteps - 1) * rowHeight
  const circleTop = getTop(activeStep) + (rowHeight - 20) / 2
  const activeLineH = stepTops && stepTops.length > 1 ? (stepTops[activeStep] - stepTops[0]) : activeStep * rowHeight

  // ── Number Style 1: Num Circle (Clean circular badges) ──
  if (lineStyle === 'numbers' || lineStyle === 'num-circle') {
    return (
      <>
        {Array.from({ length: totalSteps }).map((_, i) => {
          const isCurrent  = i === activeStep
          const isComplete = i < activeStep

          return (
            <div
              key={`num-${i}`}
              className="absolute z-10 flex items-center justify-center"
              style={{
                left: 0,
                top: getTop(i) + (rowHeight - 22) / 2,
                width: 22,
                height: 22,
              }}
            >
              {isCurrent ? (
                <motion.div
                  key={`num-active-${i}`}
                  initial={{ scale: 0.75 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 450, damping: 20 }}
                  className="w-[22px] h-[22px] rounded-full flex items-center justify-center font-mono font-bold text-[12px] text-white shadow-sm"
                  style={{ background: '#0EA5E9' }}
                >
                  {i + 1}
                </motion.div>
              ) : isComplete ? (
                <div
                  className="w-[20px] h-[20px] rounded-full flex items-center justify-center font-mono font-bold text-[11px]"
                  style={{
                    background: '#E0F2FE',
                    color: '#0284C7',
                    border: '1px solid #BAE6FD',
                  }}
                >
                  {i + 1}
                </div>
              ) : (
                <div
                  className="w-[20px] h-[20px] rounded-full flex items-center justify-center font-mono font-medium text-[11px]"
                  style={{
                    background: '#F8FAFC',
                    color: '#94A3B8',
                    border: '1px solid #E2E8F0',
                  }}
                >
                  {i + 1}
                </div>
              )}
            </div>
          )
        })}
      </>
    )
  }

  // ── Number Style 2: 01 Mono (Architectural two-digit with dark active capsule) ──
  if (lineStyle === 'num-mono') {
    return (
      <>
        {Array.from({ length: totalSteps }).map((_, i) => {
          const isCurrent  = i === activeStep
          const isComplete = i < activeStep

          return (
            <div
              key={`mono-${i}`}
              className="absolute z-10 flex items-center justify-center"
              style={{
                left: -2,
                top: getTop(i) + (rowHeight - 22) / 2,
                width: 26,
                height: 22,
              }}
            >
              {isCurrent ? (
                <motion.div
                  key={`mono-active-${i}`}
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 450, damping: 20 }}
                  className="px-1.5 py-0.5 rounded text-[10.5px] font-mono font-bold shadow-sm"
                  style={{ background: '#0F172A', color: '#fff' }}
                >
                  0{i + 1}
                </motion.div>
              ) : (
                <span
                  className="text-[12px] font-mono font-semibold transition-colors duration-200"
                  style={{ color: isComplete ? '#475569' : '#CBD5E1' }}
                >
                  0{i + 1}
                </span>
              )}
            </div>
          )
        })}
      </>
    )
  }

  // ── Number Style 3: Connected (Numbered circles linked by dynamic fill line) ──
  if (lineStyle === 'num-stepper') {
    return (
      <>
        {/* Base connector line */}
        <div
          className="absolute z-0"
          style={{
            left: 10,
            top: (rowHeight - 20) / 2 + 10,
            width: 2,
            height: totalLineH,
            background: '#E2E8F0',
          }}
        />

        {/* Filled active connector line */}
        <motion.div
          className="absolute z-0 origin-top"
          style={{
            left: 10,
            top: (rowHeight - 20) / 2 + 10,
            width: 2,
            background: '#38BDF8',
          }}
          animate={{ height: activeLineH }}
          transition={{ type: 'spring', stiffness: 350, damping: 28 }}
        />

        {/* Numbered nodes on top of the line */}
        {Array.from({ length: totalSteps }).map((_, i) => {
          const isCurrent  = i === activeStep
          const isComplete = i < activeStep

          return (
            <div
              key={`step-${i}`}
              className="absolute z-10 flex items-center justify-center"
              style={{
                left: isCurrent ? -1 : 1,
                top: getTop(i) + (rowHeight - (isCurrent ? 24 : 20)) / 2,
                width: isCurrent ? 24 : 20,
                height: isCurrent ? 24 : 20,
              }}
            >
              {isCurrent ? (
                <motion.div
                  key={`step-act-${i}`}
                  initial={{ scale: 0.7 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 450, damping: 20 }}
                  className="w-[24px] h-[24px] rounded-full flex items-center justify-center font-mono font-bold text-[12px] text-white shadow-sm ring-3 ring-sky-100"
                  style={{ background: '#0EA5E9' }}
                >
                  {i + 1}
                </motion.div>
              ) : isComplete ? (
                <div
                  className="w-[20px] h-[20px] rounded-full flex items-center justify-center font-mono font-bold text-[11px] text-white shadow-xs"
                  style={{ background: '#38BDF8' }}
                >
                  {i + 1}
                </div>
              ) : (
                <div
                  className="w-[20px] h-[20px] rounded-full flex items-center justify-center font-mono font-medium text-[10.5px] bg-white border border-gray-200 text-gray-400"
                >
                  {i + 1}
                </div>
              )}
            </div>
          )
        })}
      </>
    )
  }

  // ── Number Style 4: Squircle (Modern rounded-square badges) ──
  if (lineStyle === 'num-squircle') {
    return (
      <>
        {Array.from({ length: totalSteps }).map((_, i) => {
          const isCurrent  = i === activeStep
          const isComplete = i < activeStep

          return (
            <div
              key={`sq-${i}`}
              className="absolute z-10 flex items-center justify-center"
              style={{
                left: 0,
                top: getTop(i) + (rowHeight - 22) / 2,
                width: 22,
                height: 22,
              }}
            >
              {isCurrent ? (
                <motion.div
                  key={`sq-act-${i}`}
                  initial={{ scale: 0.75 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 450, damping: 20 }}
                  className="w-[22px] h-[22px] rounded-lg flex items-center justify-center font-mono font-bold text-[11.5px] text-white shadow-sm ring-2 ring-sky-200/80"
                  style={{ background: '#0EA5E9' }}
                >
                  {i + 1}
                </motion.div>
              ) : isComplete ? (
                <div
                  className="w-[20px] h-[20px] rounded-lg flex items-center justify-center font-mono font-bold text-[11px]"
                  style={{
                    background: '#E0F2FE',
                    color: '#0284C7',
                    border: '1px solid #BAE6FD',
                  }}
                >
                  {i + 1}
                </div>
              ) : (
                <div
                  className="w-[20px] h-[20px] rounded-lg flex items-center justify-center font-mono font-medium text-[10.5px]"
                  style={{
                    background: '#F8FAFC',
                    color: '#94A3B8',
                    border: '1px solid #E2E8F0',
                  }}
                >
                  {i + 1}
                </div>
              )}
            </div>
          )
        })}
      </>
    )
  }

  if (lineStyle === 'nodes' || lineStyle === 'segmented') {
    return (
      <>
        {/* Step connectors */}
        {Array.from({ length: totalSteps - 1 }).map((_, i) => {
          const isDone = i < activeStep
          const connTop = getTop(i) + (rowHeight + 20) / 2 - 2
          const nextNodeTop = getTop(i + 1) + (rowHeight - 20) / 2
          const connH = Math.max(2, nextNodeTop - connTop)

          return (
            <div
              key={`conn-${i}`}
              className="absolute z-0"
              style={{
                left: 10,
                top: connTop,
                width: 2,
                height: connH,
                borderRadius: 1,
                background: isDone ? '#38BDF8' : '#E5E7EB',
                transition: 'background 0.25s',
              }}
            />
          )
        })}

        {/* Step nodes for each row */}
        {Array.from({ length: totalSteps }).map((_, i) => {
          const isCurrent = i === activeStep
          const isComplete = i < activeStep
          return (
            <div
              key={`node-${i}`}
              className="absolute z-10 flex items-center justify-center"
              style={{
                left: 1,
                top: getTop(i) + (rowHeight - 20) / 2,
                width: 20,
                height: 20,
              }}
            >
              {isComplete ? (
                <div className="w-[20px] h-[20px] rounded-full flex items-center justify-center bg-sky-400 shadow-2xs">
                  <svg viewBox="0 0 12 12" className="w-3 h-3">
                    <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  </svg>
                </div>
              ) : isCurrent ? (
                <motion.div
                  key={`node-active-${i}`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  className="w-[20px] h-[20px] rounded-full flex items-center justify-center bg-sky-400 shadow-xs"
                >
                  <div className="w-2.5 h-2.5 rounded-full bg-white" />
                </motion.div>
              ) : (
                <div className="w-[16px] h-[16px] rounded-full border-2 border-gray-200 bg-white" />
              )}
            </div>
          )
        })}
      </>
    )
  }

  if (lineStyle === 'dashed') {
    return (
      <>
        {/* Base dashed line */}
        <div
          className="absolute z-0"
          style={{
            left: 10,
            top: (rowHeight - 20) / 2 + 10,
            width: 2,
            height: totalLineH,
            borderLeft: '2px dashed #CBD5E1',
          }}
        />

        {/* Filled dashed line */}
        <motion.div
          className="absolute z-0 origin-top overflow-hidden"
          style={{
            left: 10,
            top: (rowHeight - 20) / 2 + 10,
            width: 2,
            borderLeft: '2px dashed #38BDF8',
          }}
          animate={{ height: activeLineH }}
          transition={{ type: 'spring', stiffness: 350, damping: 28 }}
        />

        {/* Only ONE circle moving along line */}
        <motion.div
          className="absolute z-20 flex items-center justify-center rounded-full shadow-sm"
          style={{
            left: 1,
            width: 20,
            height: 20,
            background: '#38BDF8',
          }}
          animate={{ top: circleTop }}
          transition={{ type: 'spring', stiffness: 350, damping: 26 }}
        >
          <div className="w-2.5 h-2.5 rounded-full bg-white" />
        </motion.div>
      </>
    )
  }

  if (lineStyle === 'rail' || lineStyle === 'gradient') {
    return (
      <>
        {/* Base dual rail tracks with closed ends */}
        <div
          className="absolute z-0"
          style={{
            left: 6,
            top: (rowHeight - 20) / 2 + 10,
            width: 8,
            height: totalLineH,
            border: '1.5px solid #E2E8F0',
            borderRadius: 4,
          }}
        />

        {/* Split rail horizontal cross-ties at each step */}
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div
            key={`tie-${i}`}
            className="absolute z-0"
            style={{
              left: 6,
              top: getTop(i) + (rowHeight - 20) / 2 + 9.5,
              width: 8,
              height: 1.5,
              background: i <= activeStep ? '#38BDF8' : '#E2E8F0',
              transition: 'background 0.25s',
            }}
          />
        ))}

        {/* Filled dual rail tracks with subtle tint and closed ends */}
        <motion.div
          className="absolute z-0 origin-top"
          style={{
            left: 6,
            top: (rowHeight - 20) / 2 + 10,
            width: 8,
            borderLeft: '1.5px solid #38BDF8',
            borderRight: '1.5px solid #38BDF8',
            borderTop: '1.5px solid #38BDF8',
            borderBottom: activeStep === totalSteps - 1 ? '1.5px solid #38BDF8' : 'none',
            borderTopLeftRadius: 4,
            borderTopRightRadius: 4,
            borderBottomLeftRadius: activeStep === totalSteps - 1 ? 4 : 0,
            borderBottomRightRadius: activeStep === totalSteps - 1 ? 4 : 0,
            backgroundColor: 'rgba(56, 189, 248, 0.08)',
          }}
          animate={{ height: activeLineH }}
          transition={{ type: 'spring', stiffness: 350, damping: 28 }}
        />

        {/* Single moving circle along track */}
        <motion.div
          className="absolute z-20 flex items-center justify-center rounded-full shadow-sm"
          style={{
            left: 0,
            width: 20,
            height: 20,
            background: '#38BDF8',
          }}
          animate={{ top: circleTop }}
          transition={{ type: 'spring', stiffness: 350, damping: 26 }}
        >
          <div className="w-2.5 h-2.5 rounded-full bg-white" />
        </motion.div>
      </>
    )
  }

  if (lineStyle === 'dotted') {
    const startY = (rowHeight - 20) / 2 + 10
    return (
      <>
        {/* Base inactive dotted line */}
        <svg
          className="absolute z-0 pointer-events-none"
          style={{
            left: 0,
            top: 0,
            width: 22,
            height: totalLineH + startY + 10,
          }}
        >
          <line
            x1="11"
            y1={startY}
            x2="11"
            y2={startY + totalLineH}
            stroke="#CBD5E1"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeDasharray="0 8"
          />
        </svg>

        {/* Active filled dotted line */}
        <motion.div
          className="absolute z-0 origin-top overflow-hidden"
          style={{
            left: 0,
            top: startY,
            width: 22,
          }}
          animate={{ height: activeLineH }}
          transition={{ type: 'spring', stiffness: 350, damping: 28 }}
        >
          <svg
            className="pointer-events-none"
            style={{
              width: 22,
              height: totalLineH + 10,
            }}
          >
            <line
              x1="11"
              y1={0}
              x2="11"
              y2={totalLineH}
              stroke="#38BDF8"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeDasharray="0 8"
            />
          </svg>
        </motion.div>

        {/* Single moving circle along track */}
        <motion.div
          className="absolute z-20 flex items-center justify-center rounded-full shadow-sm"
          style={{
            left: 1,
            width: 20,
            height: 20,
            background: '#38BDF8',
          }}
          animate={{ top: circleTop }}
          transition={{ type: 'spring', stiffness: 350, damping: 26 }}
        >
          <div className="w-2.5 h-2.5 rounded-full bg-white" />
        </motion.div>
      </>
    )
  }

  if (lineStyle === 'segments' || lineStyle === 'chevron') {
    const startY = (rowHeight - 20) / 2 + 10
    return (
      <>
        {/* Step pill segments */}
        {Array.from({ length: totalSteps - 1 }).map((_, i) => {
          const isDone = i < activeStep
          const segTop = getTop(i) + startY + 5
          const nextTop = getTop(i + 1)
          const segH = Math.max(4, nextTop - getTop(i) - 10)

          return (
            <div
              key={`seg-${i}`}
              className="absolute z-0 overflow-hidden"
              style={{
                left: 8,
                top: segTop,
                width: 4,
                height: segH,
                borderRadius: 9999,
                background: '#E2E8F0',
              }}
            >
              {/* Fill animation inside segment */}
              <motion.div
                className="w-full h-full origin-top"
                style={{
                  background: 'linear-gradient(to bottom, #38BDF8, #0EA5E9)',
                  borderRadius: 9999,
                }}
                initial={false}
                animate={{
                  scaleY: isDone ? 1 : 0,
                  opacity: isDone ? 1 : 0,
                }}
                transition={{ duration: 0.28, ease: 'easeOut' }}
              />
            </div>
          )
        })}

        {/* Single moving circle along track */}
        <motion.div
          className="absolute z-20 flex items-center justify-center rounded-full shadow-sm"
          style={{
            left: 1,
            width: 20,
            height: 20,
            background: '#38BDF8',
          }}
          animate={{ top: circleTop }}
          transition={{ type: 'spring', stiffness: 350, damping: 26 }}
        >
          <div className="w-2.5 h-2.5 rounded-full bg-white" />
        </motion.div>
      </>
    )
  }
  return (
    <>
      <div
        className="absolute z-0"
        style={{
          left: 10,
          top: (rowHeight - 20) / 2 + 10,
          width: 2,
          height: totalLineH,
          background: '#E5E7EB',
          borderRadius: 1,
        }}
      />
      <motion.div
        className="absolute z-0 origin-top"
        style={{
          left: 10,
          top: (rowHeight - 20) / 2 + 10,
          width: 2,
          background: '#38BDF8',
          borderRadius: 1,
        }}
        animate={{ height: activeLineH }}
        transition={{ type: 'spring', stiffness: 350, damping: 28 }}
      />
      <motion.div
        className="absolute z-20 flex items-center justify-center rounded-full shadow-sm"
        style={{
          left: 1,
          width: 20,
          height: 20,
          background: '#38BDF8',
        }}
        animate={{ top: circleTop }}
        transition={{ type: 'spring', stiffness: 350, damping: 26 }}
      >
        <div className="w-2.5 h-2.5 rounded-full bg-white" />
      </motion.div>
    </>
  )
}

// ─── Process Sub-Steps Drawer (Interactive expandable drawer for Sorted, Washed, Dried, Ironed) ──
function ProcessSubStepsDrawer({
  subSteps = [],
  rawActiveStep = 0,
  startIndex = 2,
  endIndex = 5,
  onSelectRawStep,
}) {
  const activeSubStepIndex = rawActiveStep - startIndex

  return (
    <div className="ml-9 mr-1 my-1.5 pl-3.5 select-none border-l-1.5 border-slate-200/80 space-y-1.5">
      {subSteps.map((sub, sIdx) => {
        const isSubDone = rawActiveStep > endIndex || activeSubStepIndex > sIdx
        const isSubCurrent = rawActiveStep >= startIndex && rawActiveStep <= endIndex && activeSubStepIndex === sIdx

        return (
          <div
            key={sub.label}
            onClick={(e) => {
              e.stopPropagation()
              if (onSelectRawStep) onSelectRawStep(startIndex + sIdx)
            }}
            className="flex items-center justify-between py-1.5 px-2 rounded-lg transition-colors cursor-pointer hover:bg-slate-50/80 group"
            style={{ height: 30 }}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              {/* Status indicator */}
              <div className="w-3.5 h-3.5 flex items-center justify-center shrink-0">
                {isSubDone ? (
                  <div className="w-2.5 h-2.5 rounded-full bg-sky-500" />
                ) : isSubCurrent ? (
                  <div className="relative w-3 h-3 flex items-center justify-center">
                    <span className="absolute w-3 h-3 rounded-full bg-sky-400 opacity-40 animate-ping" />
                    <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
                  </div>
                ) : (
                  <div className="w-2 h-2 rounded-full bg-slate-300 group-hover:bg-slate-400 transition-colors" />
                )}
              </div>

              {/* Sub-step icon */}
              <div className="w-5 h-5 flex items-center justify-center shrink-0">
                {sub.icon ? (
                  <img
                    src={sub.icon}
                    alt=""
                    className="w-[18px] h-[18px] object-contain transition-opacity"
                    style={{ opacity: isSubCurrent || isSubDone ? 1 : 0.35 }}
                  />
                ) : (
                  <DriedSVG dim={!isSubDone && !isSubCurrent} />
                )}
              </div>

              {/* Sub-step label */}
              <span
                className="text-[13.5px] truncate transition-colors"
                style={{
                  color: isSubCurrent ? '#0F172A' : isSubDone ? '#475569' : '#94A3B8',
                  fontWeight: isSubCurrent ? 600 : 400,
                }}
              >
                {sub.label}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ─── Process Design 2: Segments Drawer (Micro-legend with checkmarks) ─────────
function ProcessSegmentsDrawer({
  subSteps = [],
  rawActiveStep = 0,
  startIndex = 2,
  endIndex = 5,
  onSelectRawStep,
}) {
  const activeSubStepIndex = rawActiveStep - startIndex

  return (
    <div className="ml-9 mr-1 mb-2 pl-3.5 select-none">
      <div className="pt-1.5 pb-1 flex items-center justify-between w-full max-w-[250px]">
        {subSteps.map((sub, sIdx) => {
          const isDone = rawActiveStep > endIndex || activeSubStepIndex > sIdx
          const isActive = rawActiveStep >= startIndex && rawActiveStep <= endIndex && activeSubStepIndex === sIdx

          return (
            <button
              key={sub.label}
              onClick={(e) => {
                e.stopPropagation()
                onSelectRawStep?.(startIndex + sIdx)
              }}
              className={`flex flex-col items-center gap-0.5 cursor-pointer transition-transform hover:scale-105 select-none ${
                isActive ? 'text-sky-600 font-bold' : isDone ? 'text-slate-700 font-medium' : 'text-slate-400'
              }`}
            >
              <span className="text-[11.5px] leading-tight">{sub.label}</span>
              <span className="text-[9.5px] font-mono leading-none">
                {isDone ? '✓' : isActive ? '●' : '○'}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ─── Process Design 3: Pills Drawer (Clean Minimal Text Steps with 1-Tap Switching) ─
function ProcessPillsDrawer({
  subSteps = [],
  rawActiveStep = 0,
  startIndex = 2,
  endIndex = 5,
  onSelectRawStep,
  serviceIcons = [],
  serviceName = '',
  badgeBorder = '#E2E8F0',
  subServices = [],
  serviceSteps,
  isMultiService = false,
  isTabsMode = false,
}) {
  const activeSubStepIndex = rawActiveStep - startIndex

  return (
    <div className="ml-9 mr-1 mb-1.5 pl-3.5 py-1 flex items-start gap-2 select-none overflow-x-auto no-scrollbar">
      {subSteps.map((sub, sIdx) => {
        const rawStep = startIndex + sIdx
        const isDone = rawActiveStep > endIndex || activeSubStepIndex > sIdx
        const isActive = rawActiveStep >= startIndex && rawActiveStep <= endIndex && activeSubStepIndex === sIdx

        // Determine which service icon(s) belong below this sub-step
        let servicesAtStep = []
        if (isMultiService && !isTabsMode && subServices && subServices.length > 0 && serviceSteps && typeof serviceSteps === 'object') {
          subServices.forEach(subSrv => {
            const srvStep = typeof serviceSteps[subSrv.id] === 'number' ? serviceSteps[subSrv.id] : rawActiveStep
            if (srvStep === rawStep) {
              const icon = subSrv.serviceIcons?.[0] || subSrv.icon || (servicesData[subSrv.id]?.serviceIcons?.[0])
              if (icon) {
                servicesAtStep.push({
                  id: subSrv.id,
                  name: subSrv.serviceName || subSrv.name,
                  icon,
                  border: subSrv.badgeBorder || badgeBorder,
                })
              }
            }
          })
        } else {
          // Single service or active tab view
          if (isActive && serviceIcons && serviceIcons.length > 0) {
            serviceIcons.forEach((icon, idx) => {
              servicesAtStep.push({
                id: idx,
                name: serviceName,
                icon,
                border: badgeBorder,
              })
            })
          }
        }

        return (
          <Fragment key={sub.label}>
            {sIdx > 0 && (
              <span className="text-[11px] text-slate-300 font-normal select-none shrink-0 pt-0.5">
                ·
              </span>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation()
                onSelectRawStep?.(startIndex + sIdx)
              }}
              className="relative flex flex-col items-center py-0.5 cursor-pointer select-none transition-all group shrink-0 active:scale-95"
            >
              <span
                className={`text-[12px] tracking-tight transition-colors ${
                  isActive || servicesAtStep.length > 0
                    ? 'text-sky-600 font-bold'
                    : isDone
                    ? 'text-slate-600 font-medium group-hover:text-slate-900'
                    : 'text-slate-400 font-normal group-hover:text-slate-500'
                }`}
              >
                {isDone ? '✓ ' : ''}{sub.label}
              </span>

              {/* Service icon below the service step */}
              {servicesAtStep.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: -2 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.18 }}
                  className="mt-0.5 flex items-center -space-x-1"
                >
                  {servicesAtStep.map((srv, srvIdx) => (
                    <div
                      key={srvIdx}
                      className="w-5 h-5 rounded-full flex items-center justify-center bg-white ring-1 ring-white p-0.5 shadow-2xs"
                      style={{ border: `1px solid ${srv.border || badgeBorder || '#E2E8F0'}` }}
                      title={srv.name}
                    >
                      <img
                        src={srv.icon}
                        alt=""
                        className="w-full h-full object-contain rounded-full"
                      />
                    </div>
                  ))}
                </motion.div>
              )}

              {/* Subtle active underline indicator when no icon below */}
              {isActive && servicesAtStep.length === 0 && (
                <motion.div
                  layoutId="process-text-underline"
                  className="absolute -bottom-0.5 left-0 right-0 h-[2px] bg-sky-500 rounded-full"
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}
            </button>
          </Fragment>
        )
      })}
    </div>
  )
}

function WashFoldPattern({ themeColor, badgeColor, height = 350, isExpanded = false }) {
  const extra = Math.max(0, height - 354)
  return (
    <svg width="68" height={height} viewBox={`0 0 68 ${height}`} fill="none" className="overflow-visible transition-all duration-300">
      {/* Central aquatic rail connecting Order Placed to Delivered */}
      <line x1="34" y1="16" x2="34" y2={height - 16} stroke={themeColor} strokeWidth="1" strokeDasharray="2 3" strokeOpacity="0.22" />

      {/* Top: Fresh water droplet at Order Placed (y = 8..28, center 18) */}
      <path
        d="M34 8 C34 8, 43 21, 43 26 A 9 9 0 0 1 25 26 C 25 21, 34 8, 34 8 Z"
        stroke={themeColor}
        strokeWidth="1.2"
        strokeOpacity="0.4"
        fill={badgeColor}
        fillOpacity="0.5"
      />
      <circle cx="31" cy="24" r="1.5" fill="#fff" opacity="0.8" />

      {/* Step 1: Driver En Route (y ≈ 65) - Washing foam bubbles */}
      <circle cx="47" cy="62" r="12" stroke={themeColor} strokeWidth="1.2" strokeOpacity="0.28" fill={badgeColor} fillOpacity="0.4" />
      <path d="M43 55 A 6 6 0 0 1 53 59" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" strokeOpacity="0.7" />
      <circle cx="21" cy="84" r="8.5" stroke={themeColor} strokeWidth="1" strokeOpacity="0.24" fill={badgeColor} fillOpacity="0.35" />
      <circle cx="23" cy="82" r="2.5" fill={themeColor} fillOpacity="0.25" />

      {/* Step 2: Collected & In Transit (y ≈ 114) - Aquatic wave ripples */}
      <circle cx="48" cy="106" r="3.5" fill={themeColor} fillOpacity="0.3" />
      <path d="M8 116 C 22 108, 46 124, 60 116" stroke={themeColor} strokeWidth="1.6" strokeOpacity="0.32" strokeLinecap="round" />
      <path d="M12 122 C 26 114, 42 130, 56 122" stroke={themeColor} strokeWidth="1" strokeOpacity="0.2" strokeDasharray="2 2" />

      {/* Step 3: Arrived at Facility (y ≈ 160) - Mid water current & droplet */}
      <circle cx="34" cy="155" r="3" fill={themeColor} fillOpacity="0.25" />
      <circle cx="45" cy="168" r="4.5" stroke={themeColor} strokeWidth="1" strokeOpacity="0.2" fill={badgeColor} fillOpacity="0.3" />

      {/* Step 4: Processing (y ≈ 184..230) - In-process foam & spin ripples when expanded */}
      {isExpanded && (
        <g className="transition-opacity duration-300">
          <circle cx="48" cy="188" r="11" stroke={themeColor} strokeWidth="1.1" strokeOpacity="0.28" fill={badgeColor} fillOpacity="0.38" />
          <path d="M44 183 A 5.5 5.5 0 0 1 53 186" stroke="#fff" strokeWidth="1.1" strokeLinecap="round" strokeOpacity="0.7" />
          <circle cx="20" cy="214" r="7.5" stroke={themeColor} strokeWidth="1" strokeOpacity="0.22" fill={badgeColor} fillOpacity="0.3" />
          <path d="M10 236 C 24 228, 44 244, 58 236" stroke={themeColor} strokeWidth="1.4" strokeOpacity="0.3" strokeLinecap="round" />
          <circle cx="34" cy="254" r="2.5" fill={themeColor} fillOpacity="0.3" />
        </g>
      )}

      {/* Steps 5, 6, 7: Quality Check, Out for Delivery, Delivered - Smoothly shifted down on expansion */}
      <g transform={`translate(0, ${extra})`} className="transition-transform duration-300">
        {/* Step 5: Quality Check (y ≈ 235) - Folded textiles */}
        <path d="M16 235 C 26 230, 42 230, 52 235 L 50 241 C 42 237, 26 237, 18 241 Z" fill={badgeColor} stroke={themeColor} strokeWidth="1" strokeOpacity="0.3" fillOpacity="0.4" />
        <path d="M14 243 C 24 238, 44 238, 54 243 L 52 249 C 42 245, 26 245, 16 249 Z" fill={badgeColor} stroke={themeColor} strokeWidth="1" strokeOpacity="0.35" fillOpacity="0.5" />
        <path d="M12 251 C 24 246, 44 246, 56 251 L 54 258 C 42 254, 26 254, 14 258 Z" fill={badgeColor} stroke={themeColor} strokeWidth="1.2" strokeOpacity="0.4" fillOpacity="0.6" />

        {/* Step 6: Out for Delivery (y ≈ 285) - Calming aquatic transit wave */}
        <path d="M10 290 C 24 283, 44 297, 58 290" stroke={themeColor} strokeWidth="1.4" strokeOpacity="0.3" strokeLinecap="round" />

        {/* Step 7: Delivered (y ≈ 336) - Finish bubbles perfectly opposite Delivered */}
        <circle cx="34" cy="330" r="3" fill={themeColor} fillOpacity="0.35" />
        <circle cx="26" cy="336" r="1.8" fill={themeColor} fillOpacity="0.25" />
        <circle cx="42" cy="338" r="2.2" fill={themeColor} fillOpacity="0.3" />
      </g>
    </svg>
  )
}

function CleanPressPattern({ themeColor, badgeColor, height = 350, isExpanded = false }) {
  const extra = Math.max(0, height - 354)
  return (
    <svg width="68" height={height} viewBox={`0 0 68 ${height}`} fill="none" className="overflow-visible transition-all duration-300">
      {/* Crisp vertical crease line connecting Order Placed to Delivered */}
      <line x1="34" y1="16" x2="34" y2={height - 16} stroke={themeColor} strokeWidth="1" strokeDasharray="4 2" strokeOpacity="0.25" />

      {/* Top: Coat hanger at Order Placed (center y = 18) */}
      <path d="M34 10 C 34 5, 39 3, 40 7 C 41 10, 36 12, 34 14 L34 17" stroke={themeColor} strokeWidth="1.3" strokeLinecap="round" strokeOpacity="0.5" />
      <path d="M15 29 L34 17 L53 29 Z" stroke={themeColor} strokeWidth="1.3" strokeOpacity="0.35" fill={badgeColor} fillOpacity="0.4" strokeLinejoin="round" />
      <line x1="16" y1="29" x2="52" y2="29" stroke={themeColor} strokeWidth="1.2" strokeOpacity="0.4" />

      {/* Step 1: Driver En Route (y ≈ 65) - Eco freshness leaf */}
      <path d="M44 54 C 54 57, 56 68, 44 76 C 34 68, 36 57, 44 54 Z" stroke={themeColor} strokeWidth="1.1" strokeOpacity="0.35" fill={badgeColor} fillOpacity="0.5" />
      <line x1="44" y1="56" x2="44" y2="74" stroke={themeColor} strokeWidth="0.9" strokeOpacity="0.3" />

      {/* Step 2: Collected & In Transit (y ≈ 112) - Steam swirl & star */}
      <path d="M22 105 C 14 100, 14 88, 23 84 C 32 80, 35 93, 26 97" stroke={themeColor} strokeWidth="1.2" strokeOpacity="0.3" strokeLinecap="round" />
      <circle cx="23" cy="85" r="2.5" fill={themeColor} fillOpacity="0.25" />
      <path d="M46 116 L47.5 122.5 L54 124 L47.5 125.5 L46 132 L44.5 125.5 L38 124 L44.5 122.5 Z" fill={themeColor} fillOpacity="0.35" />

      {/* Step 3: Arrived at Facility (y ≈ 160) - Mid pressed stitch */}
      <circle cx="34" cy="155" r="2.5" fill={themeColor} fillOpacity="0.25" />
      <line x1="34" y1="162" x2="34" y2="174" stroke={themeColor} strokeWidth="1" strokeOpacity="0.25" />

      {/* Step 4: Processing (y ≈ 184..230) - Expanded steam plumes & high-heat pleats */}
      {isExpanded && (
        <g className="transition-opacity duration-300">
          <path d="M48 186 C 56 178, 56 166, 46 162" stroke={themeColor} strokeWidth="1.2" strokeOpacity="0.28" strokeLinecap="round" />
          <line x1="22" y1="196" x2="22" y2="228" stroke={themeColor} strokeWidth="1" strokeDasharray="2 2" strokeOpacity="0.28" />
          <line x1="34" y1="192" x2="34" y2="232" stroke={themeColor} strokeWidth="1.2" strokeOpacity="0.35" />
          <line x1="46" y1="196" x2="46" y2="228" stroke={themeColor} strokeWidth="1" strokeDasharray="2 2" strokeOpacity="0.28" />
          <path d="M34 244 L35.2 248.8 L39 250 L35.2 251.2 L34 256 L32.8 251.2 L29 250 L32.8 248.8 Z" fill={themeColor} fillOpacity="0.35" />
        </g>
      )}

      {/* Steps 5, 6, 7: Shifted lower elements */}
      <g transform={`translate(0, ${extra})`} className="transition-transform duration-300">
        {/* Step 5: Quality Check (y ≈ 235) - Parallel pressed vertical pleat stitches */}
        <line x1="22" y1="225" x2="22" y2="250" stroke={themeColor} strokeWidth="1" strokeDasharray="2 2" strokeOpacity="0.3" />
        <line x1="34" y1="220" x2="34" y2="255" stroke={themeColor} strokeWidth="1.2" strokeOpacity="0.38" />
        <line x1="46" y1="225" x2="46" y2="250" stroke={themeColor} strokeWidth="1" strokeDasharray="2 2" strokeOpacity="0.3" />

        {/* Step 6: Out for Delivery (y ≈ 285) - Garment care label tag */}
        <rect x="23" y="278" width="22" height="15" rx="3" stroke={themeColor} strokeWidth="1.1" strokeOpacity="0.3" fill={badgeColor} fillOpacity="0.4" />
        <line x1="27" y1="284" x2="41" y2="284" stroke={themeColor} strokeWidth="0.8" strokeOpacity="0.3" />
        <line x1="27" y1="287" x2="37" y2="287" stroke={themeColor} strokeWidth="0.8" strokeOpacity="0.25" />
        <circle cx="34" cy="278" r="1.5" fill={themeColor} fillOpacity="0.4" />

        {/* Step 7: Delivered (y ≈ 336) - Pristine finish star */}
        <path d="M34 330 L35.5 334.5 L40 336 L35.5 337.5 L34 342 L32.5 337.5 L28 336 L32.5 334.5 Z" fill={themeColor} fillOpacity="0.45" />
      </g>
    </svg>
  )
}

function PressOnlyPattern({ themeColor, badgeColor, height = 350, isExpanded = false }) {
  const extra = Math.max(0, height - 354)
  return (
    <svg width="68" height={height} viewBox={`0 0 68 ${height}`} fill="none" className="overflow-visible transition-all duration-300">
      {/* Warm steam vertical dashed guide rail */}
      <line x1="34" y1="16" x2="34" y2={height - 16} stroke={themeColor} strokeWidth="1" strokeDasharray="3 3" strokeOpacity="0.25" />

      {/* Top: Steam Iron silhouette at Order Placed (center y = 18) */}
      <path d="M34 8 L49 28 C 49 30, 47 32, 44 32 L24 32 C 21 32, 19 30, 19 28 Z" stroke={themeColor} strokeWidth="1.3" strokeOpacity="0.4" fill={badgeColor} fillOpacity="0.5" strokeLinejoin="round" />
      <path d="M24 23 C 24 16, 44 16, 44 23" stroke={themeColor} strokeWidth="1.2" strokeOpacity="0.4" strokeLinecap="round" />
      <circle cx="34" cy="18" r="1.2" fill={themeColor} fillOpacity="0.4" />
      <circle cx="28" cy="25" r="1.2" fill={themeColor} fillOpacity="0.35" />
      <circle cx="40" cy="25" r="1.2" fill={themeColor} fillOpacity="0.35" />

      {/* Step 1: Driver En Route (y ≈ 65) - Rising heat waves */}
      <path d="M26 48 C 20 60, 32 72, 26 84 C 20 96, 32 108, 26 120" stroke={themeColor} strokeWidth="1.3" strokeOpacity="0.3" strokeLinecap="round" />
      <path d="M42 54 C 48 66, 36 78, 42 90 C 48 102, 36 114, 42 126" stroke={themeColor} strokeWidth="1.3" strokeOpacity="0.3" strokeLinecap="round" />

      {/* Step 3: Arrived at Facility (y ≈ 160) - Mid steam vents */}
      <circle cx="34" cy="155" r="2.5" fill={themeColor} fillOpacity="0.25" />

      {/* Step 4: Processing (y ≈ 184..230) - Expanded steam ironing elements */}
      {isExpanded && (
        <g className="transition-opacity duration-300">
          <path d="M26 180 C 20 192, 32 204, 26 216" stroke={themeColor} strokeWidth="1.3" strokeOpacity="0.28" strokeLinecap="round" />
          <path d="M42 186 C 48 198, 36 210, 42 222" stroke={themeColor} strokeWidth="1.3" strokeOpacity="0.28" strokeLinecap="round" />
          <line x1="16" y1="238" x2="52" y2="238" stroke={themeColor} strokeWidth="1.3" strokeOpacity="0.3" strokeLinecap="round" />
          <circle cx="34" cy="252" r="2.5" fill={themeColor} fillOpacity="0.35" />
        </g>
      )}

      {/* Steps 5, 6, 7: Shifted lower elements */}
      <g transform={`translate(0, ${extra})`} className="transition-transform duration-300">
        {/* Step 5: Quality Check (y ≈ 235) - Crisp press crease lines */}
        <line x1="12" y1="230" x2="56" y2="230" stroke={themeColor} strokeWidth="1.6" strokeOpacity="0.4" strokeLinecap="round" />
        <line x1="18" y1="238" x2="50" y2="238" stroke={themeColor} strokeWidth="1.2" strokeOpacity="0.3" strokeLinecap="round" />
        <line x1="24" y1="246" x2="44" y2="246" stroke={themeColor} strokeWidth="0.9" strokeOpacity="0.22" strokeLinecap="round" />

        {/* Step 6: Out for Delivery (y ≈ 285) - Radiating warmth sunburst */}
        <circle cx="34" cy="285" r="4.5" stroke={themeColor} strokeWidth="1.1" strokeOpacity="0.35" fill={badgeColor} fillOpacity="0.4" />
        <circle cx="34" cy="285" r="1.5" fill={themeColor} fillOpacity="0.45" />
        <line x1="34" y1="276" x2="34" y2="279" stroke={themeColor} strokeWidth="1" strokeOpacity="0.4" />
        <line x1="34" y1="291" x2="34" y2="294" stroke={themeColor} strokeWidth="1" strokeOpacity="0.4" />
        <line x1="25" y1="285" x2="28" y2="285" stroke={themeColor} strokeWidth="1" strokeOpacity="0.4" />
        <line x1="40" y1="285" x2="43" y2="285" stroke={themeColor} strokeWidth="1" strokeOpacity="0.4" />

        {/* Step 7: Delivered (y ≈ 336) - Crisp crease triangle */}
        <path d="M16 332 L34 340 L52 332" stroke={themeColor} strokeWidth="1.3" strokeOpacity="0.35" strokeLinecap="round" />
      </g>
    </svg>
  )
}

function BagsShoesPattern({ themeColor, badgeColor, height = 350, isExpanded = false }) {
  const extra = Math.max(0, height - 354)
  return (
    <svg width="68" height={height} viewBox={`0 0 68 ${height}`} fill="none" className="overflow-visible transition-all duration-300">
      {/* Handcrafted artisan saddle-stitching down both sides */}
      <line x1="14" y1="16" x2="14" y2={height - 16} stroke={themeColor} strokeWidth="1" strokeDasharray="3 3" strokeOpacity="0.25" />
      <line x1="54" y1="16" x2="54" y2={height - 16} stroke={themeColor} strokeWidth="1" strokeDasharray="3 3" strokeOpacity="0.25" />

      {/* Top: Handbag silhouette at Order Placed (center y = 18) */}
      <path d="M27 12 C 27 4, 41 4, 41 12" stroke={themeColor} strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.45" fill="none" />
      <path d="M20 13 L48 13 L45 30 L23 30 Z" stroke={themeColor} strokeWidth="1.2" strokeOpacity="0.4" fill={badgeColor} fillOpacity="0.45" strokeLinejoin="round" />
      <rect x="31.5" y="19" width="5" height="3.5" rx="1" stroke={themeColor} strokeWidth="1" strokeOpacity="0.5" fill="#fff" />

      {/* Step 1 & 2: Driver En Route & Collected - Diamond quilt leather lattice */}
      <path d="M20 54 L48 82 M48 54 L20 82 M20 82 L48 110 M48 82 L20 110" stroke={themeColor} strokeWidth="1" strokeOpacity="0.25" />
      <circle cx="34" cy="68" r="2" fill={badgeColor} stroke={themeColor} strokeWidth="1" strokeOpacity="0.4" />
      <circle cx="34" cy="96" r="2" fill={badgeColor} stroke={themeColor} strokeWidth="1" strokeOpacity="0.4" />

      {/* Step 3: Arrived at Facility (y ≈ 160) - Mid stitch accent */}
      <circle cx="34" cy="155" r="2.5" fill={themeColor} fillOpacity="0.25" />

      {/* Step 4: Processing (y ≈ 184..230) - Expanded artisan care lattice */}
      {isExpanded && (
        <g className="transition-opacity duration-300">
          <path d="M20 180 L48 208 M48 180 L20 208" stroke={themeColor} strokeWidth="1" strokeOpacity="0.22" />
          <circle cx="34" cy="194" r="2" fill={badgeColor} stroke={themeColor} strokeWidth="1" strokeOpacity="0.38" />
          <circle cx="27" cy="222" r="2" stroke={themeColor} strokeWidth="1" strokeOpacity="0.3" fill={badgeColor} />
          <circle cx="41" cy="222" r="2" stroke={themeColor} strokeWidth="1" strokeOpacity="0.3" fill={badgeColor} />
          <path d="M22 246 C 30 238, 38 238, 46 246" stroke={themeColor} strokeWidth="1.2" strokeOpacity="0.3" strokeLinecap="round" fill="none" />
        </g>
      )}

      {/* Steps 5, 6, 7: Shifted lower elements */}
      <g transform={`translate(0, ${extra})`} className="transition-transform duration-300">
        {/* Step 5: Quality Check (y ≈ 235) - Footwear contour curve & heel */}
        <path d="M18 226 C 28 220, 38 220, 50 230 C 44 238, 30 238, 18 234 Z" stroke={themeColor} strokeWidth="1.2" strokeOpacity="0.38" fill={badgeColor} fillOpacity="0.4" strokeLinejoin="round" />
        <path d="M18 234 L22 244 L26 244 L26 235" stroke={themeColor} strokeWidth="1.1" strokeOpacity="0.35" fill="none" />

        {/* Step 6: Out for Delivery (y ≈ 285) - Criss-cross shoe lacing */}
        <circle cx="27" cy="276" r="1.8" stroke={themeColor} strokeWidth="0.9" strokeOpacity="0.4" />
        <circle cx="41" cy="276" r="1.8" stroke={themeColor} strokeWidth="0.9" strokeOpacity="0.4" />
        <circle cx="27" cy="288" r="1.8" stroke={themeColor} strokeWidth="0.9" strokeOpacity="0.4" />
        <circle cx="41" cy="288" r="1.8" stroke={themeColor} strokeWidth="0.9" strokeOpacity="0.4" />
        <line x1="27" y1="276" x2="41" y2="288" stroke={themeColor} strokeWidth="1.1" strokeOpacity="0.35" />
        <line x1="41" y1="276" x2="27" y2="288" stroke={themeColor} strokeWidth="1.1" strokeOpacity="0.35" />

        {/* Step 7: Delivered (y ≈ 336) - Luxury belt buckle */}
        <rect x="25" y="330" width="18" height="12" rx="3" stroke={themeColor} strokeWidth="1.3" strokeOpacity="0.4" fill={badgeColor} fillOpacity="0.4" />
        <line x1="34" y1="330" x2="34" y2="342" stroke={themeColor} strokeWidth="1.3" strokeOpacity="0.5" />
      </g>
    </svg>
  )
}

function PremiumCarePattern({ themeColor, badgeColor, height = 350, isExpanded = false }) {
  const extra = Math.max(0, height - 354)
  return (
    <svg width="68" height={height} viewBox={`0 0 68 ${height}`} fill="none" className="overflow-visible transition-all duration-300">
      {/* Center regal filigree rail connecting Order Placed to Delivered */}
      <line x1="34" y1="16" x2="34" y2={height - 16} stroke={themeColor} strokeWidth="1" strokeDasharray="2 3" strokeOpacity="0.25" />

      {/* Top: Royal Crown / Tiara Crest at Order Placed (center y = 18) */}
      <path d="M18 26 L21 14 L27 20 L34 9 L41 20 L47 14 L50 26 Z" stroke={themeColor} strokeWidth="1.3" strokeOpacity="0.45" fill={badgeColor} fillOpacity="0.5" strokeLinejoin="round" />
      <circle cx="21" cy="13" r="1.5" fill={themeColor} fillOpacity="0.5" />
      <circle cx="34" cy="8" r="1.8" fill={themeColor} fillOpacity="0.6" />
      <circle cx="47" cy="13" r="1.5" fill={themeColor} fillOpacity="0.5" />
      <rect x="18" y="26" width="32" height="3.5" rx="1" stroke={themeColor} strokeWidth="1" strokeOpacity="0.4" fill={badgeColor} fillOpacity="0.6" />

      {/* Step 1: Driver En Route (y ≈ 65) - Faceted Brilliant Diamond */}
      <path d="M26 54 L42 54 L49 64 L34 81 L19 64 Z" stroke={themeColor} strokeWidth="1.3" strokeOpacity="0.4" fill={badgeColor} fillOpacity="0.45" strokeLinejoin="round" />
      <line x1="26" y1="54" x2="34" y2="64" stroke={themeColor} strokeWidth="0.9" strokeOpacity="0.35" />
      <line x1="42" y1="54" x2="34" y2="64" stroke={themeColor} strokeWidth="0.9" strokeOpacity="0.35" />
      <line x1="19" y1="64" x2="49" y2="64" stroke={themeColor} strokeWidth="0.9" strokeOpacity="0.35" />
      <line x1="34" y1="64" x2="34" y2="81" stroke={themeColor} strokeWidth="0.9" strokeOpacity="0.35" />

      {/* Step 2: Collected & In Transit (y ≈ 112) - Celestial 8-Point Starburst */}
      <path d="M46 106 L47.5 115 L56 118 L47.5 121 L46 130 L44.5 121 L36 118 L44.5 115 Z" fill={themeColor} fillOpacity="0.38" />
      <path d="M22 135 L23 140 L28 142 L23 144 L22 149 L21 144 L16 142 L21 140 Z" fill={themeColor} fillOpacity="0.32" />

      {/* Step 3: Arrived at Facility (y ≈ 160) - Mid sparkle */}
      <circle cx="34" cy="155" r="2.5" fill={themeColor} fillOpacity="0.25" />

      {/* Step 4: Processing (y ≈ 184..260) - Expanded royal ribbon & sparkle elements */}
      {isExpanded && (
        <g className="transition-opacity duration-300">
          <path d="M34 190 L35.5 196 L41 197.5 L35.5 199 L34 205 L32.5 199 L27 197.5 L32.5 196 Z" fill={themeColor} fillOpacity="0.36" />
          <path d="M14 224 C 26 214, 42 234, 54 224" stroke={themeColor} strokeWidth="1.1" strokeOpacity="0.35" fill="none" strokeDasharray="2 2" />
          <circle cx="34" cy="240" r="3" fill={badgeColor} stroke={themeColor} strokeWidth="1" strokeOpacity="0.35" />
          <path d="M34 256 L35.2 260.8 L40 262 L35.2 263.2 L34 268 L32.8 263.2 L28 262 L32.8 260.8 Z" fill={themeColor} fillOpacity="0.32" />
        </g>
      )}

      {/* Steps 5, 6, 7: Shifted lower elements */}
      <g transform={`translate(0, ${extra})`} className="transition-transform duration-300">
        {/* Step 5: Quality Check (y ≈ 235) - Flowing Silk Ribbon Heraldic Banner */}
        <path d="M14 225 C 26 215, 42 235, 54 225 C 42 235, 26 215, 14 225 Z" fill={badgeColor} stroke={themeColor} strokeWidth="1.2" strokeOpacity="0.4" fillOpacity="0.5" />
        <path d="M16 231 C 28 221, 40 241, 52 231" stroke={themeColor} strokeWidth="0.9" strokeOpacity="0.3" fill="none" strokeDasharray="1.5 2" />

        {/* Step 6: Out for Delivery (y ≈ 285) - Royal Crest Seal Rings */}
        <circle cx="34" cy="285" r="13" stroke={themeColor} strokeWidth="1.2" strokeOpacity="0.35" strokeDasharray="3 2" fill={badgeColor} fillOpacity="0.3" />
        <circle cx="34" cy="285" r="8" stroke={themeColor} strokeWidth="0.9" strokeOpacity="0.3" />
        <path d="M34 281 L34.8 284.2 L38 285 L34.8 285.8 L34 289 L33.2 285.8 L30 285 L33.2 284.2 Z" fill={themeColor} fillOpacity="0.45" />

        {/* Step 7: Delivered (y ≈ 336) - Royal finish star */}
        <path d="M34 330 L35.5 334.5 L41 336 L35.5 337.5 L34 342 L32.5 337.5 L27 336 L32.5 334.5 Z" fill={themeColor} fillOpacity="0.45" />
      </g>
    </svg>
  )
}

function MultiServicePattern({ themeColor, badgeColor, height = 350, isExpanded = false }) {
  const extra = Math.max(0, height - 354)
  return (
    <svg width="68" height={height} viewBox={`0 0 68 ${height}`} fill="none" className="overflow-visible transition-all duration-300">
      {/* Subtle vertical dashed rail connecting Order Placed to Delivered */}
      <line x1="34" y1="16" x2="34" y2={height - 16} stroke={themeColor} strokeWidth="1" strokeDasharray="2 3" strokeOpacity="0.25" />

      {/* Top: Interlocking synergy rings at Order Placed (center y = 18) */}
      <circle cx="34" cy="18" r="8" stroke={themeColor} strokeWidth="1.2" strokeOpacity="0.35" fill={badgeColor} fillOpacity="0.4" />
      <circle cx="27" cy="23" r="6" stroke={themeColor} strokeWidth="0.9" strokeOpacity="0.25" />
      <circle cx="41" cy="23" r="6" stroke={themeColor} strokeWidth="0.9" strokeOpacity="0.25" />

      {/* Step 1: Driver En Route (y ≈ 65) - Sparkle & Wave */}
      <g transform="translate(16, 48)">
        <path d="M8 0L9.5 5.5L15 7L9.5 8.5L8 14L6.5 8.5L1 7L6.5 5.5Z" fill={themeColor} fillOpacity="0.32" />
      </g>
      <path d="M8 78 C 24 68, 44 86, 60 78" stroke={themeColor} strokeWidth="1.5" strokeOpacity="0.3" strokeLinecap="round" />

      {/* Step 2: Collected & In Transit (y ≈ 112) - Diamond cluster */}
      <g transform="translate(34, 114)">
        <rect x="-7.5" y="-7.5" width="15" height="15" rx="3.5" transform="rotate(45)" stroke={themeColor} strokeWidth="1.2" strokeOpacity="0.28" fill={badgeColor} fillOpacity="0.3" />
        <circle cx="0" cy="0" r="2.5" fill={themeColor} fillOpacity="0.4" />
      </g>

      {/* Step 3: Arrived at Facility (y ≈ 160) - Mid harmony accent */}
      <circle cx="34" cy="155" r="2.5" fill={themeColor} fillOpacity="0.22" />

      {/* Step 4: Processing (y ≈ 184..230) - Expanded synergy elements */}
      {isExpanded && (
        <g className="transition-opacity duration-300">
          <circle cx="34" cy="190" r="8" stroke={themeColor} strokeWidth="1.1" strokeOpacity="0.28" fill={badgeColor} fillOpacity="0.35" />
          <g transform="translate(20, 212)">
            <path d="M6 0L7.2 4.2L11.4 5.4L7.2 6.6L6 10.8L4.8 6.6L0.6 5.4L4.8 4.2Z" fill={themeColor} fillOpacity="0.35" />
          </g>
          <path d="M12 236 C 26 228, 42 244, 56 236" stroke={themeColor} strokeWidth="1.3" strokeOpacity="0.26" strokeLinecap="round" />
        </g>
      )}

      {/* Steps 5, 6, 7: Shifted lower elements */}
      <g transform={`translate(0, ${extra})`} className="transition-transform duration-300">
        {/* Step 5: Quality Check (y ≈ 235) - Sparkle */}
        <g transform="translate(44, 226)">
          <path d="M6 0L7.2 4.2L11.4 5.4L7.2 6.6L6 10.8L4.8 6.6L0.6 5.4L4.8 4.2Z" fill={themeColor} fillOpacity="0.35" />
        </g>

        {/* Step 6: Out for Delivery (y ≈ 285) - Soft bubble ring */}
        <circle cx="22" cy="275" r="13" stroke={themeColor} strokeWidth="1.2" strokeOpacity="0.22" fill={badgeColor} fillOpacity="0.3" />
        <circle cx="20" cy="273" r="5" stroke={themeColor} strokeWidth="0.8" strokeOpacity="0.18" />

        {/* Step 7: Delivered (y ≈ 336) - Finish wave & star */}
        <path d="M10 326 C 25 319, 43 333, 58 326" stroke={themeColor} strokeWidth="1.5" strokeOpacity="0.3" strokeLinecap="round" />
        <circle cx="34" cy="336" r="3" fill={themeColor} fillOpacity="0.4" />
      </g>
    </svg>
  )
}

function BedBathPattern({ themeColor, badgeColor, height = 350, isExpanded = false }) {
  const extra = Math.max(0, height - 354)
  return (
    <svg width="68" height={height} viewBox={`0 0 68 ${height}`} fill="none" className="overflow-visible transition-all duration-300">
      {/* Center rail connecting Order Placed to Delivered */}
      <line x1="34" y1="16" x2="34" y2={height - 16} stroke={themeColor} strokeWidth="1" strokeDasharray="2 3" strokeOpacity="0.25" />

      {/* Top: Folded plush towel stack at Order Placed (center y = 18) */}
      <rect x="20" y="10" width="28" height="6" rx="3" stroke={themeColor} strokeWidth="1.2" strokeOpacity="0.4" fill={badgeColor} fillOpacity="0.5" />
      <rect x="22" y="18" width="24" height="6" rx="3" stroke={themeColor} strokeWidth="1.2" strokeOpacity="0.4" fill={badgeColor} fillOpacity="0.5" />
      <rect x="18" y="26" width="32" height="6" rx="3" stroke={themeColor} strokeWidth="1.2" strokeOpacity="0.4" fill={badgeColor} fillOpacity="0.5" />

      {/* Step 1: Driver En Route (y ≈ 65) - Spa water bubbles */}
      <circle cx="26" cy="56" r="5" stroke={themeColor} strokeWidth="1" strokeOpacity="0.35" fill={badgeColor} fillOpacity="0.4" />
      <circle cx="44" cy="68" r="7" stroke={themeColor} strokeWidth="1.1" strokeOpacity="0.35" fill={badgeColor} fillOpacity="0.4" />
      <circle cx="28" cy="82" r="4" stroke={themeColor} strokeWidth="0.9" strokeOpacity="0.3" fill={badgeColor} fillOpacity="0.3" />

      {/* Step 2: Collected & In Transit (y ≈ 112) - Soft textile wave / linen ripple */}
      <path d="M14 112 C 26 102, 42 122, 54 112" stroke={themeColor} strokeWidth="1.5" strokeOpacity="0.38" strokeLinecap="round" />
      <path d="M16 120 C 28 110, 40 130, 52 120" stroke={themeColor} strokeWidth="1" strokeOpacity="0.25" strokeDasharray="1.5 2" />

      {/* Step 3: Arrived at Facility (y ≈ 160) - Mid spa droplet */}
      <circle cx="34" cy="155" r="2.5" fill={themeColor} fillOpacity="0.25" />

      {/* Step 4: Processing (y ≈ 184..230) - Expanded bed & bath linen ripples */}
      {isExpanded && (
        <g className="transition-opacity duration-300">
          <rect x="20" y="185" width="28" height="7" rx="3.5" stroke={themeColor} strokeWidth="1.1" strokeOpacity="0.35" fill={badgeColor} fillOpacity="0.4" />
          <circle cx="44" cy="210" r="5.5" stroke={themeColor} strokeWidth="1" strokeOpacity="0.3" fill={badgeColor} fillOpacity="0.35" />
          <path d="M12 232 C 24 224, 44 240, 56 232" stroke={themeColor} strokeWidth="1.3" strokeOpacity="0.3" strokeLinecap="round" />
        </g>
      )}

      {/* Steps 5, 6, 7: Shifted lower elements */}
      <g transform={`translate(0, ${extra})`} className="transition-transform duration-300">
        {/* Step 5: Quality Check (y ≈ 235) - Crisp cotton flower botanical hygiene emblem */}
        <g transform="translate(34, 235)">
          <circle cx="0" cy="-6" r="4.5" stroke={themeColor} strokeWidth="1" strokeOpacity="0.35" fill={badgeColor} fillOpacity="0.4" />
          <circle cx="6" cy="0" r="4.5" stroke={themeColor} strokeWidth="1" strokeOpacity="0.35" fill={badgeColor} fillOpacity="0.4" />
          <circle cx="0" cy="6" r="4.5" stroke={themeColor} strokeWidth="1" strokeOpacity="0.35" fill={badgeColor} fillOpacity="0.4" />
          <circle cx="-6" cy="0" r="4.5" stroke={themeColor} strokeWidth="1" strokeOpacity="0.35" fill={badgeColor} fillOpacity="0.4" />
          <circle cx="0" cy="0" r="2.5" fill={themeColor} fillOpacity="0.45" />
        </g>

        {/* Step 6: Out for Delivery (y ≈ 285) - Soft bath waves */}
        <path d="M12 285 C 24 277, 44 293, 56 285" stroke={themeColor} strokeWidth="1.4" strokeOpacity="0.3" strokeLinecap="round" />

        {/* Step 7: Delivered (y ≈ 336) - Finish spa bubbles */}
        <circle cx="34" cy="330" r="3" fill={themeColor} fillOpacity="0.4" />
        <circle cx="24" cy="336" r="1.8" fill={themeColor} fillOpacity="0.28" />
        <circle cx="44" cy="336" r="2.2" fill={themeColor} fillOpacity="0.3" />
      </g>
    </svg>
  )
}

function RightSideGraphic({
  style = 'pattern',
  serviceId = '',
  themeColor = '#3B82F6',
  badgeColor = '#EFF6FF',
  serviceIcons = [],
  serviceName = '',
  isProcessExpanded = false,
  processDesign = 'drawer',
  subStepsCount = 3,
  top = 5,
  height = 350,
}) {
  if (style === 'none') return null

  // Determine service category to display the corresponding distinct pattern
  const sId = (serviceId || '').toLowerCase()
  const sName = (serviceName || '').toLowerCase()
  const sIcon = (serviceIcons?.[0] || '').toLowerCase()

  let serviceKey = 'multi-service'
  if (sId.includes('5') || sId.includes('2') || sName.includes('5') || sName.includes('2') || (serviceIcons && serviceIcons.length > 1)) {
    serviceKey = 'multi-service'
  } else if (sId.includes('bag') || sId.includes('shoe') || sName.includes('bag') || sName.includes('shoe') || sIcon.includes('bag') || sIcon.includes('shoe')) {
    serviceKey = 'bags-shoes'
  } else if (sId.includes('premium') || sName.includes('premium') || sIcon.includes('premium')) {
    serviceKey = 'premium-care'
  } else if (sId.includes('bed') || sId.includes('bath') || sName.includes('bed') || sName.includes('bath') || sIcon.includes('bed') || sIcon.includes('bath')) {
    serviceKey = 'bed-bath'
  } else if (sId.includes('clean') || sName.includes('clean') || sIcon.includes('clean')) {
    serviceKey = 'clean-press'
  } else if (sId.includes('press') || sName.includes('press') || sIcon.includes('press')) {
    serviceKey = 'press-only'
  } else if (sId.includes('wash') || sName.includes('wash') || sIcon.includes('wash')) {
    serviceKey = 'wash-fold'
  }

  const renderPattern = () => {
    switch (serviceKey) {
      case 'bags-shoes':
        return <BagsShoesPattern themeColor={themeColor} badgeColor={badgeColor} height={height} isExpanded={isProcessExpanded} />
      case 'premium-care':
        return <PremiumCarePattern themeColor={themeColor} badgeColor={badgeColor} height={height} isExpanded={isProcessExpanded} />
      case 'bed-bath':
        return <BedBathPattern themeColor={themeColor} badgeColor={badgeColor} height={height} isExpanded={isProcessExpanded} />
      case 'clean-press':
        return <CleanPressPattern themeColor={themeColor} badgeColor={badgeColor} height={height} isExpanded={isProcessExpanded} />
      case 'press-only':
        return <PressOnlyPattern themeColor={themeColor} badgeColor={badgeColor} height={height} isExpanded={isProcessExpanded} />
      case 'wash-fold':
        return <WashFoldPattern themeColor={themeColor} badgeColor={badgeColor} height={height} isExpanded={isProcessExpanded} />
      default:
        return <MultiServicePattern themeColor={themeColor} badgeColor={badgeColor} height={height} isExpanded={isProcessExpanded} />
    }
  }

  return (
    <div
      className="absolute right-0 z-10 pointer-events-none select-none flex flex-col items-center transition-all duration-300"
      style={{
        top,
        height,
        width: 68,
      }}
    >
      {renderPattern()}
    </div>
  )
}

// ─── Status Design 1: Vertical list ──────────────────────────────────────────
function StatusList({
  steps = NINE_STEPS,
  activeStep,
  lineStyle = 'nodes',
  rawActiveStep,
  processDesign = 'drawer',
  isProcessExpanded = false,
  onToggleProcessExpanded,
  onSelectRawStep,
  serviceId = '',
  serviceIcons = [],
  serviceName = '',
  badgeBorder = '#E2E8F0',
  subServices = [],
  serviceSteps,
  isMultiService = false,
  isTabsMode = false,
  multiServiceMode = 'minimal',
  showQRCode = false,
  rightSideStyle = 'none',
  themeColor = '#3B82F6',
  badgeColor = '#EFF6FF',
}) {
  const ROW_H = 46
  const containerRef = useRef(null)
  const rowRefs = useRef([])
  const [stepTops, setStepTops] = useState(null)

  const processGroup = steps.find(s => s.isProcessGroup)
  const processGroupIndex = steps.findIndex(s => s.isProcessGroup)
  const isCompact = processGroupIndex !== -1
  const subCount = processGroup?.subSteps?.length || 4

  const initialStepTops = useMemo(() => {
    if (!isCompact || !isProcessExpanded || processGroupIndex === -1) {
      return steps.map((_, i) => i * ROW_H)
    }
    const estimatedExtra = processDesign === 'segments' ? 32 : processDesign === 'pills' ? 40 : (subCount * 30 + 6)
    return steps.map((_, i) => {
      if (i <= processGroupIndex) {
        return i * ROW_H
      }
      return i * ROW_H + estimatedExtra
    })
  }, [isCompact, isProcessExpanded, processGroupIndex, processDesign, subCount, steps.length, ROW_H])

  useLayoutEffect(() => {
    rowRefs.current = rowRefs.current.slice(0, steps.length)
    const measure = () => {
      if (!containerRef.current) return
      const tops = rowRefs.current.map(el => (el ? el.offsetTop : 0))
      if (tops.length === steps.length) {
        setStepTops(tops)
      }
    }

    measure()

    const ro = new ResizeObserver(() => {
      measure()
    })

    if (containerRef.current) {
      ro.observe(containerRef.current)
    }
    rowRefs.current.forEach(el => {
      if (el) ro.observe(el)
    })

    return () => ro.disconnect()
  }, [steps, activeStep, isProcessExpanded, processDesign, serviceIcons, lineStyle])

  const safeRawActive = rawActiveStep ?? activeStep
  const tops = stepTops || initialStepTops
  const top0 = (tops && tops[0] !== undefined) ? tops[0] : 0
  const topLast = (tops && tops[steps.length - 1] !== undefined)
    ? tops[steps.length - 1]
    : (steps.length - 1) * ROW_H
  const patternTop = top0 + (ROW_H / 2) - 18
  const patternHeight = Math.max(120, (topLast - top0) + 36)

  return (
    <div className="relative w-full">
      <div ref={containerRef} className="relative w-full">
        <TimelineLine activeStep={activeStep} totalSteps={steps.length} rowHeight={ROW_H} lineStyle={lineStyle} stepTops={stepTops || initialStepTops} />

        {/* Step rows */}
        {steps.map((step, i) => {
          const isCurrent  = i === activeStep
          const isComplete = i < activeStep

          if (step.isProcessGroup) {
            const activeSubStepIndex = safeRawActive - step.startIndex

            return (
              <div
                key={step.label}
                ref={el => (rowRefs.current[i] = el)}
                className="relative flex flex-col justify-start"
              >
                {/* Step Header Row - ALWAYS height ROW_H */}
                <div
                  onClick={() => onToggleProcessExpanded && onToggleProcessExpanded()}
                  className="relative flex items-center gap-3 cursor-pointer group select-none"
                  style={{ height: ROW_H }}
                  title={isProcessExpanded ? 'Click to collapse process' : 'Click to expand process'}
                >
                  <div className="shrink-0 z-10" style={{ width: 22 }} />

                  {/* Icon */}
                  <div className="shrink-0 flex items-center justify-center" style={{ width: 28, height: 28 }}>
                    <img
                      src={isCurrent && activeSubStepIndex >= 0 && step.subSteps[activeSubStepIndex]?.icon ? step.subSteps[activeSubStepIndex].icon : step.icon}
                      alt={step.label}
                      className="w-[24px] h-[24px] object-contain transition-opacity duration-200"
                      style={{
                        opacity: isCurrent || isComplete ? 1 : 0.3,
                        filter: isCurrent
                          ? 'brightness(0) saturate(100%) invert(9%) sepia(39%) saturate(1800%) hue-rotate(205deg) brightness(95%) contrast(110%)'
                          : 'none',
                      }}
                    />
                  </div>

                  {/* Header content based on processDesign */}
                  {processDesign === 'segments' ? (
                    <div className="flex flex-col flex-1 min-w-0 justify-center">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span
                          className="text-[14.5px] leading-tight transition-colors duration-200 shrink-0"
                          style={{
                            color: isCurrent ? '#141C3C' : isComplete ? '#6B7280' : '#D1D5DB',
                            fontWeight: isCurrent ? 700 : 500,
                          }}
                        >
                          {step.label}
                        </span>
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className={`w-3.5 h-3.5 transition-transform duration-200 shrink-0 ${
                            isProcessExpanded ? 'rotate-180 text-sky-600' : isCurrent ? 'text-slate-500' : 'text-slate-300'
                          }`}
                        >
                          <path d="M6 9l6 6 6-6" />
                        </svg>
                      </div>
                      {/* 4-Segment Progress Bar */}
                      <div className="flex items-center gap-1 w-full max-w-[210px] mt-1">
                        {step.subSteps.map((sub, sIdx) => {
                          const isDone = safeRawActive > step.endIndex || activeSubStepIndex > sIdx
                          const isActive = safeRawActive >= step.startIndex && safeRawActive <= step.endIndex && activeSubStepIndex === sIdx
                          return (
                            <div
                              key={sub.label}
                              onClick={(e) => {
                                e.stopPropagation()
                                onSelectRawStep?.(step.startIndex + sIdx)
                              }}
                              title={`${sub.label} (${isDone ? 'Completed' : isActive ? 'Active' : 'Queued'})`}
                              className="h-1.5 flex-1 rounded-full relative overflow-hidden transition-all cursor-pointer hover:opacity-80"
                              style={{
                                background: isDone ? '#0EA5E9' : isActive ? '#38BDF8' : '#E2E8F0',
                              }}
                            >
                              {isActive && (
                                <motion.div
                                  animate={{ opacity: [0.5, 1, 0.5] }}
                                  transition={{ repeat: Infinity, duration: 1.4 }}
                                  className="absolute inset-0 bg-sky-400"
                                />
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  ) : processDesign === 'pills' ? (
                    <div className="flex items-center gap-1.5 flex-1 min-w-0">
                      <span
                        className="text-[14.5px] leading-tight transition-colors duration-200 shrink-0"
                        style={{
                          color: isCurrent ? '#141C3C' : isComplete ? '#6B7280' : '#D1D5DB',
                          fontWeight: isCurrent ? 700 : 500,
                        }}
                      >
                        {step.label}
                      </span>
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className={`w-3.5 h-3.5 transition-transform duration-200 shrink-0 ${
                          isProcessExpanded ? 'rotate-180 text-sky-600' : isCurrent ? 'text-slate-500' : 'text-slate-300'
                        }`}
                      >
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                      {/* Show service when collapsed, hide on top header when expanded (moves below sub-step in pills) */}
                      {!isProcessExpanded && isCurrent && serviceIcons.length > 0 && (
                        <div className="flex items-center -space-x-1.5 shrink-0 ml-1">
                          {serviceIcons.map((icon, idx) => (
                            <div
                              key={idx}
                              className="w-5 h-5 rounded-full flex items-center justify-center bg-white ring-1 ring-white p-0.5 shadow-2xs"
                              style={{ border: `1px solid ${badgeBorder}` }}
                            >
                              <img src={icon} alt="" className="w-full h-full object-contain rounded-full" />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    /* Drawer design header */
                    <div className="flex items-center gap-1.5 flex-1 min-w-0">
                      <span
                        className="text-[14.5px] leading-tight transition-colors duration-200 shrink-0"
                        style={{
                          color: isCurrent ? '#141C3C' : isComplete ? '#6B7280' : '#D1D5DB',
                          fontWeight: isCurrent ? 700 : 500,
                        }}
                      >
                        {step.label}
                      </span>
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className={`w-3.5 h-3.5 transition-transform duration-200 shrink-0 ${
                          isProcessExpanded ? 'rotate-180 text-sky-600' : isCurrent ? 'text-slate-500' : 'text-slate-300'
                        }`}
                      >
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                      {/* Service icon on top header ONLY when collapsed (moves beside sub-steps when expanded) */}
                      {!isProcessExpanded && isCurrent && serviceIcons && serviceIcons.length > 0 && !(isMultiService && multiServiceMode === 'minimal') && (
                        <div className="flex items-center -space-x-1.5 shrink-0 ml-1">
                          {serviceIcons.map((icon, idx) => (
                            <div
                              key={idx}
                              className="w-5 h-5 rounded-full flex items-center justify-center bg-white ring-1 ring-white p-0.5 shadow-2xs"
                              style={{ border: `1px solid ${badgeBorder || '#E2E8F0'}` }}
                            >
                              <img src={icon} alt="" className="w-full h-full object-contain rounded-full" />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Sub-steps expandable drawer below header */}
                <AnimatePresence>
                  {isProcessExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.22 }}
                      className="overflow-hidden"
                    >
                      {processDesign === 'segments' ? (
                        <ProcessSegmentsDrawer
                          subSteps={step.subSteps}
                          rawActiveStep={safeRawActive}
                          startIndex={step.startIndex}
                          endIndex={step.endIndex}
                          onSelectRawStep={onSelectRawStep}
                        />
                      ) : processDesign === 'pills' ? (
                        <ProcessPillsDrawer
                          subSteps={step.subSteps}
                          rawActiveStep={safeRawActive}
                          startIndex={step.startIndex}
                          endIndex={step.endIndex}
                          onSelectRawStep={onSelectRawStep}
                          serviceIcons={serviceIcons}
                          serviceName={serviceName}
                          badgeBorder={badgeBorder}
                          subServices={subServices}
                          serviceSteps={serviceSteps}
                          isMultiService={isMultiService}
                          isTabsMode={isTabsMode}
                        />
                      ) : (
                        <ProcessSubStepsDrawer
                          subSteps={step.subSteps}
                          rawActiveStep={safeRawActive}
                          startIndex={step.startIndex}
                          endIndex={step.endIndex}
                          onSelectRawStep={onSelectRawStep}
                        />
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          }

          const rawStepIndex = processGroup
            ? (i < processGroupIndex ? i : processGroup.endIndex + 1 + (i - processGroupIndex - 1))
            : i

          return (
            <div
              key={step.label}
              ref={el => (rowRefs.current[i] = el)}
              onClick={() => onSelectRawStep && onSelectRawStep(rawStepIndex)}
              className="relative flex items-center gap-3 cursor-pointer group select-none"
              style={{ height: ROW_H }}
            >
              {/* Spacer column where the line runs */}
              <div className="shrink-0 z-10" style={{ width: 22 }} />

              {/* Icon */}
              <div className="shrink-0 flex items-center justify-center" style={{ width: 28, height: 28 }}>
                {step.icon ? (
                  <img
                    src={step.icon}
                    alt={step.label}
                    className="w-[24px] h-[24px] object-contain transition-opacity duration-200"
                    style={{
                      opacity: isCurrent || isComplete ? 1 : 0.3,
                      filter: isCurrent
                        ? 'brightness(0) saturate(100%) invert(9%) sepia(39%) saturate(1800%) hue-rotate(205deg) brightness(95%) contrast(110%)'
                        : 'none',
                    }}
                  />
                ) : step.isQualityCheck ? (
                  <QualityCheckSVG dim={!isCurrent && !isComplete} />
                ) : (
                  <DriedSVG dim={!isCurrent && !isComplete} />
                )}
              </div>

              {/* Label */}
              <span
                className="text-[14.5px] transition-colors duration-200"
                style={{
                  color:      isCurrent ? '#141C3C' : isComplete ? '#6B7280' : '#D1D5DB',
                  fontWeight: isCurrent ? 700 : 500,
                }}
              >
                {step.label}
              </span>
            </div>
          )
        })}
      </div>

      {/* QR Code on the right - absolutely positioned so it never gets shifted by timeline elements */}
      {showQRCode && (
        <div
          className="absolute top-0 right-0 z-20 shrink-0 flex flex-col items-center gap-1.5 pointer-events-auto select-none"
          style={{ paddingTop: 2, width: 66 }}
        >
          <div className="overflow-hidden border border-gray-200 rounded-xl bg-white p-1.5 shadow-xs flex items-center justify-center" style={{ width: 66, height: 66 }}>
            <QRCodeSVG />
          </div>
          <span className="text-center text-gray-400 font-medium leading-tight" style={{ fontSize: 9 }}>
            Click for<br />details
          </span>
        </div>
      )}

      {/* Right side graphic when QR is hidden */}
      {!showQRCode && (
        <RightSideGraphic
          style={rightSideStyle}
          serviceId={serviceId}
          themeColor={themeColor}
          badgeColor={badgeColor}
          serviceIcons={serviceIcons}
          serviceName={serviceName}
          isProcessExpanded={isProcessExpanded}
          processDesign={processDesign}
          subStepsCount={subCount}
          top={patternTop}
          height={patternHeight}
        />
      )}
    </div>
  )
}

// ─── Status Design 2: Vertical list with service icon below active step ─────
function StatusStepper({
  steps = NINE_STEPS,
  activeStep,
  serviceId = '',
  serviceIcons = ['/service/clean and press.png'],
  serviceName = 'Clean & Press',
  badgeColor = '#F0FDF4',
  badgeBorder = '#BBF7D0',
  badgeText = '#166534',
  lineStyle = 'nodes',
  showServiceText = true,
  overlap = false,
  rawActiveStep,
  processDesign = 'drawer',
  isProcessExpanded = false,
  onToggleProcessExpanded,
  onSelectRawStep,
  subServices = [],
  serviceSteps,
  isMultiService = false,
  isTabsMode = false,
  multiServiceMode = 'minimal',
  showQRCode = false,
  rightSideStyle = 'none',
  themeColor = '#3B82F6',
}) {
  const ROW_H = 48
  const containerRef = useRef(null)
  const rowRefs = useRef([])
  const [stepTops, setStepTops] = useState(null)

  const processGroup = steps.find(s => s.isProcessGroup)
  const processGroupIndex = steps.findIndex(s => s.isProcessGroup)
  const isCompact = processGroupIndex !== -1
  const subCount = processGroup?.subSteps?.length || 4

  const initialStepTops = useMemo(() => {
    if (!isCompact || !isProcessExpanded || processGroupIndex === -1) {
      return steps.map((_, i) => i * ROW_H)
    }
    const estimatedExtra = processDesign === 'segments' ? 32 : processDesign === 'pills' ? 40 : (subCount * 30 + 6)
    return steps.map((_, i) => {
      if (i <= processGroupIndex) {
        return i * ROW_H
      }
      return i * ROW_H + estimatedExtra
    })
  }, [isCompact, isProcessExpanded, processGroupIndex, processDesign, subCount, steps.length, ROW_H])

  useLayoutEffect(() => {
    rowRefs.current = rowRefs.current.slice(0, steps.length)
    const measure = () => {
      if (!containerRef.current) return
      const tops = rowRefs.current.map(el => (el ? el.offsetTop : 0))
      if (tops.length === steps.length) {
        setStepTops(tops)
      }
    }

    measure()

    const ro = new ResizeObserver(() => {
      measure()
    })

    if (containerRef.current) {
      ro.observe(containerRef.current)
    }
    rowRefs.current.forEach(el => {
      if (el) ro.observe(el)
    })

    return () => ro.disconnect()
  }, [steps, activeStep, isProcessExpanded, processDesign, serviceIcons, overlap, lineStyle])

  const safeRawActive = rawActiveStep ?? activeStep
  const tops = stepTops || initialStepTops
  const top0 = (tops && tops[0] !== undefined) ? tops[0] : 0
  const topLast = (tops && tops[steps.length - 1] !== undefined)
    ? tops[steps.length - 1]
    : (steps.length - 1) * ROW_H
  const patternTop = top0 + (ROW_H / 2) - 18
  const patternHeight = Math.max(120, (topLast - top0) + 36)

  return (
    <div className="relative w-full">
      <div ref={containerRef} className="relative w-full">
        <TimelineLine activeStep={activeStep} totalSteps={steps.length} rowHeight={ROW_H} lineStyle={lineStyle} stepTops={stepTops || initialStepTops} />

        {/* Step rows */}
        {steps.map((step, i) => {
          const isCurrent  = i === activeStep
          const isComplete = i < activeStep

          if (step.isProcessGroup) {
            const activeSubStepIndex = safeRawActive - step.startIndex

            return (
              <div
                key={step.label}
                ref={el => (rowRefs.current[i] = el)}
                className="relative flex flex-col justify-start"
              >
                {/* Step Header Row - ALWAYS exactly ROW_H in height so icon & badge never jump */}
                <div
                  onClick={() => onToggleProcessExpanded && onToggleProcessExpanded()}
                  className="relative flex items-center gap-2.5 cursor-pointer group select-none"
                  style={{ height: ROW_H }}
                  title={isProcessExpanded ? 'Click to collapse process' : 'Click to expand process'}
                >
                  <div className="shrink-0 z-10" style={{ width: 22 }} />

                  {/* Icon */}
                  <div className="shrink-0 flex items-center justify-center" style={{ width: 28, height: 28 }}>
                    <img
                      src={isCurrent && activeSubStepIndex >= 0 && step.subSteps[activeSubStepIndex]?.icon ? step.subSteps[activeSubStepIndex].icon : step.icon}
                      alt={step.label}
                      className="w-[24px] h-[24px] object-contain transition-opacity duration-200"
                      style={{
                        opacity: isCurrent || isComplete ? 1 : 0.3,
                        filter: isCurrent
                          ? 'brightness(0) saturate(100%) invert(9%) sepia(39%) saturate(1800%) hue-rotate(205deg) brightness(95%) contrast(110%)'
                          : 'none',
                      }}
                    />
                  </div>

                  {/* Header content based on processDesign */}
                  {processDesign === 'segments' ? (
                    <div className="flex flex-col flex-1 min-w-0 justify-center">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span
                          className="text-[14.5px] leading-tight transition-colors duration-200 shrink-0"
                          style={{
                            color: isCurrent ? '#141C3C' : isComplete ? '#6B7280' : '#D1D5DB',
                            fontWeight: isCurrent ? 700 : 500,
                          }}
                        >
                          {step.label}
                        </span>
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className={`w-3.5 h-3.5 transition-transform duration-200 shrink-0 ${
                            isProcessExpanded ? 'rotate-180 text-sky-600' : isCurrent ? 'text-slate-500' : 'text-slate-300'
                          }`}
                        >
                          <path d="M6 9l6 6 6-6" />
                        </svg>
                        {isCurrent && overlap && serviceIcons.length > 0 && (
                          <div className="flex items-center -space-x-1.5 shrink-0 ml-1">
                            {serviceIcons.map((icon, idx) => (
                              <div
                                key={idx}
                                className="w-5 h-5 rounded-full flex items-center justify-center bg-white ring-1 ring-white p-0.5 shadow-2xs"
                                style={{ border: `1px solid ${badgeBorder}` }}
                              >
                                <img src={icon} alt="" className="w-full h-full object-contain rounded-full" />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      {/* 4-Segment Progress Bar */}
                      <div className="flex items-center gap-1 w-full max-w-[210px] mt-1">
                        {step.subSteps.map((sub, sIdx) => {
                          const isDone = safeRawActive > step.endIndex || activeSubStepIndex > sIdx
                          const isActive = safeRawActive >= step.startIndex && safeRawActive <= step.endIndex && activeSubStepIndex === sIdx
                          return (
                            <div
                              key={sub.label}
                              onClick={(e) => {
                                e.stopPropagation()
                                onSelectRawStep?.(step.startIndex + sIdx)
                              }}
                              title={`${sub.label} (${isDone ? 'Completed' : isActive ? 'Active' : 'Queued'})`}
                              className="h-1.5 flex-1 rounded-full relative overflow-hidden transition-all cursor-pointer hover:opacity-80"
                              style={{
                                background: isDone ? '#0EA5E9' : isActive ? '#38BDF8' : '#E2E8F0',
                              }}
                            >
                              {isActive && (
                                <motion.div
                                  animate={{ opacity: [0.5, 1, 0.5] }}
                                  transition={{ repeat: Infinity, duration: 1.4 }}
                                  className="absolute inset-0 bg-sky-400"
                                />
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  ) : processDesign === 'pills' ? (
                    <div className="flex items-center gap-1.5 flex-1 min-w-0">
                      <span
                        className="text-[14.5px] leading-tight transition-colors duration-200 shrink-0"
                        style={{
                          color:      isCurrent ? '#141C3C' : isComplete ? '#6B7280' : '#D1D5DB',
                          fontWeight: isCurrent ? 700 : 500,
                        }}
                      >
                        {step.label}
                      </span>
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className={`w-3.5 h-3.5 transition-transform duration-200 shrink-0 ${
                          isProcessExpanded ? 'rotate-180 text-sky-600' : isCurrent ? 'text-slate-500' : 'text-slate-300'
                        }`}
                      >
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                      {/* Show service when collapsed, hide on top header when expanded (moves below sub-step in pills) */}
                      {!isProcessExpanded && isCurrent && serviceIcons.length > 0 && (
                        <div className="flex items-center -space-x-1.5 shrink-0 ml-1">
                          {serviceIcons.map((icon, idx) => (
                            <div
                              key={idx}
                              className="w-5 h-5 rounded-full flex items-center justify-center bg-white ring-1 ring-white p-0.5 shadow-2xs"
                              style={{ border: `1px solid ${badgeBorder}` }}
                            >
                              <img src={icon} alt="" className="w-full h-full object-contain rounded-full" />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    /* Drawer design header */
                    <div className="flex items-center gap-1.5 flex-1 min-w-0">
                      <span
                        className="text-[14.5px] leading-tight transition-colors duration-200 shrink-0"
                        style={{
                          color:      isCurrent ? '#141C3C' : isComplete ? '#6B7280' : '#D1D5DB',
                          fontWeight: isCurrent ? 700 : 500,
                        }}
                      >
                        {step.label}
                      </span>
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className={`w-3.5 h-3.5 transition-transform duration-200 shrink-0 ${
                          isProcessExpanded ? 'rotate-180 text-sky-600' : isCurrent ? 'text-slate-500' : 'text-slate-300'
                        }`}
                      >
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                      {/* Service icon on top header ONLY when collapsed (moves beside sub-steps when expanded) */}
                      {!isProcessExpanded && isCurrent && serviceIcons && serviceIcons.length > 0 && !(isMultiService && multiServiceMode === 'minimal') && (
                        <div className="flex items-center -space-x-1.5 shrink-0 ml-1">
                          {serviceIcons.map((icon, idx) => (
                            <div
                              key={idx}
                              className="w-5 h-5 rounded-full flex items-center justify-center bg-white ring-1 ring-white p-0.5 shadow-2xs"
                              style={{ border: `1px solid ${badgeBorder || '#E2E8F0'}` }}
                            >
                              <img src={icon} alt="" className="w-full h-full object-contain rounded-full" />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Sub-steps drawer */}
                <AnimatePresence>
                  {isProcessExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.22 }}
                      className="overflow-hidden"
                    >
                      {processDesign === 'segments' ? (
                        <ProcessSegmentsDrawer
                          subSteps={step.subSteps}
                          rawActiveStep={safeRawActive}
                          startIndex={step.startIndex}
                          endIndex={step.endIndex}
                          onSelectRawStep={onSelectRawStep}
                        />
                      ) : processDesign === 'pills' ? (
                        <ProcessPillsDrawer
                          subSteps={step.subSteps}
                          rawActiveStep={safeRawActive}
                          startIndex={step.startIndex}
                          endIndex={step.endIndex}
                          onSelectRawStep={onSelectRawStep}
                          serviceIcons={serviceIcons}
                          serviceName={serviceName}
                          badgeBorder={badgeBorder}
                          subServices={subServices}
                          serviceSteps={serviceSteps}
                          isMultiService={isMultiService}
                          isTabsMode={isTabsMode}
                        />
                      ) : (
                        <ProcessSubStepsDrawer
                          subSteps={step.subSteps}
                          rawActiveStep={safeRawActive}
                          startIndex={step.startIndex}
                          endIndex={step.endIndex}
                          onSelectRawStep={onSelectRawStep}
                        />
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          }

          const rawStepIndex = processGroup
            ? (i < processGroupIndex ? i : processGroup.endIndex + 1 + (i - processGroupIndex - 1))
            : i

          return (
            <div
              key={step.label}
              ref={el => (rowRefs.current[i] = el)}
              onClick={() => onSelectRawStep && onSelectRawStep(rawStepIndex)}
              className="relative flex items-center gap-2.5 cursor-pointer group select-none"
              style={{ height: ROW_H }}
            >
              {/* Spacer column where the straight line runs */}
              <div className="shrink-0 z-10" style={{ width: 22 }} />

              {/* Status icon from /status/ folder */}
              <div className="shrink-0 flex items-center justify-center" style={{ width: 28, height: 28 }}>
                {step.icon ? (
                  <img
                    src={step.icon}
                    alt={step.label}
                    className="w-[24px] h-[24px] object-contain transition-opacity duration-200"
                    style={{
                      opacity: isCurrent || isComplete ? 1 : 0.3,
                      filter: isCurrent
                        ? 'brightness(0) saturate(100%) invert(9%) sepia(39%) saturate(1800%) hue-rotate(205deg) brightness(95%) contrast(110%)'
                        : 'none',
                    }}
                  />
                ) : step.isQualityCheck ? (
                  <QualityCheckSVG dim={!isCurrent && !isComplete} />
                ) : (
                  <DriedSVG dim={!isCurrent && !isComplete} />
                )}
              </div>

              {/* Step info: Label, and ONLY ON ACTIVE: service below */}
              <div className="flex flex-col items-start flex-1 min-w-0 justify-center">
                <span
                  className="text-[14.5px] leading-tight transition-colors duration-200"
                  style={{
                    color:      isCurrent ? '#141C3C' : isComplete ? '#6B7280' : '#D1D5DB',
                    fontWeight: isCurrent ? 700 : 500,
                  }}
                >
                  {step.label}
                </span>

                {/* Service from /service/ folder ONLY on active step */}
                {isCurrent && (
                  showServiceText ? (
                    <motion.div
                      initial={{ opacity: 0, y: -3, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.2 }}
                      className="mt-1 flex items-center gap-1.5 px-2.5 py-1 rounded-full"
                      style={{
                        background: badgeColor,
                        border: `1px solid ${badgeBorder}`,
                      }}
                    >
                      <div className="flex items-center -space-x-1">
                        {serviceIcons.map((icon, idx) => (
                          <img
                            key={idx}
                            src={icon}
                            alt=""
                            className="w-4 h-4 object-contain rounded-full bg-white ring-1 ring-white"
                          />
                        ))}
                      </div>
                      <span
                        className="text-[11px] font-semibold truncate"
                        style={{ color: badgeText }}
                      >
                        {serviceName}
                      </span>
                    </motion.div>
                  ) : overlap ? (
                    /* Overlapping stacked icons (on each other but not fully) */
                    <motion.div
                      initial={{ opacity: 0, y: -3, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.2 }}
                      className="mt-1 flex items-center -space-x-2 py-0.5"
                    >
                      {serviceIcons.map((icon, idx) => (
                        <div
                          key={idx}
                          className="relative w-[24px] h-[24px] rounded-full flex items-center justify-center p-0.5 ring-2 ring-white shadow-xs bg-white transition-transform hover:scale-115 hover:z-30 cursor-pointer"
                          style={{
                            border: `1px solid ${badgeBorder || '#E2E8F0'}`,
                            zIndex: serviceIcons.length - idx,
                          }}
                          title={`Service ${idx + 1}`}
                        >
                          <img
                            src={icon}
                            alt=""
                            className="w-full h-full object-contain rounded-full"
                          />
                        </div>
                      ))}
                    </motion.div>
                  ) : (
                    /* Side-by-side icons (original Icon Below) */
                    <motion.div
                      initial={{ opacity: 0, y: -3, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.2 }}
                      className="mt-1 flex items-center gap-1"
                    >
                      {serviceIcons.map((icon, idx) => (
                        <div
                          key={idx}
                          className="w-6 h-6 rounded-full flex items-center justify-center p-0.5"
                          style={{
                            background: badgeColor,
                            border: `1px solid ${badgeBorder}`,
                          }}
                        >
                          <img
                            src={icon}
                            alt=""
                            className="w-full h-full object-contain rounded-full"
                          />
                        </div>
                      ))}
                    </motion.div>
                  )
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* QR Code on the right - absolutely positioned so it never gets shifted by timeline elements */}
      {showQRCode && (
        <div
          className="absolute top-0 right-0 z-20 shrink-0 flex flex-col items-center gap-1.5 pointer-events-auto select-none"
          style={{ paddingTop: 2, width: 66 }}
        >
          <div className="overflow-hidden border border-gray-200 rounded-xl bg-white p-1.5 shadow-xs flex items-center justify-center" style={{ width: 66, height: 66 }}>
            <QRCodeSVG />
          </div>
          <span className="text-center text-gray-400 font-medium leading-tight" style={{ fontSize: 9 }}>
            Click for<br />details
          </span>
        </div>
      )}

      {/* Right side graphic when QR is hidden */}
      {!showQRCode && (
        <RightSideGraphic
          style={rightSideStyle}
          serviceId={serviceId}
          themeColor={themeColor}
          badgeColor={badgeColor}
          serviceIcons={serviceIcons}
          serviceName={serviceName}
          isProcessExpanded={isProcessExpanded}
          processDesign={processDesign}
          subStepsCount={subCount}
          top={patternTop}
          height={patternHeight}
        />
      )}
    </div>
  )
}


// ─── Service Pill Tabs Component for Multi-Service Orders (Only Icons) ───────────
function ServiceTabsBar({ subServices = [], activeSubId, onSelect }) {
  const isPair = subServices.length === 2

  return (
    <div
      className={`rounded-2xl bg-slate-100/90 grid ${
        isPair ? 'grid-cols-2 p-1.5 gap-1.5 mb-4' : 'grid-cols-5 p-1 gap-1 mb-3'
      } select-none`}
    >
      {subServices.map((sub) => {
        const isSelected = sub.id === activeSubId
        return (
          <button
            key={sub.id}
            onClick={() => onSelect(sub.id)}
            className={`relative flex items-center justify-center rounded-xl transition-all select-none cursor-pointer active:scale-95 ${
              isPair ? 'py-2.5 px-3' : 'py-2 px-1'
            }`}
            title={sub.serviceName}
          >
            {isSelected && (
              <motion.div
                layoutId="service-tab-pill-active"
                className="absolute inset-0 rounded-xl bg-white shadow-xs border border-slate-200/80"
                transition={{ type: 'spring', stiffness: 450, damping: 32 }}
              />
            )}
            <div
              className={`relative z-10 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                isPair ? 'w-11 h-11' : 'w-[43px] h-[43px]'
              }`}
              style={{
                background: isSelected ? sub.badgeColor : 'transparent',
              }}
            >
              <img
                src={sub.serviceIcons[0]}
                alt={sub.serviceName}
                className={`object-contain transition-opacity ${
                  isPair ? 'w-7.5 h-7.5' : 'w-[29px] h-[29px]'
                }`}
                style={{ opacity: isSelected ? 1 : 0.6 }}
              />
            </div>
            {isPair && (
              <span
                className="relative z-10 text-[14px] ml-2.5 font-semibold truncate transition-colors"
                style={{ color: isSelected ? '#0F172A' : '#64748B' }}
              >
                {sub.serviceName}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}

// ─── Minimal Tabs Component for Multi-Service Orders (Minimal UX/UI) ──────────
function ServiceMinimalTabsBar({ subServices = [], activeSubId, onSelect }) {
  const isPair = subServices.length === 2

  return (
    <div className={`relative border-b border-slate-100/90 select-none ${isPair ? 'mb-4' : 'mb-3'}`}>
      <div className={`grid ${isPair ? 'grid-cols-2' : 'grid-cols-5'} gap-0`}>
        {subServices.map((sub) => {
          const isSelected = sub.id === activeSubId
          return (
            <button
              key={sub.id}
              onClick={() => onSelect(sub.id)}
              className={`relative flex flex-col items-center justify-center transition-all select-none cursor-pointer group active:scale-95 ${
                isPair ? 'pt-2.5 pb-3.5' : 'pt-2 pb-2.5'
              }`}
              title={sub.serviceName}
            >
              {/* Icon */}
              <div
                className={`flex items-center justify-center transition-all duration-200 ${
                  isPair ? 'w-12 h-12' : 'w-[43px] h-[43px]'
                }`}
                style={{
                  transform: isSelected ? 'scale(1.12)' : 'scale(0.96)',
                }}
              >
                <img
                  src={sub.serviceIcons[0]}
                  alt={sub.serviceName}
                  className={`object-contain transition-opacity duration-200 ${
                    isPair ? 'w-8.5 h-8.5' : 'w-[30.5px] h-[30.5px]'
                  }`}
                  style={{ opacity: isSelected ? 1 : 0.55 }}
                />
              </div>

              {/* Label only for 2 services pair */}
              {isPair && (
                <span
                  className="text-[14px] mt-1.5 truncate max-w-full px-1 leading-none transition-colors"
                  style={{
                    color: isSelected ? '#0F172A' : '#94A3B8',
                    fontWeight: isSelected ? 600 : 500,
                  }}
                >
                  {sub.serviceName}
                </span>
              )}

              {/* Minimal centered sliding indicator */}
              {isSelected && (
                <motion.div
                  layoutId="service-minimal-indicator"
                  className={`absolute bottom-0 rounded-full ${isPair ? 'h-[3px]' : 'h-[3px]'}`}
                  style={{
                    background: sub.themeColor,
                    width: isPair ? 56 : 30,
                  }}
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ─── Minimal Rings Tabs Component for Multi-Service Orders ────────────────────
function ServiceRingTabsBar({ subServices = [], activeSubId, onSelect }) {
  const isPair = subServices.length === 2

  return (
    <div className={`select-none ${isPair ? 'mb-4' : 'mb-3'}`}>
      <div className={`grid ${isPair ? 'grid-cols-2 gap-4' : 'grid-cols-5 gap-2'}`}>
        {subServices.map((sub) => {
          const isSelected = sub.id === activeSubId
          return (
            <button
              key={sub.id}
              onClick={() => onSelect(sub.id)}
              className={`relative flex flex-col items-center justify-center rounded-xl transition-all cursor-pointer group active:scale-95 ${
                isPair ? 'py-2.5' : 'py-1'
              }`}
              title={sub.serviceName}
            >
              {/* Ring token */}
              <div
                className={`rounded-full flex items-center justify-center transition-all duration-200 ${
                  isPair ? 'w-13 h-13' : 'w-[44px] h-[44px]'
                } ${
                  isSelected
                    ? (isPair ? 'ring-2 ring-offset-2' : 'ring-2 ring-offset-1')
                    : 'border border-slate-200/80 bg-slate-50/60 group-hover:border-slate-300'
                }`}
                style={{
                  '--tw-ring-color': sub.themeColor,
                  background: isSelected ? sub.badgeColor : undefined,
                  transform: isSelected ? 'scale(1.08)' : 'scale(0.96)',
                }}
              >
                <img
                  src={sub.serviceIcons[0]}
                  alt={sub.serviceName}
                  className={`object-contain transition-opacity duration-200 ${
                    isPair ? 'w-7.5 h-7.5' : 'w-[27px] h-[27px]'
                  }`}
                  style={{ opacity: isSelected ? 1 : 0.55 }}
                />
              </div>

              {/* Label for 2-service pair */}
              {isPair && (
                <span
                  className="text-[14px] mt-2 truncate max-w-full px-1 leading-none transition-colors"
                  style={{
                    color: isSelected ? '#0F172A' : '#94A3B8',
                    fontWeight: isSelected ? 600 : 500,
                  }}
                >
                  {sub.serviceName}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ─── Minimal Ghost Chips Component for Multi-Service Orders ───────────────────
function ServiceGhostChipsBar({ subServices = [], activeSubId, onSelect }) {
  const isPair = subServices.length === 2

  return (
    <div className={`select-none ${isPair ? 'mb-4' : 'mb-3'}`}>
      <div className={`grid ${isPair ? 'grid-cols-2 gap-3' : 'grid-cols-5 gap-2'}`}>
        {subServices.map((sub) => {
          const isSelected = sub.id === activeSubId
          return (
            <button
              key={sub.id}
              onClick={() => onSelect(sub.id)}
              className="relative cursor-pointer group active:scale-95 transition-transform"
              title={sub.serviceName}
            >
              <div
                className={`relative flex items-center justify-center transition-all duration-200 ${
                  isPair ? 'py-2.5 px-3.5 gap-2 rounded-full' : 'h-[40px] rounded-full'
                }`}
                style={{
                  borderWidth: isPair ? '1.5px' : '1px',
                  borderStyle: 'solid',
                  borderColor: isSelected ? sub.themeColor : 'rgba(226, 232, 240, 0.9)',
                  background: isSelected ? sub.badgeColor : '#FAFAFA',
                  transform: isSelected ? 'scale(1.03)' : 'scale(1)',
                }}
              >
                <img
                  src={sub.serviceIcons[0]}
                  alt={sub.serviceName}
                  className={`object-contain transition-opacity duration-200 ${
                    isPair ? 'w-6.5 h-6.5' : 'w-[24px] h-[24px]'
                  }`}
                  style={{ opacity: isSelected ? 1 : 0.55 }}
                />
                {isPair && (
                  <span
                    className="text-[14px] truncate leading-none transition-colors"
                    style={{
                      color: isSelected ? '#0F172A' : '#94A3B8',
                      fontWeight: isSelected ? 600 : 500,
                    }}
                  >
                    {sub.serviceName}
                  </span>
                )}
                {isSelected && (
                  <motion.div
                    layoutId="service-chip-glow"
                    className="absolute inset-0 rounded-full pointer-events-none"
                    style={{
                      boxShadow: `0 2px 8px -2px ${sub.themeColor}33`,
                    }}
                    transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                  />
                )}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ─── Order Details Screen (Generalized from Wash & Fold, used for Clean & Press & all services) ────
function OrderDetailsScreen({
  service = servicesData['wash-fold'],
  activeStep,
  serviceSteps,
  statusStyle: propStatusStyle,
  setStatusStyle: propSetStatusStyle,
  lineStyle = 'nodes',
  selectedSubId,
  onSelectSubId,
  multiServiceMode = 'minimal',
  setMultiServiceMode,
  processMode = 'drawer',
  setProcessMode,
  isProcessExpanded = false,
  onToggleProcessExpanded,
  onSelectRawStep,
  showQRCode = false,
  rightSideStyle = 'none',
}) {
  const [internalStatusStyle, setInternalStatusStyle] = useState('list')
  const currentStyle = propStatusStyle ?? internalStatusStyle

  const isMultiService = Boolean(service.subServiceIds && service.subServiceIds.length > 1)
  const isTabsMode = isMultiService && multiServiceMode !== 'default'

  const subServices = isMultiService
    ? service.subServiceIds.map(id => servicesData[id]).filter(Boolean)
    : [service]

  const [internalSubId, setInternalSubId] = useState(service.subServiceIds?.[0] || service.id)

  useEffect(() => {
    if (service.subServiceIds && service.subServiceIds.length > 0) {
      setInternalSubId(service.subServiceIds[0])
    }
  }, [service.id])

  const activeSubId = selectedSubId ?? internalSubId
  const handleSelectSubId = (id) => {
    setInternalSubId(id)
    if (onSelectSubId) onSelectSubId(id)
  }

  // If in tabs mode, display selected sub-service; otherwise if in default mode, display full bundle (service)
  const activeDisplayService = (isTabsMode && servicesData[activeSubId])
    ? servicesData[activeSubId]
    : service

  const stepsList = activeDisplayService.steps || NINE_STEPS
  const currentStepNum = (isMultiService && serviceSteps && typeof serviceSteps[activeSubId] === 'number')
    ? serviceSteps[activeSubId]
    : activeStep

  const safeActiveStep = Math.min(currentStepNum, stepsList.length - 1)
  const currentStep = stepsList[safeActiveStep] || stepsList[0]

  // Process compaction grouping
  const isCompact = processMode !== 'default'
  const processDesign = processMode === 'compact' ? 'drawer' : processMode
  const { displaySteps, processGroupIndex, startIndex, endIndex } = useMemo(() => {
    return buildProcessSteps(stepsList, isCompact)
  }, [stepsList, isCompact])

  const displayActiveStep = useMemo(() => {
    return mapRawToDisplayStep(safeActiveStep, startIndex, endIndex, processGroupIndex)
  }, [safeActiveStep, startIndex, endIndex, processGroupIndex])

  const scrollRef = useRef(null)
  const isDragging = useRef(false)
  const startY = useRef(0)
  const startScrollTop = useRef(0)

  const handleMouseDown = (e) => {
    if (e.button !== 0) return
    if (e.target.closest('button') || e.target.closest('a')) return
    isDragging.current = true
    startY.current = e.pageY
    startScrollTop.current = scrollRef.current ? scrollRef.current.scrollTop : 0
  }

  const handleMouseMove = (e) => {
    if (!isDragging.current || !scrollRef.current) return
    e.preventDefault()
    const deltaY = e.pageY - startY.current
    scrollRef.current.scrollTop = startScrollTop.current - deltaY
  }

  const handleMouseUpOrLeave = () => {
    isDragging.current = false
  }

  return (
    <div className="flex flex-col h-full min-h-0 bg-white relative">

      {/* Back + Title */}
      <div className="relative flex items-center justify-center px-5 pb-3 shrink-0" style={{ paddingTop: 6 }}>
        <button className="absolute left-5 w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center shadow-xs bg-white hover:bg-gray-50 transition-colors">
          <svg viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2.5" strokeLinecap="round" className="w-[18px] h-[18px]">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
        </button>
        <span className="text-[17px] font-semibold text-gray-900">Order details</span>
      </div>

      {/* Scrollable content */}
      <div
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
        className="flex-1 min-h-0 px-5 space-y-3.5 overflow-y-auto no-scrollbar cursor-grab active:cursor-grabbing"
        style={{
          WebkitOverflowScrolling: 'touch',
          overscrollBehavior: 'contain',
        }}
      >
        {/* Order title + price */}
        <div className="flex items-start justify-between pt-1">
          <div>
            <h2 className="text-[21px] font-bold text-gray-900 tracking-tight">{service.title}</h2>
            <motion.span
              key={currentStep.label}
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1,    opacity: 1 }}
              className="inline-block mt-1 px-3 py-1 text-[12.5px] font-semibold text-white shadow-xs"
              style={{ background: '#0099FF', borderRadius: 12 }}
            >
              {currentStep.label}
            </motion.span>
          </div>
          <div className="text-right">
            <div className="text-[20px] font-bold text-gray-900 leading-tight">
              <span className="text-[12.5px] font-medium text-gray-500 mr-0.5 align-top">{service.currency}</span>
              {service.price}
            </div>
            <div className="text-[13px] text-gray-400 mt-0.5">{service.status || 'Pending'}</div>
          </div>
        </div>

        {/* Chat / Call */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <button
            className="flex items-center justify-center gap-2 py-3 text-white text-[14.5px] font-semibold active:scale-[0.98] transition-transform shadow-xs"
            style={{ background: '#0A1C6A', borderRadius: 12 }}
          >
            <span>Chat</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[18px] h-[18px]">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z" strokeLinejoin="round"/>
            </svg>
          </button>
          <button
            className="flex items-center justify-center gap-2 py-3 text-slate-900 text-[14.5px] font-semibold active:scale-[0.98] transition-transform shadow-xs"
            style={{ background: '#00E5BE', borderRadius: 12 }}
          >
            <span>Call</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[18px] h-[18px]">
              <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.42 1.18 2 2 0 012.41 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 8.34a16 16 0 006.75 6.75l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* Status section */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-baseline gap-1.5 min-w-0">
              <h3 className="text-[17px] font-bold text-gray-900 shrink-0">Status</h3>
              {isTabsMode && activeDisplayService && (
                <span className="text-[13.5px] font-medium text-slate-500 truncate">
                  · {activeDisplayService.serviceName}
                </span>
              )}
            </div>
          </div>

          {/* Service tabs section: ONLY in 2 service or 5 service orders AND when not in default mode */}
          {isTabsMode && multiServiceMode === 'minimal' && (
            <ServiceMinimalTabsBar
              subServices={subServices}
              activeSubId={activeSubId}
              onSelect={handleSelectSubId}
            />
          )}

          {isTabsMode && multiServiceMode === 'pills' && (
            <ServiceTabsBar
              subServices={subServices}
              activeSubId={activeSubId}
              onSelect={handleSelectSubId}
            />
          )}

          {isTabsMode && multiServiceMode === 'rings' && (
            <ServiceRingTabsBar
              subServices={subServices}
              activeSubId={activeSubId}
              onSelect={handleSelectSubId}
            />
          )}

          {isTabsMode && multiServiceMode === 'chips' && (
            <ServiceGhostChipsBar
              subServices={subServices}
              activeSubId={activeSubId}
              onSelect={handleSelectSubId}
            />
          )}

          {/* Render selected timeline layout */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`${currentStyle}-${service.id}-${isTabsMode ? activeSubId : 'default'}-${processMode}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
            >
              {(currentStyle === 'list' || currentStyle === 'track') && (
                <StatusList
                  steps={displaySteps}
                  activeStep={displayActiveStep}
                  rawActiveStep={safeActiveStep}
                  lineStyle={lineStyle}
                  processDesign={processDesign}
                  isProcessExpanded={isProcessExpanded}
                  onToggleProcessExpanded={onToggleProcessExpanded}
                  onSelectRawStep={onSelectRawStep}
                  serviceId={activeDisplayService.id}
                  serviceIcons={activeDisplayService.serviceIcons}
                  serviceName={activeDisplayService.serviceName}
                  badgeBorder={activeDisplayService.badgeBorder}
                  badgeColor={activeDisplayService.badgeColor}
                  themeColor={activeDisplayService.themeColor}
                  subServices={subServices}
                  serviceSteps={serviceSteps}
                  isMultiService={isMultiService}
                  isTabsMode={isTabsMode}
                  multiServiceMode={multiServiceMode}
                  showQRCode={showQRCode}
                  rightSideStyle={rightSideStyle}
                />
              )}
              {currentStyle === 'stepper' && (
                <StatusStepper
                  steps={displaySteps}
                  activeStep={displayActiveStep}
                  rawActiveStep={safeActiveStep}
                  serviceId={activeDisplayService.id}
                  serviceIcons={activeDisplayService.serviceIcons}
                  serviceName={activeDisplayService.serviceName}
                  badgeColor={activeDisplayService.badgeColor}
                  badgeBorder={activeDisplayService.badgeBorder}
                  badgeText={activeDisplayService.badgeText}
                  themeColor={activeDisplayService.themeColor}
                  lineStyle={lineStyle}
                  showServiceText={true}
                  processDesign={processDesign}
                  isProcessExpanded={isProcessExpanded}
                  onToggleProcessExpanded={onToggleProcessExpanded}
                  onSelectRawStep={onSelectRawStep}
                  subServices={subServices}
                  serviceSteps={serviceSteps}
                  isMultiService={isMultiService}
                  isTabsMode={isTabsMode}
                  multiServiceMode={multiServiceMode}
                  showQRCode={showQRCode}
                  rightSideStyle={rightSideStyle}
                />
              )}
              {(currentStyle === 'service-icon' || currentStyle === 'cards') && (
                <StatusStepper
                  steps={displaySteps}
                  activeStep={displayActiveStep}
                  rawActiveStep={safeActiveStep}
                  serviceId={activeDisplayService.id}
                  serviceIcons={activeDisplayService.serviceIcons}
                  serviceName={activeDisplayService.serviceName}
                  badgeColor={activeDisplayService.badgeColor}
                  badgeBorder={activeDisplayService.badgeBorder}
                  badgeText={activeDisplayService.badgeText}
                  themeColor={activeDisplayService.themeColor}
                  lineStyle={lineStyle}
                  showServiceText={false}
                  processDesign={processDesign}
                  isProcessExpanded={isProcessExpanded}
                  onToggleProcessExpanded={onToggleProcessExpanded}
                  onSelectRawStep={onSelectRawStep}
                  subServices={subServices}
                  serviceSteps={serviceSteps}
                  isMultiService={isMultiService}
                  isTabsMode={isTabsMode}
                  multiServiceMode={multiServiceMode}
                  showQRCode={showQRCode}
                  rightSideStyle={rightSideStyle}
                />
              )}
              {currentStyle === 'overlap' && (
                <StatusStepper
                  steps={displaySteps}
                  activeStep={displayActiveStep}
                  rawActiveStep={safeActiveStep}
                  serviceId={activeDisplayService.id}
                  serviceIcons={activeDisplayService.serviceIcons}
                  serviceName={activeDisplayService.serviceName}
                  badgeColor={activeDisplayService.badgeColor}
                  badgeBorder={activeDisplayService.badgeBorder}
                  badgeText={activeDisplayService.badgeText}
                  themeColor={activeDisplayService.themeColor}
                  lineStyle={lineStyle}
                  showServiceText={false}
                  overlap={true}
                  processDesign={processDesign}
                  isProcessExpanded={isProcessExpanded}
                  onToggleProcessExpanded={onToggleProcessExpanded}
                  onSelectRawStep={onSelectRawStep}
                  subServices={subServices}
                  serviceSteps={serviceSteps}
                  isMultiService={isMultiService}
                  isTabsMode={isTabsMode}
                  multiServiceMode={multiServiceMode}
                  showQRCode={showQRCode}
                  rightSideStyle={rightSideStyle}
                />
              )}
              {!['list', 'track', 'stepper', 'service-icon', 'overlap', 'cards'].includes(currentStyle) && (
                <StatusStepper
                  steps={displaySteps}
                  activeStep={displayActiveStep}
                  rawActiveStep={safeActiveStep}
                  serviceId={activeDisplayService.id}
                  serviceIcons={activeDisplayService.serviceIcons}
                  serviceName={activeDisplayService.serviceName}
                  badgeColor={activeDisplayService.badgeColor}
                  badgeBorder={activeDisplayService.badgeBorder}
                  badgeText={activeDisplayService.badgeText}
                  themeColor={activeDisplayService.themeColor}
                  lineStyle={lineStyle}
                  showServiceText={false}
                  overlap={true}
                  processDesign={processDesign}
                  isProcessExpanded={isProcessExpanded}
                  onToggleProcessExpanded={onToggleProcessExpanded}
                  onSelectRawStep={onSelectRawStep}
                  subServices={subServices}
                  serviceSteps={serviceSteps}
                  isMultiService={isMultiService}
                  isTabsMode={isTabsMode}
                  multiServiceMode={multiServiceMode}
                  showQRCode={showQRCode}
                  rightSideStyle={rightSideStyle}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Drop-off banner for press-only and bags-shoes matching screenshot */}
        {(activeDisplayService.id === 'press-only' || activeDisplayService.id === 'bags-shoes') && (
          <div className="flex items-center gap-3 px-4 py-3.5" style={{ background: '#EDF2FE', borderRadius: 16 }}>
            <div className="w-6 h-6 flex items-center justify-center shrink-0 text-slate-800">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                <rect x="8" y="2" width="9" height="14" rx="1.5" />
                <path d="M11 13h3" />
                <path d="M4 17l4-2 3.5 1" />
                <path d="M3 20c2.5-.8 5.5-.8 8.5-.8h3a2 2 0 002-2" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-[14px] font-bold text-gray-800 leading-tight">Drop-off</span>
              <span className="text-[12px] text-gray-500 font-medium mt-0.5">In Person</span>
            </div>
          </div>
        )}

        <div className="h-6" />
      </div>
    </div>
  )
}

// Alias for backwards compatibility
const WashAndFoldScreen = (props) => <OrderDetailsScreen service={servicesData['wash-fold']} {...props} />

// ─── Placeholder for other tabs ───────────────────────────────────────────────
function PlaceholderScreen({ label, color, dot, icon, short }) {
  return (
    <div className="flex flex-col h-full bg-white items-center justify-center gap-3 px-6">
      <div className="w-16 h-16 rounded-3xl flex items-center justify-center overflow-hidden shadow-sm" style={{ background: color }}>
        {icon
          ? <img src={icon} alt={label} className="w-14 h-14 object-contain" />
          : <span className="text-2xl font-bold" style={{ color: dot }}>{short}</span>
        }
      </div>
      <p className="text-sm font-bold text-gray-700 text-center">{label}</p>
      <p className="text-xs text-gray-300 text-center">Screen coming soon</p>
      <div className="mt-2 w-full h-px" style={{ background: color }} />
    </div>
  )
}

// ─── iPhone Shell (iPhone 14 Pro Max: 430px × 932px inner viewport, 452px × 954px outer frame) ──
function IPhoneShell({ children }) {
  return (
    <div className="relative shrink-0" style={{ width: 452, height: 954 }}>
      {/* Volume buttons */}
      <div className="absolute rounded-l-sm" style={{ left: -5, top: 130, width: 4, height: 44, background: '#555' }} />
      <div className="absolute rounded-l-sm" style={{ left: -5, top: 188, width: 4, height: 44, background: '#555' }} />
      <div className="absolute rounded-l-sm" style={{ left: -5, top: 246, width: 4, height: 44, background: '#555' }} />
      {/* Power button */}
      <div className="absolute rounded-r-sm" style={{ right: -5, top: 180, width: 4, height: 72, background: '#555' }} />

      {/* Frame */}
      <div
        className="rounded-[56px] overflow-hidden"
        style={{
          width: 452,
          height: 954,
          padding: 11,
          background: 'linear-gradient(160deg, #2a2a2a 0%, #1a1a1a 100%)',
          boxShadow: '0 0 0 1px #444, inset 0 0 0 1px #333, 0 40px 80px rgba(0,0,0,0.4)',
        }}
      >
        <div
          className="rounded-[46px] overflow-hidden bg-white relative flex flex-col"
          style={{ width: 430, height: 932 }}
        >
          {/* Dynamic Island — overlays the status bar center */}
          <div
            className="absolute z-20 pointer-events-none"
            style={{ top: 12, left: '50%', transform: 'translateX(-50%)', width: 125, height: 35, background: '#000', borderRadius: 22 }}
          />

          {/* Status bar sits at the very top, same row as Dynamic Island */}
          <StatusBar />

          {/* Screen content below the status bar */}
          <div className="flex-1 min-h-0 flex flex-col relative overflow-hidden h-full">
            {children}
          </div>

          {/* Home indicator bar */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-36 h-1 rounded-full bg-slate-900/25 z-30 pointer-events-none" />
        </div>
      </div>
    </div>
  )
}

// ─── Root App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [activeTab,        setActiveTab]        = useState(() => {
    if (typeof window !== 'undefined') {
      const p = new URLSearchParams(window.location.search)
      return p.get('tab') || '5-service'
    }
    return '5-service'
  })
  const [serviceSteps,     setServiceSteps]     = useState(() => {
    const urlStep = (() => {
      if (typeof window !== 'undefined') {
        const p = new URLSearchParams(window.location.search)
        const s = p.get('step')
        if (s !== null) return parseInt(s, 10)
      }
      return null
    })()

    return {
      'wash-fold': urlStep !== null ? urlStep : 1,
      'clean-press': urlStep !== null ? urlStep : 1,
      'press-only': urlStep !== null ? urlStep : 1,
      'bed-bath': urlStep !== null ? urlStep : 1,
      'bags-shoes': urlStep !== null ? urlStep : 1,
      'premium-care': urlStep !== null ? urlStep : 1,
      '2-service': {
        'wash-fold': urlStep !== null ? urlStep : 3,
        'clean-press': 1,
      },
      '5-service': {
        'wash-fold': urlStep !== null ? urlStep : 4,
        'press-only': 3,
        'clean-press': 2,
        'bags-shoes': 1,
        'premium-care': 0,
      },
    }
  })
  const [statusStyle,      setStatusStyle]      = useState(() => {
    if (typeof window !== 'undefined') {
      const p = new URLSearchParams(window.location.search)
      return p.get('layout') || 'list'
    }
    return 'list'
  })
  const [lineStyle,        setLineStyle]        = useState(() => {
    if (typeof window !== 'undefined') {
      const p = new URLSearchParams(window.location.search)
      return p.get('lineStyle') || p.get('line') || 'nodes'
    }
    return 'nodes'
  })
  const [multiServiceMode, setMultiServiceMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const p = new URLSearchParams(window.location.search)
      return p.get('multiMode') || 'minimal'
    }
    return 'minimal'
  }) // 'minimal' | 'pills' | 'rings' | 'chips' | 'default'
  const [processMode, setProcessMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const p = new URLSearchParams(window.location.search)
      return p.get('processMode') || 'drawer'
    }
    return 'drawer'
  }) // 'default' | 'compact'
  const [isProcessExpanded, setIsProcessExpanded] = useState(() => {
    if (typeof window !== 'undefined') {
      const p = new URLSearchParams(window.location.search)
      return p.get('processExpanded') === 'true'
    }
    return false
  })
  const [showQRCode, setShowQRCode] = useState(() => {
    if (typeof window !== 'undefined') {
      const p = new URLSearchParams(window.location.search)
      return p.get('qr') === 'true'
    }
    return false
  })
  const [rightSideStyle,   setRightSideStyle]   = useState(() => {
    if (typeof window !== 'undefined') {
      const p = new URLSearchParams(window.location.search)
      return p.get('rightSide') || 'none'
    }
    return 'none'
  })
  const [simulating,       setSimulating]       = useState(false)
  const [showControls,     setShowControls]     = useState(() => {
    if (typeof window !== 'undefined') {
      const p = new URLSearchParams(window.location.search)
      return p.get('controls') === 'true'
    }
    return false
  })
  const [selectedSubId,    setSelectedSubId]    = useState(null)
  const intervalRef = useRef(null)
  const active = tabs.find(t => t.id === activeTab)
  const activeService = servicesData[activeTab]

  // Track window dimensions for responsive small-device scaling
  const [windowDimensions, setWindowDimensions] = useState(() => ({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 900,
  }))

  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const isSmallDevice = windowDimensions.width < 768

  // Calculate dynamic scale factor so it fits small devices perfectly (iPhone 14 Pro Max base: 452 x 954)
  const phoneScale = useMemo(() => {
    if (isSmallDevice) {
      // Available width for the phone inside the card (accounting for margins/padding)
      const availableWidth = Math.max(280, windowDimensions.width - 32)
      return Math.min(1, Math.max(0.40, availableWidth / 452))
    }
    // On tablet / small laptop screens, scale down if height or width is constrained
    const availableHeight = windowDimensions.height - 240
    const scaleH = availableHeight < 954 ? availableHeight / 954 : 1
    const availableWidth = windowDimensions.width - 280
    const scaleW = availableWidth < 600 ? availableWidth / 600 : 1
    return Math.min(1, Math.max(0.60, Math.min(scaleH, scaleW)))
  }, [isSmallDevice, windowDimensions.width, windowDimensions.height])

  // Keyboard shortcut 'c' to toggle developer controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.key === 'c' || e.key === 'C') && !['INPUT', 'TEXTAREA'].includes(e.target?.tagName)) {
        setShowControls(prev => !prev)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Multi-service sub-service tracking
  const isMultiService = Boolean(activeService?.subServiceIds && activeService.subServiceIds.length > 1)
  const effectiveSubId = isMultiService
    ? (selectedSubId && activeService.subServiceIds.includes(selectedSubId) ? selectedSubId : activeService.subServiceIds[0])
    : null

  const isTabsMode = isMultiService && multiServiceMode !== 'default'
  const activeSubService = (isTabsMode && effectiveSubId) ? servicesData[effectiveSubId] : null

  const currentSteps = activeSubService?.steps || activeService?.steps || NINE_STEPS

  // Active step for currently selected view
  const currentActiveStep = useMemo(() => {
    if (isMultiService) {
      const subId = effectiveSubId || activeService?.subServiceIds?.[0]
      return serviceSteps[activeTab]?.[subId] ?? 0
    }
    return typeof serviceSteps[activeTab] === 'number' ? serviceSteps[activeTab] : 0
  }, [isMultiService, activeTab, effectiveSubId, serviceSteps, activeService])

  const safeActiveStep = Math.min(currentActiveStep, currentSteps.length - 1)

  const handleSetStep = useCallback((newStep, targetSubId = null) => {
    setServiceSteps(prev => {
      if (isMultiService) {
        const subId = targetSubId || effectiveSubId || activeService?.subServiceIds?.[0]
        return {
          ...prev,
          [activeTab]: {
            ...(prev[activeTab] || {}),
            [subId]: newStep,
          },
        }
      }
      return {
        ...prev,
        [activeTab]: newStep,
      }
    })
  }, [isMultiService, activeTab, effectiveSubId, activeService])

  const handleReset = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setSimulating(false)
    setServiceSteps(prev => {
      if (isMultiService && activeService?.subServiceIds) {
        const resetSubMap = {}
        activeService.subServiceIds.forEach(id => {
          resetSubMap[id] = 0
        })
        return {
          ...prev,
          [activeTab]: resetSubMap,
        }
      }
      return {
        ...prev,
        [activeTab]: 0,
      }
    })
  }, [isMultiService, activeTab, activeService])

  function startSimulate() {
    if (simulating) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      setSimulating(false)
      // Paused: DO NOT reset step!
      return
    }

    if (isMultiService) {
      const subIds = activeService?.subServiceIds || []
      const currentMap = { ...(serviceSteps[activeTab] || {}) }
      const maxStep = (activeService?.steps?.length || 9) - 1

      // If all finished, restart them from 0
      const allFinished = subIds.every(id => {
        const total = (servicesData[id]?.steps?.length || 9) - 1
        return (currentMap[id] ?? 0) >= total
      })

      // All services move together for step and process
      let nextStep = allFinished ? 0 : Math.min(...subIds.map(id => currentMap[id] ?? 0))
      if (allFinished) {
        subIds.forEach(id => {
          currentMap[id] = 0
        })
        setServiceSteps(prev => ({
          ...prev,
          [activeTab]: { ...currentMap },
        }))
      } else {
        // Sync them to advance together
        subIds.forEach(id => {
          currentMap[id] = nextStep
        })
        setServiceSteps(prev => ({
          ...prev,
          [activeTab]: { ...currentMap },
        }))
      }

      setSimulating(true)

      intervalRef.current = setInterval(() => {
        nextStep += 1
        if (nextStep > maxStep) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current)
            intervalRef.current = null
          }
          setSimulating(false)
          // Keep at final step! DO NOT reset!
          return
        }

        const stepsState = {}
        subIds.forEach(id => {
          stepsState[id] = nextStep
        })
        setServiceSteps(prev => ({
          ...prev,
          [activeTab]: { ...stepsState },
        }))
      }, 1200)

    } else {
      // Single service
      const targetService = activeService
      const stepsCount = targetService?.steps?.length || 9

      const currentVal = serviceSteps[activeTab] ?? 0

      let nextStep = currentVal >= stepsCount - 1 ? 0 : currentVal
      if (currentVal >= stepsCount - 1) {
        handleSetStep(0)
      }

      setSimulating(true)
      intervalRef.current = setInterval(() => {
        nextStep += 1
        if (nextStep >= stepsCount) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current)
            intervalRef.current = null
          }
          setSimulating(false)
          // Finished: Keep at final step! DO NOT reset!
          return
        }
        handleSetStep(nextStep)
      }, 1200)
    }
  }

  const handleSelectRawStep = (step) => {
    if (simulating) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      setSimulating(false)
    }
    handleSetStep(step)
  }

  const prevActiveTabRef = useRef(activeTab)
  // Cleanup on tab change
  useEffect(() => {
    if (prevActiveTabRef.current === activeTab) {
      return
    }
    prevActiveTabRef.current = activeTab
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setSimulating(false)
    const nextService = servicesData[activeTab]
    if (nextService?.subServiceIds?.length > 0) {
      setSelectedSubId(nextService.subServiceIds[0])
    } else {
      setSelectedSubId(null)
    }
  }, [activeTab])

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-start py-6 sm:py-10 px-3 sm:px-8 overflow-x-hidden overflow-y-auto" style={{ background: '#F0F4F8' }}>

      {/* Page title */}
      <div className="mb-4 sm:mb-7 text-center shrink-0">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 tracking-tight">Order Flow</h1>
        <p className="text-xs sm:text-sm text-gray-400 mt-0.5">Select a service to preview</p>
      </div>

      {/* Main card */}
      <div
        className="flex flex-col md:flex-row rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl sm:shadow-2xl mx-auto my-auto mb-6 sm:mb-10 w-full max-w-full md:max-w-none md:w-auto"
        style={{
          background: '#fff',
          minHeight: isSmallDevice ? 'auto' : Math.round(1100 * phoneScale),
        }}
      >

        {/* ── Services selector: Top bar on small devices, Left sidebar on desktop ── */}
        <div
          className={
            isSmallDevice
              ? "flex flex-row items-center gap-1.5 p-2 overflow-x-auto no-scrollbar w-full shrink-0"
              : "flex flex-col gap-1 p-3 shrink-0"
          }
          style={{
            width: isSmallDevice ? '100%' : 165,
            background: '#F8FAFC',
            borderRight: isSmallDevice ? 'none' : '1px solid #E9EEF4',
            borderBottom: isSmallDevice ? '1px solid #E9EEF4' : 'none',
          }}
        >
          {/* Header */}
          {!isSmallDevice && (
            <div className="flex items-center gap-2 px-2 py-3 mb-2">
              <div className="w-7.5 h-7.5 rounded-lg flex items-center justify-center" style={{ background: '#1B2F6E' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="w-4 h-4">
                  <path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round"/>
                </svg>
              </div>
              <span className="text-[13.5px] font-bold text-gray-700">Services</span>
            </div>
          )}

          {/* Tab items */}
          {tabs.map(tab => {
            const isActive = activeTab === tab.id
            if (isSmallDevice) {
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="relative flex items-center gap-2 py-1.5 px-3 rounded-xl transition-all duration-200 cursor-pointer shrink-0"
                  style={{ background: isActive ? tab.color : 'transparent' }}
                >
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center overflow-hidden shrink-0"
                    style={{
                      background: isActive ? '#fff' : '#F1F5F9',
                      boxShadow: isActive ? `0 2px 6px ${tab.dot}25` : 'none',
                    }}
                  >
                    {tab.icon
                      ? <img src={tab.icon} alt={tab.label} className="w-5.5 h-5.5 object-contain" />
                      : <span className="text-xs font-bold" style={{ color: tab.dot }}>{tab.short}</span>
                    }
                  </div>
                  <span
                    className="text-[11.5px] font-semibold whitespace-nowrap"
                    style={{ color: isActive ? '#1e293b' : '#64748B' }}
                  >
                    {tab.label}
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="mobile-sidebar-dot"
                      className="w-1.5 h-1.5 rounded-full shrink-0"
                      style={{ background: tab.dot }}
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                </button>
              )
            }

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="relative flex flex-col items-center gap-1.5 w-full py-3.5 px-2.5 rounded-2xl transition-all duration-200 cursor-pointer"
                style={{ background: isActive ? tab.color : 'transparent' }}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-accent"
                    className="absolute left-0 top-3 bottom-3 rounded-r-full"
                    style={{ width: 3.5, background: tab.dot }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center overflow-hidden transition-all duration-200"
                  style={{
                    background:  isActive ? '#fff' : '#F1F5F9',
                    boxShadow:   isActive ? `0 2px 8px ${tab.dot}30` : 'none',
                  }}
                >
                  {tab.icon
                    ? <img src={tab.icon} alt={tab.label} className="w-10 h-10 object-contain" />
                    : <span className="text-xl font-bold" style={{ color: tab.dot }}>{tab.short}</span>
                  }
                </div>
                <span className="text-[12px] font-semibold leading-tight text-center"
                  style={{ color: isActive ? '#1e293b' : '#94A3B8' }}>
                  {tab.label}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="sidebar-dot"
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: tab.dot }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            )
          })}
        </div>

        {/* ── Right: phone + simulate ── */}
        <div
          className="flex-1 flex flex-col items-center justify-center px-4 sm:px-10 pt-6 sm:pt-10 pb-6 sm:pb-8 gap-3 sm:gap-4 h-full transition-all duration-300 w-full min-w-0"
          style={{
            background: `linear-gradient(135deg, ${active.color}80 0%, #fff 60%)`,
            minWidth: (!isSmallDevice && !showControls) ? 540 : 'auto',
          }}
        >
          {/* Label above phone */}
          <div className="flex items-center justify-center gap-2.5 mb-3 sm:mb-6 mx-auto">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center overflow-hidden" style={{ background: active.color }}>
              {active.icon
                ? <img src={active.icon} alt="" className="w-7 h-7 object-contain" />
                : <span className="text-sm font-bold" style={{ color: active.dot }}>{active.short}</span>
              }
            </div>
            <div>
              <div className="text-sm sm:text-base font-bold text-gray-800">{active.label}</div>
              <div className="text-[11px] sm:text-xs text-gray-400">Order details preview</div>
            </div>
          </div>

          {/* Phone + Simulate side by side */}
          <div
            className="flex flex-col md:flex-row items-center justify-center gap-4 sm:gap-6 shrink-0 w-full mx-auto"
            style={{
              height: isSmallDevice ? 'auto' : Math.round(954 * phoneScale),
            }}
          >

            {/* Phone Scaled Wrapper */}
            <div
              className="relative flex items-center justify-center shrink-0 mx-auto"
              style={{
                width: Math.round(452 * phoneScale),
                height: Math.round(954 * phoneScale),
              }}
            >
              <div
                style={{
                  width: 452,
                  height: 954,
                  transform: `scale(${phoneScale})`,
                  transformOrigin: 'center center',
                  flexShrink: 0,
                }}
              >
                <IPhoneShell>
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key={activeTab}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.15, ease: 'easeInOut' }}
                      className="flex-1 min-h-0 flex flex-col h-full"
                    >
                      {activeService ? (
                        <OrderDetailsScreen
                          service={activeService}
                          activeStep={safeActiveStep}
                          serviceSteps={serviceSteps[activeTab]}
                          statusStyle={statusStyle}
                          setStatusStyle={setStatusStyle}
                          lineStyle={lineStyle}
                          selectedSubId={effectiveSubId}
                          onSelectSubId={setSelectedSubId}
                          multiServiceMode={multiServiceMode}
                          setMultiServiceMode={setMultiServiceMode}
                          processMode={processMode}
                          setProcessMode={setProcessMode}
                          isProcessExpanded={isProcessExpanded}
                          onToggleProcessExpanded={() => setIsProcessExpanded(prev => !prev)}
                          onSelectRawStep={handleSelectRawStep}
                          showQRCode={showQRCode}
                          rightSideStyle={rightSideStyle}
                        />
                      ) : (
                        <PlaceholderScreen
                          label={active.label}
                          color={active.color}
                          dot={active.dot}
                          icon={active.icon}
                          short={active.short}
                        />
                      )}
                    </motion.div>
                  </AnimatePresence>
                </IPhoneShell>
              </div>
            </div>

            {/* Simulate panel — available for activeService when showControls is true */}
            {activeService && showControls && (
              <div
                className="flex flex-col items-center justify-start py-0.5 gap-1.5 shrink-0 overflow-y-auto no-scrollbar"
                style={{
                  width: isSmallDevice ? Math.min(360, Math.round(452 * phoneScale)) : 144,
                  maxHeight: isSmallDevice ? 360 : Math.round(954 * phoneScale),
                }}
              >

                {/* Multi-Service section — visible for 2-service and 5-service */}
                {isMultiService && (
                  <div className="flex flex-col items-center gap-1 p-1.5 rounded-xl bg-white border border-gray-100 shadow-sm w-full">
                    <span className="text-[9.5px] font-bold text-gray-400 uppercase tracking-wider">Multi-Service</span>
                    <div className="grid grid-cols-2 gap-1 w-full">
                      {[
                        { id: 'minimal', label: 'Underline' },
                        { id: 'pills',   label: 'Pills' },
                        { id: 'rings',   label: 'Rings' },
                        { id: 'chips',   label: 'Chips' },
                        { id: 'default', label: 'Default', span: 2 },
                      ].map(opt => (
                        <button
                          key={opt.id}
                          onClick={() => setMultiServiceMode(opt.id)}
                          className={`py-0.5 px-1 rounded-md text-[9px] font-bold transition-all text-center cursor-pointer ${
                            opt.span === 2 ? 'col-span-2' : ''
                          }`}
                          style={{
                            background: multiServiceMode === opt.id ? '#141C3C' : '#F1F5F9',
                            color: multiServiceMode === opt.id ? '#fff' : '#64748B',
                          }}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Status layout switcher — compact 2x2 grid */}
                <div className="flex flex-col items-center gap-1 p-1.5 rounded-xl bg-white border border-gray-100 shadow-sm w-full">
                  <span className="text-[9.5px] font-bold text-gray-400 uppercase tracking-wider">Layout</span>
                  <div className="grid grid-cols-2 gap-1 w-full">
                    {styleOptions.map(opt => (
                      <button
                        key={opt.id}
                        onClick={() => setStatusStyle(opt.id)}
                        className="py-0.5 px-0.5 rounded-md text-[9px] font-bold transition-all text-center leading-tight cursor-pointer"
                        style={{
                          background: statusStyle === opt.id ? '#141C3C' : '#F1F5F9',
                          color: statusStyle === opt.id ? '#fff' : '#64748B',
                        }}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Process compaction switcher (Default, Drawer, Segments, Pills) */}
                <div className="flex flex-col items-center gap-1 p-1.5 rounded-xl bg-white border border-gray-100 shadow-sm w-full">
                  <span className="text-[9.5px] font-bold text-gray-400 uppercase tracking-wider">Process</span>
                  <div className="grid grid-cols-2 gap-1 w-full">
                    {[
                      { id: 'default',  label: 'Default' },
                      { id: 'drawer',   label: 'Drawer' },
                      { id: 'segments', label: 'Segments' },
                      { id: 'pills',    label: 'Pills' },
                    ].map(opt => {
                      const isActive = processMode === opt.id || (processMode === 'compact' && opt.id === 'drawer')
                      return (
                        <button
                          key={opt.id}
                          onClick={() => setProcessMode(opt.id)}
                          className="py-0.5 px-1 rounded-md text-[9px] font-bold transition-all text-center cursor-pointer"
                          style={{
                            background: isActive ? '#141C3C' : '#F1F5F9',
                            color: isActive ? '#fff' : '#64748B',
                          }}
                        >
                          {opt.label}
                        </button>
                      )
                    })}
                  </div>
                  {processMode !== 'default' && (
                    <button
                      onClick={() => setIsProcessExpanded(prev => !prev)}
                      className="w-full text-[9px] font-bold text-sky-600 hover:text-sky-700 py-0.5 text-center cursor-pointer transition-colors"
                    >
                      {isProcessExpanded ? '▲ Collapse' : '▼ Expand'}
                    </button>
                  )}
                </div>

                {/* Line style switcher (changes line globally across styles) */}
                <div className="flex flex-col items-center gap-1 p-1.5 rounded-xl bg-white border border-gray-100 shadow-sm w-full">
                  <span className="text-[9.5px] font-bold text-gray-400 uppercase tracking-wider">Line Style</span>
                  <div className="grid grid-cols-2 gap-1 w-full">
                    {lineStyles.map((opt, i) => (
                      <button
                        key={opt.id}
                        onClick={() => setLineStyle(opt.id)}
                        className={`py-0.5 px-1 rounded-md text-[9.5px] font-bold transition-all text-center ${
                          i === lineStyles.length - 1 && lineStyles.length % 2 !== 0 ? 'col-span-2' : ''
                        }`}
                        style={{
                          background: lineStyle === opt.id ? '#0EA5E9' : '#F1F5F9',
                          color: lineStyle === opt.id ? '#fff' : '#64748B',
                        }}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* QR Code toggle card */}
                <div className="flex flex-col items-center gap-1 p-1.5 rounded-xl bg-white border border-gray-100 shadow-sm w-full">
                  <span className="text-[9.5px] font-bold text-gray-400 uppercase tracking-wider">QR Code</span>
                  <div className="grid grid-cols-2 gap-1 w-full">
                    <button
                      onClick={() => setShowQRCode(true)}
                      className="py-0.5 px-1 rounded-md text-[9px] font-bold transition-all text-center cursor-pointer"
                      style={{
                        background: showQRCode ? '#141C3C' : '#F1F5F9',
                        color: showQRCode ? '#fff' : '#64748B',
                      }}
                    >
                      Show
                    </button>
                    <button
                      onClick={() => setShowQRCode(false)}
                      className="py-0.5 px-1 rounded-md text-[9px] font-bold transition-all text-center cursor-pointer"
                      style={{
                        background: !showQRCode ? '#141C3C' : '#F1F5F9',
                        color: !showQRCode ? '#fff' : '#64748B',
                      }}
                    >
                      Hide
                    </button>
                  </div>
                </div>

                {/* Pattern Rail switcher (Hidden, Visible) */}
                <div className="flex flex-col items-center gap-1 p-1.5 rounded-xl bg-white border border-gray-100 shadow-sm w-full">
                  <span className="text-[9.5px] font-bold text-gray-400 uppercase tracking-wider">Pattern Rail</span>
                  <div className="grid grid-cols-2 gap-0.5 w-full">
                    {[
                      { id: 'none',    label: 'Hidden' },
                      { id: 'pattern', label: 'Visible' },
                    ].map(opt => {
                      const isSelected = (!showQRCode && rightSideStyle === opt.id) || (showQRCode && opt.id === 'none' && rightSideStyle === 'none')
                      return (
                        <button
                          key={opt.id}
                          onClick={() => {
                            setRightSideStyle(opt.id)
                            setShowQRCode(false)
                          }}
                          className="py-1 px-0.5 rounded-md text-[8px] font-bold transition-all text-center cursor-pointer leading-tight"
                          style={{
                            background: isSelected ? '#141C3C' : '#F1F5F9',
                            color: isSelected ? '#fff' : '#64748B',
                          }}
                        >
                          {opt.label}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Simulate & Reset controls */}
                <div className="flex flex-col items-center gap-1.5 p-1.5 rounded-xl bg-white border border-gray-100 shadow-sm w-full">
                  <span className="text-[9.5px] font-bold text-gray-400 uppercase tracking-wider">Simulate</span>

                  <div className="grid grid-cols-2 gap-1.5 w-full">
                    {/* Simulate / Stop button */}
                    <motion.button
                      onClick={startSimulate}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex flex-col items-center justify-center gap-1 py-2 px-1 rounded-xl text-white font-bold text-[10.5px] cursor-pointer shadow-xs select-none"
                      style={{
                        background: simulating
                          ? 'linear-gradient(135deg, #EF4444, #DC2626)'
                          : 'linear-gradient(135deg, #38BDF8, #0EA5E9)',
                      }}
                    >
                      {simulating ? (
                        <motion.svg
                          viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"
                          animate={{ scale: [1, 1.15, 1] }}
                          transition={{ duration: 1, repeat: Infinity }}
                        >
                          <rect x="6" y="6" width="12" height="12" rx="2" />
                        </motion.svg>
                      ) : (
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                          <path d="M8 5.14v14l11-7-11-7z"/>
                        </svg>
                      )}
                      <span>{simulating ? 'Stop' : 'Simulate'}</span>
                    </motion.button>

                    {/* Reset button */}
                    <motion.button
                      onClick={handleReset}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex flex-col items-center justify-center gap-1 py-2 px-1 rounded-xl font-bold text-[10.5px] cursor-pointer shadow-xs select-none bg-slate-100 hover:bg-slate-200 text-slate-700 active:bg-slate-300 transition-colors"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                        <path d="M3 3v5h5" />
                      </svg>
                      <span>Reset</span>
                    </motion.button>
                  </div>

                  {/* Step progress & label inside card */}
                  <div className="flex flex-col gap-1 w-full pt-1.5 border-t border-slate-100">
                    <div className="flex items-center justify-between w-full">
                      <span className="text-[10px] font-bold text-sky-600 truncate max-w-[80px]">
                        {processMode !== 'default' && isProcessStep(currentSteps[safeActiveStep])
                          ? currentSteps[safeActiveStep]?.label
                          : (currentSteps[safeActiveStep]?.label || '')}
                      </span>
                      <span className="text-[9px] font-mono font-medium text-slate-400 shrink-0">
                        {safeActiveStep + 1}/{currentSteps.length}
                      </span>
                    </div>

                    {/* Horizontal step dashes */}
                    <div className="flex items-center gap-[2.5px] w-full">
                      {currentSteps.map((s, i) => (
                        <motion.div
                          key={s.label}
                          animate={{
                            background: i < safeActiveStep  ? '#0EA5E9'
                                      : i === safeActiveStep ? '#38BDF8'
                                      : '#E2E8F0',
                            height: i === safeActiveStep ? 4.5 : 3.5,
                          }}
                          transition={{ duration: 0.2 }}
                          className="flex-1 rounded-full"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
