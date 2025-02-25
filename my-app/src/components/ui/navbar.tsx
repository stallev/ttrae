import Link from 'next/link'
import { Button } from "./button"

export function Navbar() {
  return (
    <nav className="border-b bg-background py-4">
      <div className="container flex items-center justify-between">
        <Link href="/" className="text-xl font-bold">
          Blog
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/posts">
            <Button variant="ghost">Posts</Button>
          </Link>
          <Link href="/posts/new">
            <Button>New Post</Button>
          </Link>
        </div>
      </div>
    </nav>
  )
}