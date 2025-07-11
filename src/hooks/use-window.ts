"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useDebouncedCallback } from "./use-debounce"

interface WindowSize {
  width: number
  height: number
}

interface WindowScroll {
  x: number
  y: number
}

export function useWindowSize(debounceMs = 100) {
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
  })

  const handleResize = useDebouncedCallback(() => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    })
  }, debounceMs)

  useEffect(() => {
    if (typeof window === "undefined") return

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [handleResize])

  return windowSize
}

export function useWindowScroll(debounceMs = 100) {
  const [scroll, setScroll] = useState<WindowScroll>({
    x: typeof window !== "undefined" ? window.pageXOffset : 0,
    y: typeof window !== "undefined" ? window.pageYOffset : 0,
  })

  const handleScroll = useDebouncedCallback(() => {
    setScroll({
      x: window.pageXOffset,
      y: window.pageYOffset,
    })
  }, debounceMs)

  useEffect(() => {
    if (typeof window === "undefined") return

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [handleScroll])

  const scrollTo = useCallback(({ x, y }: Partial<WindowScroll>) => {
    if (typeof window === "undefined") return

    window.scrollTo({
      left: x,
      top: y,
      behavior: "smooth",
    })
  }, [])

  return { ...scroll, scrollTo }
}

export function useWindowFocus() {
  const [focused, setFocused] = useState(
    typeof window !== "undefined" ? document.hasFocus() : true
  )

  useEffect(() => {
    if (typeof window === "undefined") return

    const handleFocus = () => setFocused(true)
    const handleBlur = () => setFocused(false)

    window.addEventListener("focus", handleFocus)
    window.addEventListener("blur", handleBlur)

    return () => {
      window.removeEventListener("focus", handleFocus)
      window.removeEventListener("blur", handleBlur)
    }
  }, [])

  return focused
}

export function useWindowEvent<K extends keyof WindowEventMap>(
  type: K,
  listener: (event: WindowEventMap[K]) => void,
  options?: boolean | AddEventListenerOptions
) {
  useEffect(() => {
    if (typeof window === "undefined") return

    window.addEventListener(type, listener, options)
    return () => window.removeEventListener(type, listener, options)
  }, [type, listener, options])
}

export function useWindowUnload(handler: () => void) {
  useEffect(() => {
    if (typeof window === "undefined") return

    window.addEventListener("beforeunload", handler)
    return () => window.removeEventListener("beforeunload", handler)
  }, [handler])
}

export function useWindowOrientation() {
  const [orientation, setOrientation] = useState<string>(
    typeof window !== "undefined"
      ? window.screen.orientation?.type || "unknown"
      : "unknown"
  )

  useEffect(() => {
    if (typeof window === "undefined" || !window.screen?.orientation) return

    const handleChange = () => {
      setOrientation(window.screen.orientation.type)
    }

    window.screen.orientation.addEventListener("change", handleChange)
    return () => window.screen.orientation.removeEventListener("change", handleChange)
  }, [])

  return orientation
}

export function useWindowNetwork() {
  const [online, setOnline] = useState(
    typeof navigator !== "undefined" ? navigator.onLine : true
  )

  useEffect(() => {
    if (typeof window === "undefined") return

    const handleOnline = () => setOnline(true)
    const handleOffline = () => setOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  return online
}

export function useWindowIdle(timeout = 1000 * 60) {
  const [idle, setIdle] = useState(false)
  const timeoutId = useRef<number>()

  const handleActivity = useCallback(() => {
    setIdle(false)
    window.clearTimeout(timeoutId.current)
    timeoutId.current = window.setTimeout(() => setIdle(true), timeout)
  }, [timeout])

  useEffect(() => {
    if (typeof window === "undefined") return

    const events = [
      "mousedown",
      "mousemove",
      "keydown",
      "touchstart",
      "wheel",
    ]

    events.forEach((event) =>
      document.addEventListener(event, handleActivity, true)
    )

    handleActivity()

    return () => {
      events.forEach((event) =>
        document.removeEventListener(event, handleActivity, true)
      )
      window.clearTimeout(timeoutId.current)
    }
  }, [handleActivity])

  return idle
}
