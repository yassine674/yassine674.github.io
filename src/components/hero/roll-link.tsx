import Link from "next/link"

// Label that rolls up on hover, like the HUD links on the reference site.
export default function RollLink({
  href,
  children,
  external,
}: {
  href: string
  children: string
  external?: boolean
}) {
  const inner = (
    <span className="roll__inner" data-label={children}>
      {children}
    </span>
  )
  // pages of the site are opened without reloading, so the preloader does not run again
  return external ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className="roll">
      {inner}
    </a>
  ) : (
    <Link href={href} className="roll">
      {inner}
    </Link>
  )
}
