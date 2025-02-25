'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/ui/navbar'
import { Input } from '@/components/ui/input'
import { Textarea } from "@/components/ui/textarea"
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

export default function NewPostPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    const title = formData.get('title') as string
    const body = formData.get('body') as string

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          body,
          createdAt: new Date().toISOString(),
        }),
      })

      if (response.ok) {
        router.push('/posts')
      } else {
        throw new Error('Failed to create post')
      }
    } catch (error) {
      console.error('Error creating post:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-6">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Create New Post</CardTitle>
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
                  placeholder="Write your post content here..."
                  className="min-h-[200px]"
                />
              </div>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Creating...' : 'Create Post'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}