import { Plus } from 'lucide-react'
import type { ReactElement } from 'react'
import { Link } from 'react-router-dom'
import { AnimatedCard } from '../../../../components/shared/AnimatedCard'
import { LoadingSpinner } from '../../../../components/shared/LoadingSpinner'
import { PageTransition } from '../../../../components/shared/PageTransition'
import {
  StaggerContainer,
  StaggerItem,
} from '../../../../components/shared/StaggerContainer'
import { Button } from '../../../../components/ui/button'
import { usePosts } from '../hooks/usePostOperations'

export function PostList(): ReactElement {
  const { data: posts, isLoading, error } = usePosts()

  if (isLoading) {
    return <LoadingSpinner text="Loading posts..." />
  }

  if (error) {
    return (
      <PageTransition>
        <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-center">
          <p className="text-destructive">Error: {error.message}</p>
        </div>
      </PageTransition>
    )
  }

  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Posts</h1>
          <Button asChild>
            <Link to="/posts/new">
              <Plus className="mr-2 size-4" />
              New Post
            </Link>
          </Button>
        </div>

        <StaggerContainer className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {posts?.map((post, index) => (
            <StaggerItem key={post.id}>
              <AnimatedCard delay={index * 0.05}>
                <Link
                  className="block rounded-lg border bg-card p-6 transition-colors hover:bg-accent"
                  to={`/posts/${String(post.id)}`}
                >
                  <h3 className="mb-2 line-clamp-2 text-lg font-semibold">
                    {post.title}
                  </h3>
                  <p className="line-clamp-3 text-sm text-muted-foreground">
                    {post.body}
                  </p>
                  <p className="mt-4 text-xs text-muted-foreground">
                    User ID: {post.userId}
                  </p>
                </Link>
              </AnimatedCard>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </PageTransition>
  )
}
