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
import { useUsers } from '../hooks/useUserOperations'

export function UserList(): ReactElement {
  const { data: users, isLoading, error } = useUsers()

  if (isLoading) {
    return <LoadingSpinner text="Loading users..." />
  }

  if (error) {
    return (
      <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-center">
        <p className="text-destructive">Error: {error.message}</p>
      </div>
    )
  }

  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Users</h1>
          <Button asChild>
            <Link to="/users/new">
              <Plus className="mr-2 size-4" />
              New User
            </Link>
          </Button>
        </div>

        <StaggerContainer>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {users?.map(user => (
              <StaggerItem key={user.id}>
                <AnimatedCard>
                  <Link className="block" to={`/users/${String(user.id)}`}>
                    <h3 className="mb-2 text-lg font-semibold">{user.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      @{user.username}
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {user.email}
                    </p>
                    <div className="mt-4 text-xs text-muted-foreground">
                      <p>{user.company.name}</p>
                      <p className="italic">{user.company.catchPhrase}</p>
                    </div>
                  </Link>
                </AnimatedCard>
              </StaggerItem>
            ))}
          </div>
        </StaggerContainer>
      </div>
    </PageTransition>
  )
}
