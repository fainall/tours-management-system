"use client"

import { useEffect, useCallback, useRef } from "react"
import { usePrefersReducedMotion } from "./use-mobile"

type KeyHandler = (event: KeyboardEvent) => void
type KeyMap = Record<string, KeyHandler>
type Options = {
  enabled?: boolean
  preventDefault?: boolean
  stopPropagation?: boolean
  keyEvent?: "keydown" | "keyup" | "keypress"
}

export function useKeyboard(
  keyMap: KeyMap,
  {
    enabled = true,
    preventDefault = true,
    stopPropagation = true,
    keyEvent = "keydown",
  }: Options = {}
) {
  useEffect(() => {
    if (!enabled) return

    const handler = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase()
      const handler = keyMap[key]

      if (handler) {
        if (preventDefault) event.preventDefault()
        if (stopPropagation) event.stopPropagation()
        handler(event)
      }
    }

    window.addEventListener(keyEvent, handler)
    return () => window.removeEventListener(keyEvent, handler)
  }, [keyMap, enabled, preventDefault, stopPropagation, keyEvent])
}

export function useEscape(handler: () => void, enabled = true) {
  useKeyboard({ escape: handler }, { enabled })
}

export function useEnter(handler: () => void, enabled = true) {
  useKeyboard({ enter: handler }, { enabled })
}

export function useArrows(
  handlers: {
    up?: () => void
    down?: () => void
    left?: () => void
    right?: () => void
  },
  enabled = true
) {
  useKeyboard(
    {
      arrowup: handlers.up || (() => {}),
      arrowdown: handlers.down || (() => {}),
      arrowleft: handlers.left || (() => {}),
      arrowright: handlers.right || (() => {}),
    },
    { enabled }
  )
}

export function useFocusTrap(enabled = true) {
  const ref = useRef<HTMLElement>(null)

  const handleTab = useCallback((event: KeyboardEvent) => {
    if (!ref.current) return

    const focusableElements = ref.current.querySelectorAll(
      'a[href], button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])'
    )
    const firstFocusable = focusableElements[0] as HTMLElement
    const lastFocusable = focusableElements[
      focusableElements.length - 1
    ] as HTMLElement

    if (event.shiftKey) {
      if (document.activeElement === firstFocusable) {
        lastFocusable.focus()
        event.preventDefault()
      }
    } else {
      if (document.activeElement === lastFocusable) {
        firstFocusable.focus()
        event.preventDefault()
      }
    }
  }, [])

  useKeyboard({ tab: handleTab }, { enabled })

  return ref
}

export function useHotkeys(
  hotkeys: Record<string, () => void>,
  enabled = true
) {
  useEffect(() => {
    if (!enabled) return

    const handler = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase()
      const ctrl = event.ctrlKey || event.metaKey
      const alt = event.altKey
      const shift = event.shiftKey

      const hotkeyString = [
        ctrl && "ctrl",
        alt && "alt",
        shift && "shift",
        key,
      ]
        .filter(Boolean)
        .join("+")

      const handler = hotkeys[hotkeyString]
      if (handler) {
        event.preventDefault()
        event.stopPropagation()
        handler()
      }
    }

    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [hotkeys, enabled])
}

export function useAccessibleAnimation(duration = 200) {
  const prefersReducedMotion = usePrefersReducedMotion()
  return prefersReducedMotion ? 0 : duration
}
