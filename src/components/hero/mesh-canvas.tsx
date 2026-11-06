"use client"

import { useEffect, useRef } from "react"
import { useIntro } from "@/components/intro-context"
import maskData from "./mask-points.json"

// A single motif: a mesh that builds itself, from the top down, into a hooded figure wearing the
// Anonymous mask. mask-points.json is read from the picture "Masque anonyme en réseau néon": the nodes
// are its dots, the lines are the thin lines it draws between them, and the triangles take the tone of
// the picture where they sit, so the mask is bright and the hood almost black. Once built it stays
// alive: the pointer lights what it touches, the eyes follow it, the face smiles when it reaches the
// hood, loose triangles float in the air, and a click sends a wave through everything.

type Edge = [number, number]

const GREEN = "0,255,0"
const EYE_TRAVEL = 1.6 // how far the eyes move, in mask units
const REACH = 150 // px, pointer influence
// how the motif appears once the page is revealed: its nodes fly in and join with their lines, so the mask
// first shows as a net of dots; then the whole motif switches on like a screen that starts badly (it flickers,
// slices tear sideways with green flashes) and the picture of the mask comes on with it
const BUILD_MS = 1100 // time one node takes to reach its place
const SPREAD_MS = 900 // ...and the build is spread over this long, top to bottom
const POWER_MS = 1400 // the switching on, from the end of the flight until the motif is stable
const START_DELAY_MS = 900 // after the page is revealed

// node kinds in mask-points.json: 0 = the face, 2 = the hood, 4 = a loose green spark
const SPARK = 4
// where the face sits in the picture, in mask units (the picture is 100 wide, 125 tall)
const FACE = { cx: 49.4, cy: 52, rx: 20.5, ry: 29 }
const EYE_Y = 43.5
const SOCKET = { rx: 2.6, ry: 1.0, dy: -0.15 } // the eye socket around each eye point, in mask units
// the winning laugh when the pointer arrives: one short smug "huh", a smaller one, then the mouth stays half open on the grin,
// while the head lifts a little so that he looks down on the visitor
const HUH: [number, number, number][] = [[200, 180, 1], [760, 200, 0.55]] // [centre ms, half width ms, strength]
const TILT = 0.06 // how much the lower face shortens when the head lifts (chin up)
const TILT_PIVOT = 40 // mask units: the head lifts around the brow
const tiltY = (y: number, t: number) => TILT_PIVOT + (y - TILT_PIVOT) * (1 - TILT * t) - 0.6 * t
// the slit of the mouth, read from the picture: the dark line between the moustache and the lit lower lip,
// as (x, y) points in mask units from left to right (it curves up at both corners, like the smile)
const SLIT: [number, number][] = [[36.7, 61.2], [38.7, 61.9], [40.7, 62.5], [43.7, 63.0], [47.7, 63.0], [51.7, 62.7], [55.7, 62.4], [59.7, 61.8], [63.7, 60.7], [65.7, 59.8]]
const slitY = (x: number) => {
  if (x <= SLIT[0][0]) return SLIT[0][1]
  for (let q = 1; q < SLIT.length; q++) {
    const [x1, y1] = SLIT[q]
    if (x <= x1) {
      const [x0, y0] = SLIT[q - 1]
      return y0 + ((y1 - y0) * (x - x0)) / (x1 - x0)
    }
  }
  return SLIT[SLIT.length - 1][1]
}
const MOUTH_OPEN = 2.2 // how far the jaw drops when the pointer is on the motif, in mask units
// the mask is drawn with the picture itself (public/mask-face.webp, cut from the reference along the mask outline):
// its pixel (ax, ay) is the reference pixel (ax + 320, ay + 390); 10 reference pixels = 1 mask unit
const FACE_IMG = { src: "/mask-face.webp", x0: 320, y0: 390, w: 440, h: 610 }
const srcX = (ux: number) => (ux - 50) * 10 + 543 - FACE_IMG.x0
const srcY = (uy: number) => (uy - 62.5) * 10 + 795 - FACE_IMG.y0

// Small seeded PRNG so the layout is stable between renders.
const rng = (seed: number) => () => {
  seed = (seed * 1664525 + 1013904223) % 4294967296
  return seed / 4294967296
}

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  r: number
  born: number
  life: number
  rot: number
  spin: number
}
interface P3 {
  x: number
  y: number
  z: number
}
interface Mesh {
  pts: P3[] // nodes, then the two eyes
  hood: boolean[] // per node: part of the hood (or a loose spark)
  light: number[] // per node: 0..1, how light the picture is there
  green: number[] // per node: 0..1, how green the picture is there (the lit rim of the hood)
  n: number // nodes before the eyes
  tris: [number, number, number][]
  tone: number[] // per triangle: 0-255, brightness of the picture there
  tint: number[] // per triangle: 0..1, how green the picture is there
  edges: Edge[]
  edgeLight: number[] // per edge: 0..1, how bright its line is in the picture
  contour: boolean[] // per edge: the picture draws a line there
  short: boolean[] // per edge: shorter than 2 mask units (the rings of dots around the features)
  rimEdge: boolean[] // per edge: part of the lit green rim of the hood (one clean line, no fans)
  adj: number[][] // per node: edges touching it
  pulse: number[] // nodes of the mask that pulse green
  litTris: number[] // triangles of the mask that may flash green
  floaters: [number, number][][] // loose triangles floating around the figure
  faceTris: [number, number, number][] // triangles that carry the picture of the mask
}

// brightness 0-255 -> 0..1
const lightOf = (t: number) => Math.pow(Math.min(1, t / 215), 1.1)

function buildMesh(seed: number): Mesh {
  const r = rng(seed)
  const kinds = maskData.nodes.map((n) => n[2])
  const pts: P3[] = maskData.nodes.map(([x, y]) => ({ x, y, z: (r() * 2 - 1) * 2 }))
  const hood = kinds.map((k) => k !== 0)
  const green = maskData.nodes.map((n) => n[3])

  const tris: [number, number, number][] = maskData.tris.map(([a, b, c]) => [a, b, c])
  const tone = maskData.tris.map((t) => t[3])
  const tint = maskData.tris.map((t) => t[4])

  // how light each node is: the mean tone of the triangles that touch it
  const nodeSum = pts.map(() => 0)
  const nodeCnt = pts.map(() => 0)
  const edges: Edge[] = []
  const edgeIndex = new Map<string, number>()
  tris.forEach(([a, b, c], t) => {
    for (const v of [a, b, c]) {
      nodeSum[v] += tone[t]
      nodeCnt[v]++
    }
    for (const [i, j] of [[a, b], [b, c], [c, a]] as Edge[]) {
      const k = i < j ? `${i}-${j}` : `${j}-${i}`
      if (!edgeIndex.has(k)) {
        edgeIndex.set(k, edges.length)
        edges.push([i, j])
      }
    }
  })
  const light = pts.map((_, i) => lightOf(nodeCnt[i] ? nodeSum[i] / nodeCnt[i] : 0))

  // the lines the picture draws between its dots
  const contour = edges.map(() => false)
  const edgeLight = edges.map(() => 0)
  for (const [i, j, strength] of maskData.lines) {
    const key = i < j ? `${i}-${j}` : `${j}-${i}`
    let e = edgeIndex.get(key)
    if (e === undefined) {
      e = edges.length
      edgeIndex.set(key, e)
      edges.push([i, j])
      contour.push(false)
      edgeLight.push(0)
    }
    contour[e] = true
    edgeLight[e] = strength
  }
  // the green rim is a single clean line: among the short edges between green nodes, each node keeps its two shortest
  const rimEdge = edges.map(() => false)
  {
    const cand = edges
      .map((_, e) => e)
      .filter((e) => {
        const [i, j] = edges[e]
        return contour[e] && hood[i] && hood[j] && green[i] > 0.3 && green[j] > 0.3 && Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y) < 6.5
      })
      .sort((a, b) => Math.hypot(pts[edges[a][0]].x - pts[edges[a][1]].x, pts[edges[a][0]].y - pts[edges[a][1]].y) - Math.hypot(pts[edges[b][0]].x - pts[edges[b][1]].x, pts[edges[b][0]].y - pts[edges[b][1]].y))
    const deg = pts.map(() => 0)
    for (const e of cand) {
      const [i, j] = edges[e]
      if (deg[i] >= 2 || deg[j] >= 2) continue
      deg[i]++
      deg[j]++
      rimEdge[e] = true
    }
  }
  const short = edges.map(([i, j]) => Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y) < 2)
  const adj: number[][] = pts.map(() => [])
  edges.forEach(([i, j], e) => {
    adj[i].push(e)
    adj[j].push(e)
  })
  const litTris = tris.map((_, t) => t).filter((t) => tone[t] > 80)
  const maskNodes = pts.map((_, i) => i).filter((i) => !hood[i] && light[i] > 0.25)
  const pulse: number[] = [] // no pulsing nodes: the picture's face has no green specks
  void maskNodes

  // the two glowing eyes
  const n = pts.length
  maskData.eyes.forEach(([x, y]) => {
    pts.push({ x, y, z: 0 })
    hood.push(false)
    light.push(1)
    green.push(0)
  })
  return { pts, hood, light, green, n, tris, tone, tint, edges, edgeLight, contour, short, rimEdge, adj, pulse, litTris, floaters: maskData.floaters as [number, number][][], faceTris: maskData.facetris as [number, number, number][] }
}

const smoothstep = (t: number) => t * t * (3 - 2 * t)
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3)
const clamp01 = (v: number) => Math.min(1, Math.max(0, v))

// how a point of the mask moves when it smiles and laughs (mask units): the corners of the mouth lift,
// and everything below the slit (lower lip, chin) drops, while the moustache and the sides of the jaw stay
const deform = (x: number, y: number, smile: number, open: number): [number, number] => {
  const dx = x - FACE.cx
  const band = smoothstep(clamp01((y - 53) / 5)) * (1 - smoothstep(clamp01((y - 71) / 5)))
  const side = Math.min(1, Math.abs(dx) / 15) * (1 - smoothstep(clamp01((Math.abs(dx) - 17) / 4)))
  // the left corner of the open mouth closes sooner than the right one, so the grin is a little lopsided there
  const corner = dx < 0 ? 1 - smoothstep(clamp01((-dx - 3) / 6)) : 1 - smoothstep(clamp01((dx - 4) / 7))
  const jaw = smoothstep(clamp01((y - slitY(x)) / 0.4)) * corner
  return [x + dx * 0.02 * smile * band, tiltY(y - 3.2 * smile * band * Math.pow(side, 1.1) + MOUTH_OPEN * open * jaw, smile)]
}

export default function MeshCanvas({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const { revealed } = useIntro()
  const revealAt = useRef<number | null>(null)

  // the build starts when the page is revealed
  useEffect(() => {
    if (revealed && revealAt.current === null) revealAt.current = performance.now()
  }, [revealed])

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !ctx) return

    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const mesh = buildMesh(11)
    const faceImg = new Image()
    let faceReady = false
    faceImg.onload = () => (faceReady = true)
    faceImg.src = FACE_IMG.src

    // where each node starts: scattered across the screen, as an offset from its place
    // fake depth: the face is in front, the hood behind, so turning the head shifts them against each other
    // how firmly each node of the hood holds onto the mask: 1 right around it, 0 on the outer parts of the hood
    const hug = mesh.pts.map((q) => 1 - smoothstep(clamp01((Math.hypot((q.x - FACE.cx) / FACE.rx, (q.y - FACE.cy) / FACE.ry) - 1.05) / 0.9)))
    // the edges that run along the outline of the mask: they catch the green light too
    // the outer nodes of the hood: where the aura leaves the figure
    const rimNodes = mesh.pts
      .map((_, i) => i)
      .filter((i) => i < mesh.n && mesh.hood[i] && ((mesh.pts[i].x - FACE.cx) / FACE.rx) ** 2 + ((mesh.pts[i].y - FACE.cy) / FACE.ry) ** 2 > 3.2 && mesh.adj[i].some((e) => mesh.contour[e]))
    const faceRim = mesh.edges.map(([i, j], e) => {
      if (!mesh.contour[e] || mesh.hood[i] || mesh.hood[j]) return false
      const q = (k: number) => ((mesh.pts[k].x - FACE.cx) / FACE.rx) ** 2 + ((mesh.pts[k].y - FACE.cy) / FACE.ry) ** 2
      return q(i) > 0.72 && q(j) > 0.72
    })
    const puffs: Particle[] = []
    const shards: Particle[] = []
    const glitches: { x: number; y: number; w: number; h: number; born: number }[] = []
    // columns of falling binary in the air, mostly on both sides of the figure (x in mask units)
    const rr0 = rng(23)
    const rain = Array.from({ length: 26 }, () => {
      const side = rr0() < 0.5 ? -1 : 1
      return { x: 50 + side * (20 + rr0() * 52), phase: rr0() * 1.4, speed: 0.05 + rr0() * 0.08, len: 5 + Math.floor(rr0() * 9), alpha: 0.25 + rr0() * 0.35, seed: Math.floor(rr0() * 100) }
    })
    const sr = rng(5)
    const scatter = mesh.pts.map(() => ({ x: (sr() * 2 - 1) * 700, y: (sr() * 2 - 1) * 450 }))

    let w = 0
    let h = 0
    let raf = 0
    let last = 0
    let flashClock = 0

    const mouse = { x: -1e4, y: -1e4, on: false }
    let hover = 0 // 0..1, how much the pointer is on the face
    let wasOnHood = false
    let laughStart = -1e9
    let hitBeats = 0 // which "huh" of the laugh already shook the page
    let tearUntil = 0
    let smileV = 0 // 0..1, the smile: grows while the pointer is on the face, stays, fades when it leaves
    // the glitch of the mask at rest: now and then a few slices of it jump sideways for a moment
    let glitchUntil = 0
    let nextGlitch = 0
    let glitchBands: { y: number; h: number; dx: number }[] = []
    const look = { x: 0, y: 0 } // where the eyes look, in mask units (eases toward the pointer)
    const waves: { x: number; y: number; t0: number }[] = []
    const off = mesh.pts.map(() => ({ x: 0, y: 0, vx: 0, vy: 0 }))
    const flashes: { tri: number; born: number }[] = []

    // each face triangle draws its own piece of the picture, mapped onto where its corners are now
    // deformed masks are kept, one small canvas per step of smile and opening, so the laugh does not redraw every frame
    const faceCaches = new Map<string, HTMLCanvasElement>()
    const drawFaceTris = (fc: CanvasRenderingContext2D, pts: { x: number; y: number; prog: number }[]) => {
      for (const [i, j, k] of mesh.faceTris) {
        const a = Math.min(pts[i].prog, pts[j].prog, pts[k].prog)
        if (a <= 0) continue
        const s0 = mesh.pts[i]
        const s1 = mesh.pts[j]
        const s2 = mesh.pts[k]
        const x0 = srcX(s0.x), y0 = srcY(s0.y), x1 = srcX(s1.x), y1 = srcY(s1.y), x2 = srcX(s2.x), y2 = srcY(s2.y)
        const den = x0 * (y1 - y2) - x1 * (y0 - y2) + x2 * (y0 - y1)
        if (Math.abs(den) < 1e-6) continue
        const d0 = pts[i], d1 = pts[j], d2 = pts[k]
        // affine map picture -> screen: u = A x + C y + E, v = B x + D y + F
        const A = (d0.x * (y1 - y2) - d1.x * (y0 - y2) + d2.x * (y0 - y1)) / den
        const C = (x0 * (d1.x - d2.x) - x1 * (d0.x - d2.x) + x2 * (d0.x - d1.x)) / den
        const E = (x0 * (y1 * d2.x - y2 * d1.x) - x1 * (y0 * d2.x - y2 * d0.x) + x2 * (y0 * d1.x - y1 * d0.x)) / den
        const B = (d0.y * (y1 - y2) - d1.y * (y0 - y2) + d2.y * (y0 - y1)) / den
        const D = (x0 * (d1.y - d2.y) - x1 * (d0.y - d2.y) + x2 * (d0.y - d1.y)) / den
        const F = (x0 * (y1 * d2.y - y2 * d1.y) - x1 * (y0 * d2.y - y2 * d0.y) + x2 * (y0 * d1.y - y1 * d0.y)) / den
        const cx = (d0.x + d1.x + d2.x) / 3
        const cy = (d0.y + d1.y + d2.y) / 3
        const grow = (q: { x: number; y: number }) => {
          const dx = q.x - cx
          const dy = q.y - cy
          const l = Math.hypot(dx, dy) || 1
          return [q.x + (dx / l) * 0.7, q.y + (dy / l) * 0.7]
        }
        fc.save()
        fc.globalAlpha = a * a
        fc.beginPath()
        fc.moveTo(...(grow(d0) as [number, number]))
        fc.lineTo(...(grow(d1) as [number, number]))
        fc.lineTo(...(grow(d2) as [number, number]))
        fc.closePath()
        fc.clip()
        fc.transform(A, B, C, D, E, F)
        fc.drawImage(faceImg, 0, 0)
        fc.restore()
      }
    }

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = canvas.clientWidth
      h = canvas.clientHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const toLocal = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect()
      return { x: e.clientX - r.left, y: e.clientY - r.top }
    }
    const onMove = (e: PointerEvent) => {
      const p = toLocal(e)
      mouse.x = p.x
      mouse.y = p.y
      mouse.on = true
    }
    const onLeave = () => (mouse.on = false)
    const onDown = (e: PointerEvent) => {
      const p = toLocal(e)
      if (p.x < 0 || p.y < 0 || p.x > w || p.y > h) return
      waves.push({ ...p, t0: performance.now() })
    }

    // how strongly a point is lit by the pointer and by click waves (0..1)
    const lit = (x: number, y: number, now: number) => {
      let g = 0
      if (mouse.on) {
        const d = Math.hypot(x - mouse.x, y - mouse.y)
        g = Math.pow(Math.max(0, 1 - d / REACH), 2.2)
      }
      for (const wv of waves) {
        const age = (now - wv.t0) / 1100
        if (age >= 1) continue
        const d = Math.hypot(x - wv.x, y - wv.y)
        g = Math.max(g, Math.exp(-(((d - age * 520) / 38) ** 2)) * (1 - age))
      }
      return g
    }

    const draw = (now: number) => {
      raf = requestAnimationFrame(draw)
      const dt = Math.min((now - last) / 16.7 || 1, 3)
      last = now
      ctx.clearRect(0, 0, w, h)
      for (let i = waves.length - 1; i >= 0; i--) if (now - waves[i].t0 > 1200) waves.splice(i, 1)

      // nothing until the page is revealed
      if (revealAt.current === null) return
      const since = now - revealAt.current - START_DELAY_MS
      if (since < 0 && !still) return

      // ── layout ──
      const narrow = w < 900
      const size = Math.min(h * 0.7, w * (narrow ? 1.05 : 0.4)) / 125
      const fx = (narrow ? 0.6 : 0.77) * w
      const fy = 0.53 * h

      // ── nodes, each flying in to its place ──
      const doneAt = SPREAD_MS + BUILD_MS
      // nodes: how much of the picture of the mask is shown (0 while only the nodes and lines are there)
      // the switching on: the motif flickers on and off, more and more on, until it stays; the picture of the mask
      // is on from the start of it (it flickers with the rest)
      const power = still ? 1 : clamp01((since - doneAt) / POWER_MS)
      const facePic = since >= doneAt || still ? 1 : 0
      if (!still && since >= doneAt - 400) {
        canvas.style.transition = "none" // the page's slow fade-in of the motif would smooth the flicker away
        const beat = Math.floor(since / 55)
        const on = power >= 1 || ((beat * 2654435761) >>> 0) % 100 > 80 - 80 * power
        canvas.style.opacity = power >= 1 ? "" : on ? (0.55 + 0.45 * power).toFixed(2) : "0.08"
        if (power < 1 && on && Math.random() < 0.45) tearUntil = now + 60
      }
      const faceNet = !faceReady || facePic < 1 // the nodes and lines of the mask are drawn (before the picture takes over)
      const built = still ? 1 : clamp01((since - doneAt - POWER_MS * 0.6) / 400)
      // the pointer is on the face: it smiles once and the eyes widen
      const mux = 50 + (mouse.x - fx) / size
      const muy = 62.5 + (mouse.y - fy) / size
      // the smile (and the hood turning) start as soon as the pointer reaches the hood, before it touches the face
      const onHood = mouse.on && !still && built >= 1 && ((mux - 49) / 56) ** 2 + ((muy - 62) / 64) ** 2 < 1
      hover += ((onHood ? 1 : 0) - hover) * 0.1 * dt
      smileV += ((onHood ? 1 : 0) - smileV) * (onHood ? 0.07 : 0.035) * dt
      const smile = smoothstep(clamp01(smileV))
      // the evil laugh: when the pointer arrives the jaw beats (ha, ha, ha), then the mouth stays half open on the smile
      if (onHood && !wasOnHood) {
        laughStart = now
        hitBeats = 0
      }
      wasOnHood = onHood
      const laughT = now - laughStart
      const laugh = HUH.reduce((sum, [c, half, k]) => sum + (Math.abs(laughT - c) < half ? k * 0.5 * (1 + Math.cos((Math.PI * (laughT - c)) / half)) : 0), 0)
      const open = smile * (0.35 + 0.65 * laugh)
      // each "huh" shakes the whole page: the name glitches and the motif tears for a moment
      for (const [q, [c]] of HUH.entries()) {
        // only during a laugh (the pointer just arrived), never on the first frames of the page
        if (laughT >= c - 40 && laughT < c + 400 && !(hitBeats & (1 << q)) && !still) {
          hitBeats |= 1 << q
          tearUntil = now + 170
          if (q === 0) window.dispatchEvent(new Event("title-glitch"))
          const hero = canvas.closest(".hero")
          hero?.setAttribute("data-glitch", "true")
          setTimeout(() => hero?.removeAttribute("data-glitch"), 260)
        }
      }
      // the neon state: the whole hood lights up green while the pointer is on it
      const neon = smoothstep(clamp01(hover))
      // the eyes follow the pointer
      if (mouse.on && !still) {
        const dx = mux - FACE.cx
        const dy = muy - EYE_Y
        const d = Math.hypot(dx, dy) || 1
        const k = Math.min(1, d / 60) * EYE_TRAVEL
        look.x += ((dx / d) * k - look.x) * 0.1 * dt
        look.y += ((dy / d) * k - look.y) * 0.1 * dt
      } else {
        look.x -= look.x * 0.06 * dt
        look.y -= look.y * 0.06 * dt
      }
      const pts = mesh.pts.map((p0, i) => {
        let p = p0
        if (i >= mesh.n) p = { x: p0.x + look.x, y: tiltY(p0.y, smile) + look.y, z: p0.z }
        else if (smile > 0 && !mesh.hood[i]) {
          const [x, y] = deform(p0.x, p0.y, smile, open)
          p = { x, y, z: p0.z }
        }
        const delay = still ? 0 : (p.y / 125) * SPREAD_MS
        const prog = still ? 1 : clamp01((since - delay) / BUILD_MS)
        const e = easeOut(prog)
        const isHood = i < mesh.n && mesh.hood[i]
        const bx = fx + (p.x - 50) * size
        // the hood around the mask lifts with the head
        const py = isHood && smile > 0 ? p.y + (tiltY(p.y, smile) - p.y) * hug[i] : p.y
        const by = fy + (py - 62.5) * size + (still || !isHood ? 0 : Math.sin(now / 2400 + i) * 1.6)
        const sx = bx + scatter[i].x * (1 - e)
        const sy = by + scatter[i].y * (1 - e)
        // the pointer pushes nodes away; a spring brings them back
        const n = off[i]
        if (!still && prog >= 1) {
          if (mouse.on && isHood && hug[i] < 1) {
            const dx = sx + n.x - mouse.x
            const dy = sy + n.y - mouse.y
            const d = Math.hypot(dx, dy) || 1
            if (d < REACH) {
              // the hood around the mask stays on it; only its outer parts are pushed
              const f = (1 - d / REACH) * 1.4 * (1 - hug[i])
              n.vx += (dx / d) * f
              n.vy += (dy / d) * f
            }
          }
          n.vx = (n.vx - n.x * 0.07) * 0.84
          n.vy = (n.vy - n.y * 0.07) * 0.84
          n.x += n.vx * dt
          n.y += n.vy * dt
        }
        const x = sx + n.x
        const y = sy + n.y
        return { x, y, z: p.z / 6, prog, g: lit(x, y, now) }
      })

      // the aura: green mist and green triangles leave the outline of the hood and drift away from the figure
      if (neon > 0.25 && !still && built >= 1 && rimNodes.length) {
        const cxs = fx + (FACE.cx - 50) * size
        const cys = fy + (FACE.cy - 62.5) * size
        const spawn = (list: Particle[], chance: number, make: (x: number, y: number, ax: number, ay: number) => Particle) => {
          if (Math.random() < chance * neon * dt && list.length < 60) {
            const pt = pts[rimNodes[Math.floor(Math.random() * rimNodes.length)]]
            const dx = pt.x - cxs
            const dy = pt.y - cys
            const d = Math.hypot(dx, dy) || 1
            list.push(make(pt.x, pt.y, dx / d + (Math.random() - 0.5) * 0.7, dy / d + (Math.random() - 0.5) * 0.7))
          }
        }
        spawn(puffs, 0.5, (x, y, ax, ay) => ({ x, y, vx: ax * (0.15 + Math.random() * 0.3), vy: ay * (0.15 + Math.random() * 0.3), r: 14 + Math.random() * 26, born: now, life: 2200 + Math.random() * 1500, rot: 0, spin: 0 }))
        spawn(shards, 0.22, (x, y, ax, ay) => ({ x, y, vx: ax * (0.3 + Math.random() * 0.6), vy: ay * (0.3 + Math.random() * 0.6), r: 6 + Math.random() * 14, born: now, life: 1800 + Math.random() * 1800, rot: Math.random() * 6.28, spin: (Math.random() - 0.5) * 0.04 }))
      }
      for (let q = puffs.length - 1; q >= 0; q--) {
        const f = puffs[q]
        const age = (now - f.born) / f.life
        if (age >= 1) {
          puffs.splice(q, 1)
          continue
        }
        f.x += f.vx * dt
        f.y += f.vy * dt
        const rad = f.r * (1 + age * 1.2)
        const gr = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, rad)
        gr.addColorStop(0, `rgba(40,255,80,${(0.13 * Math.sin(age * Math.PI) * Math.max(neon, 0.2)).toFixed(3)})`)
        gr.addColorStop(1, "rgba(40,255,80,0)")
        ctx.fillStyle = gr
        ctx.fillRect(f.x - rad, f.y - rad, rad * 2, rad * 2)
      }

      // facets float loose in the air: each one is a little smaller than its triangle and drifts a bit,
      // a few drift much more, so the picture is only suggested by them and the nodes hold it together
      const facet = (t: number, fill: string, shrink: number) => {
        const [i, j, k] = mesh.tris[t]
        const cxm = (pts[i].x + pts[j].x + pts[k].x) / 3
        const cym = (pts[i].y + pts[j].y + pts[k].y) / 3
        const far = t % 11 === 0
        const ph = t * 1.7
        const amp = still ? 0 : far ? 3 : 0.7
        const ox = Math.sin(now / 1700 + ph) * amp
        const oy = Math.cos(now / 2100 + ph) * amp
        const rot = still || !far ? 0 : Math.sin(now / 2600 + ph) * 0.35
        const cr = Math.cos(rot)
        const sr = Math.sin(rot)
        ctx.fillStyle = fill
        ctx.beginPath()
        for (const [n, v] of [i, j, k].entries()) {
          const dx = (pts[v].x - cxm) * shrink
          const dy = (pts[v].y - cym) * shrink
          const x = cxm + ox + dx * cr - dy * sr
          const y = cym + oy + dx * sr + dy * cr
          if (n === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        ctx.closePath()
        ctx.fill()
      }
      mesh.tris.forEach(([i, j, k], t) => {
        const a = Math.min(pts[i].prog, pts[j].prog, pts[k].prog)
        if (a <= 0) return
        const shimmer = still ? 1 : 1 + 0.2 * Math.sin(now / 900 + t * 0.9)
        // brighter near the pointer, so the picture reads more clearly where you look
        const near = mouse.on ? Math.pow(Math.max(0, 1 - Math.hypot((pts[i].x + pts[j].x + pts[k].x) / 3 - mouse.x, (pts[i].y + pts[j].y + pts[k].y) / 3 - mouse.y) / 230), 1.3) : 0
        const inHood = mesh.hood[i] && mesh.hood[j] && mesh.hood[k]
        if (!mesh.hood[i] && !mesh.hood[j] && !mesh.hood[k]) return
        // the hood takes its light from the reference (the lit strip on the right and over the top, the folds at the neck), darkest next to the face
        const base = Math.min(1, (mesh.tone[t] / 255) * (inHood ? 1.05 : 0.92))
        const tn = inHood ? mesh.tint[t] : 0
        const wc = Math.round(255 * (1 - 0.85 * tn))
        facet(t, `rgba(${wc},255,${wc},${((base * (1 + 1.2 * tn) * shimmer * (1 + 0.9 * near)) * Math.pow(a, 10)).toFixed(3)})`, 0.97)
      })
      // ── green binary falling in the air around the figure, faint, a little stronger when the pointer is on the motif ──
      if (built > 0) {
        const fs = Math.max(12, size * 2.7)
        ctx.font = `${fs.toFixed(0)}px monospace`
        ctx.textAlign = "center"
        for (const col of rain) {
          const x = fx + (col.x - 50) * size
          const head = ((still ? col.phase : col.phase + (now / 1000) * col.speed * (1 + hover)) % 1.4) * 150 - 20
          for (let q = 0; q < col.len; q++) {
            const uy = head - q * 3
            if (uy < -10 || uy > 135) continue
            const fade = 1 - q / col.len
            const bit = (Math.floor(uy / 3) * 7 + col.seed) % 3 === 0 ? "1" : "0"
            ctx.fillStyle = `rgba(${q === 0 ? "190,255,190" : GREEN},${(fade * col.alpha * (0.6 + 0.6 * hover) * built).toFixed(3)})`
            ctx.fillText(bit, x, fy + (uy - 62.5) * size)
          }
        }
      }

      // ── the mask: the picture itself, carried by its triangles ──
      if (faceReady) {
        const deformed = !still && (built < 1 || smile > 0.002 || facePic < 1)
        if (!deformed) {
          // at rest the mask does not move: one draw of the whole picture
          const k = size / 10
          const ox = fx + (FACE_IMG.x0 - 543) * k
          const oy = fy + (FACE_IMG.y0 - 795) * k
          ctx.drawImage(faceImg, ox, oy, FACE_IMG.w * k, FACE_IMG.h * k)
          if (!still) {
            if (nextGlitch === 0) nextGlitch = now + 2500
            if (now > nextGlitch) {
              glitchUntil = now + 240
              nextGlitch = now + 2600 + Math.random() * 3200
              glitchBands = Array.from({ length: 3 + Math.floor(Math.random() * 3) }, () => ({
                y: 60 + Math.random() * 480,
                h: 8 + Math.random() * 34,
                dx: (Math.random() < 0.5 ? -1 : 1) * (12 + Math.random() * 22),
              }))
            }
            if (now < glitchUntil) {
              for (const band of glitchBands) {
                // the slice is cut out of its place, drawn shifted, with a green ghost on the other side
                ctx.clearRect(ox, oy + band.y * k, FACE_IMG.w * k, band.h * k)
                ctx.drawImage(faceImg, 0, band.y, FACE_IMG.w, band.h, ox + band.dx * k, oy + band.y * k, FACE_IMG.w * k, band.h * k)
                ctx.globalCompositeOperation = "lighter"
                ctx.globalAlpha = 0.35
                ctx.fillStyle = `rgb(${GREEN})`
                ctx.fillRect(ox - band.dx * 0.6 * k, oy + band.y * k, FACE_IMG.w * k * 0.8, Math.max(1, band.h * k * 0.25))
                ctx.globalAlpha = 1
                ctx.globalCompositeOperation = "source-over"
              }
            }
          }
        } else if (facePic < 1) {
          // before the switching on, the mask is only its net of nodes and lines
        } else {
          // while it smiles and laughs the mask is deformed: drawn once per step of smile and opening, then reused
          const k = size / 10
          const bx = fx + (FACE_IMG.x0 - 543) * k - 12
          const by = fy + (FACE_IMG.y0 - 795) * k - 12
          const bw = FACE_IMG.w * k + 24
          const bh = FACE_IMG.h * k + 60
          const key = `${Math.round(smile * 24)}|${Math.round(open * 12)}|${bx.toFixed(1)}|${by.toFixed(1)}|${size.toFixed(3)}`
          let fcv = faceCaches.get(key)
          if (!fcv) {
            const dpr = canvas.width / w
            fcv = document.createElement("canvas")
            fcv.width = Math.ceil(bw * dpr)
            fcv.height = Math.ceil(bh * dpr)
            const cc = fcv.getContext("2d")
            if (cc) {
              cc.setTransform(dpr, 0, 0, dpr, -bx * dpr, -by * dpr)
              drawFaceTris(cc, pts)
            }
            if (faceCaches.size > 60) faceCaches.delete(faceCaches.keys().next().value as string)
            faceCaches.set(key, fcv)
          }
          ctx.drawImage(fcv, bx, by, bw, bh)
        }
        // the inside of the open mouth: a smooth black shape between the upper lip and the dropped lower lip
        if (open > 0.01 && built >= 1) {
          const toScreen = ([ux, uy]: [number, number]): [number, number] => [fx + (ux - 50) * size, fy + (uy - 62.5) * size]
          const x0 = FACE.cx - 9 // the open part of the mouth stays narrow: the corners of the grin stay closed
          const x1 = FACE.cx + 11
          ctx.beginPath()
          for (let x = x0; x <= x1 + 1e-6; x += 0.5) ctx.lineTo(...toScreen(deform(x, slitY(x) - 0.3, smile, open)))
          for (let x = x1; x >= x0 - 1e-6; x -= 0.5) ctx.lineTo(...toScreen(deform(x, slitY(x) + 0.5, smile, open)))
          ctx.closePath()
          ctx.fillStyle = `rgba(2,2,2,${Math.min(1, open * 5).toFixed(3)})`
          ctx.fill()
        }
      }

      // patches of the mesh flash green now and then
      if (!still && built >= 1 && now - flashClock > 160) {
        flashClock = now
        flashes.push({ tri: mesh.litTris[Math.floor(Math.random() * mesh.litTris.length)], born: now })
        if (flashes.length > 10) flashes.shift()
      }
      for (const f of flashes) {
        const age = (now - f.born) / 800
        if (age >= 1) continue
        facet(f.tri, `rgba(${GREEN},${(0.16 * (1 - age)).toFixed(3)})`, 0.8)
      }

      // ── lines: brighter where the picture is light, green and thicker near the pointer ──
      const line = (e: number) => {
        const [i, j] = mesh.edges[e]
        const a = Math.min(pts[i].prog, pts[j].prog)
        if (a <= 0) return
        const hood = mesh.hood[i] && mesh.hood[j]
        const g = Math.max(pts[i].g, pts[j].g)
        const s = mesh.edgeLight[e]
        const rim = mesh.rimEdge[e] ? Math.min(mesh.green[i], mesh.green[j]) : 0
        const faceEdge = !mesh.hood[i] && !mesh.hood[j]
        if (!faceNet && faceEdge && g <= 0.3 && !(neon > 0.02 && faceRim[e])) return // the picture already draws them
        if (g > 0.3) {
          ctx.strokeStyle = `rgba(${GREEN},${((0.15 + 0.55 * g) * a * (hood ? 0.8 : 1)).toFixed(3)})`
          ctx.lineWidth = 0.8 + 0.7 * g
        } else if (rim > 0.3) {
          // the lit green rim of the hood
          ctx.shadowColor = `rgba(${GREEN},0.7)`
          ctx.shadowBlur = 3
          ctx.strokeStyle = `rgba(110,255,110,${((0.3 + 0.35 * rim) * a * a).toFixed(3)})`
          ctx.lineWidth = 0.7
        } else {
          ctx.strokeStyle = `rgba(255,255,255,${((hood ? (0.08 + 0.9 * s) * (1 - 0.55 * neon) : mesh.short[e] ? 0.14 + 0.35 * s : 0.025 + 0.12 * s) * a * a).toFixed(3)})`
          ctx.lineWidth = hood ? 0.6 : 0.7
        }
        ctx.beginPath()
        ctx.moveTo(pts[i].x, pts[i].y)
        ctx.lineTo(pts[j].x, pts[j].y)
        ctx.stroke()
        ctx.shadowBlur = 0
        // neon: the bright lines of the hood and the outline of the mask light up green, with a glow
        if (neon > 0.02 && (hood ? s > 0.22 : faceRim[e])) {
          ctx.shadowColor = `rgba(${GREEN},0.9)`
          ctx.shadowBlur = 9 * neon
          ctx.strokeStyle = `rgba(${GREEN},${(neon * (0.3 + 0.6 * s) * a * a).toFixed(3)})`
          ctx.lineWidth = hood ? 1.3 : 1.6
          ctx.beginPath()
          ctx.moveTo(pts[i].x, pts[i].y)
          ctx.lineTo(pts[j].x, pts[j].y)
          ctx.stroke()
          ctx.shadowBlur = 0
        }
      }
      mesh.edges.forEach((_, e) => {
        if (mesh.contour[e]) line(e)
      })

      // glitch bars: thin green streaks that flicker across the figure
      if (neon > 0.3 && !still) {
        if (Math.random() < 0.12 * neon) {
          glitches.push({ x: fx + (Math.random() * 130 - 85) * size, y: fy + (Math.random() * 120 - 62) * size, w: (14 + Math.random() * 30) * size, h: 1 + Math.random() * 3, born: now })
          if (glitches.length > 8) glitches.shift()
        }
      }
      for (let g = glitches.length - 1; g >= 0; g--) {
        const gl = glitches[g]
        const age = (now - gl.born) / 260
        if (age >= 1) {
          glitches.splice(g, 1)
          continue
        }
        ctx.fillStyle = `rgba(${GREEN},${(0.4 * (1 - age) * Math.max(neon, 0.3)).toFixed(3)})`
        ctx.fillRect(gl.x, gl.y, gl.w, gl.h)
      }

      // green triangles leaving the motif
      for (let q = shards.length - 1; q >= 0; q--) {
        const f = shards[q]
        const age = (now - f.born) / f.life
        if (age >= 1) {
          shards.splice(q, 1)
          continue
        }
        f.x += f.vx * dt
        f.y += f.vy * dt
        f.rot += f.spin * dt
        const alpha = Math.sin(age * Math.PI) * Math.max(neon, 0.25)
        ctx.beginPath()
        for (let m = 0; m < 3; m++) {
          const ang = f.rot + (m * Math.PI * 2) / 3
          const x = f.x + Math.cos(ang) * f.r
          const y = f.y + Math.sin(ang) * f.r
          if (m === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        ctx.closePath()
        ctx.fillStyle = `rgba(${GREEN},${(0.18 * alpha).toFixed(3)})`
        ctx.fill()
        ctx.shadowColor = `rgba(${GREEN},0.9)`
        ctx.shadowBlur = 8
        ctx.strokeStyle = `rgba(${GREEN},${(0.8 * alpha).toFixed(3)})`
        ctx.lineWidth = 1
        ctx.stroke()
        ctx.shadowBlur = 0
      }

      // soft glow under the pointer
      if (mouse.on) {
        const gr = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, REACH)
        gr.addColorStop(0, `rgba(${GREEN},0.07)`)
        gr.addColorStop(1, `rgba(${GREEN},0)`)
        ctx.fillStyle = gr
        ctx.fillRect(mouse.x - REACH, mouse.y - REACH, REACH * 2, REACH * 2)
      }

      // ── nodes: dots, brighter where the picture is light; some pulse green; lit green by the pointer ──
      const pulsing = new Set(mesh.pulse)
      for (let i = 0; i < mesh.n; i++) {
        const p = pts[i]
        if (p.prog <= 0) continue
        const hood = mesh.hood[i]
        const kind = maskData.nodes[i][2]
        if (!faceNet && !hood && p.g <= 0.4) continue // the picture already draws the dots of the mask
        if (p.g > 0.4 || (built >= 1 && pulsing.has(i))) {
          const pulse = still ? 1 : 0.6 + 0.4 * Math.sin(now / 420 + i)
          const k = p.g > 0.4 ? 0.3 + 0.5 * p.g : 0.3 + 0.6 * pulse
          ctx.fillStyle = `rgba(${GREEN},${(k * p.prog).toFixed(3)})`
          ctx.shadowColor = `rgba(${GREEN},0.9)`
          ctx.shadowBlur = 4 + 6 * Math.max(p.g, pulsing.has(i) ? pulse * 0.5 : 0)
          ctx.beginPath()
          ctx.arc(p.x, p.y, 1.4 + 1.2 * p.g, 0, Math.PI * 2)
          ctx.fill()
          ctx.shadowBlur = 0
        } else {
          const l = mesh.light[i]
          if (kind === SPARK) {
            // a loose green spark twinkling in the air
            const tw = still ? 1 : 0.5 + 0.5 * Math.sin(now / 700 + i * 1.9)
            ctx.fillStyle = `rgba(${GREEN},${((0.35 + 0.5 * tw) * p.prog).toFixed(3)})`
            ctx.shadowColor = `rgba(${GREEN},0.9)`
            ctx.shadowBlur = 6 + 10 * neon
            ctx.beginPath()
            ctx.arc(p.x, p.y, 1.3 + 1.2 * neon, 0, Math.PI * 2)
            ctx.fill()
            ctx.shadowBlur = 0
          } else if (mesh.green[i] > 0.35) {
            // the lit green rim of the hood
            ctx.fillStyle = `rgba(${GREEN},${((0.5 + 0.4 * mesh.green[i]) * p.prog).toFixed(3)})`
            ctx.shadowColor = `rgba(${GREEN},0.8)`
            ctx.shadowBlur = hood ? 8 : 2
            ctx.beginPath()
            ctx.arc(p.x, p.y, hood ? Math.min(1.5, Math.max(0.9, maskData.nodes[i][4] * 0.1 * size * 0.9)) : 0.9, 0, Math.PI * 2)
            ctx.fill()
            ctx.shadowBlur = 0
          } else {
            // the nodes are what draws the picture: clear white dots, brightest along the outline of the mask and the hood
            const alpha = (hood ? 0.55 + 0.4 * l : 0.7 + 0.3 * l) * (hood ? 1 - 0.45 * neon : 1)
            const dotR = Math.min(2.2, Math.max(0.7, maskData.nodes[i][4] * 0.1 * size * 1.15)) // the size of the dot in the picture
            ctx.fillStyle = `rgba(255,255,255,${(alpha * p.prog).toFixed(3)})`
            ctx.shadowColor = "rgba(255,255,255,0.7)"
            ctx.shadowBlur = dotR > 1.3 ? 5 : 0
            ctx.beginPath()
            ctx.arc(p.x, p.y, dotR, 0, Math.PI * 2)
            ctx.fill()
            ctx.shadowBlur = 0
          }
        }
      }

      // loose triangles floating in the air around the figure
      mesh.floaters.forEach((tri, q) => {
        const a = built * 0.6
        if (a <= 0) return
        const cx0 = tri.reduce((s0, v) => s0 + v[0], 0) / 3
        const cy0 = tri.reduce((s0, v) => s0 + v[1], 0) / 3
        const rot = still ? 0 : Math.sin(now / 3000 + q * 2.3) * 0.5
        const ox = still ? 0 : Math.sin(now / 2300 + q) * 7
        const oy = still ? 0 : Math.cos(now / 2700 + q * 1.7) * 7
        ctx.beginPath()
        tri.forEach(([ux, uy], m) => {
          const dx = ux - cx0
          const dy = uy - cy0
          const x = fx + (cx0 - 50 + dx * Math.cos(rot) - dy * Math.sin(rot)) * size + ox
          const y = fy + (cy0 - 62.5 + dx * Math.sin(rot) + dy * Math.cos(rot)) * size + oy
          if (m === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        })
        ctx.closePath()
        const wr = Math.round(255 * (1 - 0.85 * neon))
        const wb = Math.round(255 * (1 - 0.85 * neon))
        ctx.fillStyle = `rgba(${wr},255,${wb},${((0.07 + 0.1 * neon) * a).toFixed(3)})`
        ctx.fill()
        ctx.strokeStyle = `rgba(${wr},255,${wb},${((0.35 + 0.4 * neon) * a).toFixed(3)})`
        ctx.lineWidth = 0.8
        ctx.stroke()
      })

      // the two eyes: a green glowing dot with a pale hot centre that grows a little when the pointer comes (and gets a dark pupil)
      for (let i = mesh.n; i < mesh.n + 2; i++) {
        const p = pts[i]
        const ignite = still ? 1 : clamp01((since - doneAt) / 500)
        if (ignite <= 0) continue
        const flash = still ? 0 : Math.max(0, 1 - (since - doneAt) / 600)
        const pulse = still ? 1 : 0.65 + 0.35 * Math.sin(now / 380 + i * 2)
        // never taller than the socket
        const rr = Math.min(SOCKET.ry * size * 0.82, (1.6 + 0.3 * pulse + 3 * flash + 1.5 * hover + 0.5 * smile) * Math.min(1.4, size / 3.2 + 0.4))
        // the socket (the dark almond of the mask) holds the eye: the eye moves inside it and never crosses its edge
        const sx = p.x - look.x * size
        const sy = p.y - look.y * size + SOCKET.dy * size
        const roomX = Math.max(0, SOCKET.rx * size - rr * 1.1)
        const roomY = Math.max(0, SOCKET.ry * size - rr * 1.05)
        const cx = sx + Math.max(-roomX, Math.min(roomX, p.x - sx))
        const cy = sy + Math.max(-roomY, Math.min(roomY, p.y - sy))
        ctx.save()
        ctx.beginPath()
        ctx.ellipse(sx, sy, SOCKET.rx * size, SOCKET.ry * size, 0, 0, Math.PI * 2)
        ctx.clip()
        ctx.shadowColor = `rgba(${GREEN},1)`
        ctx.shadowBlur = 8 * pulse + 14 * flash + 6 * hover
        ctx.fillStyle = `rgba(${GREEN},${((0.6 + 0.4 * hover) * ignite).toFixed(3)})`
        ctx.beginPath()
        ctx.arc(cx, cy, rr, 0, Math.PI * 2)
        ctx.fill()
        ctx.shadowBlur = 0
        // pale hot centre, or a dark pupil that looks at the pointer while it is on the motif
        ctx.fillStyle = `rgba(200,255,200,${(0.9 * (1 - hover) * ignite).toFixed(3)})`
        ctx.beginPath()
        ctx.arc(cx, cy, rr * 0.36, 0, Math.PI * 2)
        ctx.fill()
        if (hover > 0.05) {
          ctx.fillStyle = `rgba(0,0,0,${(0.85 * hover).toFixed(3)})`
          ctx.beginPath()
          ctx.arc(cx + look.x * size * 0.2, cy + look.y * size * 0.2, rr * 0.34, 0, Math.PI * 2)
          ctx.fill()
        }
        ctx.restore()
      }

      // screen tearing on each "huh": slices of the picture jump sideways, with a green flicker
      if (now < tearUntil) {
        const dpr = canvas.width / w
        for (let q = 0; q < 6; q++) {
          const sy = Math.random() * h
          const sh = 4 + Math.random() * 26
          const dx = (Math.random() - 0.5) * 50
          ctx.drawImage(canvas, 0, sy * dpr, canvas.width, sh * dpr, dx, sy, w, sh)
          if (q % 2 === 0) {
            ctx.fillStyle = `rgba(${GREEN},0.12)`
            ctx.fillRect(0, sy, w, Math.max(1, sh * 0.3))
          }
        }
      }
    }

    resize()
    raf = requestAnimationFrame(draw)
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    window.addEventListener("pointermove", onMove)
    window.addEventListener("pointerdown", onDown)
    document.addEventListener("pointerleave", onLeave)
    const onVis = () => {
      cancelAnimationFrame(raf)
      if (!document.hidden) raf = requestAnimationFrame(draw)
    }
    document.addEventListener("visibilitychange", onVis)
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      window.removeEventListener("pointermove", onMove)
      window.removeEventListener("pointerdown", onDown)
      document.removeEventListener("pointerleave", onLeave)
      document.removeEventListener("visibilitychange", onVis)
    }
  }, [])

  return <canvas ref={ref} className={className} aria-hidden />
}
