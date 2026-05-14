'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAdmin } from '@/components/admin/admin-provider'
import { signIn } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'

const loginSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

type LoginValues = z.infer<typeof loginSchema>

const inputClass =
  'w-full bg-transparent border border-[rgba(139,146,165,0.3)] rounded-[8px] px-4 py-2.5 text-sm text-bone placeholder:text-ash focus:outline-none focus:border-plasma transition-colors duration-150 aria-[invalid=true]:border-[rgba(255,107,107,0.6)]'

const labelClass = 'block text-[12px] text-ash mb-1.5'
const errorClass = 'mt-1 text-[12px] text-[rgba(255,107,107,0.85)]'

export default function LoginPage() {
  const router = useRouter()
  const { isAdmin } = useAdmin()

  // Already authenticated — redirect to home.
  useEffect(() => {
    if (isAdmin) {
      router.replace('/')
    }
  }, [isAdmin, router])

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) })

  async function onSubmit(data: LoginValues) {
    const result = await signIn(data.email, data.password)
    if (result.success) {
      router.replace('/')
      router.refresh()
    } else {
      setError('root', { message: result.error })
    }
  }

  return (
    <main className="min-h-screen bg-midnight flex items-center justify-center px-4">
      <div className="w-full max-w-[480px] bg-carbon border border-[rgba(139,146,165,0.2)] rounded-[12px] p-8">
        <h1 className="text-[22px] font-sans font-medium text-bone tracking-[-0.5px] mb-1">
          Admin sign in
        </h1>
        <p className="text-[13px] text-ash mb-8">
          This area is for the site owner only.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
          <div>
            <label htmlFor="login-email" className={labelClass}>
              Email
            </label>
            <input
              id="login-email"
              type="email"
              autoComplete="email"
              placeholder="admin@example.com"
              aria-invalid={errors.email ? 'true' : undefined}
              aria-describedby={errors.email ? 'login-email-error' : undefined}
              className={inputClass}
              {...register('email')}
            />
            {errors.email && (
              <p id="login-email-error" role="alert" className={errorClass}>
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="login-password" className={labelClass}>
              Password
            </label>
            <input
              id="login-password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              aria-invalid={errors.password ? 'true' : undefined}
              aria-describedby={errors.password ? 'login-password-error' : undefined}
              className={inputClass}
              {...register('password')}
            />
            {errors.password && (
              <p id="login-password-error" role="alert" className={errorClass}>
                {errors.password.message}
              </p>
            )}
          </div>

          {errors.root && (
            <p role="alert" className={errorClass}>
              {errors.root.message}
            </p>
          )}

          <Button
            type="submit"
            variant="primary"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Signing in…' : 'Sign in'}
          </Button>
        </form>
      </div>
    </main>
  )
}
