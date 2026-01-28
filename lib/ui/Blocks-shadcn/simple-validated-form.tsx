/**
 * @file        simple-validated-form.tsx
 * @description TODO: Add description
 *
 * @repo        AXIS-V3
 * @path        components\\simple-validated-form.tsx
 *
 * @since       2026-01-26
 * @changedate  2026-01-26
 * @changeref   {{changeRef}}
 *
 * @category    General
 * @tags        TODO
 */

/**
 * SIMPLE VALIDATED FORM DEMO
 *
 * A simplified version of the contact form that demonstrates Zod validation
 * without requiring additional UI components.
 *
 * @author AXIS-V3 Team
 * @version 1.0.0
 * @since 2026-01-26
 */

'use client'

import logger from '@/lib/logger'
import { useFormValidation } from '@/lib/zod-hooks'
import { contactFormSchema, type ContactForm } from '@/lib/zod-schemas'
import { useState } from 'react'

interface SimpleValidatedFormProps {
  onSubmit?: (data: ContactForm) => Promise<void>
  className?: string
}

export function SimpleValidatedForm({ onSubmit, className }: SimpleValidatedFormProps) {
  // Initial form values
  const initialValues: ContactForm = {
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    priority: 'medium',
    preferredContact: 'email',
    subscribe: false,
  }

  // Form validation hook
  const {
    data,
    isValid,
    isSubmitting,
    isDirty,
    updateData,
    handleBlur,
    handleSubmit,
    resetForm,
    hasError,
    getError,
  } = useFormValidation(contactFormSchema, {
    initialValues,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async formData => {
      if (onSubmit) {
        await onSubmit(formData)
      }
    },
    onValidationError: errors => {
      // In a real app, you might want to show these errors to the user
      // or send them to an error tracking service
      if (process.env.NODE_ENV === 'development') {
        logger.error(errors, 'Form validation errors')
      }
    },
    focusFirstError: true,
    debounceMs: 300,
  })

  // Local state for success message
  const [isSubmitted, setIsSubmitted] = useState(false)

  // Handle form submission
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      await handleSubmit(e)
      setIsSubmitted(true)

      // Reset form after successful submission
      setTimeout(() => {
        resetForm()
        setIsSubmitted(false)
      }, 3000)
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        logger.error({ error }, 'Form submission error')
      }
    }
  }

  if (isSubmitted) {
    return (
      <div
        className={`mx-auto w-full max-w-2xl rounded-lg border border-green-200 bg-green-50 p-6 ${className}`}
      >
        <div className='space-y-4 text-center'>
          <div className='text-4xl text-green-600'>✓</div>
          <div>
            <h3 className='text-lg font-semibold text-green-900'>Message Sent!</h3>
            <p className='mt-1 text-green-700'>
              Thank you for contacting us. We'll get back to you soon.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`mx-auto w-full max-w-2xl rounded-lg border border-gray-200 bg-white p-6 shadow-sm ${className}`}
    >
      <div className='mb-6'>
        <h2 className='mb-2 text-2xl font-bold text-gray-900'>Contact Us</h2>
        <p className='text-gray-600'>Send us a message and we'll respond as soon as possible.</p>
      </div>

      <form onSubmit={handleFormSubmit} className='space-y-6'>
        {/* Name Field */}
        <div>
          <label htmlFor='name' className='mb-2 block text-sm font-medium text-gray-700'>
            Name <span className='text-red-500'>*</span>
          </label>
          <input
            id='name'
            type='text'
            placeholder='Your full name'
            value={data.name}
            onChange={e => updateData('name', e.target.value)}
            onBlur={() => handleBlur('name', data.name)}
            className={`w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              hasError('name') ? 'border-red-500' : 'border-gray-300'
            }`}
            aria-invalid={hasError('name')}
          />
          {hasError('name') && <div className='mt-1 text-sm text-red-600'>{getError('name')}</div>}
        </div>

        {/* Email Field */}
        <div>
          <label htmlFor='email' className='mb-2 block text-sm font-medium text-gray-700'>
            Email <span className='text-red-500'>*</span>
          </label>
          <input
            id='email'
            type='email'
            placeholder='your.email@example.com'
            value={data.email}
            onChange={e => updateData('email', e.target.value)}
            onBlur={() => handleBlur('email', data.email)}
            className={`w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              hasError('email') ? 'border-red-500' : 'border-gray-300'
            }`}
            aria-invalid={hasError('email')}
          />
          {hasError('email') && (
            <div className='mt-1 text-sm text-red-600'>{getError('email')}</div>
          )}
        </div>

        {/* Phone Field */}
        <div>
          <label htmlFor='phone' className='mb-2 block text-sm font-medium text-gray-700'>
            Phone (Optional)
          </label>
          <input
            id='phone'
            type='tel'
            placeholder='+1 (555) 123-4567'
            value={data.phone || ''}
            onChange={e => updateData('phone', e.target.value)}
            onBlur={() => handleBlur('phone', data.phone)}
            className={`w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              hasError('phone') ? 'border-red-500' : 'border-gray-300'
            }`}
            aria-invalid={hasError('phone')}
          />
          {hasError('phone') && (
            <div className='mt-1 text-sm text-red-600'>{getError('phone')}</div>
          )}
        </div>

        {/* Subject Field */}
        <div>
          <label htmlFor='subject' className='mb-2 block text-sm font-medium text-gray-700'>
            Subject <span className='text-red-500'>*</span>
          </label>
          <input
            id='subject'
            type='text'
            placeholder='What is this regarding?'
            value={data.subject}
            onChange={e => updateData('subject', e.target.value)}
            onBlur={() => handleBlur('subject', data.subject)}
            className={`w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              hasError('subject') ? 'border-red-500' : 'border-gray-300'
            }`}
            aria-invalid={hasError('subject')}
          />
          {hasError('subject') && (
            <div className='mt-1 text-sm text-red-600'>{getError('subject')}</div>
          )}
        </div>

        {/* Priority Field */}
        <div>
          <label htmlFor='priority' className='mb-2 block text-sm font-medium text-gray-700'>
            Priority
          </label>
          <select
            id='priority'
            value={data.priority}
            onChange={e => updateData('priority', e.target.value as 'low' | 'medium' | 'high')}
            className='w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
          >
            <option value='low'>Low - General inquiry</option>
            <option value='medium'>Medium - Standard request</option>
            <option value='high'>High - Urgent matter</option>
          </select>
        </div>

        {/* Message Field */}
        <div>
          <label htmlFor='message' className='mb-2 block text-sm font-medium text-gray-700'>
            Message <span className='text-red-500'>*</span>
          </label>
          <textarea
            id='message'
            placeholder='Tell us more about your inquiry...'
            value={data.message}
            onChange={e => updateData('message', e.target.value)}
            onBlur={() => handleBlur('message', data.message)}
            rows={5}
            className={`w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              hasError('message') ? 'border-red-500' : 'border-gray-300'
            }`}
            aria-invalid={hasError('message')}
          />
          {hasError('message') && (
            <div className='mt-1 text-sm text-red-600'>{getError('message')}</div>
          )}
        </div>

        {/* Preferred Contact Method */}
        <div>
          <label
            htmlFor='preferredContact'
            className='mb-2 block text-sm font-medium text-gray-700'
          >
            Preferred Contact Method
          </label>
          <select
            id='preferredContact'
            value={data.preferredContact}
            onChange={e => updateData('preferredContact', e.target.value as 'email' | 'phone')}
            className='w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
          >
            <option value='email'>Email</option>
            <option value='phone'>Phone</option>
          </select>
        </div>

        {/* Newsletter Subscription */}
        <div className='flex items-start space-x-2'>
          <input
            id='subscribe'
            type='checkbox'
            checked={data.subscribe}
            onChange={e => updateData('subscribe', e.target.checked)}
            className='mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500'
          />
          <div>
            <label htmlFor='subscribe' className='text-sm font-medium text-gray-700'>
              Subscribe to our newsletter
            </label>
            <p className='text-sm text-gray-500'>
              Receive updates about our products and services.
            </p>
          </div>
        </div>

        {/* Form Actions */}
        <div className='flex items-center justify-between pt-4'>
          <button
            type='button'
            onClick={resetForm}
            disabled={!isDirty || isSubmitting}
            className='rounded-md border border-gray-300 bg-gray-100 px-4 py-2 text-gray-700 hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50'
          >
            Reset
          </button>
          <button
            type='submit'
            disabled={!isValid || !isDirty || isSubmitting}
            className='min-w-[120px] rounded-md bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50'
          >
            {isSubmitting ? (
              <div className='flex items-center justify-center gap-2'>
                <div className='h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent' />
                Sending...
              </div>
            ) : (
              'Send Message'
            )}
          </button>
        </div>

        {/* Form Status */}
        <div className='text-xs text-gray-500'>
          {isDirty && !isValid && 'Please fix the errors above to submit the form.'}
          {isValid && isDirty && 'Form is ready to submit.'}
          {!isDirty && 'Please fill out the form to get started.'}
        </div>
      </form>
    </div>
  )
}

export default SimpleValidatedForm
