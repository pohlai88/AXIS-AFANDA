/**
 * @file        container-queries-demo.tsx
 * @description TODO: Add description
 *
 * @repo        AXIS-V3
 * @path        components\\container-queries-demo.tsx
 *
 * @since       2026-01-26
 * @changedate  2026-01-26
 * @changeref   {{changeRef}}
 *
 * @category    General
 * @tags        TODO
 */

import { Container } from '@/components/ui/container'

export default function ContainerQueriesDemo() {
  return (
    <div className='container mx-auto space-y-12 px-4 py-8'>
      <section>
        <h2 className='mb-6 text-2xl font-bold'>Basic Container Queries</h2>
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
          <Container className='bg-card rounded-lg border border-border p-4'>
            <h3 className='mb-4 text-lg font-semibold'>Simple Container</h3>
            <div className='@container'>
              <div className='transition-colors @lg:underline @xl:text-blue-500 @2xl:text-green-500'>
                <p className='mb-2 text-sm'>This text changes based on container size:</p>
                <ul className='space-y-1 text-xs text-muted-foreground'>
                  <li>• Underline when container &gt; 32rem (@lg)</li>
                  <li>• Blue when container &gt; 36rem (@xl)</li>
                  <li>• Green when container &gt; 42rem (@2xl)</li>
                </ul>
              </div>
            </div>
          </Container>

          <Container className='bg-card rounded-lg border border-border p-4'>
            <h3 className='mb-4 text-lg font-semibold'>Layout Changes</h3>
            <div className='@container'>
              <div className='gap-4 @xs:block @sm:flex @md:grid @lg:flex'>
                <div className='rounded bg-muted p-3 @xs:w-full @sm:w-1/3 @md:col-span-1'>
                  <div className='mx-auto mb-2 h-12 w-12 rounded bg-primary'></div>
                  <p className='text-center text-xs'>Item 1</p>
                </div>
                <div className='rounded bg-muted p-3 @xs:w-full @sm:w-2/3 @md:col-span-2'>
                  <p className='text-sm'>Content adapts to container layout</p>
                </div>
              </div>
            </div>
          </Container>

          <Container className='bg-card rounded-lg border border-border p-4'>
            <h3 className='mb-4 text-lg font-semibold'>Typography Scaling</h3>
            <div className='@container'>
              <h4 className='mb-2 font-bold @xs:text-sm @sm:text-base @md:text-lg @lg:text-xl @xl:text-2xl'>
                Responsive Heading
              </h4>
              <p className='@xs:text-xs @sm:text-sm @md:text-base @lg:text-lg'>
                This text scales based on the container size, not the viewport.
              </p>
            </div>
          </Container>
        </div>
      </section>

      <section>
        <h2 className='mb-6 text-2xl font-bold'>Named Containers</h2>
        <div className='grid grid-cols-1 gap-8 lg:grid-cols-2'>
          <div className='space-y-4'>
            <h3 className='text-lg font-semibold'>Sidebar Container</h3>
            <Container name='sidebar' className='rounded-lg border border-border bg-muted p-6'>
              <div className='@container/sidebar'>
                <div className='@xs/sidebar:text-center @sm/sidebar:text-left'>
                  <h4 className='mb-3 font-bold @xs/sidebar:text-base @md/sidebar:text-lg'>
                    Sidebar Content
                  </h4>
                  <nav className='@xs/sidebar:space-y-1 @sm/sidebar:space-y-2'>
                    <a
                      href='#'
                      className='rounded p-2 hover:bg-accent @xs/sidebar:block @xs/sidebar:text-sm @sm/sidebar:inline-block @md/sidebar:text-base'
                    >
                      Navigation Item 1
                    </a>
                    <a
                      href='#'
                      className='rounded p-2 hover:bg-accent @xs/sidebar:block @xs/sidebar:text-sm @sm/sidebar:inline-block @md/sidebar:text-base'
                    >
                      Navigation Item 2
                    </a>
                    <a
                      href='#'
                      className='rounded p-2 hover:bg-accent @xs/sidebar:block @xs/sidebar:text-sm @sm/sidebar:inline-block @md/sidebar:text-base'
                    >
                      Navigation Item 3
                    </a>
                  </nav>
                </div>
              </div>
            </Container>
          </div>

          <div className='space-y-4'>
            <h3 className='text-lg font-semibold'>Main Container</h3>
            <Container name='main' className='bg-card rounded-lg border border-border p-6'>
              <div className='@container/main'>
                <div className='@xs/main:space-y-4 @sm/main:space-y-6'>
                  <h4 className='font-bold @xs/main:text-lg @md/main:text-xl @lg/main:text-2xl'>
                    Main Content Area
                  </h4>
                  <div className='gap-4 @xs/main:grid-cols-1 @sm/main:grid-cols-2 @md/main:grid-cols-3'>
                    {Array.from({ length: 6 }, (_, i) => (
                      <div key={i} className='rounded bg-muted p-3'>
                        <div className='mb-2 h-8 w-8 rounded bg-primary'></div>
                        <p className='@xs/main:text-xs @sm/main:text-sm'>Item {i + 1}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Container>
          </div>
        </div>
      </section>

      <section>
        <h2 className='mb-6 text-2xl font-bold'>Arbitrary Container Sizes</h2>
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
          <Container className='bg-card rounded-lg border border-border p-4'>
            <h3 className='mb-4 text-lg font-semibold'>Custom Breakpoint</h3>
            <div className='@container'>
              <div className='rounded p-4 transition-all @[300px]:border-2 @[300px]:border-blue-200 @[300px]:bg-blue-50'>
                <p className='text-sm'>Changes at 300px container width</p>
                <p className='mt-1 text-xs text-muted-foreground'>
                  Current container: <span className='font-mono'>@[300px]</span>
                </p>
              </div>
            </div>
          </Container>

          <Container className='bg-card rounded-lg border border-border p-4'>
            <h3 className='mb-4 text-lg font-semibold'>Pixel Breakpoint</h3>
            <div className='@container'>
              <div className='transition-colors @[450px]:font-bold @[450px]:text-green-600'>
                <p className='text-sm'>Green text at 450px container</p>
                <div className='mt-2 rounded p-2 @[450px]:border @[450px]:border-green-300 @[450px]:bg-green-100'>
                  <p className='@xs:text-xs @[450px]:text-sm'>Background appears at 450px</p>
                </div>
              </div>
            </div>
          </Container>

          <Container className='bg-card rounded-lg border border-border p-4'>
            <h3 className='mb-4 text-lg font-semibold'>Multiple Arbitrary Values</h3>
            <div className='@container'>
              <div className='rounded p-4 transition-all @[250px]:text-purple-600 @[350px]:bg-purple-50 @[450px]:border-2 @[450px]:border-purple-200'>
                <p className='text-sm'>Multiple changes at different sizes</p>
                <ul className='mt-2 space-y-1 text-xs text-muted-foreground'>
                  <li>• Purple text at 250px</li>
                  <li>• Background at 350px</li>
                  <li>• Border at 450px</li>
                </ul>
              </div>
            </div>
          </Container>
        </div>
      </section>

      <section>
        <h2 className='mb-6 text-2xl font-bold'>Card Components</h2>
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
          <Container
            name='card'
            className='bg-card overflow-hidden rounded-lg border border-border shadow-lg'
          >
            <div className='@container/card'>
              <div className='@xs/card:aspect-video @sm/card:aspect-square'>
                <img
                  src='https://via.placeholder.com/400x225/4F46E5/FFFFFF?text=Card+Image'
                  alt='Card image'
                  className='h-full w-full object-cover'
                />
              </div>
              <div className='p-4'>
                <h3 className='mb-2 font-semibold @xs/card:text-sm @sm/card:text-base @md/card:text-lg @lg/card:text-xl'>
                  Adaptive Card Title
                </h3>
                <p className='mb-4 text-muted-foreground @xs/card:text-xs @sm/card:text-sm @md/card:text-base'>
                  This card adapts its layout and typography based on its container size, not the
                  viewport.
                </p>
                <div className='gap-2 @xs/card:space-y-2 @sm/card:flex @sm/card:space-y-0'>
                  <button className='@sm/card:auto rounded bg-primary px-4 py-2 text-primary-foreground @xs/card:w-full @xs/card:text-xs @sm/card:text-sm'>
                    Primary Action
                  </button>
                  <button className='@sm/card:auto rounded border border-border px-4 py-2 @xs/card:w-full @xs/card:text-xs @sm/card:text-sm'>
                    Secondary
                  </button>
                </div>
              </div>
            </div>
          </Container>

          <Container
            name='product'
            className='bg-card overflow-hidden rounded-lg border border-border shadow-lg'
          >
            <div className='@container/product'>
              <div className='@xs/product:aspect-square @sm/product:aspect-video'>
                <img
                  src='https://via.placeholder.com/400x400/10B981/FFFFFF?text=Product'
                  alt='Product'
                  className='h-full w-full object-cover'
                />
              </div>
              <div className='p-4'>
                <h3 className='mb-2 font-bold @xs/product:text-sm @md/product:text-base'>
                  Product Card
                </h3>
                <p className='mb-3 text-muted-foreground @xs/product:text-xs @md/product:text-sm'>
                  $99.99
                </p>
                <div className='gap-2 @xs/product:grid-cols-2 @sm/product:grid-cols-3'>
                  {['S', 'M', 'L', 'XL', 'XXL'].map(size => (
                    <button
                      key={size}
                      className='rounded border border-border p-2 hover:bg-accent @xs/product:text-xs @sm/product:text-sm'
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Container>

          <Container
            name='article'
            className='bg-card overflow-hidden rounded-lg border border-border shadow-lg'
          >
            <div className='@container/article'>
              <div className='h-32 bg-gradient-to-r from-purple-500 to-pink-500'></div>
              <div className='p-4'>
                <div className='@xs/article:space-y-2 @sm/article:space-y-3'>
                  <h3 className='font-bold @xs/article:text-base @md/article:text-lg'>
                    Article Card
                  </h3>
                  <p className='text-muted-foreground @xs/article:text-xs @md/article:text-sm'>
                    Published on {new Date().toLocaleDateString()}
                  </p>
                  <p className='@xs/article:text-xs @md/article:text-sm'>
                    Container queries enable truly responsive components that adapt to their parent
                    container.
                  </p>
                  <div className='gap-2 @xs/article:block @sm/article:flex'>
                    <span className='rounded bg-primary/10 px-2 py-1 text-primary @xs/article:text-xs @sm/article:text-sm'>
                      Design
                    </span>
                    <span className='rounded bg-secondary px-2 py-1 @xs/article:text-xs @sm/article:text-sm'>
                      CSS
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </div>
      </section>

      <section>
        <h2 className='mb-6 text-2xl font-bold'>Dashboard Layout</h2>
        <div className='grid grid-cols-1 gap-6 lg:grid-cols-4'>
          <div className='lg:col-span-1'>
            <Container name='sidebar' className='rounded-lg border border-border bg-muted p-4'>
              <div className='@container/sidebar'>
                <div className='@xs/sidebar:space-y-3 @sm/sidebar:space-y-4'>
                  <h3 className='font-bold @xs/sidebar:text-base @md/sidebar:text-lg'>Dashboard</h3>
                  <nav className='@xs/sidebar:space-y-1 @sm/sidebar:space-y-2'>
                    {['Overview', 'Analytics', 'Reports', 'Settings'].map(item => (
                      <a
                        key={item}
                        href='#'
                        className='block rounded p-2 transition-colors hover:bg-accent @xs/sidebar:text-sm @md/sidebar:text-base'
                      >
                        {item}
                      </a>
                    ))}
                  </nav>
                </div>
              </div>
            </Container>
          </div>

          <div className='lg:col-span-3'>
            <Container name='main' className='bg-card rounded-lg border border-border p-6'>
              <div className='@container/main'>
                <div className='@xs/main:space-y-6 @sm/main:space-y-8'>
                  <div className='gap-6 @xs/main:grid-cols-1 @sm/main:grid-cols-2 @lg/main:grid-cols-3'>
                    <div className='rounded-lg bg-muted p-4'>
                      <h4 className='mb-2 font-semibold @xs/main:text-sm @md/main:text-base'>
                        Statistics
                      </h4>
                      <div className='@xs/main:space-y-1 @sm/main:space-y-2'>
                        <div className='flex justify-between'>
                          <span className='@xs/main:text-xs @sm/main:text-sm'>Users</span>
                          <span className='font-medium @xs/main:text-xs @sm/main:text-sm'>
                            1,234
                          </span>
                        </div>
                        <div className='flex justify-between'>
                          <span className='@xs/main:text-xs @sm/main:text-sm'>Revenue</span>
                          <span className='font-medium @xs/main:text-xs @sm/main:text-sm'>
                            $12,345
                          </span>
                        </div>
                        <div className='flex justify-between'>
                          <span className='@xs/main:text-xs @sm/main:text-sm'>Orders</span>
                          <span className='font-medium @xs/main:text-xs @sm/main:text-sm'>456</span>
                        </div>
                      </div>
                    </div>

                    <div className='rounded-lg bg-muted p-4'>
                      <h4 className='mb-2 font-semibold @xs/main:text-sm @md/main:text-base'>
                        Activity
                      </h4>
                      <div className='@xs/main:space-y-2 @sm/main:space-y-3'>
                        <div className='flex items-center gap-2'>
                          <div className='h-2 w-2 rounded-full bg-green-500'></div>
                          <span className='@xs/main:text-xs @sm/main:text-sm'>Server Online</span>
                        </div>
                        <div className='flex items-center gap-2'>
                          <div className='h-2 w-2 rounded-full bg-blue-500'></div>
                          <span className='@xs/main:text-xs @sm/main:text-sm'>
                            Database Connected
                          </span>
                        </div>
                        <div className='flex items-center gap-2'>
                          <div className='h-2 w-2 rounded-full bg-yellow-500'></div>
                          <span className='@xs/main:text-xs @sm/main:text-sm'>Cache Warming</span>
                        </div>
                      </div>
                    </div>

                    <div className='rounded-lg bg-muted p-4'>
                      <h4 className='mb-2 font-semibold @xs/main:text-sm @md/main:text-base'>
                        Quick Actions
                      </h4>
                      <div className='@xs/main:space-y-2 @sm/main:space-y-3'>
                        <button className='w-full rounded bg-primary px-3 py-2 text-primary-foreground @xs/main:text-xs @sm/main:text-sm'>
                          New Report
                        </button>
                        <button className='w-full rounded border border-border px-3 py-2 @xs/main:text-xs @sm/main:text-sm'>
                          Export Data
                        </button>
                        <button className='w-full rounded border border-border px-3 py-2 @xs/main:text-xs @sm/main:text-sm'>
                          Settings
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className='gap-6 @xs/main:grid-cols-1 @md/main:grid-cols-2'>
                    <div className='rounded-lg bg-muted p-4'>
                      <h4 className='mb-4 font-semibold @xs/main:text-sm @md/main:text-base'>
                        Recent Activity
                      </h4>
                      <div className='@xs/main:space-y-3 @sm/main:space-y-4'>
                        {Array.from({ length: 4 }, (_, i) => (
                          <div key={i} className='flex items-center gap-3'>
                            <div className='flex h-8 w-8 items-center justify-center rounded-full bg-primary'>
                              <span className='text-xs text-primary-foreground'>U{i + 1}</span>
                            </div>
                            <div className='flex-1'>
                              <p className='font-medium @xs/main:text-xs @sm/main:text-sm'>
                                User {i + 1}
                              </p>
                              <p className='text-muted-foreground @xs/main:text-xs'>
                                Action performed
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className='rounded-lg bg-muted p-4'>
                      <h4 className='mb-4 font-semibold @xs/main:text-sm @md/main:text-base'>
                        Performance
                      </h4>
                      <div className='@xs/main:space-y-3 @sm/main:space-y-4'>
                        <div>
                          <div className='mb-1 flex justify-between'>
                            <span className='@xs/main:text-xs @sm/main:text-sm'>CPU Usage</span>
                            <span className='@xs/main:text-xs @sm/main:text-sm'>45%</span>
                          </div>
                          <div className='h-2 w-full rounded-full bg-background'>
                            <div
                              className='h-2 rounded-full bg-primary'
                              style={{ width: '45%' }}
                            ></div>
                          </div>
                        </div>
                        <div>
                          <div className='mb-1 flex justify-between'>
                            <span className='@xs/main:text-xs @sm/main:text-sm'>Memory</span>
                            <span className='@xs/main:text-xs @sm/main:text-sm'>67%</span>
                          </div>
                          <div className='h-2 w-full rounded-full bg-background'>
                            <div
                              className='h-2 rounded-full bg-green-500'
                              style={{ width: '67%' }}
                            ></div>
                          </div>
                        </div>
                        <div>
                          <div className='mb-1 flex justify-between'>
                            <span className='@xs/main:text-xs @sm/main:text-sm'>Storage</span>
                            <span className='@xs/main:text-xs @sm/main:text-sm'>23%</span>
                          </div>
                          <div className='h-2 w-full rounded-full bg-background'>
                            <div
                              className='h-2 rounded-full bg-blue-500'
                              style={{ width: '23%' }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Container>
          </div>
        </div>
      </section>

      <section>
        <h2 className='mb-6 text-2xl font-bold'>Advanced Patterns</h2>
        <div className='grid grid-cols-1 gap-8 lg:grid-cols-2'>
          <div className='space-y-4'>
            <h3 className='text-lg font-semibold'>Nested Containers</h3>
            <Container name='outer' className='bg-card rounded-lg border border-border p-6'>
              <div className='@container/outer'>
                <h4 className='mb-4 font-bold @xs/outer:text-base @md/outer:text-lg'>
                  Outer Container
                </h4>
                <Container name='inner' className='rounded-lg bg-muted p-4'>
                  <div className='@container/inner'>
                    <h5 className='mb-2 font-semibold @xs/inner:text-sm @md/inner:text-base'>
                      Inner Container
                    </h5>
                    <p className='text-muted-foreground @xs/inner:text-xs @md/inner:text-sm'>
                      This content responds to the inner container size.
                    </p>
                    <div className='@xs/inner:mt-2 @xs/inner:space-y-1 @md/inner:mt-3 @md/inner:space-y-2'>
                      <div className='@xs/inner:text-xs @md/inner:text-sm'>
                        • Nested container queries
                      </div>
                      <div className='@xs/inner:text-xs @md/inner:text-sm'>
                        • Independent responsive behavior
                      </div>
                      <div className='@xs/inner:text-xs @md/inner:text-sm'>
                        • Component-based design
                      </div>
                    </div>
                  </div>
                </Container>
              </div>
            </Container>
          </div>

          <div className='space-y-4'>
            <h3 className='text-lg font-semibold'>Container Animations</h3>
            <Container name='animated' className='bg-card rounded-lg border border-border p-6'>
              <div className='@container/animated'>
                <div className='transition-transform duration-300 @xs/animated:scale-95 @sm/animated:scale-100 @md/animated:scale-105 @lg/animated:scale-110'>
                  <h4 className='mb-3 font-bold @xs/animated:text-base @md/animated:text-lg'>
                    Animated Content
                  </h4>
                  <p className='text-muted-foreground @xs/animated:text-xs @md/animated:text-sm'>
                    Scale changes based on container size
                  </p>
                  <div className='mt-3 h-2 rounded-full @xs/animated:bg-gradient-to-r @xs/animated:from-blue-500 @xs/animated:to-purple-500 @md/animated:from-green-500 @md/animated:to-blue-500'></div>
                </div>
              </div>
            </Container>
          </div>
        </div>
      </section>

      <section>
        <h2 className='mb-6 text-2xl font-bold'>Responsive Grid System</h2>
        <Container name='grid' className='bg-card rounded-lg border border-border p-6'>
          <div className='@container/grid'>
            <h3 className='mb-6 font-bold @xs/grid:text-lg @md/grid:text-xl @lg/grid:text-2xl'>
              Container-Based Grid
            </h3>
            <div className='gap-4 @xs/grid:grid-cols-1 @sm/grid:grid-cols-2 @md/grid:grid-cols-4 @lg/grid:grid-cols-6 @[450px]:grid-cols-3 @[600px]:grid-cols-5'>
              {Array.from({ length: 18 }, (_, i) => (
                <div key={i} className='rounded bg-muted p-4 text-center'>
                  <div className='mx-auto mb-2 h-8 w-8 rounded-full bg-primary'></div>
                  <p className='@xs/grid:text-xs @sm/grid:text-sm'>Item {i + 1}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>
    </div>
  )
}
