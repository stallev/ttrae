'use client'

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Navbar } from '@/components/ui/navbar'
import Image from 'next/image'

interface Post {
  id: string
  title: string
  body: string
  photoUrl: string
  createdAt: string
  category?: {
    id: string
    name: string
  }
}

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([])

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/posts')
        const data = await response.json()
        setPosts(data.items || [])
      } catch (error) {
        console.error('Error fetching posts:', error)
      }
    }

    fetchPosts()
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-6">
        <h1 className="text-3xl font-bold mb-8">Latest Posts</h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Card key={post.id} className="overflow-hidden">
              {post.photoUrl && (
                <div className="relative w-full h-48">
                  <Image
                    src={post.photoUrl}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <CardHeader>
                <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                {post.category && (
                  <CardDescription>{post.category.name}</CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <p className="line-clamp-3 text-sm text-muted-foreground">
                  {post.body}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
