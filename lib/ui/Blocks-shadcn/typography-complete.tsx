'use client'

// Complete Typography System

export function TypographyH1() {
  return (
    <h1 className='scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl'>
      The quick brown fox jumps over the lazy dog
    </h1>
  )
}

export function TypographyH2() {
  return (
    <h2 className='scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0'>
      The quick brown fox jumps over the lazy dog
    </h2>
  )
}

export function TypographyH3() {
  return (
    <h3 className='scroll-m-20 text-2xl font-semibold tracking-tight'>
      The quick brown fox jumps over the lazy dog
    </h3>
  )
}

export function TypographyH4() {
  return (
    <h4 className='scroll-m-20 text-xl font-semibold tracking-tight'>
      The quick brown fox jumps over the lazy dog
    </h4>
  )
}

export function TypographyP() {
  return (
    <p className='leading-7 [&:not(:first-child)]:mt-6'>
      The quick brown fox jumps over the lazy dog is a pangram that has been used to test
      typewriters and computer keyboards for many years. It contains all 26 letters of the English
      alphabet, making it perfect for demonstrating typefaces and font designs.
    </p>
  )
}

export function TypographyBlockquote() {
  return (
    <blockquote className='mt-6 border-l-2 pl-6 italic'>
      "The quick brown fox jumps over the lazy dog" is not just a pangram; it's a testament to the
      elegance of language and the precision of typography.
    </blockquote>
  )
}

export function TypographyList() {
  return (
    <ul className='my-6 ml-6 list-disc [&>li]:mt-2'>
      <li>The quick brown fox jumps over the lazy dog</li>
      <li>Typography is the art and technique of arranging type</li>
      <li>Good typography makes reading effortless and enjoyable</li>
      <li>Font choice, size, and spacing all matter</li>
    </ul>
  )
}

export function TypographyInlineCode() {
  return (
    <p className='leading-7 [&:not(:first-child)]:mt-6'>
      The{' '}
      <code className='relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold'>
        quick brown fox
      </code>{' '}
      is a classic example used in typography.
    </p>
  )
}

export function TypographyLead() {
  return (
    <p className='text-xl text-muted-foreground'>
      The quick brown fox jumps over the lazy dog - a perfect demonstration of typography in action.
    </p>
  )
}

export function TypographyLarge() {
  return <div className='text-lg font-semibold'>The quick brown fox jumps over the lazy dog</div>
}

export function TypographySmall() {
  return (
    <small className='text-sm font-medium leading-none'>
      The quick brown fox jumps over the lazy dog
    </small>
  )
}

export function TypographyMuted() {
  return (
    <p className='text-sm text-muted-foreground'>The quick brown fox jumps over the lazy dog</p>
  )
}

export function TypographyTable() {
  return (
    <div className='my-6 w-full overflow-y-auto'>
      <table className='w-full caption-bottom text-sm'>
        <thead>
          <tr className='border-b'>
            <th className='h-12 px-4 text-left align-middle font-medium text-muted-foreground'>
              Animal
            </th>
            <th className='h-12 px-4 text-left align-middle font-medium text-muted-foreground'>
              Action
            </th>
            <th className='h-12 px-4 text-left align-middle font-medium text-muted-foreground'>
              Target
            </th>
          </tr>
        </thead>
        <tbody>
          <tr className='border-b'>
            <td className='p-4 align-middle font-medium'>Fox</td>
            <td className='p-4 align-middle'>jumps</td>
            <td className='p-4 align-middle'>lazy dog</td>
          </tr>
          <tr className='border-b'>
            <td className='p-4 align-middle font-medium'>Dog</td>
            <td className='p-4 align-middle'>sleeps</td>
            <td className='p-4 align-middle'>peacefully</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

// Additional Typography Variants

export function TypographyDisplay() {
  return <h1 className='text-6xl font-bold tracking-tight lg:text-7xl'>The Quick Brown Fox</h1>
}

export function TypographySubtitle() {
  return <h2 className='text-xl font-medium text-muted-foreground'>Jumps Over The Lazy Dog</h2>
}

export function TypographyCaption() {
  return (
    <p className='text-xs text-muted-foreground'>A classic pangram for typography demonstration</p>
  )
}

export function TypographyOverline() {
  return (
    <p className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
      Typography Example
    </p>
  )
}

export function TypographyCode() {
  return (
    <div className='rounded-lg bg-muted p-4'>
      <pre className='text-sm'>
        <code>{`const fox = "quick brown";
const dog = "lazy";
fox.jumpsOver(dog);`}</code>
      </pre>
    </div>
  )
}

export function TypographyLink() {
  return (
    <p className='leading-7 [&:not(:first-child)]:mt-6'>
      The quick brown fox{' '}
      <a href='#' className='text-primary underline-offset-4 hover:underline'>
        jumps over
      </a>{' '}
      the lazy dog.
    </p>
  )
}

export function TypographyStrong() {
  return (
    <p className='leading-7 [&:not(:first-child)]:mt-6'>
      The <strong>quick brown fox</strong> jumps over the <strong>lazy dog</strong>.
    </p>
  )
}

export function TypographyEmphasis() {
  return (
    <p className='leading-7 [&:not(:first-child)]:mt-6'>
      The <em>quick brown fox</em> jumps over the <em>lazy dog</em>.
    </p>
  )
}

export function TypographyMark() {
  return (
    <p className='leading-7 [&:not(:first-child)]:mt-6'>
      The{' '}
      <mark className='rounded bg-yellow-200 px-1 py-0.5 dark:bg-yellow-800'>quick brown fox</mark>{' '}
      jumps over the lazy dog.
    </p>
  )
}

export function TypographyDel() {
  return (
    <p className='leading-7 [&:not(:first-child)]:mt-6'>
      The <del>slow brown fox</del> <ins>quick brown fox</ins> jumps over the lazy dog.
    </p>
  )
}

export function TypographyAbbreviation() {
  return (
    <p className='leading-7 [&:not(:first-child)]:mt-6'>
      The <abbr title='quick brown fox'>QBF</abbr> jumps over the lazy dog.
    </p>
  )
}

export function TypographyCite() {
  return (
    <p className='leading-7 [&:not(:first-child)]:mt-6'>
      As <cite>The Typography Handbook</cite> states, "The quick brown fox jumps over the lazy dog"
      is the most famous pangram.
    </p>
  )
}

export function TypographyDefinition() {
  return (
    <dl className='mt-6 space-y-4'>
      <div>
        <dt className='font-semibold'>Pangram</dt>
        <dd className='text-sm text-muted-foreground'>
          A sentence using every letter of the alphabet, like "The quick brown fox jumps over the
          lazy dog."
        </dd>
      </div>
      <div>
        <dt className='font-semibold'>Typography</dt>
        <dd className='text-sm text-muted-foreground'>
          The art and technique of arranging type to make written language legible and appealing.
        </dd>
      </div>
    </dl>
  )
}

export function TypographyTime() {
  return (
    <div className='space-y-2'>
      <time className='text-sm text-muted-foreground'>2024-01-26</time>
      <time className='text-lg font-semibold'>11:48 AM</time>
      <time dateTime='2024-01-26T11:48:00' className='text-xs text-muted-foreground'>
        January 26, 2024 at 11:48 AM
      </time>
    </div>
  )
}

export function TypographyAddress() {
  return (
    <address className='not-italic'>
      <div className='text-sm'>Typography Street 123</div>
      <div className='text-sm'>Design City, DC 12345</div>
      <div className='text-sm'>
        <a href='mailto:typography@example.com' className='text-primary hover:underline'>
          typography@example.com
        </a>
      </div>
    </address>
  )
}
