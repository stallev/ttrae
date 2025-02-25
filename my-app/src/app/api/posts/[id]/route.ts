import { NextResponse } from 'next/server'

interface Post {
  id: string
  title: string
  body: string
  createdAt: string
}

const posts: Post[] = []

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const post = posts.find(p => p.id === params.id)
    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }
    return NextResponse.json(post)
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch post' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const index = posts.findIndex(p => p.id === params.id)
    
    if (index === -1) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    posts[index] = {
      ...posts[index],
      title: body.title,
      body: body.body
    }

    return NextResponse.json(posts[index])
  } catch {
    return NextResponse.json(
      { error: 'Failed to update post' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const index = posts.findIndex(p => p.id === params.id)
    
    if (index === -1) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    posts.splice(index, 1)
    return NextResponse.json({ message: 'Post deleted successfully' })
  } catch {
    return NextResponse.json(
      { error: 'Failed to delete post' },
      { status: 500 }
    )
  }
}