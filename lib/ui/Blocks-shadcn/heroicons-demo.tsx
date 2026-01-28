/**
 * @file        heroicons-demo.tsx
 * @description TODO: Add description
 *
 * @repo        AXIS-V3
 * @path        components\\heroicons-demo.tsx
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
import { cn } from '@/lib/utils'
import { useState } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'

// Import outline icons
import {
  BellIcon,
  BuildingOfficeIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  Cog6ToothIcon as CogIcon,
  PencilIcon as EditIcon,
  EyeIcon,
  EyeSlashIcon,
  DocumentIcon as FileIcon,
  GlobeAltIcon as GlobeIcon,
  HeartIcon,
  HomeIcon,
  PhotoIcon as ImageIcon,
  BoltIcon as LightningIcon,
  EnvelopeIcon as MailIcon,
  PhoneIcon,
  PlusIcon,
  MagnifyingGlassIcon as SearchIcon,
  ShieldCheckIcon as ShieldIcon,
  SparklesIcon,
  StarIcon,
  TrashIcon,
  UserGroupIcon,
  VideoCameraIcon as VideoIcon,
} from '@heroicons/react/24/outline'

// Import solid icons with different names to avoid conflicts
import {
  CheckCircleIcon as CheckCircleSolid,
  InformationCircleIcon as InfoSolid,
  ExclamationTriangleIcon as WarningSolid,
  XCircleIcon as XCircleSolid,
} from '@heroicons/react/24/solid'

export default function HeroiconsDemo() {
  const [isVisible, setIsVisible] = useState(true)
  const [isExpanded, setIsExpanded] = useState(false)
  const [rating, setRating] = useState(3)

  return (
    <div className='space-y-8 p-6'>
      {/* Header */}
      <div className='space-y-2 text-center'>
        <h1 className='flex items-center justify-center gap-2 text-3xl font-bold'>
          <SparklesIcon className='size-8 text-blue-500' />
          Heroicons Integration Demo
        </h1>
        <p className='text-muted-foreground'>
          Showcase of @heroicons/react integration with our Tailwind CSS setup
        </p>
      </div>

      {/* Navigation Icons */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <HomeIcon className='size-5' />
            Navigation Icons
          </CardTitle>
          <CardDescription>
            Common navigation and layout icons with consistent styling
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
            <div className='flex items-center gap-2 rounded-lg border p-3'>
              <HomeIcon className='size-5 text-blue-500' />
              <span className='text-sm font-medium'>Home</span>
            </div>
            <div className='flex items-center gap-2 rounded-lg border p-3'>
              <BuildingOfficeIcon className='size-5 text-green-500' />
              <span className='text-sm font-medium'>Office</span>
            </div>
            <div className='flex items-center gap-2 rounded-lg border p-3'>
              <UserGroupIcon className='size-5 text-purple-500' />
              <span className='text-sm font-medium'>Users</span>
            </div>
            <div className='flex items-center gap-2 rounded-lg border p-3'>
              <CogIcon className='size-5 text-gray-500' />
              <span className='text-sm font-medium'>Settings</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Icons */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <PlusIcon className='size-5' />
            Action Icons
          </CardTitle>
          <CardDescription>Interactive action buttons with icon integration</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='flex flex-wrap gap-3'>
            <Button>
              <PlusIcon className='size-4' />
              Add Item
            </Button>
            <Button variant='outline'>
              <EditIcon className='size-4' />
              Edit
            </Button>
            <Button variant='destructive'>
              <TrashIcon className='size-4' />
              Delete
            </Button>
            <Button variant='outline' onClick={() => setIsVisible(!isVisible)}>
              {isVisible ? <EyeSlashIcon className='size-4' /> : <EyeIcon className='size-4' />}
              {isVisible ? 'Hide' : 'Show'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Form Icons */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <MailIcon className='size-5' />
            Form Integration
          </CardTitle>
          <CardDescription>Icons integrated into form components for better UX</CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='grid gap-4 md:grid-cols-2'>
            <div className='relative'>
              <MailIcon className='absolute left-3 top-3 size-4 text-gray-400' />
              <input
                type='email'
                placeholder='Email address'
                className='w-full rounded-md border py-2 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-blue-500'
              />
            </div>
            <div className='relative'>
              <PhoneIcon className='absolute left-3 top-3 size-4 text-gray-400' />
              <input
                type='tel'
                placeholder='Phone number'
                className='w-full rounded-md border py-2 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-blue-500'
              />
            </div>
            <div className='relative'>
              <GlobeIcon className='absolute left-3 top-3 size-4 text-gray-400' />
              <input
                type='url'
                placeholder='Website'
                className='w-full rounded-md border py-2 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-blue-500'
              />
            </div>
            <div className='relative'>
              <SearchIcon className='absolute left-3 top-3 size-4 text-gray-400' />
              <input
                type='search'
                placeholder='Search...'
                className='w-full rounded-md border py-2 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-blue-500'
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status Indicators */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <CheckCircleSolid className='size-5' />
            Status Indicators
          </CardTitle>
          <CardDescription>Status icons with appropriate colors and meanings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
            <div className='flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 p-3'>
              <CheckCircleSolid className='size-5 text-green-600' />
              <div>
                <div className='font-medium text-green-900'>Success</div>
                <div className='text-sm text-green-700'>Operation completed</div>
              </div>
            </div>
            <div className='flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3'>
              <XCircleSolid className='size-5 text-red-600' />
              <div>
                <div className='font-medium text-red-900'>Error</div>
                <div className='text-sm text-red-700'>Operation failed</div>
              </div>
            </div>
            <div className='flex items-center gap-2 rounded-lg border border-yellow-200 bg-yellow-50 p-3'>
              <WarningSolid className='size-5 text-yellow-600' />
              <div>
                <div className='font-medium text-yellow-900'>Warning</div>
                <div className='text-sm text-yellow-700'>Please review</div>
              </div>
            </div>
            <div className='flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 p-3'>
              <InfoSolid className='size-5 text-blue-600' />
              <div>
                <div className='font-medium text-blue-900'>Info</div>
                <div className='text-sm text-blue-700'>Additional details</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Interactive Components */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <HeartIcon className='size-5' />
            Interactive Components
          </CardTitle>
          <CardDescription>Icons with interactive states and animations</CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          {/* Expandable Content */}
          <div className='rounded-lg border'>
            <Button
              variant='ghost'
              className='w-full justify-between'
              onClick={() => setIsExpanded(!isExpanded)}
            >
              Expandable Content
              {isExpanded ? (
                <ChevronUpIcon className='size-4' />
              ) : (
                <ChevronDownIcon className='size-4' />
              )}
            </Button>
            {isExpanded && (
              <div className='border-t bg-muted/50 p-4'>
                <p className='text-sm text-muted-foreground'>
                  This content can be expanded and collapsed using the chevron icons. The icons
                  change based on the expanded state, providing clear visual feedback.
                </p>
              </div>
            )}
          </div>

          {/* Rating Component */}
          <div className='space-y-2'>
            <label className='text-sm font-medium'>Rating:</label>
            <div className='flex gap-1'>
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className='rounded p-1 transition-colors hover:bg-muted'
                >
                  <StarIcon
                    className={cn(
                      'size-5 transition-colors',
                      star <= rating ? 'fill-current text-yellow-500' : 'text-gray-300'
                    )}
                  />
                </button>
              ))}
            </div>
            <p className='text-sm text-muted-foreground'>Selected rating: {rating} stars</p>
          </div>

          {/* Toggle Icons */}
          <div className='flex items-center gap-4'>
            <Button
              variant='outline'
              onClick={() => {
                if (process.env.NODE_ENV === 'development') {
                  logger.info('Notifications toggled')
                }
              }}
            >
              <BellIcon className='size-4' />
              Notifications
            </Button>
            <Button
              variant='outline'
              onClick={() => {
                if (process.env.NODE_ENV === 'development') {
                  logger.info('Favorited')
                }
              }}
            >
              <HeartIcon className='size-4' />
              Favorite
            </Button>
            <Button
              variant='outline'
              onClick={() => {
                if (process.env.NODE_ENV === 'development') {
                  logger.info('Security checked')
                }
              }}
            >
              <ShieldIcon className='size-4' />
              Secure
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Media Icons */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <ImageIcon className='size-5' />
            Media & Content Icons
          </CardTitle>
          <CardDescription>Icons for media files and content types</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
            <div className='flex flex-col items-center gap-2 rounded-lg border p-4'>
              <ImageIcon className='size-8 text-blue-500' />
              <span className='text-sm font-medium'>Image</span>
            </div>
            <div className='flex flex-col items-center gap-2 rounded-lg border p-4'>
              <VideoIcon className='size-8 text-red-500' />
              <span className='text-sm font-medium'>Video</span>
            </div>
            <div className='flex flex-col items-center gap-2 rounded-lg border p-4'>
              <FileIcon className='size-8 text-gray-500' />
              <span className='text-sm font-medium'>Document</span>
            </div>
            <div className='flex flex-col items-center gap-2 rounded-lg border p-4'>
              <LightningIcon className='size-8 text-yellow-500' />
              <span className='text-sm font-medium'>Quick</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Best Practices */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <InfoSolid className='size-5' />
            Integration Best Practices
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className='space-y-2 text-sm text-muted-foreground'>
            <li>• Use size-* utilities for consistent icon sizing (size-4, size-5, size-6)</li>
            <li>• Apply color utilities for theme consistency (text-gray-500, text-blue-500)</li>
            <li>• Combine with spacing utilities for proper layout (mr-2, ml-2, gap-2)</li>
            <li>• Use solid icons for emphasis and outline icons for subtlety</li>
            <li>• Implement interactive states with hover and focus utilities</li>
            <li>• Maintain consistent stroke width and visual weight across components</li>
            <li>• Use semantic icons that match their action or content purpose</li>
            <li>• Consider accessibility by adding appropriate aria labels when needed</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
