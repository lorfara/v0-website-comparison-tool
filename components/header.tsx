export function Header() {
  return (
    <header className="border-b border-border bg-background">
      <div className="bg-foreground px-4 py-2 text-center text-sm text-primary-foreground">
        Williams Sonoma Reserve - Enjoy free shipping on eligible purchases*.{" "}
        <span className="font-semibold underline">JOIN NOW &rarr;</span>
      </div>
      <div className="flex items-center justify-center py-6 border-b border-border">
        <h2 className="font-serif text-2xl tracking-[0.3em] text-foreground md:text-3xl">
          WILLIAMS SONOMA
        </h2>
      </div>
    </header>
  )
}
