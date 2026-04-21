export function Header() {
  return (
    <header className="border-b border-border bg-background">
      <div className="bg-foreground px-4 py-2 text-center text-sm text-primary-foreground">
        Williams Sonoma Reserve - Enjoy free shipping on eligible purchases*.{" "}
        <span className="font-semibold underline">JOIN NOW &rarr;</span>
      </div>
      <div className="flex items-center justify-center py-6">
        <h2 className="font-serif text-2xl tracking-[0.3em] text-foreground md:text-3xl">
          WILLIAMS SONOMA
        </h2>
      </div>
      <nav className="border-t border-border">
        <ul className="flex items-center justify-center gap-8 px-4 py-3 text-sm tracking-wide text-foreground">
          <li className="cursor-pointer hover:underline">New</li>
          <li className="cursor-pointer hover:underline">Cookware</li>
          <li className="cursor-pointer hover:underline">Bakeware</li>
          <li className="cursor-pointer hover:underline">Food</li>
          <li className="cursor-pointer hover:underline">Tabletop & Bar</li>
          <li className="cursor-pointer text-accent hover:underline">Sale</li>
        </ul>
      </nav>
    </header>
  )
}
