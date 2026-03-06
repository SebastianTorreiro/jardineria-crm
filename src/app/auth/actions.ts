'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'

import { loginWithPassword, signupWithPassword, signOut } from '@/lib/services/auth-service'

export async function login(formData: FormData) {
  const supabase = await createClient()

  // Type-casting here for simplicity, but in a real app you might want to validate
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await loginWithPassword(supabase, email, password)

  if (error) {
    return { error: 'Could not authenticate user' }
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await signupWithPassword(supabase, email, password)

  if (error) {
     return { error: 'Could not create user' }
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function logout() {
  const supabase = await createClient()

  const { error } = await signOut(supabase)

  if (error) {
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  redirect('/login')
}
