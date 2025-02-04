import { useEffect, useRef } from "react"

export const useGameLoop = (callback: () => void) => {
  const requestRef = useRef<number>()

  const animate = () => {
    callback()
    requestRef.current = requestAnimationFrame(animate)
  }

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate)
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current)
      }
    }
  }, [animate]) // Added animate to the dependency array
}

