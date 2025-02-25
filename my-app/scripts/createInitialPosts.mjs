import { GraphQLClient, gql } from 'graphql-request';

const endpoint = 'https://kiivro4eirgtldybtflw7knd5m.appsync-api.us-east-1.amazonaws.com/graphql';
const apiKey = 'da2-g2tj7fk65rey3doo5vutjlgrkm';

const client = new GraphQLClient(endpoint, {
  headers: {
    'x-api-key': apiKey
  }
});

const createCategoryMutation = gql`
  mutation CreateCategory($input: CreateCategoryInput!) {
    createCategory(input: $input) {
      id
      name
    }
  }
`;

const createPostMutation = gql`
  mutation CreatePost($input: CreatePostInput!) {
    createPost(input: $input) {
      id
      title
      body
      photoUrl
      category {
        id
        name
      }
      createdAt
      updatedAt
    }
  }
`;

const categories = [
  { name: 'Fundamentals' },
  { name: 'Server-side Rendering' },
  { name: 'Data Management' },
  { name: 'Backend Integration' },
  { name: 'Performance' },
  { name: 'State Management' },
  { name: 'Security' },
  { name: 'Styling' },
  { name: 'Testing' },
  { name: 'Deployment' }
];

const posts = [
  {
    title: 'Mastering Next.js 13 App Directory Architecture',
    body: 'Deep dive into the revolutionary App Directory structure in Next.js 13. Learn about parallel routes, intercepting routes, and how to effectively organize your application for maximum maintainability. Discover advanced patterns for route groups and dynamic segments.',
    photoUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97'
  },
  {
    title: 'Advanced Server Components and Streaming',
    body: 'Master the art of streaming Server Components in Next.js. Learn how to implement progressive rendering, handle loading states with Suspense, and optimize the user experience through strategic component splitting and streaming techniques.',
    photoUrl: 'https://images.unsplash.com/photo-1537432376769-00f5c2f4c8d2'
  },
  {
    title: 'Next.js Data Patterns with Server Actions',
    body: 'Explore the power of Server Actions in Next.js for handling form submissions and data mutations. Learn how to implement optimistic updates, handle validation, and manage complex data flows while maintaining type safety throughout your application.',
    photoUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31'
  },
  {
    title: 'Building a Serverless API with Next.js Route Handlers',
    body: 'Learn how to create robust API endpoints using Next.js Route Handlers. Discover patterns for authentication, rate limiting, and error handling. Implement WebSocket connections and handle streaming responses for real-time applications.',
    photoUrl: 'https://images.unsplash.com/photo-1516259762381-22954d7d3ad2'
  },
  {
    title: 'Next.js Performance Optimization and Analytics',
    body: 'Master advanced performance optimization techniques in Next.js. Learn about partial prerendering, route prefetching strategies, and implementing real user monitoring. Discover how to use the Next.js Speed Insights and optimize Core Web Vitals.',
    photoUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71'
  },
  {
    title: 'Advanced State Management with Zustand and Server Components',
    body: 'Learn how to effectively combine client-side state management with Server Components. Implement advanced patterns using Zustand, handle hydration challenges, and maintain a clean architecture while preserving the benefits of server rendering.',
    photoUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40'
  },
  {
    title: 'Implementing OAuth and JWT with Next.js Auth.js',
    body: 'Build secure authentication flows using Next.js Auth.js (formerly NextAuth). Learn about custom providers, implementing role-based access control, and securing both API routes and Server Components with the latest authentication patterns.',
    photoUrl: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb'
  },
  {
    title: 'Modern Styling Patterns in Next.js Applications',
    body: 'Explore cutting-edge styling solutions in Next.js including CSS Modules, Tailwind CSS with JIT, and CSS-in-JS libraries. Learn about dynamic styling, dark mode implementation, and creating maintainable design systems.',
    photoUrl: 'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2'
  },
  {
    title: 'Testing Server Components and Client Components',
    body: 'Master testing strategies for Next.js applications with both Server and Client Components. Learn about integration testing with MSW, component testing with React Testing Library, and end-to-end testing with Playwright.',
    photoUrl: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea'
  },
  {
    title: 'Advanced Next.js Deployment and Infrastructure',
    body: 'Learn advanced deployment strategies for Next.js applications. Explore containerization with Docker, implementing CI/CD pipelines, and setting up preview environments. Master deployment on various platforms including Vercel, AWS, and Kubernetes.',
    photoUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f'
  }
];

const createPosts = async () => {
  try {
    // First create all categories
    const categoryMap = {};
    for (const category of categories) {
      const variables = {
        input: {
          ...category,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      };
      const data = await client.request(createCategoryMutation, variables);
      console.log(`Created category: ${category.name}`);
      categoryMap[category.name] = data.createCategory.id;
    }

    // Then create all posts with category references
    for (let i = 0; i < posts.length; i++) {
      const post = posts[i];
      const categoryName = categories[i].name;
      const variables = {
        input: {
          ...post,
          categoryPostsId: categoryMap[categoryName],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      };

      const data = await client.request(createPostMutation, variables);
      console.log(`Created post: ${post.title}`);
      console.log(data);
    }

    console.log('All posts and categories created successfully!');
  } catch (error) {
    console.error('Error creating posts:', error);
  }
};

createPosts();