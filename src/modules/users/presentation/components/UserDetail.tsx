import type { ReactElement } from 'react'

import { motion } from 'framer-motion'
import { Edit, Globe, Mail, Phone, Trash2 } from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'

import { DetailLayout } from '@/components/layout/DetailLayout'
import { FadeIn } from '@/components/shared/FadeIn'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { Button } from '@/components/ui/button'

import { useDeleteUser, useUser } from '../hooks/useUserOperations'

export function UserDetail(): ReactElement {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const userId = id ? parseInt(id, 10) : undefined
  const { data: user, isLoading, error } = useUser(userId)
  const deleteUser = useDeleteUser()

  const handleDelete = (): void => {
    if (!userId) {
      return
    }

    toast('Are you sure?', {
      description: 'This action cannot be undone.',
      action: {
        label: 'Delete',
        onClick: () => {
          deleteUser.mutate(userId, {
            onSuccess: () => {
              navigate('/users')
            },
          })
        },
      },
      cancel: {
        label: 'Cancel',
        onClick: () => {
          // Cancel action
        },
      },
    })
  }

  if (isLoading) {
    return <LoadingSpinner text="Loading user..." />
  }

  if (error || !user) {
    return (
      <DetailLayout actions={<div />} backLink="/users">
        <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-center">
          <h1 className="mb-2 text-2xl font-bold">Error</h1>
          <p className="text-destructive">
            {error ? error.message : 'User not found'}
          </p>
        </div>
      </DetailLayout>
    )
  }

  return (
    <DetailLayout
      actions={
        <>
          <Button asChild variant="outline">
            <Link to={`/users/${String(user.id)}/edit`}>
              <Edit className="mr-2 size-4" />
              Edit
            </Link>
          </Button>
          <Button
            disabled={deleteUser.isPending}
            variant="destructive"
            onClick={handleDelete}
          >
            <Trash2 className="mr-2 size-4" />
            Delete
          </Button>
        </>
      }
      backLink="/users"
    >
      <div className="space-y-6">
        <FadeIn>
          <div className="mb-6">
            <h1 className="mb-2 text-3xl font-bold">{user.name}</h1>
            <p className="text-lg text-muted-foreground">@{user.username}</p>
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="grid gap-6 md:grid-cols-2"
            initial={{ opacity: 0, y: 20 }}
            transition={{ delay: 0.2 }}
          >
            <div className="space-y-4 rounded-lg border bg-card p-6">
              <h2 className="text-xl font-semibold">Contact Information</h2>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="size-4 text-muted-foreground" />
                  <a className="hover:underline" href={`mailto:${user.email}`}>
                    {user.email}
                  </a>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="size-4 text-muted-foreground" />
                  <a className="hover:underline" href={`tel:${user.phone}`}>
                    {user.phone}
                  </a>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Globe className="size-4 text-muted-foreground" />
                  <a
                    className="hover:underline"
                    href={`https://${user.website}`}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {user.website}
                  </a>
                </div>
              </div>
            </div>

            <div className="space-y-4 rounded-lg border bg-card p-6">
              <h2 className="text-xl font-semibold">Address</h2>
              <div className="text-sm">
                <p>
                  {user.address.street}, {user.address.suite}
                </p>
                <p>{user.address.city}</p>
                <p>{user.address.zipcode}</p>
              </div>
            </div>

            <div className="space-y-4 rounded-lg border bg-card p-6 md:col-span-2">
              <h2 className="text-xl font-semibold">Company</h2>
              <div className="text-sm">
                <p className="font-medium">{user.company.name}</p>
                <p className="italic text-muted-foreground">
                  {user.company.catchPhrase}
                </p>
                <p className="text-muted-foreground">{user.company.bs}</p>
              </div>
            </div>
          </motion.div>
        </FadeIn>
      </div>
    </DetailLayout>
  )
}
