import { motion, useReducedMotion } from 'motion/react'
import type { ReactNode } from 'react'

/**
 * The template's only scroll motion: content rises into place once, on entry.
 * Motion is used for presence, not decoration — see DESIGN.md.
 *
 * `data-reveal` exists so the `<noscript>` rule in the root document can force
 * these back to visible. Marketing pages are prerendered, and the hidden initial
 * state is an inline style, so without that escape hatch a visitor with JS
 * disabled would get a page of invisible sections.
 */
export function Reveal({
  children,
  delay = 0,
  className,
  as = 'div',
}: {
  children: ReactNode
  delay?: number
  className?: string
  as?: 'div' | 'section' | 'li' | 'article'
}) {
  const reduced = useReducedMotion()
  const Component = motion[as]

  if (reduced) {
    return <Component className={className}>{children}</Component>
  }

  return (
    <Component
      data-reveal=""
      className={className}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-12% 0px -8% 0px' }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </Component>
  )
}
