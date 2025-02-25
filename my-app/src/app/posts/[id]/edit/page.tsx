'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/ui/navbar'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

interface Post {
  id: string
  title: string
  body: string
  createdAt: string
}

export default function EditPostPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [post, setPost] = useState<Post | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/posts/${params.id}`)
        if (response.ok) {
          const data = await response.json()
          setPost(data)
        } else {
          throw new Error('Post not found')
        }
      } catch (error) {
        console.error('Error fetching post:', error)
        router.push('/posts')
      } finally {
        setIsLoading(false)
      }
    }

    fetchPost()
  }, [params.id, router])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    const title = formData.get('title') as string
    const body = formData.get('body') as string

    try {
      const response = await fetch(`/api/posts/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          body,
        }),
      })

      if (response.ok) {
        router.push('/posts')
      } else {
        throw new Error('Failed to update post')
      }
    } catch (error) {
      console.error('Error updating post:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container py-6">
          <div className="flex justify-center items-center h-[60vh]">
            <p>Loading...</p>
          </div>
        </main>
      </div>
    )
  }

  if (!post) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-6">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Edit Post</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium">
                  Title
                </label>
                <Input
                  id="title"
                  name="title"
                  required
                  defaultValue={post.title}
                  placeholder="Enter post title"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="body" className="text-sm font-medium">
                  Content
                </label>
                <Textarea
                  id="body"
                  name="body"
                  required
                  defaultValue={post.body}
                  placeholder="Write your post content here..."
                  className="min-h-[200px]"
                />
              </div>
              <div className="flex gap-4">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/posts')}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}