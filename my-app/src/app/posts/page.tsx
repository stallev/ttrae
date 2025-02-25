'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Navbar } from '@/components/ui/navbar'

interface Post {
  id: string
  title: string
  body: string
  createdAt: string
}

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = async (query: string) => {
    setSearchQuery(query)
    try {
      const response = await fetch(`/api/posts/search?q=${encodeURIComponent(query)}`)
      const data = await response.json()
      setPosts(data.items || [])
    } catch (error) {
      console.error('Error searching posts:', error)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Blog Posts</h1>
          <Input
            type="search"
            placeholder="Search posts..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="max-w-md"
          />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Card key={post.id}>
              <CardHeader>
                <CardTitle>{post.title}</CardTitle>
                <CardDescription>
                  {new Date(post.createdAt).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="line-clamp-3">{post.body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}