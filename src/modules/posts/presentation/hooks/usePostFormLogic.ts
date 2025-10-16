import { useEffect } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, type UseFormReturn } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import { useCreatePost, usePost, useUpdatePost } from './usePostOperations'
import {
  type PostFormData,
  postSchema,
  type PostUpdateFormData,
  postUpdateSchema,
} from '../../domain/schemas/postSchema'

import type { CreatePostDto, UpdatePostDto } from '../../domain/dtos'

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

  const { data: existingPost, isLoading: isLoadingPost } = usePost(postId)

  const createPost = useCreatePost()
  const updatePost = useUpdatePost()

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

  const onSubmit = (data: PostFormData | PostUpdateFormData): void => {
    if (isEditing && postId && 'id' in data) {
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
