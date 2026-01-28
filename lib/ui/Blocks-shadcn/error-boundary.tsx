/**
 * @file        error-boundary.tsx
 * @description TODO: Add description
 *
 * @repo        AXIS-V3
 * @path        components\\error-boundary.tsx
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
import React from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error | null
  errorInfo?: React.ErrorInfo | null
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error?: Error; errorInfo?: React.ErrorInfo; reset: () => void }>
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error, errorInfo: null }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ error, errorInfo })

    // Log error to service in production
    if (process.env.NODE_ENV === 'production') {
      // Here you would send to an error tracking service
      logger.error({ error, errorInfo }, 'Error caught by boundary')
    }
  }

  reset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null })
  }

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback
      return (
        <FallbackComponent
          reset={this.reset}
          {...(this.state.error && { error: this.state.error })}
          {...(this.state.errorInfo && { errorInfo: this.state.errorInfo })}
        />
      )
    }

    return this.props.children
  }
}

function DefaultErrorFallback({
  error,
  errorInfo,
  reset,
}: {
  error?: Error
  errorInfo?: React.ErrorInfo
  reset: () => void
}) {
  return (
    <div className='flex min-h-[400px] items-center justify-center p-4'>
      <Card className='w-full max-w-md'>
        <CardHeader>
          <CardTitle className='text-red-600'>Something went wrong</CardTitle>
          <CardDescription>
            An unexpected error occurred. Please try again or contact support if the problem
            persists.
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          {process.env.NODE_ENV === 'development' && error && (
            <details className='rounded-md bg-gray-100 p-4 text-sm'>
              <summary className='cursor-pointer font-mono font-semibold'>Error Details</summary>
              <pre className='mt-2 whitespace-pre-wrap text-xs'>{error.stack}</pre>
              {errorInfo && (
                <pre className='mt-2 whitespace-pre-wrap text-xs'>{errorInfo.componentStack}</pre>
              )}
            </details>
          )}
          <Button onClick={reset} className='w-full'>
            Try Again
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default ErrorBoundary
