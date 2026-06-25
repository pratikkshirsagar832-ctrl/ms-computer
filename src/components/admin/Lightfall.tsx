"use client"

import { useEffect, useRef } from "react"
import { Renderer, Camera, Geometry, Program, Mesh, Color, Vec3 } from "ogl"

interface LightfallProps {
  colors?: string[]
  backgroundColor?: string
  speed?: number
  density?: number
  opacity?: number
}

export default function Lightfall({
  colors = ["#408EC6", "#0A1128", "#7AB8E0"],
  backgroundColor = "#F5F5F5",
  speed = 1,
  density = 0.4,
  opacity = 0.5,
}: LightfallProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mouseRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const renderer = new Renderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    })
    const gl = renderer.gl
    container.appendChild(gl.canvas)

    const camera = new Camera(gl, { fov: 60 })
    camera.position.z = 4

    const count = Math.floor(200 * density)
    const positions = new Float32Array(count * 3)
    const sizes = new Float32Array(count)
    const spds = new Float32Array(count)
    const offs = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 14
      positions[i * 3 + 1] = (Math.random() - 0.5) * 14
      positions[i * 3 + 2] = (Math.random() - 0.5) * 6
      sizes[i] = Math.random() * 0.12 + 0.01
      spds[i] = Math.random() * 0.4 + 0.2
      offs[i] = Math.random() * Math.PI * 2
    }

    const palette = colors.slice(0, 3)

    const geometry = new Geometry(gl, {
      position: { size: 3, data: positions },
      size: { size: 1, data: sizes },
      aSpeed: { size: 1, data: spds },
      aOffset: { size: 1, data: offs },
    })

    const vertex = `
      attribute vec3 position;
      attribute float size;
      attribute float aSpeed;
      attribute float aOffset;

      uniform mat4 modelViewMatrix;
      uniform mat4 projectionMatrix;
      uniform float uTime;
      uniform vec3 uMouse;

      varying float vAlpha;

      void main() {
        vec3 pos = position;
        float t = uTime * aSpeed;
        pos.y = mod(pos.y + t * 1.5 + 7.0, 14.0) - 7.0;
        pos.x += sin(t * 1.2 + aOffset) * 0.3;

        vec2 mouseVec = pos.xy - uMouse.xy;
        float mDist = length(mouseVec);
        if (mDist < 1.5) {
          pos.xy += normalize(mouseVec) * (1.5 - mDist) * 0.3;
        }

        vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
        gl_PointSize = size * (250.0 / -mvPos.z);

        vAlpha = 1.0;

        gl_Position = projectionMatrix * mvPos;
      }
    `

    const fragment = `
      precision highp float;
      varying float vAlpha;
      uniform vec3 uColor1;
      uniform vec3 uColor2;
      uniform vec3 uColor3;
      uniform float uOpacity;

      void main() {
        vec2 c = gl_PointCoord - vec2(0.5);
        float d = length(c);
        if (d > 0.5) discard;
        float glow = exp(-d * 8.0);
        vec3 col = mix(uColor1, uColor2, sin(c.x * 6.28) * 0.5 + 0.5);
        col = mix(col, uColor3, cos(c.y * 6.28) * 0.5 + 0.5);
        gl_FragColor = vec4(col, glow * vAlpha * uOpacity);
      }
    `

    const program = new Program(gl, {
      vertex,
      fragment,
      transparent: true,
      depthTest: false,
      uniforms: {
        modelViewMatrix: { value: camera.viewMatrix },
        projectionMatrix: { value: camera.projectionMatrix },
        uTime: { value: 0 },
        uMouse: { value: new Vec3(0) },
        uColor1: { value: new Color(palette[0]) },
        uColor2: { value: new Color(palette[1]) },
        uColor3: { value: new Color(palette[2]) },
        uOpacity: { value: opacity },
      },
    })

    const mesh = new Mesh(gl, { geometry, program })
    mesh.frustumCulled = false

    const bgColor = new Color(backgroundColor)
    let time = 0
    let animId: number

    const handleResize = () => {
      const rect = container.getBoundingClientRect()
      if (!rect.width || !rect.height) return
      renderer.setSize(rect.width, rect.height)
      camera.perspective({ aspect: rect.width / rect.height })
      program.uniforms.modelViewMatrix.value = camera.viewMatrix
      program.uniforms.projectionMatrix.value = camera.projectionMatrix
    }

    const handleMouse = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      mouseRef.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      mouseRef.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1
    }

    window.addEventListener("resize", handleResize)
    container.addEventListener("mousemove", handleMouse)
    handleResize()

    function animate() {
      time += 0.02 * speed
      program.uniforms.uTime.value = time
      program.uniforms.uMouse.value = new Vec3(mouseRef.current.x, mouseRef.current.y, 0)

      gl.clearColor(bgColor.r * 0.15, bgColor.g * 0.15, bgColor.b * 0.15, 1)
      gl.clear(gl.COLOR_BUFFER_BIT)
      renderer.render({ scene: mesh, camera, clear: false })

      animId = requestAnimationFrame(animate)
    }
    animId = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener("resize", handleResize)
      container.removeEventListener("mousemove", handleMouse)
      if (container.contains(gl.canvas)) container.removeChild(gl.canvas)
      gl.getExtension("WEBGL_lose_context")?.loseContext()
    }
  }, [])

  return (
    <div
      ref={containerRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "auto",
        zIndex: 0,
      }}
    />
  )
}
