/**
 * @file        validated-contact-form.tsx
 * @description TODO: Add description
 *
 * @repo        AXIS-V3
 * @path        components\\validated-contact-form.tsx
 *
 * @since       2026-01-26
 * @changedate  2026-01-26
 * @changeref   {{changeRef}}
 *
 * @category    General
 * @tags        TODO
 */

'use client'

import logger from '@/lib/logger'
import { useFormValidation } from '@/lib/zod-hooks'
import { contactFormSchema, type ContactForm } from '@/lib/zod-schemas'
import React, { useState } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'

interface ValidatedContactFormProps {
  onSubmit?: (data: ContactForm) => Promise<void>
  className?: string
}

export function ValidatedContactForm({ onSubmit, className }: ValidatedContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const initialValues: {
    name: string
    email: string
    subject: string
    message: string
    priority: 'low' | 'medium' | 'high'
    preferredContact: 'email' | 'phone'
    subscribe: boolean
  } = {
    name: '',
    email: '',
    subject: '',
    message: '',
    priority: 'medium',
    preferredContact: 'email',
    subscribe: false,
  }

  const {
    data,
    isValid,
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
        setIsSubmitting(true)
        try {
          await onSubmit(formData)
        } finally {
          setIsSubmitting(false)
        }
      }
    },
    onValidationError: errors => {
      // In a real app, you might want to show these errors to the user
      // or send them to an error tracking service
      if (process.env.NODE_ENV === 'development') {
        logger.error(errors, 'Validation errors:')
      }
    },
  })

  const handleInputChange = (field: keyof typeof initialValues, value: string | boolean) => {
    updateData(field, value)
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await handleSubmit(e)
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Contact Us</CardTitle>
        <CardDescription>
          Send us a message and we'll get back to you as soon as possible.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleFormSubmit} className='space-y-4'>
          {/* Name Field */}
          <div className='space-y-2'>
            <Label htmlFor='name'>Name *</Label>
            <Input
              id='name'
              type='text'
              value={data.name}
              onChange={e => handleInputChange('name', e.target.value)}
              onBlur={() => handleBlur('name')}
              placeholder='John Doe'
              className={hasError('name') ? 'border-red-500' : ''}
            />
            {hasError('name') && <p className='text-sm text-red-500'>{getError('name')}</p>}
          </div>

          {/* Email Field */}
          <div className='space-y-2'>
            <Label htmlFor='email'>Email *</Label>
            <Input
              id='email'
              type='email'
              value={data.email}
              onChange={e => handleInputChange('email', e.target.value)}
              onBlur={() => handleBlur('email')}
              placeholder='john.doe@example.com'
              className={hasError('email') ? 'border-red-500' : ''}
            />
            {hasError('email') && <p className='text-sm text-red-500'>{getError('email')}</p>}
          </div>

          {/* Subject Field */}
          <div className='space-y-2'>
            <Label htmlFor='subject'>Subject *</Label>
            <Input
              id='subject'
              type='text'
              value={data.subject}
              onChange={e => handleInputChange('subject', e.target.value)}
              onBlur={() => handleBlur('subject')}
              placeholder='How can we help?'
              className={hasError('subject') ? 'border-red-500' : ''}
            />
            {hasError('subject') && <p className='text-sm text-red-500'>{getError('subject')}</p>}
          </div>

          {/* Priority Field */}
          <div className='space-y-2'>
            <Label htmlFor='priority'>Priority</Label>
            <select
              id='priority'
              value={data.priority}
              onChange={e => handleInputChange('priority', e.target.value)}
              onBlur={() => handleBlur('priority')}
              className='w-full rounded-md border p-2'
            >
              <option value='low'>Low</option>
              <option value='medium'>Medium</option>
              <option value='high'>High</option>
            </select>
            {hasError('priority') && <p className='text-sm text-red-500'>{getError('priority')}</p>}
          </div>

          {/* Preferred Contact Method */}
          <div className='space-y-2'>
            <Label htmlFor='preferredContact'>Preferred Contact Method</Label>
            <select
              id='preferredContact'
              value={data.preferredContact}
              onChange={e => handleInputChange('preferredContact', e.target.value)}
              onBlur={() => handleBlur('preferredContact')}
              className='w-full rounded-md border p-2'
            >
              <option value='email'>Email</option>
              <option value='phone'>Phone</option>
            </select>
            {hasError('preferredContact') && (
              <p className='text-sm text-red-500'>{getError('preferredContact')}</p>
            )}
          </div>

          {/* Message Field */}
          <div className='space-y-2'>
            <Label htmlFor='message'>Message *</Label>
            <Textarea
              id='message'
              value={data.message}
              onChange={e => handleInputChange('message', e.target.value)}
              onBlur={() => handleBlur('message')}
              placeholder='Your message here...'
              rows={5}
              className={hasError('message') ? 'border-red-500' : ''}
            />
            {hasError('message') && <p className='text-sm text-red-500'>{getError('message')}</p>}
          </div>

          {/* Subscribe Checkbox */}
          <div className='flex items-center space-x-2'>
            <input
              id='subscribe'
              type='checkbox'
              checked={data.subscribe}
              onChange={e => handleInputChange('subscribe', e.target.checked)}
              onBlur={() => handleBlur('subscribe')}
              className='rounded'
            />
            <Label htmlFor='subscribe'>Subscribe to newsletter</Label>
          </div>
          {hasError('subscribe') && <p className='text-sm text-red-500'>{getError('subscribe')}</p>}

          {/* Form Status */}
          <div className='text-sm text-muted-foreground'>
            {isDirty && !isValid && 'Please fix the errors above to submit the form.'}
            {isValid && isDirty && 'Form is ready to submit.'}
            {!isDirty && 'Please fill out the form to get started.'}
          </div>

          {/* Submit Button */}
          <div className='flex space-x-2'>
            <Button type='submit' disabled={!isDirty || isSubmitting} className='flex-1'>
              {isSubmitting ? 'Submitting...' : 'Send Message'}
            </Button>
            <Button
              type='button'
              variant='outline'
              onClick={() => resetForm()}
              disabled={isSubmitting}
            >
              Reset
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
