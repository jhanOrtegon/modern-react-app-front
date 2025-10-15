import { AlertCircle } from 'lucide-react'
import type { ReactElement } from 'react'
import { useParams } from 'react-router-dom'
import { FormLayout } from '../../../../components/layout/FormLayout'
import { LoadingSpinner } from '../../../../components/shared/LoadingSpinner'
import { Alert, AlertDescription } from '../../../../components/ui/alert'
import { Label } from '../../../../components/ui/label'
import { useUserFormLogic } from '../hooks/useUserFormLogic'

export function UserForm(): ReactElement {
  const { id } = useParams<{ id: string }>()
  const userId = id && id !== 'new' ? parseInt(id, 10) : undefined

  const { form, onSubmit, isPending, isLoadingUser, isEditing, backLink } =
    useUserFormLogic(userId)

  if (isLoadingUser && isEditing) {
    return <LoadingSpinner text="Loading user..." />
  }

  const formTitle = isEditing ? 'Edit User' : 'New User'

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault()
    void form.handleSubmit(onSubmit)(e)
  }

  return (
    <FormLayout
      backLink={backLink}
      isEditing={isEditing}
      isPending={isPending}
      title={formTitle}
      onSubmit={handleSubmit}
    >
      {form.formState.errors.root ? (
        <Alert variant="destructive">
          <AlertCircle className="size-4" />
          <AlertDescription>
            {form.formState.errors.root.message}
          </AlertDescription>
        </Alert>
      ) : null}

      <div className="space-y-2">
        <Label htmlFor="name">
          Name <span className="text-destructive">*</span>
        </Label>
        <input
          {...form.register('name')}
          className="w-full rounded-md border bg-background px-3 py-2"
          id="name"
          placeholder="Enter full name..."
          type="text"
        />
        {form.formState.errors.name ? (
          <p className="text-xs text-destructive">
            {form.formState.errors.name.message}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="username">
          Username <span className="text-destructive">*</span>
        </Label>
        <input
          {...form.register('username')}
          className="w-full rounded-md border bg-background px-3 py-2"
          id="username"
          placeholder="Enter username..."
          type="text"
        />
        {form.formState.errors.username ? (
          <p className="text-xs text-destructive">
            {form.formState.errors.username.message}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">
          Email <span className="text-destructive">*</span>
        </Label>
        <input
          {...form.register('email')}
          className="w-full rounded-md border bg-background px-3 py-2"
          id="email"
          placeholder="Enter email..."
          type="email"
        />
        {form.formState.errors.email ? (
          <p className="text-xs text-destructive">
            {form.formState.errors.email.message}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">
          Phone <span className="text-destructive">*</span>
        </Label>
        <input
          {...form.register('phone')}
          className="w-full rounded-md border bg-background px-3 py-2"
          id="phone"
          placeholder="Enter phone..."
          type="tel"
        />
        {form.formState.errors.phone ? (
          <p className="text-xs text-destructive">
            {form.formState.errors.phone.message}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="website">
          Website <span className="text-destructive">*</span>
        </Label>
        <input
          {...form.register('website')}
          className="w-full rounded-md border bg-background px-3 py-2"
          id="website"
          placeholder="Enter website..."
          type="text"
        />
        {form.formState.errors.website ? (
          <p className="text-xs text-destructive">
            {form.formState.errors.website.message}
          </p>
        ) : null}
      </div>
    </FormLayout>
  )
}
