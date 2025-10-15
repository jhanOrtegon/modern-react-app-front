import { AlertCircle } from 'lucide-react'
import type { ReactElement } from 'react'
import { useParams } from 'react-router-dom'
import { FormLayout } from '../../../../components/layout/FormLayout'
import { LoadingSpinner } from '../../../../components/shared/LoadingSpinner'
import { Alert, AlertDescription } from '../../../../components/ui/alert'
import { Label } from '../../../../components/ui/label'
import { usePostFormLogic } from '../hooks/usePostFormLogic'

export function PostForm(): ReactElement {
  const { id } = useParams<{ id: string }>()
  const postId = id && id !== 'new' ? parseInt(id, 10) : undefined

  const { form, onSubmit, isPending, isLoadingPost, isEditing, backLink } =
    usePostFormLogic(postId)

  if (isLoadingPost && isEditing) {
    return <LoadingSpinner text="Loading post..." />
  }

  const formTitle = isEditing ? 'Edit Post' : 'New Post'

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
        <Label htmlFor="userId">
          User ID <span className="text-destructive">*</span>
        </Label>
        <input
          {...form.register('userId', { valueAsNumber: true })}
          className="w-full rounded-md border bg-background px-3 py-2"
          id="userId"
          min={1}
          type="number"
        />
        {form.formState.errors.userId ? (
          <p className="text-xs text-destructive">
            {form.formState.errors.userId.message}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="title">
          Title <span className="text-destructive">*</span>
        </Label>
        <input
          {...form.register('title')}
          className="w-full rounded-md border bg-background px-3 py-2"
          id="title"
          placeholder="Enter post title..."
          type="text"
        />
        {form.formState.errors.title ? (
          <p className="text-xs text-destructive">
            {form.formState.errors.title.message}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="body">
          Body <span className="text-destructive">*</span>
        </Label>
        <textarea
          {...form.register('body')}
          className="w-full rounded-md border bg-background px-3 py-2"
          id="body"
          placeholder="Enter post content..."
          rows={10}
        />
        {form.formState.errors.body ? (
          <p className="text-xs text-destructive">
            {form.formState.errors.body.message}
          </p>
        ) : null}
      </div>
    </FormLayout>
  )
}
