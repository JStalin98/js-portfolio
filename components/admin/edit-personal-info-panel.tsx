'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, useFieldArray, type SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { IconPlus, IconX } from '@tabler/icons-react'
import { SlideOver } from '@/components/admin/slide-over'
import { EditButton } from '@/components/admin/edit-button'
import { Button } from '@/components/ui/button'
import { updatePersonalInfo } from '@/app/actions/admin'
import {
  personalInfoSchema,
  type PersonalInfoInput,
} from '@/lib/validation/admin'
import type { HeroMetric } from '@/types/database'
import type { Database } from '@/types/database'

type PersonalInfoRow = Database['public']['Tables']['personal_info']['Row']

interface EditPersonalInfoLayerProps {
  initialData: PersonalInfoRow | null
}

// ─── Shared field styles ─────────────────────────────────────────────────────

const labelClass = 'block text-[12px] font-mono text-ash mb-1'
const inputClass =
  'w-full bg-midnight text-bone text-[14px] leading-[1.7] px-3 py-2 rounded-[8px] border border-[rgba(139,146,165,0.2)] placeholder:text-ash focus:outline-none focus-visible:ring-1 focus-visible:ring-plasma transition-colors duration-150'
const errorClass = 'mt-1 text-[11px] font-mono text-[#ff6b6b]'

export function EditPersonalInfoLayer({ initialData }: EditPersonalInfoLayerProps) {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const defaultMetrics: HeroMetric[] = Array.isArray(initialData?.hero_metrics)
    ? (initialData.hero_metrics as HeroMetric[])
    : []

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PersonalInfoInput>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      full_name: initialData?.full_name ?? '',
      headline: initialData?.headline ?? '',
      tagline: initialData?.tagline ?? '',
      email: initialData?.email ?? '',
      location: initialData?.location ?? '',
      linkedin_url: initialData?.linkedin_url ?? '',
      github_url: initialData?.github_url ?? '',
      availability_status: initialData?.availability_status ?? '',
      hero_metrics: defaultMetrics,
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'hero_metrics',
  })

  const openPanel = useCallback(() => {
    reset({
      full_name: initialData?.full_name ?? '',
      headline: initialData?.headline ?? '',
      tagline: initialData?.tagline ?? '',
      email: initialData?.email ?? '',
      location: initialData?.location ?? '',
      linkedin_url: initialData?.linkedin_url ?? '',
      github_url: initialData?.github_url ?? '',
      availability_status: initialData?.availability_status ?? '',
      hero_metrics: defaultMetrics,
    })
    setOpen(true)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData])

  const onSubmit: SubmitHandler<PersonalInfoInput> = async (values) => {
    const result = await updatePersonalInfo(values)
    if (result.success) {
      toast.success('Updated.')
      setOpen(false)
      router.refresh()
    } else {
      toast.error(result.error)
    }
  }

  const footer = (
    <>
      <Button
        type="button"
        variant="secondary"
        size="sm"
        onClick={() => setOpen(false)}
        disabled={isSubmitting}
      >
        Cancel
      </Button>
      <Button
        type="submit"
        form="personal-info-form"
        variant="primary"
        size="sm"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Saving…' : 'Save'}
      </Button>
    </>
  )

  return (
    <>
      {/* Positioned below the sticky nav (nav = z-50, this = z-30, ~nav height 64px + 24px gap) */}
      <EditButton
        aria-label="Edit hero"
        onClick={openPanel}
        positionClassName="top-[88px] right-6"
      />

      <SlideOver
        open={open}
        onClose={() => setOpen(false)}
        title="Edit hero"
        footer={footer}
        titleId="personal-info-title"
      >
        <form
          id="personal-info-form"
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5"
          noValidate
        >
          {/* Full name */}
          <div>
            <label htmlFor="pi-full_name" className={labelClass}>
              Full name
            </label>
            <input
              id="pi-full_name"
              type="text"
              autoComplete="name"
              className={inputClass}
              aria-invalid={!!errors.full_name}
              {...register('full_name')}
            />
            {errors.full_name && (
              <p role="alert" className={errorClass}>
                {errors.full_name.message}
              </p>
            )}
          </div>

          {/* Headline */}
          <div>
            <label htmlFor="pi-headline" className={labelClass}>
              Headline
            </label>
            <input
              id="pi-headline"
              type="text"
              className={inputClass}
              aria-invalid={!!errors.headline}
              {...register('headline')}
            />
            {errors.headline && (
              <p role="alert" className={errorClass}>
                {errors.headline.message}
              </p>
            )}
          </div>

          {/* Tagline */}
          <div>
            <label htmlFor="pi-tagline" className={labelClass}>
              Tagline
            </label>
            <textarea
              id="pi-tagline"
              rows={3}
              className={`${inputClass} resize-none`}
              aria-invalid={!!errors.tagline}
              {...register('tagline')}
            />
            {errors.tagline && (
              <p role="alert" className={errorClass}>
                {errors.tagline.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="pi-email" className={labelClass}>
              Email
            </label>
            <input
              id="pi-email"
              type="email"
              autoComplete="email"
              className={inputClass}
              aria-invalid={!!errors.email}
              {...register('email')}
            />
            {errors.email && (
              <p role="alert" className={errorClass}>
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Location */}
          <div>
            <label htmlFor="pi-location" className={labelClass}>
              Location
            </label>
            <input
              id="pi-location"
              type="text"
              className={inputClass}
              {...register('location')}
            />
          </div>

          {/* LinkedIn URL */}
          <div>
            <label htmlFor="pi-linkedin_url" className={labelClass}>
              LinkedIn URL
            </label>
            <input
              id="pi-linkedin_url"
              type="url"
              className={inputClass}
              aria-invalid={!!errors.linkedin_url}
              {...register('linkedin_url')}
            />
            {errors.linkedin_url && (
              <p role="alert" className={errorClass}>
                {errors.linkedin_url.message}
              </p>
            )}
          </div>

          {/* GitHub URL */}
          <div>
            <label htmlFor="pi-github_url" className={labelClass}>
              GitHub URL
            </label>
            <input
              id="pi-github_url"
              type="url"
              className={inputClass}
              aria-invalid={!!errors.github_url}
              {...register('github_url')}
            />
            {errors.github_url && (
              <p role="alert" className={errorClass}>
                {errors.github_url.message}
              </p>
            )}
          </div>

          {/* Availability status */}
          <div>
            <label htmlFor="pi-availability_status" className={labelClass}>
              Availability status
            </label>
            <input
              id="pi-availability_status"
              type="text"
              className={inputClass}
              aria-invalid={!!errors.availability_status}
              {...register('availability_status')}
            />
            <p className="mt-1 text-[11px] text-ash leading-relaxed">
              Examples: Open to opportunities, Available now, Selectively available,{' '}
              Available Q3 2026.
            </p>
            {errors.availability_status && (
              <p role="alert" className={errorClass}>
                {errors.availability_status.message}
              </p>
            )}
          </div>

          {/* Hero metrics */}
          <div>
            <p className={labelClass}>Hero metrics</p>
            <div className="space-y-2">
              {fields.map((field, index) => (
                <div key={field.id} className="flex gap-2 items-start">
                  <div className="flex-1">
                    <label htmlFor={`pi-metric-label-${index}`} className="sr-only">
                      Metric {index + 1} label
                    </label>
                    <input
                      id={`pi-metric-label-${index}`}
                      type="text"
                      placeholder="Label"
                      className={inputClass}
                      aria-invalid={!!errors.hero_metrics?.[index]?.label}
                      {...register(`hero_metrics.${index}.label`)}
                    />
                  </div>
                  <div className="flex-1">
                    <label htmlFor={`pi-metric-value-${index}`} className="sr-only">
                      Metric {index + 1} value
                    </label>
                    <input
                      id={`pi-metric-value-${index}`}
                      type="text"
                      placeholder="Value"
                      className={inputClass}
                      aria-invalid={!!errors.hero_metrics?.[index]?.value}
                      {...register(`hero_metrics.${index}.value`)}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    aria-label={`Remove metric ${index + 1}`}
                    className="mt-[9px] flex items-center justify-center w-6 h-6 text-ash hover:text-bone transition-colors duration-150 shrink-0 focus:outline-none focus-visible:ring-1 focus-visible:ring-plasma rounded-[4px]"
                  >
                    <IconX size={14} stroke={1.5} />
                  </button>
                </div>
              ))}
            </div>
            {fields.length < 6 && (
              <button
                type="button"
                onClick={() => append({ label: '', value: '' })}
                className="mt-2 flex items-center gap-1.5 text-[12px] font-mono text-ash hover:text-bone transition-colors duration-150 focus:outline-none focus-visible:ring-1 focus-visible:ring-plasma rounded-[4px] px-1"
              >
                <IconPlus size={12} stroke={1.5} />
                Add metric
              </button>
            )}
            {errors.hero_metrics && !Array.isArray(errors.hero_metrics) && (
              <p role="alert" className={errorClass}>
                {(errors.hero_metrics as { message?: string }).message}
              </p>
            )}
          </div>
        </form>
      </SlideOver>
    </>
  )
}
