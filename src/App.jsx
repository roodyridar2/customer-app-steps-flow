import { useState, useEffect, useRef, useMemo, Fragment } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ─── Tabs ────────────────────────────────────────────────────────────────────
const tabs = [
  { id: 'wash-fold',    label: 'Wash & Fold',   short: 'Wash',    icon: '/service/Wash and fold.png',   color: '#DBEAFE', dot: '#3B82F6' },
  { id: 'clean-press',  label: 'Clean & Press', short: 'Clean',   icon: '/service/clean and press.png', color: '#DCFCE7', dot: '#22C55E' },
  { id: 'press-only',   label: 'Press Only',    short: 'Press',   icon: '/service/press only.png',      color: '#FEF9C3', dot: '#EAB308' },
  { id: 'bags-shoes',   label: 'Bags & Shoes',  short: 'Bags',    icon: '/service/bags and shoes.png',  color: '#FCE7F3', dot: '#EC4899' },
  { id: 'premium-care', label: 'Premium Care',  short: 'Premium', icon: '/service/premium care.png',    color: '#EDE9FE', dot: '#8B5CF6' },
  { id: '2-service',    label: '2 Service',     short: '×2',      icon: null,                           color: '#FEF3C7', dot: '#F59E0B' },
  { id: '5-service',    label: '5 Service',     short: '×5',      icon: null,                           color: '#CCFBF1', dot: '#14B8A6' },
]

// ─── Status steps definitions from assets/screens ────────────────────────────
const ALL_STEPS = {
  received:       { label: 'Received',         icon: '/status/recived.png' },
  confirmed:      { label: 'Confirmed',        icon: '/status/confirm.png' },
  sorted:         { label: 'Sorted',           icon: '/status/sorted.png' },
  washed:         { label: 'Washed',           icon: '/status/washed.png' },
  dried:          { label: 'Dried',            icon: null, isDried: true },
  ironed:         { label: 'Ironed',           icon: '/status/Iconed.png' },
  packed:         { label: 'Packed',           icon: '/status/packed.png' },
  outForDelivery: { label: 'Out for delivery', icon: '/status/out-of-delivery.png' },
  completed:      { label: 'Completed',        icon: '/status/recivedpng.png' },
}

const NINE_STEPS = [
  ALL_STEPS.received,
  ALL_STEPS.confirmed,
  ALL_STEPS.sorted,
  ALL_STEPS.washed,
  ALL_STEPS.dried,
  ALL_STEPS.ironed,
  ALL_STEPS.packed,
  ALL_STEPS.outForDelivery,
  ALL_STEPS.completed,
]

const PRESS_ONLY_STEPS = [
  ALL_STEPS.received,
  ALL_STEPS.confirmed,
  ALL_STEPS.sorted,
  ALL_STEPS.ironed,
  ALL_STEPS.packed,
  ALL_STEPS.outForDelivery,
  ALL_STEPS.completed,
]

const BAGS_SHOES_STEPS = [
  ALL_STEPS.received,
  ALL_STEPS.confirmed,
  ALL_STEPS.sorted,
  ALL_STEPS.dried,
  ALL_STEPS.packed,
  ALL_STEPS.outForDelivery,
  ALL_STEPS.completed,
]

// Fallback steps reference
const steps = NINE_STEPS

// ─── Process Compaction Helpers (sorted, washed, dried, ironed) ───────────────
const PROCESS_STEP_LABELS = ['Sorted', 'Washed', 'Dried', 'Ironed']

function isProcessStep(step) {
  return step ? PROCESS_STEP_LABELS.includes(step.label) : false
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
    icon: '/status/washed.png',
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
    steps: NINE_STEPS,
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
    steps: NINE_STEPS,
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
    steps: NINE_STEPS,
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
    steps: NINE_STEPS,
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
    steps: NINE_STEPS,
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
      className="w-[20px] h-[20px]"
    >
      <path d="M3 6h18" strokeWidth="1.2" strokeDasharray="2 1.5" />
      <path d="M8 4v2.5M16 4v2.5" strokeWidth="1.8" />
      <path d="M7 7l2-1.5h6l2 1.5 2.5 1.8-1.8 2.2-1.7-.8v8H9v-8l-1.7.8-1.8-2.2z" />
    </svg>
  )
}

// ─── Status bar (shared) ──────────────────────────────────────────────────────
function StatusBar() {
  return (
    <div
      className="shrink-0 flex items-center justify-between px-5"
      style={{ height: 44, paddingTop: 12 }}
    >
      {/* Time — left */}
      <span className="text-[13px] font-bold text-black" style={{ zIndex: 30, position: 'relative' }}>
        9:41
      </span>

      {/* Icons — right */}
      <div className="flex items-center gap-1.5 text-black" style={{ zIndex: 30, position: 'relative' }}>
        {/* Wifi */}
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="w-[14px] h-[14px]">
          <path d="M1.5 8.5a13 13 0 0121 0" strokeLinecap="round"/>
          <path d="M5 12a10 10 0 0114 0" strokeLinecap="round"/>
          <path d="M8.5 15.5a6 6 0 017 0" strokeLinecap="round"/>
          <circle cx="12" cy="19" r="1" fill="currentColor"/>
        </svg>
        {/* Signal bars */}
        <svg viewBox="0 0 18 14" fill="currentColor" className="w-[14px] h-[11px]">
          <rect x="0" y="9"  width="3" height="5"  rx="0.5"/>
          <rect x="5" y="6"  width="3" height="8"  rx="0.5"/>
          <rect x="10" y="3" width="3" height="11" rx="0.5"/>
          <rect x="15" y="0" width="3" height="14" rx="0.5" opacity="0.3"/>
        </svg>
        {/* Battery */}
        <div className="flex items-center" style={{ gap: 1 }}>
          <div className="relative border border-black rounded-[3px]" style={{ width: 22, height: 11 }}>
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
function TimelineLine({ activeStep, totalSteps = steps.length, rowHeight = 38, lineStyle = 'solid', stepTops = null }) {
  const getTop = (i) => (stepTops && stepTops[i] !== undefined ? stepTops[i] : i * rowHeight)
  const totalLineH = stepTops && stepTops.length > 1 ? (stepTops[totalSteps - 1] - stepTops[0]) : (totalSteps - 1) * rowHeight
  const circleTop = getTop(activeStep) + (rowHeight - 18) / 2
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
                top: getTop(i) + (rowHeight - 20) / 2,
                width: 20,
                height: 20,
              }}
            >
              {isCurrent ? (
                <motion.div
                  key={`num-active-${i}`}
                  initial={{ scale: 0.75 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 450, damping: 20 }}
                  className="w-5 h-5 rounded-full flex items-center justify-center font-mono font-bold text-[11px] text-white shadow-sm"
                  style={{ background: '#0EA5E9' }}
                >
                  {i + 1}
                </motion.div>
              ) : isComplete ? (
                <div
                  className="w-[19px] h-[19px] rounded-full flex items-center justify-center font-mono font-bold text-[10px]"
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
                  className="w-[18px] h-[18px] rounded-full flex items-center justify-center font-mono font-medium text-[10px]"
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
                top: getTop(i) + (rowHeight - 20) / 2,
                width: 24,
                height: 20,
              }}
            >
              {isCurrent ? (
                <motion.div
                  key={`mono-active-${i}`}
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 450, damping: 20 }}
                  className="px-1 py-0.5 rounded text-[9.5px] font-mono font-bold shadow-sm"
                  style={{ background: '#0F172A', color: '#fff' }}
                >
                  0{i + 1}
                </motion.div>
              ) : (
                <span
                  className="text-[11px] font-mono font-semibold transition-colors duration-200"
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
            left: 9,
            top: (rowHeight - 18) / 2 + 9,
            width: 2,
            height: totalLineH,
            background: '#E2E8F0',
          }}
        />

        {/* Filled active connector line */}
        <motion.div
          className="absolute z-0 origin-top"
          style={{
            left: 9,
            top: (rowHeight - 18) / 2 + 9,
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
                top: getTop(i) + (rowHeight - (isCurrent ? 22 : 18)) / 2,
                width: isCurrent ? 22 : 18,
                height: isCurrent ? 22 : 18,
              }}
            >
              {isCurrent ? (
                <motion.div
                  key={`step-act-${i}`}
                  initial={{ scale: 0.7 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 450, damping: 20 }}
                  className="w-[22px] h-[22px] rounded-full flex items-center justify-center font-mono font-bold text-[11px] text-white shadow-sm ring-3 ring-sky-100"
                  style={{ background: '#0EA5E9' }}
                >
                  {i + 1}
                </motion.div>
              ) : isComplete ? (
                <div
                  className="w-[18px] h-[18px] rounded-full flex items-center justify-center font-mono font-bold text-[10px] text-white shadow-xs"
                  style={{ background: '#38BDF8' }}
                >
                  {i + 1}
                </div>
              ) : (
                <div
                  className="w-[18px] h-[18px] rounded-full flex items-center justify-center font-mono font-medium text-[9.5px] bg-white border border-gray-200 text-gray-400"
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
                top: getTop(i) + (rowHeight - 20) / 2,
                width: 20,
                height: 20,
              }}
            >
              {isCurrent ? (
                <motion.div
                  key={`sq-act-${i}`}
                  initial={{ scale: 0.75 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 450, damping: 20 }}
                  className="w-5 h-5 rounded-lg flex items-center justify-center font-mono font-bold text-[10.5px] text-white shadow-sm ring-2 ring-sky-200/80"
                  style={{ background: '#0EA5E9' }}
                >
                  {i + 1}
                </motion.div>
              ) : isComplete ? (
                <div
                  className="w-[19px] h-[19px] rounded-lg flex items-center justify-center font-mono font-bold text-[10px]"
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
                  className="w-[18px] h-[18px] rounded-lg flex items-center justify-center font-mono font-medium text-[10px]"
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
          const connTop = getTop(i) + (rowHeight + 18) / 2 - 3
          const nextNodeTop = getTop(i + 1) + (rowHeight - 18) / 2
          const connH = Math.max(2, nextNodeTop - connTop)

          return (
            <div
              key={`conn-${i}`}
              className="absolute z-0"
              style={{
                left: 9,
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
                top: getTop(i) + (rowHeight - 18) / 2,
                width: 18,
                height: 18,
              }}
            >
              {isComplete ? (
                <div className="w-[18px] h-[18px] rounded-full flex items-center justify-center bg-sky-400">
                  <svg viewBox="0 0 12 12" className="w-2.5 h-2.5">
                    <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  </svg>
                </div>
              ) : isCurrent ? (
                <motion.div
                  key={`node-active-${i}`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  className="w-[18px] h-[18px] rounded-full flex items-center justify-center bg-sky-400"
                >
                  <div className="w-2 h-2 rounded-full bg-white" />
                </motion.div>
              ) : (
                <div className="w-[14px] h-[14px] rounded-full border-2 border-gray-200 bg-white" />
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
            left: 9,
            top: (rowHeight - 18) / 2 + 9,
            width: 2,
            height: totalLineH,
            borderLeft: '2px dashed #CBD5E1',
          }}
        />

        {/* Filled dashed line */}
        <motion.div
          className="absolute z-0 origin-top overflow-hidden"
          style={{
            left: 9,
            top: (rowHeight - 18) / 2 + 9,
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
            width: 18,
            height: 18,
            background: '#38BDF8',
          }}
          animate={{ top: circleTop }}
          transition={{ type: 'spring', stiffness: 350, damping: 26 }}
        >
          <div className="w-2 h-2 rounded-full bg-white" />
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
            top: (rowHeight - 18) / 2 + 9,
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
              top: getTop(i) + (rowHeight - 18) / 2 + 8.5,
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
            top: (rowHeight - 18) / 2 + 9,
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
            left: 1,
            width: 18,
            height: 18,
            background: '#38BDF8',
          }}
          animate={{ top: circleTop }}
          transition={{ type: 'spring', stiffness: 350, damping: 26 }}
        >
          <div className="w-2 h-2 rounded-full bg-white" />
        </motion.div>
      </>
    )
  }

  if (lineStyle === 'dotted') {
    const startY = (rowHeight - 18) / 2 + 9
    return (
      <>
        {/* Base inactive dotted line */}
        <svg
          className="absolute z-0 pointer-events-none"
          style={{
            left: 0,
            top: 0,
            width: 20,
            height: totalLineH + startY + 10,
          }}
        >
          <line
            x1="10"
            y1={startY}
            x2="10"
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
            width: 20,
          }}
          animate={{ height: activeLineH }}
          transition={{ type: 'spring', stiffness: 350, damping: 28 }}
        >
          <svg
            className="pointer-events-none"
            style={{
              width: 20,
              height: totalLineH + 10,
            }}
          >
            <line
              x1="10"
              y1={0}
              x2="10"
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
            width: 18,
            height: 18,
            background: '#38BDF8',
          }}
          animate={{ top: circleTop }}
          transition={{ type: 'spring', stiffness: 350, damping: 26 }}
        >
          <div className="w-2 h-2 rounded-full bg-white" />
        </motion.div>
      </>
    )
  }

  if (lineStyle === 'segments' || lineStyle === 'chevron') {
    const startY = (rowHeight - 18) / 2 + 9
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
            width: 18,
            height: 18,
            background: '#38BDF8',
          }}
          animate={{ top: circleTop }}
          transition={{ type: 'spring', stiffness: 350, damping: 26 }}
        >
          <div className="w-2 h-2 rounded-full bg-white" />
        </motion.div>
      </>
    )
  }
  return (
    <>
      <div
        className="absolute z-0"
        style={{
          left: 9,
          top: (rowHeight - 18) / 2 + 9,
          width: 2,
          height: totalLineH,
          background: '#E5E7EB',
          borderRadius: 1,
        }}
      />
      <motion.div
        className="absolute z-0 origin-top"
        style={{
          left: 9,
          top: (rowHeight - 18) / 2 + 9,
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
          width: 18,
          height: 18,
          background: '#38BDF8',
        }}
        animate={{ top: circleTop }}
        transition={{ type: 'spring', stiffness: 350, damping: 26 }}
      >
        <div className="w-2 h-2 rounded-full bg-white" />
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
    <div className="ml-8 mr-1 my-1 pl-3 select-none border-l-1.5 border-slate-200/80 space-y-1">
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
            className="flex items-center justify-between py-1 px-1.5 rounded-lg transition-colors cursor-pointer hover:bg-slate-50/80 group"
            style={{ height: 24 }}
          >
            <div className="flex items-center gap-2 min-w-0">
              {/* Status indicator */}
              <div className="w-3 h-3 flex items-center justify-center shrink-0">
                {isSubDone ? (
                  <div className="w-2 h-2 rounded-full bg-sky-500" />
                ) : isSubCurrent ? (
                  <div className="relative w-2.5 h-2.5 flex items-center justify-center">
                    <span className="absolute w-2.5 h-2.5 rounded-full bg-sky-400 opacity-40 animate-ping" />
                    <span className="w-2 h-2 rounded-full bg-sky-500" />
                  </div>
                ) : (
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-300 group-hover:bg-slate-400 transition-colors" />
                )}
              </div>

              {/* Sub-step icon */}
              <div className="w-4 h-4 flex items-center justify-center shrink-0">
                {sub.icon ? (
                  <img
                    src={sub.icon}
                    alt=""
                    className="w-3.5 h-3.5 object-contain transition-opacity"
                    style={{ opacity: isSubCurrent || isSubDone ? 1 : 0.35 }}
                  />
                ) : (
                  <DriedSVG dim={!isSubDone && !isSubCurrent} />
                )}
              </div>

              {/* Sub-step label */}
              <span
                className="text-[12px] truncate transition-colors"
                style={{
                  color: isSubCurrent ? '#0F172A' : isSubDone ? '#475569' : '#94A3B8',
                  fontWeight: isSubCurrent ? 600 : 400,
                }}
              >
                {sub.label}
              </span>
            </div>

            {/* Right status text */}
            <span
              className="text-[10px] font-medium transition-colors"
              style={{
                color: isSubCurrent ? '#0284C7' : isSubDone ? '#64748B' : '#CBD5E1',
              }}
            >
              {isSubCurrent ? 'Active' : isSubDone ? 'Done' : ''}
            </span>
          </div>
        )
      })}
    </div>
  )
}

// ─── Process Design 2: Segments (Minimal 4-segment progress bar with micro-legend) ─
function ProcessSegmentsView({
  step,
  safeRawActive,
  isProcessExpanded,
  onToggleProcessExpanded,
  onSelectRawStep,
  isCurrent,
  isComplete,
  serviceIcons = [],
  overlap = false,
  badgeBorder = '#E2E8F0',
}) {
  const activeSubStepIndex = safeRawActive - step.startIndex
  const currentSub = step.subSteps[Math.max(0, Math.min(activeSubStepIndex, step.subSteps.length - 1))]

  return (
    <div className="flex flex-col flex-1 min-w-0 justify-center">
      {/* Top row: Label + arrow beside process + optional overlap service icons */}
      <div
        onClick={(e) => {
          e.stopPropagation()
          onToggleProcessExpanded?.()
        }}
        className="flex items-center justify-between gap-1.5 cursor-pointer select-none"
      >
        <div className="flex items-center gap-1.5 min-w-0">
          <span
            className="text-[13px] leading-tight transition-colors duration-200 shrink-0"
            style={{
              color: isCurrent ? '#141C3C' : isComplete ? '#6B7280' : '#D1D5DB',
              fontWeight: isCurrent ? 700 : 400,
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
            className={`w-3 h-3 transition-transform duration-200 shrink-0 ${
              isProcessExpanded ? 'rotate-180 text-sky-600' : isCurrent ? 'text-slate-500' : 'text-slate-300'
            }`}
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
          {isCurrent && overlap && serviceIcons.length > 0 && (
            <div className="flex items-center -space-x-1.5 shrink-0 ml-0.5">
              {serviceIcons.map((icon, idx) => (
                <div
                  key={idx}
                  className="w-4 h-4 rounded-full flex items-center justify-center bg-white ring-1 ring-white p-0.5 shadow-2xs"
                  style={{ border: `1px solid ${badgeBorder}` }}
                >
                  <img src={icon} alt="" className="w-full h-full object-contain rounded-full" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 4-Segment Progress Bar */}
      <div className="flex items-center gap-1 w-full max-w-[200px] mt-1.5">
        {step.subSteps.map((sub, sIdx) => {
          const isDone = safeRawActive > step.endIndex || activeSubStepIndex > sIdx
          const isActive = safeRawActive >= step.startIndex && safeRawActive <= step.endIndex && activeSubStepIndex === sIdx

          return (
            <button
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
            </button>
          )
        })}
      </div>

      {/* Expanded sub-steps mini-legend */}
      <AnimatePresence>
        {isProcessExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pt-2 flex items-center justify-between w-full max-w-[200px]">
              {step.subSteps.map((sub, sIdx) => {
                const isDone = safeRawActive > step.endIndex || activeSubStepIndex > sIdx
                const isActive = safeRawActive >= step.startIndex && safeRawActive <= step.endIndex && activeSubStepIndex === sIdx

                return (
                  <button
                    key={sub.label}
                    onClick={(e) => {
                      e.stopPropagation()
                      onSelectRawStep?.(step.startIndex + sIdx)
                    }}
                    className={`flex flex-col items-center gap-0.5 cursor-pointer transition-transform hover:scale-105 select-none ${
                      isActive ? 'text-sky-600 font-bold' : isDone ? 'text-slate-700 font-medium' : 'text-slate-400'
                    }`}
                  >
                    <span className="text-[9.5px] leading-tight">{sub.label}</span>
                    <span className="text-[8px] font-mono leading-none">
                      {isDone ? '✓' : isActive ? '●' : '○'}
                    </span>
                  </button>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Process Design 3: Pills (Clean Minimal Text Steps with 1-Tap Switching) ─────
function ProcessPillsView({
  step,
  safeRawActive,
  isProcessExpanded,
  onToggleProcessExpanded,
  onSelectRawStep,
  isCurrent,
  isComplete,
  serviceIcons = [],
  overlap = false,
  badgeBorder = '#E2E8F0',
}) {
  const activeSubStepIndex = safeRawActive - step.startIndex
  const currentSub = step.subSteps[Math.max(0, Math.min(activeSubStepIndex, step.subSteps.length - 1))]

  const subNotes = [
    'Sorting fabrics & colors',
    'Eco wash cycle at 30°C',
    'Gentle low-heat drying',
    'Hand steam-pressed & hung',
  ]

  return (
    <div className="flex flex-col flex-1 min-w-0 justify-center">
      {/* Top row: Label + arrow beside process + optional overlap service icons */}
      <div
        onClick={(e) => {
          e.stopPropagation()
          onToggleProcessExpanded?.()
        }}
        className="flex items-center justify-between gap-1.5 cursor-pointer select-none"
      >
        <div className="flex items-center gap-1.5 min-w-0">
          <span
            className="text-[13px] leading-tight transition-colors duration-200 shrink-0"
            style={{
              color: isCurrent ? '#141C3C' : isComplete ? '#6B7280' : '#D1D5DB',
              fontWeight: isCurrent ? 700 : 400,
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
            className={`w-3 h-3 transition-transform duration-200 shrink-0 ${
              isProcessExpanded ? 'rotate-180 text-sky-600' : isCurrent ? 'text-slate-500' : 'text-slate-300'
            }`}
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
          {isCurrent && overlap && serviceIcons.length > 0 && (
            <div className="flex items-center -space-x-1.5 shrink-0 ml-0.5">
              {serviceIcons.map((icon, idx) => (
                <div
                  key={idx}
                  className="w-4 h-4 rounded-full flex items-center justify-center bg-white ring-1 ring-white p-0.5 shadow-2xs"
                  style={{ border: `1px solid ${badgeBorder}` }}
                >
                  <img src={icon} alt="" className="w-full h-full object-contain rounded-full" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Horizontal Simple Text Row (No heavy pill backgrounds) */}
      <div className="flex items-center gap-1.5 mt-0.5 select-none overflow-x-auto no-scrollbar py-0.5">
        {step.subSteps.map((sub, sIdx) => {
          const isDone = safeRawActive > step.endIndex || activeSubStepIndex > sIdx
          const isActive = safeRawActive >= step.startIndex && safeRawActive <= step.endIndex && activeSubStepIndex === sIdx

          return (
            <Fragment key={sub.label}>
              {sIdx > 0 && (
                <span className="text-[9px] text-slate-300 font-normal select-none shrink-0">
                  ·
                </span>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onSelectRawStep?.(step.startIndex + sIdx)
                }}
                className="relative py-0.5 cursor-pointer select-none transition-all group shrink-0 active:scale-95"
              >
                <span
                  className={`text-[10.5px] tracking-tight transition-colors ${
                    isActive
                      ? 'text-sky-600 font-bold'
                      : isDone
                      ? 'text-slate-600 font-medium group-hover:text-slate-900'
                      : 'text-slate-400 font-normal group-hover:text-slate-500'
                  }`}
                >
                  {isDone ? '✓ ' : ''}{sub.label}
                </span>

                {/* Subtle active underline indicator */}
                {isActive && (
                  <motion.div
                    layoutId="process-text-underline"
                    className="absolute -bottom-0.5 left-0 right-0 h-[1.5px] bg-sky-500 rounded-full"
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  />
                )}
              </button>
            </Fragment>
          )
        })}
      </div>

      {/* Expanded contextual live detail (Clean text, no heavy card background) */}
      <AnimatePresence>
        {isProcessExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.18 }}
            className="overflow-hidden"
          >
            <div className="mt-1 flex items-center justify-between text-[10px] text-slate-500 pt-0.5 border-t border-slate-100/90">
              <div className="flex items-center gap-1.5 truncate">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-500 shrink-0" />
                <span className="font-semibold text-sky-950 shrink-0">
                  {currentSub ? currentSub.label : 'Status'}:
                </span>
                <span className="text-slate-600 truncate text-[9.5px]">
                  {subNotes[Math.max(0, Math.min(activeSubStepIndex, subNotes.length - 1))]}
                </span>
              </div>
              <span className="text-[9px] font-mono font-medium text-sky-600 shrink-0 ml-1.5">
                {activeSubStepIndex >= 0 ? `${activeSubStepIndex + 1}/${step.subSteps.length}` : 'Done'}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Status Design 1: Vertical list ──────────────────────────────────────────
function StatusList({
  steps = NINE_STEPS,
  activeStep,
  lineStyle = 'solid',
  rawActiveStep,
  processDesign = 'drawer',
  isProcessExpanded = false,
  onToggleProcessExpanded,
  onSelectRawStep,
}) {
  const ROW_H = 38
  const processGroup = steps.find(s => s.isProcessGroup)
  const processGroupIndex = steps.findIndex(s => s.isProcessGroup)
  const isCompact = processGroupIndex !== -1
  const subCount = processGroup?.subSteps?.length || 4

  const effectiveDrawerHeight = useMemo(() => {
    if (processDesign === 'segments') return 28
    if (processDesign === 'pills') return 20
    return subCount * 28 + 4
  }, [processDesign, subCount])

  const stepTops = useMemo(() => {
    if (!isCompact || !isProcessExpanded || processGroupIndex === -1) {
      return null
    }
    return steps.map((_, i) => {
      if (i <= processGroupIndex) {
        return i * ROW_H
      }
      return i * ROW_H + effectiveDrawerHeight
    })
  }, [isCompact, isProcessExpanded, processGroupIndex, effectiveDrawerHeight, steps.length, ROW_H])

  const safeRawActive = rawActiveStep ?? activeStep

  return (
    <div className="flex gap-2">
      <div className="flex-1 relative">
        <TimelineLine activeStep={activeStep} totalSteps={steps.length} rowHeight={ROW_H} lineStyle={lineStyle} stepTops={stepTops} />

        {/* Step rows */}
        {steps.map((step, i) => {
          const isCurrent  = i === activeStep
          const isComplete = i < activeStep

          if (step.isProcessGroup) {
            const activeSubStepIndex = safeRawActive - step.startIndex

            if (processDesign === 'segments') {
              return (
                <div key={step.label} className="relative flex flex-col justify-start">
                  <div className="relative flex items-center gap-3" style={{ minHeight: ROW_H }}>
                    <div className="shrink-0 z-10" style={{ width: 20 }} />
                    <div className="shrink-0 flex items-center justify-center" style={{ width: 26, height: 26 }}>
                      <img
                        src={isCurrent && activeSubStepIndex >= 0 && step.subSteps[activeSubStepIndex]?.icon ? step.subSteps[activeSubStepIndex].icon : step.icon}
                        alt={step.label}
                        className="w-[22px] h-[22px] object-contain transition-opacity duration-200"
                        style={{
                          opacity: isCurrent || isComplete ? 1 : 0.3,
                          filter: isCurrent
                            ? 'brightness(0) saturate(100%) invert(9%) sepia(39%) saturate(1800%) hue-rotate(205deg) brightness(95%) contrast(110%)'
                            : 'none',
                        }}
                      />
                    </div>
                    <ProcessSegmentsView
                      step={step}
                      safeRawActive={safeRawActive}
                      isProcessExpanded={isProcessExpanded}
                      onToggleProcessExpanded={onToggleProcessExpanded}
                      onSelectRawStep={onSelectRawStep}
                      isCurrent={isCurrent}
                      isComplete={isComplete}
                    />
                  </div>
                </div>
              )
            }

            if (processDesign === 'pills') {
              return (
                <div key={step.label} className="relative flex flex-col justify-start">
                  <div className="relative flex items-center gap-3" style={{ minHeight: ROW_H }}>
                    <div className="shrink-0 z-10" style={{ width: 20 }} />
                    <div className="shrink-0 flex items-center justify-center" style={{ width: 26, height: 26 }}>
                      <img
                        src={isCurrent && activeSubStepIndex >= 0 && step.subSteps[activeSubStepIndex]?.icon ? step.subSteps[activeSubStepIndex].icon : step.icon}
                        alt={step.label}
                        className="w-[22px] h-[22px] object-contain transition-opacity duration-200"
                        style={{
                          opacity: isCurrent || isComplete ? 1 : 0.3,
                          filter: isCurrent
                            ? 'brightness(0) saturate(100%) invert(9%) sepia(39%) saturate(1800%) hue-rotate(205deg) brightness(95%) contrast(110%)'
                            : 'none',
                        }}
                      />
                    </div>
                    <ProcessPillsView
                      step={step}
                      safeRawActive={safeRawActive}
                      isProcessExpanded={isProcessExpanded}
                      onToggleProcessExpanded={onToggleProcessExpanded}
                      onSelectRawStep={onSelectRawStep}
                      isCurrent={isCurrent}
                      isComplete={isComplete}
                    />
                  </div>
                </div>
              )
            }

            // Default compact design: Drawer
            return (
              <div key={step.label} className="relative flex flex-col justify-start">
                <div
                  onClick={() => onToggleProcessExpanded && onToggleProcessExpanded()}
                  className="relative flex items-center gap-3 cursor-pointer group"
                  style={{ height: ROW_H }}
                  title={isProcessExpanded ? 'Click to collapse process' : 'Click to expand process'}
                >
                  <div className="shrink-0 z-10" style={{ width: 20 }} />

                  {/* Icon */}
                  <div className="shrink-0 flex items-center justify-center" style={{ width: 26, height: 26 }}>
                    <img
                      src={isCurrent && activeSubStepIndex >= 0 && step.subSteps[activeSubStepIndex]?.icon ? step.subSteps[activeSubStepIndex].icon : step.icon}
                      alt={step.label}
                      className="w-[22px] h-[22px] object-contain transition-opacity duration-200"
                      style={{
                        opacity: isCurrent || isComplete ? 1 : 0.3,
                        filter: isCurrent
                          ? 'brightness(0) saturate(100%) invert(9%) sepia(39%) saturate(1800%) hue-rotate(205deg) brightness(95%) contrast(110%)'
                          : 'none',
                      }}
                    />
                  </div>

                  {/* Label + arrow beside process */}
                  <div className="flex items-center gap-1.5 flex-1 min-w-0">
                    <span
                      className="text-[13px] transition-colors duration-200 truncate"
                      style={{
                        color:      isCurrent ? '#141C3C' : isComplete ? '#6B7280' : '#D1D5DB',
                        fontWeight: isCurrent ? 700 : 400,
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
                      className={`w-3 h-3 transition-transform duration-200 shrink-0 ${
                        isProcessExpanded ? 'rotate-180 text-sky-600' : isCurrent ? 'text-slate-500' : 'text-slate-300'
                      }`}
                    >
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </div>
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
                      <ProcessSubStepsDrawer
                        subSteps={step.subSteps}
                        rawActiveStep={safeRawActive}
                        startIndex={step.startIndex}
                        endIndex={step.endIndex}
                        onSelectRawStep={onSelectRawStep}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          }

          return (
            <div
              key={step.label}
              className="relative flex items-center gap-3"
              style={{ height: ROW_H }}
            >
              {/* Spacer column where the line runs */}
              <div className="shrink-0 z-10" style={{ width: 20 }} />

              {/* Icon */}
              <div className="shrink-0 flex items-center justify-center" style={{ width: 26, height: 26 }}>
                {step.icon ? (
                  <img
                    src={step.icon}
                    alt={step.label}
                    className="w-[22px] h-[22px] object-contain transition-opacity duration-200"
                    style={{
                      opacity: isCurrent || isComplete ? 1 : 0.3,
                      filter: isCurrent
                        ? 'brightness(0) saturate(100%) invert(9%) sepia(39%) saturate(1800%) hue-rotate(205deg) brightness(95%) contrast(110%)'
                        : 'none',
                    }}
                  />
                ) : (
                  <DriedSVG dim={!isCurrent && !isComplete} />
                )}
              </div>

              {/* Label */}
              <span
                className="text-[13px] transition-colors duration-200"
                style={{
                  color:      isCurrent ? '#141C3C' : isComplete ? '#6B7280' : '#D1D5DB',
                  fontWeight: isCurrent ? 700 : 400,
                }}
              >
                {step.label}
              </span>
            </div>
          )
        })}
      </div>

      {/* QR Code on the right */}
      <div className="shrink-0 flex flex-col items-center gap-1.5" style={{ paddingTop: 2 }}>
        <div className="overflow-hidden border border-gray-200 rounded-xl bg-white p-1.5 shadow-xs flex items-center justify-center" style={{ width: 66, height: 66 }}>
          <QRCodeSVG />
        </div>
        <span className="text-center text-gray-400 font-medium leading-tight" style={{ fontSize: 9 }}>
          Click for<br />details
        </span>
      </div>
    </div>
  )
}

// ─── Status Design 2: Vertical list with service icon below active step ─────
function StatusStepper({
  steps = NINE_STEPS,
  activeStep,
  serviceIcons = ['/service/clean and press.png'],
  serviceName = 'Clean & Press',
  badgeColor = '#F0FDF4',
  badgeBorder = '#BBF7D0',
  badgeText = '#166534',
  lineStyle = 'solid',
  showServiceText = true,
  overlap = false,
  rawActiveStep,
  processDesign = 'drawer',
  isProcessExpanded = false,
  onToggleProcessExpanded,
  onSelectRawStep,
}) {
  const ROW_H = 44
  const processGroup = steps.find(s => s.isProcessGroup)
  const processGroupIndex = steps.findIndex(s => s.isProcessGroup)
  const isCompact = processGroupIndex !== -1
  const subCount = processGroup?.subSteps?.length || 4

  const effectiveDrawerHeight = useMemo(() => {
    if (processDesign === 'segments') return 28
    if (processDesign === 'pills') return 20
    return subCount * 28 + 4
  }, [processDesign, subCount])

  const stepTops = useMemo(() => {
    if (!isCompact || !isProcessExpanded || processGroupIndex === -1) {
      return null
    }
    return steps.map((_, i) => {
      if (i <= processGroupIndex) {
        return i * ROW_H
      }
      return i * ROW_H + effectiveDrawerHeight
    })
  }, [isCompact, isProcessExpanded, processGroupIndex, effectiveDrawerHeight, steps.length, ROW_H])

  const safeRawActive = rawActiveStep ?? activeStep

  return (
    <div className="flex gap-2">
      <div className="flex-1 relative">
        <TimelineLine activeStep={activeStep} totalSteps={steps.length} rowHeight={ROW_H} lineStyle={lineStyle} stepTops={stepTops} />

        {/* Step rows */}
        {steps.map((step, i) => {
          const isCurrent  = i === activeStep
          const isComplete = i < activeStep

          if (step.isProcessGroup) {
            const activeSubStepIndex = safeRawActive - step.startIndex

            if (processDesign === 'segments') {
              return (
                <div key={step.label} className="relative flex flex-col justify-start">
                  <div className="relative flex items-center gap-2.5" style={{ minHeight: ROW_H }}>
                    <div className="shrink-0 z-10" style={{ width: 20 }} />
                    <div className="shrink-0 flex items-center justify-center" style={{ width: 24, height: 24 }}>
                      <img
                        src={isCurrent && activeSubStepIndex >= 0 && step.subSteps[activeSubStepIndex]?.icon ? step.subSteps[activeSubStepIndex].icon : step.icon}
                        alt={step.label}
                        className="w-[20px] h-[20px] object-contain transition-opacity duration-200"
                        style={{
                          opacity: isCurrent || isComplete ? 1 : 0.3,
                          filter: isCurrent
                            ? 'brightness(0) saturate(100%) invert(9%) sepia(39%) saturate(1800%) hue-rotate(205deg) brightness(95%) contrast(110%)'
                            : 'none',
                        }}
                      />
                    </div>
                    <ProcessSegmentsView
                      step={step}
                      safeRawActive={safeRawActive}
                      isProcessExpanded={isProcessExpanded}
                      onToggleProcessExpanded={onToggleProcessExpanded}
                      onSelectRawStep={onSelectRawStep}
                      isCurrent={isCurrent}
                      isComplete={isComplete}
                      serviceIcons={serviceIcons}
                      overlap={overlap}
                      badgeBorder={badgeBorder}
                    />
                  </div>
                </div>
              )
            }

            if (processDesign === 'pills') {
              return (
                <div key={step.label} className="relative flex flex-col justify-start">
                  <div className="relative flex items-center gap-2.5" style={{ minHeight: ROW_H }}>
                    <div className="shrink-0 z-10" style={{ width: 20 }} />
                    <div className="shrink-0 flex items-center justify-center" style={{ width: 24, height: 24 }}>
                      <img
                        src={isCurrent && activeSubStepIndex >= 0 && step.subSteps[activeSubStepIndex]?.icon ? step.subSteps[activeSubStepIndex].icon : step.icon}
                        alt={step.label}
                        className="w-[20px] h-[20px] object-contain transition-opacity duration-200"
                        style={{
                          opacity: isCurrent || isComplete ? 1 : 0.3,
                          filter: isCurrent
                            ? 'brightness(0) saturate(100%) invert(9%) sepia(39%) saturate(1800%) hue-rotate(205deg) brightness(95%) contrast(110%)'
                            : 'none',
                        }}
                      />
                    </div>
                    <ProcessPillsView
                      step={step}
                      safeRawActive={safeRawActive}
                      isProcessExpanded={isProcessExpanded}
                      onToggleProcessExpanded={onToggleProcessExpanded}
                      onSelectRawStep={onSelectRawStep}
                      isCurrent={isCurrent}
                      isComplete={isComplete}
                      serviceIcons={serviceIcons}
                      overlap={overlap}
                      badgeBorder={badgeBorder}
                    />
                  </div>
                </div>
              )
            }

            // Default compact design: Drawer
            return (
              <div key={step.label} className="relative flex flex-col justify-start">
                <div
                  onClick={() => onToggleProcessExpanded && onToggleProcessExpanded()}
                  className="relative flex items-center gap-2.5 cursor-pointer group"
                  style={{ height: ROW_H }}
                  title={isProcessExpanded ? 'Click to collapse process' : 'Click to expand process'}
                >
                  <div className="shrink-0 z-10" style={{ width: 20 }} />

                  {/* Icon */}
                  <div className="shrink-0 flex items-center justify-center" style={{ width: 24, height: 24 }}>
                    <img
                      src={isCurrent && activeSubStepIndex >= 0 && step.subSteps[activeSubStepIndex]?.icon ? step.subSteps[activeSubStepIndex].icon : step.icon}
                      alt={step.label}
                      className="w-[20px] h-[20px] object-contain transition-opacity duration-200"
                      style={{
                        opacity: isCurrent || isComplete ? 1 : 0.3,
                        filter: isCurrent
                          ? 'brightness(0) saturate(100%) invert(9%) sepia(39%) saturate(1800%) hue-rotate(205deg) brightness(95%) contrast(110%)'
                          : 'none',
                      }}
                    />
                  </div>

                  {/* Label + toggle badge */}
                  <div className="flex flex-col items-start flex-1 min-w-0 justify-center">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span
                        className="text-[13px] leading-tight transition-colors duration-200 shrink-0"
                        style={{
                          color:      isCurrent ? '#141C3C' : isComplete ? '#6B7280' : '#D1D5DB',
                          fontWeight: isCurrent ? 700 : 400,
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
                        className={`w-3 h-3 transition-transform duration-200 shrink-0 ${
                          isProcessExpanded ? 'rotate-180 text-sky-600' : isCurrent ? 'text-slate-500' : 'text-slate-300'
                        }`}
                      >
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </div>

                    {/* Service from /service/ folder ONLY on active step */}
                    {isCurrent && (
                      showServiceText ? (
                        <motion.div
                          initial={{ opacity: 0, y: -3, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{ duration: 0.2 }}
                          className="mt-1 flex items-center gap-1.5 px-2 py-0.5 rounded-full"
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
                                className="w-3.5 h-3.5 object-contain rounded-full bg-white ring-1 ring-white"
                              />
                            ))}
                          </div>
                          <span
                            className="text-[9px] font-semibold truncate"
                            style={{ color: badgeText }}
                          >
                            {serviceName}
                          </span>
                        </motion.div>
                      ) : overlap ? (
                        <motion.div
                          initial={{ opacity: 0, y: -3, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{ duration: 0.2 }}
                          className="mt-1 flex items-center -space-x-2 py-0.5"
                        >
                          {serviceIcons.map((icon, idx) => (
                            <div
                              key={idx}
                              className="relative w-[22px] h-[22px] rounded-full flex items-center justify-center p-0.5 ring-2 ring-white shadow-xs bg-white transition-transform hover:scale-115 hover:z-30 cursor-pointer"
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
                        <motion.div
                          initial={{ opacity: 0, y: -3, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{ duration: 0.2 }}
                          className="mt-1 flex items-center gap-1"
                        >
                          {serviceIcons.map((icon, idx) => (
                            <div
                              key={idx}
                              className="w-5 h-5 rounded-full flex items-center justify-center p-0.5"
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
                      <ProcessSubStepsDrawer
                        subSteps={step.subSteps}
                        rawActiveStep={safeRawActive}
                        startIndex={step.startIndex}
                        endIndex={step.endIndex}
                        onSelectRawStep={onSelectRawStep}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          }

          return (
            <div
              key={step.label}
              className="relative flex items-center gap-2.5"
              style={{ height: ROW_H }}
            >
              {/* Spacer column where the straight line runs */}
              <div className="shrink-0 z-10" style={{ width: 20 }} />

              {/* Status icon from /status/ folder */}
              <div className="shrink-0 flex items-center justify-center" style={{ width: 24, height: 24 }}>
                {step.icon ? (
                  <img
                    src={step.icon}
                    alt={step.label}
                    className="w-[20px] h-[20px] object-contain transition-opacity duration-200"
                    style={{
                      opacity: isCurrent || isComplete ? 1 : 0.3,
                      filter: isCurrent
                        ? 'brightness(0) saturate(100%) invert(9%) sepia(39%) saturate(1800%) hue-rotate(205deg) brightness(95%) contrast(110%)'
                        : 'none',
                    }}
                  />
                ) : (
                  <DriedSVG dim={!isCurrent && !isComplete} />
                )}
              </div>

              {/* Step info: Label, and ONLY ON ACTIVE: service below */}
              <div className="flex flex-col items-start flex-1 min-w-0 justify-center">
                <span
                  className="text-[13px] leading-tight transition-colors duration-200"
                  style={{
                    color:      isCurrent ? '#141C3C' : isComplete ? '#6B7280' : '#D1D5DB',
                    fontWeight: isCurrent ? 700 : 400,
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
                      className="mt-1 flex items-center gap-1.5 px-2 py-0.5 rounded-full"
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
                            className="w-3.5 h-3.5 object-contain rounded-full bg-white ring-1 ring-white"
                          />
                        ))}
                      </div>
                      <span
                        className="text-[9px] font-semibold truncate"
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
                          className="relative w-[22px] h-[22px] rounded-full flex items-center justify-center p-0.5 ring-2 ring-white shadow-xs bg-white transition-transform hover:scale-115 hover:z-30 cursor-pointer"
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
                          className="w-5 h-5 rounded-full flex items-center justify-center p-0.5"
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

      {/* QR Code on the right */}
      <div className="shrink-0 flex flex-col items-center gap-1.5" style={{ paddingTop: 2 }}>
        <div className="overflow-hidden border border-gray-200 rounded-xl bg-white p-1.5 shadow-xs flex items-center justify-center" style={{ width: 66, height: 66 }}>
          <QRCodeSVG />
        </div>
        <span className="text-center text-gray-400 font-medium leading-tight" style={{ fontSize: 9 }}>
          Click for<br />details
        </span>
      </div>
    </div>
  )
}


// ─── Service Pill Tabs Component for Multi-Service Orders (Only Icons) ───────────
function ServiceTabsBar({ subServices = [], activeSubId, onSelect }) {
  const isPair = subServices.length === 2

  return (
    <div
      className={`p-1 rounded-2xl bg-slate-100/90 grid ${
        isPair ? 'grid-cols-2' : 'grid-cols-5'
      } gap-1 mb-3 select-none`}
    >
      {subServices.map((sub) => {
        const isSelected = sub.id === activeSubId
        return (
          <button
            key={sub.id}
            onClick={() => onSelect(sub.id)}
            className="relative flex items-center justify-center py-2 px-2 rounded-xl transition-all select-none cursor-pointer active:scale-95"
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
              className="relative z-10 w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-all"
              style={{
                background: isSelected ? sub.badgeColor : 'transparent',
              }}
            >
              <img
                src={sub.serviceIcons[0]}
                alt={sub.serviceName}
                className="w-5 h-5 object-contain transition-opacity"
                style={{ opacity: isSelected ? 1 : 0.55 }}
              />
            </div>
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
    <div className="relative border-b border-slate-100/90 mb-3 select-none">
      <div className={`grid ${isPair ? 'grid-cols-2' : 'grid-cols-5'} gap-0`}>
        {subServices.map((sub) => {
          const isSelected = sub.id === activeSubId
          return (
            <button
              key={sub.id}
              onClick={() => onSelect(sub.id)}
              className="relative flex flex-col items-center justify-center pt-1.5 pb-2.5 transition-all select-none cursor-pointer group active:scale-95"
              title={sub.serviceName}
            >
              {/* Icon */}
              <div
                className="w-7 h-7 flex items-center justify-center transition-all duration-200"
                style={{
                  transform: isSelected ? 'scale(1.1)' : 'scale(0.95)',
                }}
              >
                <img
                  src={sub.serviceIcons[0]}
                  alt={sub.serviceName}
                  className="w-5 h-5 object-contain transition-opacity duration-200"
                  style={{ opacity: isSelected ? 1 : 0.35 }}
                />
              </div>

              {/* Label only for 2 services pair */}
              {isPair && (
                <span
                  className="text-[11px] mt-1 truncate max-w-full px-1 leading-none transition-colors"
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
                  className="absolute bottom-0 h-[2.5px] rounded-full"
                  style={{
                    background: sub.themeColor,
                    width: isPair ? 36 : 22,
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
    <div className="mb-3 select-none">
      <div className={`grid ${isPair ? 'grid-cols-2 gap-2' : 'grid-cols-5 gap-1.5'}`}>
        {subServices.map((sub) => {
          const isSelected = sub.id === activeSubId
          return (
            <button
              key={sub.id}
              onClick={() => onSelect(sub.id)}
              className="relative flex flex-col items-center justify-center py-1 rounded-xl transition-all cursor-pointer group active:scale-95"
              title={sub.serviceName}
            >
              {/* Ring token */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
                  isSelected
                    ? 'ring-2 ring-offset-2'
                    : 'border border-slate-200/80 bg-slate-50/60 group-hover:border-slate-300'
                }`}
                style={{
                  '--tw-ring-color': sub.themeColor,
                  background: isSelected ? sub.badgeColor : undefined,
                  transform: isSelected ? 'scale(1.05)' : 'scale(0.95)',
                }}
              >
                <img
                  src={sub.serviceIcons[0]}
                  alt={sub.serviceName}
                  className="w-4 h-4 object-contain transition-opacity duration-200"
                  style={{ opacity: isSelected ? 1 : 0.4 }}
                />
              </div>

              {/* Label for 2-service pair */}
              {isPair && (
                <span
                  className="text-[11px] mt-1 truncate max-w-full px-1 leading-none transition-colors"
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
    <div className="mb-3 select-none">
      <div className={`grid ${isPair ? 'grid-cols-2 gap-2' : 'grid-cols-5 gap-1.5'}`}>
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
                  isPair ? 'py-1.5 px-2.5 gap-1.5 rounded-full' : 'h-8 rounded-full'
                }`}
                style={{
                  borderWidth: '1.5px',
                  borderStyle: 'solid',
                  borderColor: isSelected ? sub.themeColor : 'rgba(226, 232, 240, 0.9)',
                  background: isSelected ? sub.badgeColor : '#FAFAFA',
                  transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                }}
              >
                <img
                  src={sub.serviceIcons[0]}
                  alt={sub.serviceName}
                  className="w-4 h-4 object-contain transition-opacity duration-200"
                  style={{ opacity: isSelected ? 1 : 0.4 }}
                />
                {isPair && (
                  <span
                    className="text-[11px] truncate leading-none transition-colors"
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
  statusStyle: propStatusStyle,
  setStatusStyle: propSetStatusStyle,
  lineStyle = 'solid',
  selectedSubId,
  onSelectSubId,
  multiServiceMode = 'minimal',
  setMultiServiceMode,
  processMode = 'default',
  setProcessMode,
  isProcessExpanded = false,
  onToggleProcessExpanded,
  onSelectRawStep,
}) {
  const [internalStatusStyle, setInternalStatusStyle] = useState('stepper')
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
  const safeActiveStep = Math.min(activeStep, stepsList.length - 1)
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
      <div className="relative flex items-center justify-center px-4 pb-2.5 shrink-0" style={{ paddingTop: 6 }}>
        <button className="absolute left-4 w-8 h-8 rounded-xl border border-gray-200 flex items-center justify-center shadow-xs bg-white hover:bg-gray-50 transition-colors">
          <svg viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2.5" strokeLinecap="round" className="w-4 h-4">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
        </button>
        <span className="text-[15px] font-semibold text-gray-800">Order details</span>
      </div>

      {/* Scrollable content */}
      <div
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
        className="flex-1 min-h-0 px-4 space-y-3 overflow-y-auto ios-scrollbar cursor-grab active:cursor-grabbing"
        style={{
          WebkitOverflowScrolling: 'touch',
          overscrollBehavior: 'contain',
        }}
      >
        {/* Order title + price */}
        <div className="flex items-start justify-between pt-1">
          <div>
            <h2 className="text-[18px] font-bold text-gray-900 tracking-tight">{service.title}</h2>
            <motion.span
              key={currentStep.label}
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1,    opacity: 1 }}
              className="inline-block mt-1 px-2.5 py-0.5 text-[11.5px] font-semibold text-white shadow-xs"
              style={{ background: '#0099FF', borderRadius: 12 }}
            >
              {currentStep.label}
            </motion.span>
          </div>
          <div className="text-right">
            <div className="text-[17px] font-bold text-gray-900 leading-tight">
              <span className="text-[11px] font-medium text-gray-500 mr-0.5 align-top">{service.currency}</span>
              {service.price}
            </div>
            <div className="text-[12px] text-gray-400 mt-0.5">{service.status || 'Pending'}</div>
          </div>
        </div>

        {/* Chat / Call */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <button
            className="flex items-center justify-center gap-2 py-2.5 text-white text-[13.5px] font-semibold active:scale-[0.98] transition-transform shadow-xs"
            style={{ background: '#0A1C6A', borderRadius: 12 }}
          >
            <span>Chat</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z" strokeLinejoin="round"/>
            </svg>
          </button>
          <button
            className="flex items-center justify-center gap-2 py-2.5 text-slate-900 text-[13.5px] font-semibold active:scale-[0.98] transition-transform shadow-xs"
            style={{ background: '#00E5BE', borderRadius: 12 }}
          >
            <span>Call</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
              <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.42 1.18 2 2 0 012.41 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 8.34a16 16 0 006.75 6.75l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* Status section */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-baseline gap-1.5 min-w-0">
              <h3 className="text-[15px] font-bold text-gray-900 shrink-0">Status</h3>
              {isTabsMode && activeDisplayService && (
                <span className="text-[12px] font-medium text-slate-400 truncate">
                  · {activeDisplayService.serviceName}
                </span>
              )}
            </div>
            {isTabsMode && activeDisplayService && (
              <span
                className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full shrink-0"
                style={{
                  background: activeDisplayService.badgeColor,
                  color: activeDisplayService.themeColor,
                }}
              >
                {displaySteps.length} steps
              </span>
            )}
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
                />
              )}
              {currentStyle === 'stepper' && (
                <StatusStepper
                  steps={displaySteps}
                  activeStep={displayActiveStep}
                  rawActiveStep={safeActiveStep}
                  serviceIcons={activeDisplayService.serviceIcons}
                  serviceName={activeDisplayService.serviceName}
                  badgeColor={activeDisplayService.badgeColor}
                  badgeBorder={activeDisplayService.badgeBorder}
                  badgeText={activeDisplayService.badgeText}
                  lineStyle={lineStyle}
                  showServiceText={true}
                  processDesign={processDesign}
                  isProcessExpanded={isProcessExpanded}
                  onToggleProcessExpanded={onToggleProcessExpanded}
                  onSelectRawStep={onSelectRawStep}
                />
              )}
              {(currentStyle === 'service-icon' || currentStyle === 'cards') && (
                <StatusStepper
                  steps={displaySteps}
                  activeStep={displayActiveStep}
                  rawActiveStep={safeActiveStep}
                  serviceIcons={activeDisplayService.serviceIcons}
                  serviceName={activeDisplayService.serviceName}
                  badgeColor={activeDisplayService.badgeColor}
                  badgeBorder={activeDisplayService.badgeBorder}
                  badgeText={activeDisplayService.badgeText}
                  lineStyle={lineStyle}
                  showServiceText={false}
                  processDesign={processDesign}
                  isProcessExpanded={isProcessExpanded}
                  onToggleProcessExpanded={onToggleProcessExpanded}
                  onSelectRawStep={onSelectRawStep}
                />
              )}
              {currentStyle === 'overlap' && (
                <StatusStepper
                  steps={displaySteps}
                  activeStep={displayActiveStep}
                  rawActiveStep={safeActiveStep}
                  serviceIcons={activeDisplayService.serviceIcons}
                  serviceName={activeDisplayService.serviceName}
                  badgeColor={activeDisplayService.badgeColor}
                  badgeBorder={activeDisplayService.badgeBorder}
                  badgeText={activeDisplayService.badgeText}
                  lineStyle={lineStyle}
                  showServiceText={false}
                  overlap={true}
                  processDesign={processDesign}
                  isProcessExpanded={isProcessExpanded}
                  onToggleProcessExpanded={onToggleProcessExpanded}
                  onSelectRawStep={onSelectRawStep}
                />
              )}
              {!['list', 'track', 'stepper', 'service-icon', 'overlap', 'cards'].includes(currentStyle) && (
                <StatusStepper
                  steps={displaySteps}
                  activeStep={displayActiveStep}
                  rawActiveStep={safeActiveStep}
                  serviceIcons={activeDisplayService.serviceIcons}
                  serviceName={activeDisplayService.serviceName}
                  badgeColor={activeDisplayService.badgeColor}
                  badgeBorder={activeDisplayService.badgeBorder}
                  badgeText={activeDisplayService.badgeText}
                  lineStyle={lineStyle}
                  showServiceText={false}
                  overlap={true}
                  processDesign={processDesign}
                  isProcessExpanded={isProcessExpanded}
                  onToggleProcessExpanded={onToggleProcessExpanded}
                  onSelectRawStep={onSelectRawStep}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ETA banner */}
        <div className="flex items-center gap-3 px-4 py-3" style={{ background: '#EDF2FE', borderRadius: 16 }}>
          <div className="w-5 h-5 rounded-full border-1.5 border-slate-800 flex items-center justify-center shrink-0">
            <svg viewBox="0 0 12 12" className="w-3 h-3">
              <path d="M2.5 6.5l2.5 2.5 4.5-5" stroke="#1E293B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-[13px] font-bold text-gray-800 leading-tight">Estimated time arrival</span>
            {(activeDisplayService.id === 'press-only' || activeDisplayService.id === 'bags-shoes') && (
              <span className="text-[11px] text-gray-500 font-medium mt-0.5">09 Sep 2026 (11:00 - 14:00)</span>
            )}
          </div>
        </div>

        {/* Drop-off banner for press-only and bags-shoes matching screenshot */}
        {(activeDisplayService.id === 'press-only' || activeDisplayService.id === 'bags-shoes') && (
          <div className="flex items-center gap-3 px-4 py-3" style={{ background: '#EDF2FE', borderRadius: 16 }}>
            <div className="w-5 h-5 flex items-center justify-center shrink-0 text-slate-800">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                <rect x="8" y="2" width="9" height="14" rx="1.5" />
                <path d="M11 13h3" />
                <path d="M4 17l4-2 3.5 1" />
                <path d="M3 20c2.5-.8 5.5-.8 8.5-.8h3a2 2 0 002-2" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-[13px] font-bold text-gray-800 leading-tight">Drop-off</span>
              <span className="text-[11px] text-gray-500 font-medium mt-0.5">In Person</span>
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

// ─── iPhone Shell ─────────────────────────────────────────────────────────────
function IPhoneShell({ children }) {
  return (
    <div className="relative shrink-0" style={{ width: 300, height: 640 }}>
      {/* Volume buttons */}
      <div className="absolute rounded-l-sm" style={{ left: -5, top: 90,  width: 4, height: 28, background: '#555' }} />
      <div className="absolute rounded-l-sm" style={{ left: -5, top: 128, width: 4, height: 28, background: '#555' }} />
      <div className="absolute rounded-l-sm" style={{ left: -5, top: 166, width: 4, height: 28, background: '#555' }} />
      {/* Power button */}
      <div className="absolute rounded-r-sm" style={{ right: -5, top: 120, width: 4, height: 52, background: '#555' }} />

      {/* Frame */}
      <div
        className="rounded-[44px] overflow-hidden"
        style={{
          width: 300,
          height: 640,
          padding: 10,
          background: 'linear-gradient(160deg, #2a2a2a 0%, #1a1a1a 100%)',
          boxShadow: '0 0 0 1px #444, inset 0 0 0 1px #333, 0 40px 80px rgba(0,0,0,0.4)',
        }}
      >
        <div
          className="rounded-[36px] overflow-hidden bg-white relative flex flex-col"
          style={{ width: 280, height: 620 }}
        >
          {/* Dynamic Island — overlays the status bar center */}
          <div
            className="absolute z-20"
            style={{ top: 10, left: '50%', transform: 'translateX(-50%)', width: 96, height: 26, background: '#000', borderRadius: 20 }}
          />

          {/* Status bar sits at the very top, same row as Dynamic Island */}
          <StatusBar />

          {/* Screen content below the status bar */}
          <div className="flex-1 min-h-0 flex flex-col relative overflow-hidden h-full">
            {children}
          </div>
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
      return p.get('tab') || '2-service'
    }
    return '2-service'
  })
  const [activeStep,       setActiveStep]       = useState(() => {
    if (typeof window !== 'undefined') {
      const p = new URLSearchParams(window.location.search)
      const s = p.get('step')
      if (s !== null) return parseInt(s, 10)
    }
    return 1
  })
  const [statusStyle,      setStatusStyle]      = useState('overlap')
  const [lineStyle,        setLineStyle]        = useState('numbers')
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
      return p.get('processMode') || 'default'
    }
    return 'default'
  }) // 'default' | 'compact'
  const [isProcessExpanded, setIsProcessExpanded] = useState(() => {
    if (typeof window !== 'undefined') {
      const p = new URLSearchParams(window.location.search)
      return p.get('processExpanded') === 'true'
    }
    return false
  })
  const [simulating,       setSimulating]       = useState(false)
  const [selectedSubId,    setSelectedSubId]    = useState(null)
  const intervalRef = useRef(null)
  const active = tabs.find(t => t.id === activeTab)
  const activeService = servicesData[activeTab]

  // Multi-service sub-service tracking
  const isMultiService = Boolean(activeService?.subServiceIds && activeService.subServiceIds.length > 1)
  const effectiveSubId = isMultiService
    ? (selectedSubId && activeService.subServiceIds.includes(selectedSubId) ? selectedSubId : activeService.subServiceIds[0])
    : null

  const isTabsMode = isMultiService && multiServiceMode !== 'default'
  const activeSubService = (isTabsMode && effectiveSubId) ? servicesData[effectiveSubId] : null

  const currentSteps = activeSubService?.steps || activeService?.steps || NINE_STEPS
  const safeActiveStep = Math.min(activeStep, currentSteps.length - 1)

  function startSimulate() {
    if (simulating) {
      clearInterval(intervalRef.current)
      setSimulating(false)
      setActiveStep(0)
      return
    }
    setActiveStep(0)
    setSimulating(true)
    let step = 0
    intervalRef.current = setInterval(() => {
      step += 1
      if (step >= currentSteps.length) {
        clearInterval(intervalRef.current)
        setSimulating(false)
        setTimeout(() => setActiveStep(0), 1200)
        return
      }
      setActiveStep(step)
    }, 1400)
  }

  const prevActiveTabRef = useRef(activeTab)
  // Cleanup on tab change
  useEffect(() => {
    if (prevActiveTabRef.current === activeTab) {
      return
    }
    prevActiveTabRef.current = activeTab
    clearInterval(intervalRef.current)
    setSimulating(false)
    setActiveStep(0)
    const nextService = servicesData[activeTab]
    if (nextService?.subServiceIds?.length > 0) {
      setSelectedSubId(nextService.subServiceIds[0])
    } else {
      setSelectedSubId(null)
    }
  }, [activeTab])

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-start py-8 px-4 sm:px-6 overflow-y-auto" style={{ background: '#F0F4F8' }}>

      {/* Page title */}
      <div className="mb-6 text-center shrink-0">
        <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Order Flow</h1>
        <p className="text-sm text-gray-400 mt-0.5">Select a service to preview</p>
      </div>

      {/* Main card */}
      <div className="flex rounded-3xl overflow-hidden shadow-2xl my-auto" style={{ background: '#fff', height: 760 }}>

        {/* ── Left sidebar ── */}
        <div
          className="flex flex-col gap-1 p-3 shrink-0"
          style={{ width: 150, background: '#F8FAFC', borderRight: '1px solid #E9EEF4' }}
        >
          {/* Header */}
          <div className="flex items-center gap-2 px-2 py-3 mb-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: '#1B2F6E' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="w-4 h-4">
                <path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="text-[13px] font-bold text-gray-700">Services</span>
          </div>

          {/* Tab items */}
          {tabs.map(tab => {
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="relative flex flex-col items-center gap-1.5 w-full py-3 px-2 rounded-2xl transition-all duration-200"
                style={{ background: isActive ? tab.color : 'transparent' }}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-accent"
                    className="absolute left-0 top-3 bottom-3 rounded-r-full"
                    style={{ width: 3, background: tab.dot }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <div
                  className="w-11 h-11 rounded-2xl flex items-center justify-center overflow-hidden transition-all duration-200"
                  style={{
                    background:  isActive ? '#fff' : '#F1F5F9',
                    boxShadow:   isActive ? `0 2px 8px ${tab.dot}30` : 'none',
                  }}
                >
                  {tab.icon
                    ? <img src={tab.icon} alt={tab.label} className="w-9 h-9 object-contain" />
                    : <span className="text-lg font-bold" style={{ color: tab.dot }}>{tab.short}</span>
                  }
                </div>
                <span className="text-[11px] font-semibold leading-tight text-center"
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
          className="flex-1 flex flex-col items-center justify-center px-8 py-5 gap-4 h-full"
          style={{ background: `linear-gradient(135deg, ${active.color}80 0%, #fff 60%)` }}
        >
          {/* Label above phone */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center overflow-hidden" style={{ background: active.color }}>
              {active.icon
                ? <img src={active.icon} alt="" className="w-7 h-7 object-contain" />
                : <span className="text-sm font-bold" style={{ color: active.dot }}>{active.short}</span>
              }
            </div>
            <div>
              <div className="text-base font-bold text-gray-800">{active.label}</div>
              <div className="text-xs text-gray-400">Order details preview</div>
            </div>
          </div>

          {/* Phone + Simulate side by side */}
          <div className="flex items-center gap-6 shrink-0" style={{ height: 640 }}>

            {/* Phone */}
            <div className="shrink-0" style={{ width: 300, height: 640 }}>
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
                        activeStep={activeStep}
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
                        onSelectRawStep={setActiveStep}
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

            {/* Simulate panel — available for activeService */}
            {activeService && (
              <div className="flex flex-col items-center justify-start py-1 gap-2 shrink-0 overflow-y-auto no-scrollbar" style={{ width: 140, height: 640 }}>

                {/* Multi-Service section — visible for 2-service and 5-service */}
                {isMultiService && (
                  <div className="flex flex-col items-center gap-1.5 p-2 rounded-2xl bg-white border border-gray-100 shadow-sm w-full">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Multi-Service</span>
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
                          className={`py-1 px-1 rounded-lg text-[9px] font-bold transition-all text-center cursor-pointer ${
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
                <div className="flex flex-col items-center gap-1.5 p-2 rounded-2xl bg-white border border-gray-100 shadow-sm w-full">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Layout</span>
                  <div className="grid grid-cols-2 gap-1 w-full">
                    {styleOptions.map(opt => (
                      <button
                        key={opt.id}
                        onClick={() => setStatusStyle(opt.id)}
                        className="py-1 px-0.5 rounded-lg text-[9px] font-bold transition-all text-center leading-tight cursor-pointer"
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
                <div className="flex flex-col items-center gap-1.5 p-2 rounded-2xl bg-white border border-gray-100 shadow-sm w-full">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Process</span>
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
                          className="py-1 px-1 rounded-lg text-[9px] font-bold transition-all text-center cursor-pointer"
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
                <div className="flex flex-col items-center gap-1.5 p-2 rounded-2xl bg-white border border-gray-100 shadow-sm w-full">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Line Style</span>
                  <div className="grid grid-cols-2 gap-1 w-full">
                    {lineStyles.map((opt, i) => (
                      <button
                        key={opt.id}
                        onClick={() => setLineStyle(opt.id)}
                        className={`py-1 px-1 rounded-lg text-[10px] font-bold transition-all text-center ${
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

                {/* Simulate button */}
                <motion.button
                  onClick={startSimulate}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.93 }}
                  className="flex flex-col items-center gap-1.5 px-4 py-2.5 rounded-2xl text-white font-bold text-xs w-full cursor-pointer shadow-xs"
                  style={{
                    background: simulating
                      ? 'linear-gradient(135deg, #0EA5E9, #0284C7)'
                      : 'linear-gradient(135deg, #38BDF8, #0EA5E9)',
                  }}
                >
                  {simulating ? (
                    <motion.svg
                      viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"
                      animate={{ rotate: [0, 180, 360] }}
                      transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                    >
                      <path d="M12 4V2A10 10 0 0 0 2 12h2a8 8 0 0 1 8-8z"/>
                    </motion.svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                      <path d="M8 5.14v14l11-7-11-7z"/>
                    </svg>
                  )}
                  <span>{simulating ? 'Stop' : 'Simulate'}</span>
                </motion.button>

                {/* Step progress bar with fixed height container so 7 vs 9 dots never changes height */}
                <div className="flex flex-col gap-[4px] items-center justify-center shrink-0" style={{ height: 75 }}>
                  {currentSteps.map((s, i) => (
                    <motion.div
                      key={s.label}
                      animate={{
                        width:      i === safeActiveStep ? 24 : 8,
                        background: i < safeActiveStep  ? '#0EA5E9'
                                  : i === safeActiveStep ? '#38BDF8'
                                  : '#E5E7EB',
                        opacity: i <= safeActiveStep ? 1 : 0.4,
                      }}
                      transition={{ duration: 0.35, type: 'spring', stiffness: 300, damping: 24 }}
                      className="rounded-full"
                      style={{ height: 5 }}
                    />
                  ))}
                </div>

                {/* Step label with fixed height container */}
                <div className="h-7 flex items-center justify-center shrink-0">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`${activeTab}-${effectiveSubId || ''}-${safeActiveStep}`}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{    opacity: 0, y: -4 }}
                      transition={{ duration: 0.15 }}
                      className="text-center"
                    >
                      <div className="text-[10.5px] font-bold leading-tight" style={{ color: '#0EA5E9' }}>
                        {processMode !== 'default' && isProcessStep(currentSteps[safeActiveStep])
                          ? `Process · ${currentSteps[safeActiveStep]?.label}`
                          : (currentSteps[safeActiveStep]?.label || '')}
                      </div>
                      <div className="text-[9.5px] text-gray-400 font-mono">
                        {safeActiveStep + 1} / {currentSteps.length}
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
