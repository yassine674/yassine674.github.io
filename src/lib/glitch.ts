// The glitch of the reference site, same algorithm: the element is cut by a grid of 32x8px
// cells, in parts of 320px. When a part glitches it starts (after a random 0-200ms) fully
// dissolved and re-materialises over 0.35s: with `progress` going 1 -> 0 linearly, a cell is
// hidden while 0.5*random + 0.5*progress > 0.5.
// The reference draws this as an SVG mask; here it is a `clip-path: path()` with the hidden
// cells as even-odd holes. It is computed from numbers and applied synchronously, so unlike a
// mask built from an image there is nothing to decode or load, and nothing can stay invisible.
const CELL_W = 32
const CELL_H = 8
const PART_W = 320
const PARTS = 3
const DURATION = 350

export function createGlitch(root: HTMLElement) {
  const progress = new Array(PARTS).fill(0)
  const busy = new Array(PARTS).fill(false)
  const cooldown = new Array(PARTS).fill(0) // a part ignores new triggers for 2x its duration
  const timers: number[] = []
  let raf = 0
  let destroyed = false

  const clear = () => {
    root.style.clipPath = ""
  }

  const paint = () => {
    const w = root.offsetWidth
    const h = root.offsetHeight
    if (!w || !h) return
    let d = `M0 0H${w}V${h}H0Z`
    for (let p = 0; p < PARTS; p++) {
      if (!busy[p]) continue
      const xe = Math.min(w, (p + 1) * PART_W)
      for (let x = p * PART_W; x < xe; x += CELL_W) {
        const cw = Math.min(CELL_W, xe - x)
        for (let y = 0; y < h; y += CELL_H) {
          if (0.5 * Math.random() + 0.5 * progress[p] > 0.5) d += `M${x} ${y}h${cw}v${Math.min(CELL_H, h - y)}h${-cw}z`
        }
      }
    }
    root.style.clipPath = `path(evenodd,"${d}")`
  }

  const frame = () => {
    if (destroyed) return
    const now = performance.now()
    let any = false
    for (let p = 0; p < PARTS; p++) {
      if (!busy[p]) continue
      const t = (now - cooldown[p] + 2 * DURATION) / DURATION // cooldown[p] holds start + 2*DURATION
      progress[p] = 1 - Math.min(Math.max(t, 0), 1)
      if (t >= 1) busy[p] = false
      else any = true
    }
    paint()
    if (any) raf = requestAnimationFrame(frame)
    else clear()
  }

  const start = (p: number) => {
    if (destroyed || busy[p] || performance.now() < cooldown[p]) return
    busy[p] = true
    progress[p] = 1
    cooldown[p] = performance.now() + 2 * DURATION
    cancelAnimationFrame(raf)
    raf = requestAnimationFrame(frame)
  }

  return {
    // every part, each starting after its own random delay
    all() {
      for (let p = 0; p < PARTS; p++) timers.push(window.setTimeout(() => start(p), Math.random() * 200))
    },
    // the part under the pointer
    at(clientX: number) {
      const r = root.getBoundingClientRect()
      start(Math.min(PARTS - 1, Math.max(0, Math.floor((clientX - r.left) / PART_W))))
    },
    destroy() {
      destroyed = true
      timers.forEach(clearTimeout)
      cancelAnimationFrame(raf)
      clear()
    },
  }
}
