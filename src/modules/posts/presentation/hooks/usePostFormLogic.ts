import { useEffect } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, type UseFormReturn } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import type { CreatePostDto, UpdatePostDto } from '../../domain/entities/Post'
import {
  type PostFormData,
  postSchema,
  type PostUpdateFormData,
  postUpdateSchema,
} from '../../domain/schemas/postSchema'
import { useCreatePost, usePost, useUpdatePost } from './usePostOperations'

interface UsePostFormLogicReturn {
  form: UseFormReturn<PostFormData | PostUpdateFormData>
  onSubmit: (data: PostFormData | PostUpdateFormData) => void
  isPending: boolean
  isLoadingPost: boolean
  isEditing: boolean
  backLink: string
}

export function usePostFormLogic(postId?: number): UsePostFormLogicReturn {
  const navigate = useNavigate()
  const isEditing = Boolean(postId)

  // Fetch existing post if editing
  const { data: existingPost, isLoading: isLoadingPost } = usePost(postId)

  // Mutations
  const createPost = useCreatePost()
  const updatePost = useUpdatePost()

  // Setup form with proper schema based on mode
  const form = useForm<PostFormData | PostUpdateFormData>({
    resolver: zodResolver(isEditing ? postUpdateSchema : postSchema),
    defaultValues: {
      accountId: undefined,
      userId: 1,
      title: '',
      body: '',
      ...(isEditing && postId ? { id: postId } : {}),
    },
  })

  // Load existing data when available
  useEffect(() => {
    if (existingPost && isEditing) {
      form.reset({
        accountId: existingPost.accountId,
        userId: existingPost.userId,
        title: existingPost.title,
        body: existingPost.body,
        ...(postId ? { id: postId } : {}),
      })
    }
  }, [existingPost, isEditing, form, postId])

  // Handle form submission
  const onSubmit = (data: PostFormData | PostUpdateFormData): void => {
    if (isEditing && postId && 'id' in data) {
      // El accountId se agrega automáticamente en useUpdatePost
      updatePost.mutate(data as UpdatePostDto, {
        onSuccess: () => {
          navigate(`/posts/${postId}`)
        },
        onError: error => {
          form.setError('root', {
            message: error.message || 'Failed to update post',
          })
        },
      })
    } else {
      // El accountId se agrega automáticamente en useCreatePost
      createPost.mutate(data as CreatePostDto, {
        onSuccess: newPost => {
          navigate(`/posts/${newPost.id}`)
        },
        onError: error => {
          form.setError('root', {
            message: error.message || 'Failed to create post',
          })
        },
      })
    }
  }

  const isPending = createPost.isPending || updatePost.isPending
  const backLink = isEditing && postId ? `/posts/${postId}` : '/posts'

  return {
    form,
    onSubmit,
    isPending,
    isLoadingPost,
    isEditing,
    backLink,
  }
}
