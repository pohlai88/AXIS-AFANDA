/**
 * @file        line-clamp-demo.tsx
 * @description TODO: Add description
 *
 * @repo        AXIS-V3
 * @path        components\\line-clamp-demo.tsx
 *
 * @since       2026-01-26
 * @changedate  2026-01-26
 * @changeref   {{changeRef}}
 *
 * @category    General
 * @tags        TODO
 */

'use client'

import { cn } from '@/lib/utils'
import { useState } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'

export default function LineClampDemo() {
  const [isExpanded, setIsExpanded] = useState(false)

  const longText = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.`

  const examples = [
    {
      title: 'Single Line Truncation',
      className: 'line-clamp-1',
      description: 'Truncates text after exactly one line with ellipsis',
    },
    {
      title: 'Two Line Truncation',
      className: 'line-clamp-2',
      description: 'Perfect for short descriptions and summaries',
    },
    {
      title: 'Three Line Truncation',
      className: 'line-clamp-3',
      description: 'Ideal for card descriptions and article excerpts',
    },
    {
      title: 'Four Line Truncation',
      className: 'line-clamp-4',
      description: 'Good for longer content that still needs to be contained',
    },
    {
      title: 'Six Line Truncation',
      className: 'line-clamp-6',
      description: 'Maximum default truncation for longer content blocks',
    },
  ]

  return (
    <div className='space-y-8 p-6'>
      <div className='space-y-2 text-center'>
        <h1 className='text-3xl font-bold'>Line Clamp Demo</h1>
        <p className='text-muted-foreground'>
          Showcase of @tailwindcss/line-clamp plugin utilities
        </p>
      </div>

      {/* Basic Examples */}
      <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
        {examples.map((example, index) => (
          <Card key={index} className='h-fit'>
            <CardHeader>
              <CardTitle className='text-lg'>{example.title}</CardTitle>
              <CardDescription>{example.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className={cn(example.className, 'text-sm leading-relaxed')}>{longText}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Responsive Example */}
      <Card>
        <CardHeader>
          <CardTitle>Responsive Line Clamp</CardTitle>
          <CardDescription>
            Text truncation that adapts to screen size - 2 lines on mobile, 4 on tablet, 6 on
            desktop
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className='line-clamp-2 text-sm leading-relaxed md:line-clamp-4 lg:line-clamp-6'>
            {longText}
          </p>
        </CardContent>
      </Card>

      {/* Interactive Example */}
      <Card>
        <CardHeader>
          <CardTitle>Interactive Line Clamp</CardTitle>
          <CardDescription>
            Click the button to toggle between truncated and full text
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <p
            className={cn(
              'text-sm leading-relaxed transition-all duration-(--ax-motion-base)',
              isExpanded ? 'line-clamp-none' : 'line-clamp-3'
            )}
          >
            {longText}
          </p>
          <Button variant='outline' onClick={() => setIsExpanded(!isExpanded)} className='w-fit'>
            {isExpanded ? 'Show Less' : 'Show More'}
          </Button>
        </CardContent>
      </Card>

      {/* Component Integration Examples */}
      <div className='space-y-4'>
        <h2 className='text-2xl font-semibold'>Component Integration Examples</h2>

        {/* Enhanced Card */}
        <Card>
          <CardHeader>
            <CardTitle>Enhanced Card Component</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='line-clamp-3 text-muted-foreground'>
              This card demonstrates how line-clamp can be integrated into existing components to
              ensure consistent heights and clean text truncation. Perfect for product cards,
              article previews, and notification panels.
            </p>
          </CardContent>
        </Card>

        {/* Button with long text */}
        <div className='space-y-2'>
          <h3 className='text-lg font-medium'>Button with Long Text</h3>
          <div className='flex flex-wrap gap-4'>
            <Button className='line-clamp-1 max-w-xs'>
              This is a very long button text that should be truncated with ellipsis
            </Button>
            <Button variant='outline' className='line-clamp-1 max-w-xs'>
              Another button with extremely long text content that needs truncation
            </Button>
          </div>
        </div>

        {/* Typography integration */}
        <div className='space-y-2'>
          <h3 className='text-lg font-medium'>Typography Integration</h3>
          <div className='prose prose-sm max-w-none'>
            <p className='line-clamp-4'>
              The line-clamp utilities work seamlessly with the typography plugin. This allows you
              to maintain beautiful typography while controlling text overflow. Perfect for article
              excerpts, blog post previews, and content sections where you want to maintain
              typographic consistency while truncating text.
            </p>
          </div>
        </div>
      </div>

      {/* Best Practices */}
      <Card>
        <CardHeader>
          <CardTitle>Best Practices</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className='space-y-2 text-sm text-muted-foreground'>
            <li>• Use line-clamp for consistent component heights in grids</li>
            <li>• Combine with responsive prefixes for adaptive text display</li>
            <li>• Perfect for card descriptions, article excerpts, and notifications</li>
            <li>• Works with hover states for interactive text reveals</li>
            <li>• Combine with state management for expandable content</li>
            <li>• Use line-clamp-none to remove truncation when needed</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
