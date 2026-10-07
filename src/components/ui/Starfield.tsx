"use client";

import React, { useEffect, useRef, useState } from "react";

const generateUUID = () => {
  const lut = Array(256).fill(null).map((_, i) => (i < 16 ? "0" : "") + i.toString(16));
  const d0 = (Math.random() * 0xffffffff) | 0;
  const d1 = (Math.random() * 0xffffffff) | 0;
  const d2 = (Math.random() * 0xffffffff) | 0;
  const d3 = (Math.random() * 0xffffffff) | 0;
  return (
    lut[d0 & 0xff] + lut[(d0 >> 8) & 0xff] + lut[(d0 >> 16) & 0xff] + lut[(d0 >> 24) & 0xff] + "-" +
    lut[d1 & 0xff] + lut[(d1 >> 8) & 0xff] + "-" + lut[((d1 >> 16) & 0x0f) | 0x40] + lut[(d1 >> 24) & 0xff] + "-" +
    lut[(d2 & 0x3f) | 0x80] + lut[(d2 >> 8) & 0xff] + "-" + lut[(d2 >> 16) & 0xff] + lut[(d2 >> 24) & 0xff] +
    lut[d3 & 0xff] + lut[(d3 >> 8) & 0xff] + lut[(d3 >> 16) & 0xff] + lut[(d3 >> 24) & 0xff]
  );
};

type StarfieldProps = {
  starColor?: string;
  bgColor?: string;
  mouseAdjust?: boolean;
  tiltAdjust?: boolean;
  easing?: number;
  clickToWarp?: boolean;
  hyperspace?: boolean;
  warpFactor?: number;
  opacity?: number;
  speed?: number;
  quantity?: number;
};

export const Starfield = ({
  starColor = "rgba(255,255,255,1)",
  bgColor = "rgba(0,0,0,1)",
  mouseAdjust = false,
  tiltAdjust = false,
  easing = 1,
  clickToWarp = false,
  hyperspace = false,
  warpFactor = 10,
  opacity = 0.1,
  speed = 1,
  quantity = 512,
}: StarfieldProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [, setState] = useState({ uid: generateUUID(), running: false });
  const mouse = useRef({ x: 0, y: 0 });
  const cursor = useRef({ x: 0, y: 0 });
  const animationFrameRef = useRef<number | null>(null);

  const sd = useRef<{
    w: number; h: number; ctx: CanvasRenderingContext2D | null;
    cw: number; ch: number; x: number; y: number; z: number;
    star: { colorRatio: number; arr: number[][] }; prevTime: number;
  }>({
    w: 0, h: 0, ctx: null, cw: 0, ch: 0,
    x: 0, y: 0, z: 0,
    star: { colorRatio: 0, arr: [] },
    prevTime: 0,
  });

  const colors = { fill: hyperspace ? `rgba(0,0,0,${opacity})` : bgColor };
  const compSpeed = hyperspace ? speed * warpFactor : speed;
  const ratio = quantity / 2;

  const measureViewport = () => {
    const el = canvasRef.current?.parentElement;
    if (el) {
      sd.current.w = el.clientWidth;
      sd.current.h = el.clientHeight;
      sd.current.x = Math.round(sd.current.w / 2);
      sd.current.y = Math.round(sd.current.h / 2);
      sd.current.z = (sd.current.w + sd.current.h) / 2;
      sd.current.star.colorRatio = 1 / sd.current.z;
      if (cursor.current.x === 0 || cursor.current.y === 0) {
        cursor.current.x = sd.current.x;
        cursor.current.y = sd.current.y;
      }
      if (mouse.current.x === 0 || mouse.current.y === 0) {
        mouse.current.x = cursor.current.x - sd.current.x;
        mouse.current.y = cursor.current.y - sd.current.y;
      }
    }
  };

  const setupCanvas = () => {
    measureViewport();
    const canvas = canvasRef.current;
    if (canvas) {
      sd.current.ctx = canvas.getContext("2d");
      canvas.width = sd.current.w;
      canvas.height = sd.current.h;
      if (sd.current.ctx) {
        sd.current.ctx.fillStyle = colors.fill;
        sd.current.ctx.strokeStyle = starColor;
      }
    }
  };

  const bigBang = () => {
    if (sd.current.star.arr.length !== quantity) {
      sd.current.star.arr = new Array(quantity).fill(null).map(() => [
        Math.random() * sd.current.w * 2 - sd.current.x * 2,
        Math.random() * sd.current.h * 2 - sd.current.y * 2,
        Math.round(Math.random() * sd.current.z),
        0, 0, 0, 0, 1,
      ]);
    }
  };

  const resize = () => {
    const oldArr = sd.current.star.arr.slice();
    measureViewport();
    sd.current.cw = sd.current.ctx?.canvas.width ?? 0;
    sd.current.ch = sd.current.ctx?.canvas.height ?? 0;

    if (sd.current.cw !== sd.current.w || sd.current.ch !== sd.current.h) {
      sd.current.x = Math.round(sd.current.w / 2);
      sd.current.y = Math.round(sd.current.h / 2);
      sd.current.z = (sd.current.w + sd.current.h) / 2;
      sd.current.star.colorRatio = 1 / sd.current.z;

      const rw = sd.current.w / sd.current.cw;
      const rh = sd.current.h / sd.current.ch;

      if (sd.current.ctx) {
        sd.current.ctx.canvas.width = sd.current.w;
        sd.current.ctx.canvas.height = sd.current.h;
      }

      if (!sd.current.star.arr.length) {
        bigBang();
      } else {
        sd.current.star.arr = sd.current.star.arr.map((star, i) => {
          const newStar = [...star];
          newStar[0] = oldArr[i][0] * rw;
          newStar[1] = oldArr[i][1] * rh;
          newStar[3] = sd.current.x + (newStar[0] / newStar[2]) * ratio;
          newStar[4] = sd.current.y + (newStar[1] / newStar[2]) * ratio;
          return newStar;
        });
      }

      if (sd.current.ctx) {
        sd.current.ctx.fillStyle = colors.fill;
        sd.current.ctx.strokeStyle = starColor;
      }
    }
  };

  const update = () => {
    mouse.current.x = (cursor.current.x - sd.current.x) / easing;
    mouse.current.y = (cursor.current.y - sd.current.y) / easing;

    if (sd.current.star.arr.length > 0) {
      sd.current.star.arr = sd.current.star.arr.map(star => {
        const s = [...star];
        s[7] = 1;
        s[5] = s[3];
        s[6] = s[4];
        s[0] += mouse.current.x >> 4;
        if (s[0] > sd.current.x << 1) { s[0] -= sd.current.w << 1; s[7] = 0; }
        if (s[0] < -(sd.current.x << 1)) { s[0] += sd.current.w << 1; s[7] = 0; }
        s[1] += mouse.current.y >> 4;
        if (s[1] > sd.current.y << 1) { s[1] -= sd.current.h << 1; s[7] = 0; }
        if (s[1] < -(sd.current.y << 1)) { s[1] += sd.current.h << 1; s[7] = 0; }
        s[2] -= compSpeed;
        if (s[2] > sd.current.z) { s[2] -= sd.current.z; s[7] = 0; }
        if (s[2] < 0) { s[2] += sd.current.z; s[7] = 0; }
        s[3] = sd.current.x + (s[0] / s[2]) * ratio;
        s[4] = sd.current.y + (s[1] / s[2]) * ratio;
        return s;
      });
    }
  };

  const draw = () => {
    const ctx = sd.current.ctx;
    if (!ctx) return;
    ctx.fillStyle = colors.fill;
    ctx.fillRect(0, 0, sd.current.w, sd.current.h);
    ctx.strokeStyle = starColor;

    sd.current.star.arr.forEach(star => {
      if (star[5] > 0 && star[5] < sd.current.w && star[6] > 0 && star[6] < sd.current.h && star[7]) {
        ctx.lineWidth = (1 - sd.current.star.colorRatio * star[2]) * 10;
        ctx.beginPath();
        ctx.moveTo(star[5], star[6]);
        ctx.lineTo(star[3], star[4]);
        ctx.stroke();
        ctx.closePath();
      }
    });
  };

  const animate = () => {
    resize();
    update();
    draw();
    animationFrameRef.current = requestAnimationFrame(animate);
  };

  const stopAnim = () => {
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
  };

  const init = () => {
    measureViewport();
    setupCanvas();
    bigBang();
    animate();
    setState(prev => ({ ...prev, running: true }));
  };

  const destroy = () => {
    stopAnim();
    sd.current = { w: 0, h: 0, ctx: null, cw: 0, ch: 0, x: 0, y: 0, z: 0, star: { colorRatio: 0, arr: [] }, prevTime: 0 };
  };

  useEffect(() => {
    const el = canvasRef.current?.parentElement;

    const mouseHandler = (event: MouseEvent) => {
      if (el) {
        cursor.current.x = event.pageX || event.clientX + el.scrollLeft - el.clientLeft;
        cursor.current.y = event.pageY || event.clientY + el.scrollTop - el.clientTop;
      }
    };

    const tiltHandler = (event: DeviceOrientationEvent) => {
      if (event.beta !== null && event.gamma !== null) {
        cursor.current.x = sd.current.w / 2 + event.gamma * 5;
        cursor.current.y = sd.current.h / 2 + event.beta * 5;
      }
    };

    if (mouseAdjust) el?.addEventListener("mousemove", mouseHandler);
    if (tiltAdjust) window.addEventListener("deviceorientation", tiltHandler);

    init();

    return () => {
      destroy();
      if (mouseAdjust) el?.removeEventListener("mousemove", mouseHandler);
      if (tiltAdjust) window.removeEventListener("deviceorientation", tiltHandler);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ position: "absolute", width: "100%", height: "100%", top: 0, left: 0 }}>
      <canvas ref={canvasRef} />
    </div>
  );
};

export default Starfield;
