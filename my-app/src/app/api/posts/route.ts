import { NextResponse } from 'next/server'

interface Post {
  id: string
  title: string
  body: string
  createdAt: string
}

export async function GET() {
  try {
    const response = await fetch(process.env.NEXT_PUBLIC_APPSYNC_API_URL!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.NEXT_PUBLIC_APPSYNC_API_KEY!
      },
      body: JSON.stringify({
        query: `
          query ListPosts {
            listPosts {
              items {
                id
                title
                body
                photoUrl
                createdAt
                category {
                  id
                  name
                }
              }
            }
          }
        `
      })
    })

    const data = await response.json()
    return NextResponse.json({ items: data.data.listPosts.items })
  } catch (error) {
    console.error('Error fetching posts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const newPost: Post = {
      id: Math.random().toString(36).substr(2, 9),
      title: body.title,
      body: body.body,
      createdAt: body.createdAt
    }

    await fetch(process.env.NEXT_PUBLIC_APPSYNC_API_URL!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.NEXT_PUBLIC_APPSYNC_API_KEY!
      },
      body: JSON.stringify({
        query: `
          mutation CreatePost($input: CreatePostInput!) {
            createPost(input: $input) {
              id
              title
              body
              createdAt
            }
          }
        `,
        variables: {
          input: newPost
        }
      })
    })
    return NextResponse.json(newPost, { status: 201 })
  } catch {
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    )
  }
}