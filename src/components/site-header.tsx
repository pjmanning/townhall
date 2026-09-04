import { useEffect, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { MenuIcon } from 'lucide-react'

import { Wordmark } from './brand'
import { ThemeToggle } from './theme-toggle'
import { Button } from '#/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '#/components/ui/sheet'
import { nav } from '#/lib/site'
import { useAppAuth } from '#/lib/use-auth'
import { cn } from '#/lib/utils'

function AuthActions({ onNavigate }: { onNavigate?: () => void }) {
  const { isSignedIn, isLoaded } = useAppAuth()

  if (!isLoaded) return <div className="h-9 w-24 animate-pulse rounded-md bg-muted" />

  return isSignedIn ? (
    <Button asChild size="sm">
      <Link to="/app" onClick={onNavigate}>
        Open app
      </Link>
    </Button>
  ) : (
    <>
      <Button asChild variant="ghost" size="sm">
        <Link to="/admin" onClick={onNavigate}>
          Admin
        </Link>
      </Button>
      <Button asChild size="sm">
        <Link to="/budget" onClick={onNavigate}>
          Budget
        </Link>
      </Button>
    </>
  )
}

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={cn(
        'sticky top-0 z-50 transition-colors duration-300',
        scrolled && 'border-b border-border bg-background/72 backdrop-blur-xl',
      )}
    >
      <div className="nj-shell flex h-16 items-center justify-between gap-6">
        <Wordmark />

        <nav className="hidden items-center gap-1 md:flex">
          {nav.marketing.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeProps={{ className: 'text-foreground' }}
              className="rounded-md px-3 py-2 text-sm text-muted-foreground no-underline transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-1.5 md:flex">
          <ThemeToggle />
          <AuthActions />
        </div>

        <div className="flex items-center gap-1 md:hidden">
          <ThemeToggle />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <MenuIcon className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle className="text-left">
                  <Wordmark />
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1 px-4">
                {[...nav.marketing, ...nav.legal].map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className="rounded-md px-3 py-2.5 text-sm text-muted-foreground no-underline hover:bg-accent hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
              <div className="mt-auto flex flex-col gap-2 p-4">
                <AuthActions onNavigate={() => setOpen(false)} />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
