/**
 * @file        aspect-ratio-demo.tsx
 * @description TODO: Add description
 *
 * @repo        AXIS-V3
 * @path        components\\aspect-ratio-demo.tsx
 *
 * @since       2026-01-26
 * @changedate  2026-01-26
 * @changeref   {{changeRef}}
 *
 * @category    General
 * @tags        TODO
 */

import { AspectRatio } from '@/components/ui/aspect-ratio'

export default function AspectRatioDemo() {
  return (
    <div className='container mx-auto space-y-12 px-4 py-8'>
      <section>
        <h2 className='mb-6 text-2xl font-bold'>Basic Aspect Ratios</h2>
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
          <div className='space-y-2'>
            <h3 className='text-lg font-semibold'>Square (1:1)</h3>
            <AspectRatio ratio={1}>
              <img
                src='https://via.placeholder.com/400x400/4F46E5/FFFFFF?text=Square+1:1'
                alt='Square aspect ratio'
                className='h-full w-full rounded-lg border-2 border-border object-cover'
              />
            </AspectRatio>
            <p className='text-sm text-muted-foreground'>aspect-w-1 aspect-h-1</p>
          </div>

          <div className='space-y-2'>
            <h3 className='text-lg font-semibold'>Video (16:9)</h3>
            <AspectRatio ratio={16 / 9}>
              <img
                src='https://via.placeholder.com/400x225/4F46E5/FFFFFF?text=Video+16:9'
                alt='Video aspect ratio'
                className='h-full w-full rounded-lg border-2 border-border object-cover'
              />
            </AspectRatio>
            <p className='text-sm text-muted-foreground'>aspect-w-16 aspect-h-9</p>
          </div>

          <div className='space-y-2'>
            <h3 className='text-lg font-semibold'>Portrait (9:16)</h3>
            <AspectRatio ratio={9 / 16}>
              <img
                src='https://via.placeholder.com/225x400/4F46E5/FFFFFF?text=Portrait+9:16'
                alt='Portrait aspect ratio'
                className='h-full w-full rounded-lg border-2 border-border object-cover'
              />
            </AspectRatio>
            <p className='text-sm text-muted-foreground'>aspect-w-9 aspect-h-16</p>
          </div>

          <div className='space-y-2'>
            <h3 className='text-lg font-semibold'>Widescreen (21:9)</h3>
            <AspectRatio ratio={21 / 9}>
              <img
                src='https://via.placeholder.com/400x171/4F46E5/FFFFFF?text=Widescreen+21:9'
                alt='Widescreen aspect ratio'
                className='h-full w-full rounded-lg border-2 border-border object-cover'
              />
            </AspectRatio>
            <p className='text-sm text-muted-foreground'>aspect-w-21 aspect-h-9</p>
          </div>

          <div className='space-y-2'>
            <h3 className='text-lg font-semibold'>Golden Ratio</h3>
            <AspectRatio ratio={1.618}>
              <img
                src='https://via.placeholder.com/400x247/4F46E5/FFFFFF?text=Golden+Ratio'
                alt='Golden ratio'
                className='h-full w-full rounded-lg border-2 border-border object-cover'
              />
            </AspectRatio>
            <p className='text-sm text-muted-foreground'>aspect-w-16 aspect-h-10</p>
          </div>

          <div className='space-y-2'>
            <h3 className='text-lg font-semibold'>No Aspect Ratio</h3>
            <AspectRatio ratio={1}>
              <img
                src='https://via.placeholder.com/400x200/4F46E5/FFFFFF?text=No+Aspect+Ratio'
                alt='No aspect ratio'
                className='h-full w-full rounded-lg border-2 border-border object-cover'
              />
            </AspectRatio>
            <p className='text-sm text-muted-foreground'>aspect-none</p>
          </div>
        </div>
      </section>

      <section>
        <h2 className='mb-6 text-2xl font-bold'>Video Embeds</h2>
        <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
          <div className='space-y-2'>
            <h3 className='text-lg font-semibold'>YouTube Video</h3>
            <AspectRatio ratio={16 / 9}>
              <iframe
                src='https://www.youtube.com/embed/dQw4w9WgXcQ'
                title='YouTube video player'
                className='h-full w-full rounded-lg border-2 border-border'
                allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                allowFullScreen
              />
            </AspectRatio>
            <p className='text-sm text-muted-foreground'>Standard 16:9 video embed</p>
          </div>

          <div className='space-y-2'>
            <h3 className='text-lg font-semibold'>Custom Video Player</h3>
            <AspectRatio ratio={16 / 9}>
              <div className='flex h-full w-full items-center justify-center rounded-lg border-2 border-border bg-black'>
                <div className='text-center text-white'>
                  <svg className='mx-auto mb-2 h-16 w-16' fill='currentColor' viewBox='0 0 20 20'>
                    <path
                      fillRule='evenodd'
                      d='M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z'
                      clipRule='evenodd'
                    />
                  </svg>
                  <p className='text-sm'>Custom Video Player</p>
                </div>
              </div>
            </AspectRatio>
            <p className='text-sm text-muted-foreground'>Custom video placeholder</p>
          </div>
        </div>
      </section>

      <section>
        <h2 className='mb-6 text-2xl font-bold'>Image Gallery</h2>
        <div className='grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4'>
          {Array.from({ length: 12 }, (_, i) => {
            const ratios = ['square', 'video', 'portrait', 'widescreen'] as const
            const ratio = ratios[i % ratios.length]
            const ratioValue = {
              square: 1,
              video: 16 / 9,
              portrait: 9 / 16,
              widescreen: 21 / 9,
            }[ratio as keyof typeof ratio] || 1
            const colors = ['4F46E5', '10B981', 'F59E0B', 'EF4444', '8B5CF6', 'EC4899']
            const color = colors[i % colors.length]

            return (
              <div key={i} className='group'>
                <AspectRatio ratio={ratioValue}>
                  <img
                    src={`https://via.placeholder.com/400x400/${color}/FFFFFF?text=Image+${i + 1}`}
                    alt={`Gallery image ${i + 1}`}
                    className='h-full w-full rounded-lg border-2 border-border object-cover transition-transform duration-200 group-hover:scale-105'
                  />
                </AspectRatio>
                <p className='mt-1 text-center text-xs text-muted-foreground'>Image {i + 1}</p>
              </div>
            )
          })}
        </div>
      </section>

      <section>
        <h2 className='mb-6 text-2xl font-bold'>Card Layouts</h2>
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
          <div className='bg-card overflow-hidden rounded-lg border border-border shadow-lg'>
            <AspectRatio ratio={16 / 9}>
              <img
                src='https://via.placeholder.com/400x225/4F46E5/FFFFFF?text=Card+Image'
                alt='Card image'
                className='h-full w-full object-cover'
              />
            </AspectRatio>
            <div className='p-4'>
              <h3 className='mb-2 font-semibold'>Video Card</h3>
              <p className='text-sm text-muted-foreground'>
                Card with 16:9 aspect ratio image perfect for video content.
              </p>
              <div className='mt-4 flex gap-2'>
                <span className='rounded bg-primary/10 px-2 py-1 text-xs text-primary'>Video</span>
                <span className='rounded bg-secondary px-2 py-1 text-xs'>Media</span>
              </div>
            </div>
          </div>

          <div className='bg-card overflow-hidden rounded-lg border border-border shadow-lg'>
            <AspectRatio ratio={1}>
              <img
                src='https://via.placeholder.com/400x400/10B981/FFFFFF?text=Square+Card'
                alt='Square card image'
                className='h-full w-full object-cover'
              />
            </AspectRatio>
            <div className='p-4'>
              <h3 className='mb-2 font-semibold'>Square Card</h3>
              <p className='text-sm text-muted-foreground'>
                Card with square aspect ratio ideal for product images.
              </p>
              <div className='mt-4 flex gap-2'>
                <span className='rounded bg-primary/10 px-2 py-1 text-xs text-primary'>
                  Product
                </span>
                <span className='rounded bg-secondary px-2 py-1 text-xs'>Square</span>
              </div>
            </div>
          </div>

          <div className='bg-card overflow-hidden rounded-lg border border-border shadow-lg'>
            <AspectRatio ratio={9 / 16}>
              <img
                src='https://via.placeholder.com/300x400/F59E0B/FFFFFF?text=Portrait+Card'
                alt='Portrait card image'
                className='h-full w-full object-cover'
              />
            </AspectRatio>
            <div className='p-4'>
              <h3 className='mb-2 font-semibold'>Portrait Card</h3>
              <p className='text-sm text-muted-foreground'>
                Card with portrait aspect ratio great for profile images.
              </p>
              <div className='mt-4 flex gap-2'>
                <span className='rounded bg-primary/10 px-2 py-1 text-xs text-primary'>
                  Profile
                </span>
                <span className='rounded bg-secondary px-2 py-1 text-xs'>Portrait</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className='mb-6 text-2xl font-bold'>Responsive Aspect Ratios</h2>
        <div className='space-y-6'>
          <div className='space-y-2'>
            <h3 className='text-lg font-semibold'>Mobile Square, Desktop Video</h3>
            <AspectRatio ratio={1} className='md:aspect-h-9 md:aspect-w-16'>
              <img
                src='https://via.placeholder.com/400x400/8B5CF6/FFFFFF?text=Responsive+Image'
                alt='Responsive aspect ratio'
                className='h-full w-full rounded-lg border-2 border-border object-cover'
              />
            </AspectRatio>
            <p className='text-sm text-muted-foreground'>
              Square on mobile (aspect-w-1 aspect-h-1), Video on desktop (aspect-w-16 aspect-h-9)
            </p>
          </div>

          <div className='space-y-2'>
            <h3 className='text-lg font-semibold'>Video Ratio, Remove on Large</h3>
            <AspectRatio ratio={16 / 9} className='lg:aspect-none'>
              <img
                src='https://via.placeholder.com/400x225/EC4899/FFFFFF?text=Adaptive+Image'
                alt='Adaptive aspect ratio'
                className='h-full w-full rounded-lg border-2 border-border object-cover lg:h-full lg:w-full'
              />
            </AspectRatio>
            <p className='text-sm text-muted-foreground'>
              Video ratio on mobile/tablet, no aspect ratio on large screens (aspect-none)
            </p>
          </div>

          <div className='space-y-2'>
            <h3 className='text-lg font-semibold'>Complex Responsive Layout</h3>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              <AspectRatio ratio={9 / 16} className='lg:aspect-h-3 lg:aspect-w-4'>
                <img
                  src='https://via.placeholder.com/300x400/EF4444/FFFFFF?text=Complex+1'
                  alt='Complex responsive 1'
                  className='h-full w-full rounded-lg border-2 border-border object-cover'
                />
              </AspectRatio>
              <AspectRatio ratio={1} className='lg:aspect-h-9 lg:aspect-w-16'>
                <img
                  src='https://via.placeholder.com/400x400/3B82F6/FFFFFF?text=Complex+2'
                  alt='Complex responsive 2'
                  className='h-full w-full rounded-lg border-2 border-border object-cover'
                />
              </AspectRatio>
            </div>
            <p className='text-sm text-muted-foreground'>
              Complex responsive behavior with different aspect ratios per breakpoint
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2 className='mb-6 text-2xl font-bold'>Advanced Examples</h2>
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
          <div className='space-y-2'>
            <h3 className='text-lg font-semibold'>Gradient Background</h3>
            <AspectRatio ratio={16 / 9}>
              <div className='flex h-full w-full items-center justify-center rounded-lg border-2 border-border bg-gradient-to-br from-blue-500 to-purple-600'>
                <div className='text-center text-white'>
                  <h4 className='mb-2 text-xl font-bold'>Gradient Content</h4>
                  <p>Beautiful gradient background</p>
                </div>
              </div>
            </AspectRatio>
            <p className='text-sm text-muted-foreground'>Aspect ratio with gradient background</p>
          </div>

          <div className='space-y-2'>
            <h3 className='text-lg font-semibold'>Image Overlay</h3>
            <AspectRatio ratio={16 / 9} className='group relative'>
              <img
                src='https://via.placeholder.com/400x225/6366F1/FFFFFF?text=Overlay+Image'
                alt='Overlay example'
                className='h-full w-full rounded-lg object-cover'
              />
              <div className='absolute inset-0 flex items-end rounded-lg bg-black/60'>
                <div className='p-4 text-white'>
                  <h4 className='text-lg font-semibold'>Overlay Title</h4>
                  <p className='text-sm opacity-90'>Content overlay on aspect ratio image</p>
                </div>
              </div>
            </AspectRatio>
            <p className='text-sm text-muted-foreground'>Image with overlay content</p>
          </div>

          <div className='space-y-2'>
            <h3 className='text-lg font-semibold'>Loading State</h3>
            <AspectRatio ratio={1}>
              <div className='flex h-full w-full items-center justify-center rounded-lg border-2 border-border bg-muted'>
                <div className='text-center'>
                  <div className='mx-auto mb-2 h-8 w-8 animate-spin rounded-full border-b-2 border-primary'></div>
                  <p className='text-sm text-muted-foreground'>Loading content...</p>
                </div>
              </div>
            </AspectRatio>
            <p className='text-sm text-muted-foreground'>Loading state in aspect ratio container</p>
          </div>

          <div className='space-y-2'>
            <h3 className='text-lg font-semibold'>Error State</h3>
            <AspectRatio ratio={16 / 9}>
              <div className='flex h-full w-full items-center justify-center rounded-lg border-2 border-destructive/20 bg-destructive/10'>
                <div className='text-center'>
                  <svg
                    className='mx-auto mb-2 h-12 w-12 text-destructive'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 16.5c-.77.833.192 2.5 1.732 2.5z'
                    />
                  </svg>
                  <p className='text-sm font-medium text-destructive'>Failed to load</p>
                </div>
              </div>
            </AspectRatio>
            <p className='text-sm text-muted-foreground'>Error state in aspect ratio container</p>
          </div>
        </div>
      </section>

      <section>
        <h2 className='mb-6 text-2xl font-bold'>Custom Ratio Examples</h2>
        <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
          <div className='space-y-2'>
            <h3 className='text-lg font-semibold'>4:3 Traditional</h3>
            <div className='aspect-h-3 aspect-w-4'>
              <img
                src='https://via.placeholder.com/400x300/059669/FFFFFF?text=4:3+Ratio'
                alt='4:3 aspect ratio'
                className='h-full w-full rounded-lg border-2 border-border object-cover'
              />
            </div>
            <p className='text-sm text-muted-foreground'>aspect-w-4 aspect-h-3 (Traditional TV)</p>
          </div>

          <div className='space-y-2'>
            <h3 className='text-lg font-semibold'>3:2 Photography</h3>
            <div className='aspect-h-2 aspect-w-3'>
              <img
                src='https://via.placeholder.com/400x267/DC2626/FFFFFF?text=3:2+Ratio'
                alt='3:2 aspect ratio'
                className='h-full w-full rounded-lg border-2 border-border object-cover'
              />
            </div>
            <p className='text-sm text-muted-foreground'>aspect-w-3 aspect-h-2 (Photography)</p>
          </div>

          <div className='space-y-2'>
            <h3 className='text-lg font-semibold'>2:1 Panorama</h3>
            <div className='aspect-h-1 aspect-w-2'>
              <img
                src='https://via.placeholder.com/400x200/7C3AED/FFFFFF?text=2:1+Ratio'
                alt='2:1 aspect ratio'
                className='h-full w-full rounded-lg border-2 border-border object-cover'
              />
            </div>
            <p className='text-sm text-muted-foreground'>aspect-w-2 aspect-h-1 (Panorama)</p>
          </div>
        </div>
      </section>

      <section>
        <h2 className='mb-6 text-2xl font-bold'>Dark Mode Examples</h2>
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
          <div className='space-y-2'>
            <h3 className='text-lg font-semibold'>Light Mode</h3>
            <AspectRatio ratio={16 / 9}>
              <img
                src='https://via.placeholder.com/400x225/F3F4F6/111827?text=Light+Mode'
                alt='Light mode example'
                className='h-full w-full rounded-lg border-2 border-border object-cover'
              />
            </AspectRatio>
            <p className='text-sm text-muted-foreground'>Light mode styling</p>
          </div>

          <div className='space-y-2'>
            <h3 className='text-lg font-semibold'>Dark Mode</h3>
            <AspectRatio ratio={16 / 9}>
              <img
                src='https://via.placeholder.com/400x225/1F2937/F9FAFB?text=Dark+Mode'
                alt='Dark mode example'
                className='h-full w-full rounded-lg border-2 border-border object-cover'
              />
            </AspectRatio>
            <p className='text-sm text-muted-foreground'>Dark mode styling</p>
          </div>
        </div>
      </section>
    </div>
  )
}
