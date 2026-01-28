/**
 * @file        component-playground.tsx
 * @description TODO: Add description
 *
 * @repo        AXIS-V3
 * @path        components\\component-playground.tsx
 *
 * @since       2026-01-26
 * @changedate  2026-01-26
 * @changeref   {{changeRef}}
 *
 * @category    General
 * @tags        TODO
 */

'use client'

import { AspectRatio } from '@/components/ui/aspect-ratio'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Container } from '@/components/ui/container'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Radio } from '@/components/ui/radio'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useState } from 'react'

interface ComponentExample {
  name: string
  description: string
  category: string
  component: React.ReactNode
  code: string
}

export default function ComponentPlayground() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedComponent, setSelectedComponent] = useState('button')

  const components: ComponentExample[] = [
    {
      name: 'Button',
      description: 'Interactive button with multiple variants',
      category: 'forms',
      component: (
        <div className='flex flex-wrap gap-2'>
          <Button>Default</Button>
          <Button variant='destructive'>Destructive</Button>
          <Button variant='outline'>Outline</Button>
          <Button variant='secondary'>Secondary</Button>
          <Button variant='ghost'>Ghost</Button>
          <Button variant='link'>Link</Button>
        </div>
      ),
      code: `<Button>Default</Button>
<Button variant="destructive">Destructive</Button>
<Button variant="outline">Outline</Button>`,
    },
    {
      name: 'Input',
      description: 'Text input with various states',
      category: 'forms',
      component: (
        <div className='w-full max-w-sm space-y-2'>
          <Input placeholder='Default input' />
          <Input type='email' placeholder='Email input' />
          <Input disabled placeholder='Disabled input' />
        </div>
      ),
      code: `<Input placeholder="Default input" />
<Input type="email" placeholder="Email input" />
<Input disabled placeholder="Disabled input" />`,
    },
    {
      name: 'Textarea',
      description: 'Multi-line text input',
      category: 'forms',
      component: (
        <Textarea placeholder='Enter your message...' className='w-full max-w-sm' rows={3} />
      ),
      code: `<Textarea
  placeholder="Enter your message..."
  className="w-full max-w-sm"
  rows={3}
/>`,
    },
    {
      name: 'Select',
      description: 'Dropdown selection component',
      category: 'forms',
      component: (
        <Select>
          <SelectTrigger className='w-full max-w-sm'>
            <SelectValue placeholder='Choose an option' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='option1'>Option 1</SelectItem>
            <SelectItem value='option2'>Option 2</SelectItem>
            <SelectItem value='option3'>Option 3</SelectItem>
          </SelectContent>
        </Select>
      ),
      code: `<Select>
  <SelectTrigger className="w-full max-w-sm">
    <SelectValue placeholder="Choose an option" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">Option 1</SelectItem>
    <SelectItem value="option2">Option 2</SelectItem>
    <SelectItem value="option3">Option 3</SelectItem>
  </SelectContent>
</Select>`,
    },
    {
      name: 'Checkbox',
      description: 'Checkbox input component',
      category: 'forms',
      component: (
        <div className='space-y-2'>
          <label className='flex items-center space-x-2'>
            <Checkbox />
            <span>Default checkbox</span>
          </label>
          <label className='flex items-center space-x-2'>
            <Checkbox defaultChecked />
            <span>Checked checkbox</span>
          </label>
          <label className='flex items-center space-x-2'>
            <Checkbox disabled />
            <span>Disabled checkbox</span>
          </label>
        </div>
      ),
      code: `<label className="flex items-center space-x-2">
  <Checkbox />
  <span>Default checkbox</span>
</label>`,
    },
    {
      name: 'Radio',
      description: 'Radio button component',
      category: 'forms',
      component: (
        <div className='space-y-2'>
          <label className='flex items-center space-x-2'>
            <Radio name='example' defaultChecked />
            <span>Selected radio</span>
          </label>
          <label className='flex items-center space-x-2'>
            <Radio name='example' />
            <span>Unselected radio</span>
          </label>
        </div>
      ),
      code: `<label className="flex items-center space-x-2">
  <Radio name="example" defaultChecked />
  <span>Selected radio</span>
</label>`,
    },
    {
      name: 'Label',
      description: 'Form label component',
      category: 'forms',
      component: (
        <div className='space-y-2'>
          <Label htmlFor='example1'>Default label</Label>
          <Label htmlFor='example2' className='text-sm'>
            Small label
          </Label>
          <Label htmlFor='example3' className='text-muted-foreground'>
            Muted label
          </Label>
        </div>
      ),
      code: `<Label htmlFor="example1">Default label</Label>
<Label htmlFor="example2" className="text-sm">Small label</Label>
<Label htmlFor="example3" className="text-muted-foreground">Muted label</Label>`,
    },
    {
      name: 'Aspect Ratio',
      description: 'Container with fixed aspect ratio',
      category: 'layout',
      component: (
        <div className='grid w-full max-w-md grid-cols-1 gap-4 md:grid-cols-2'>
          <AspectRatio ratio={1}>
            <div className='flex items-center justify-center rounded bg-primary/10'>
              <span className='text-sm'>Square (1:1)</span>
            </div>
          </AspectRatio>
          <AspectRatio ratio={16 / 9}>
            <div className='flex items-center justify-center rounded bg-secondary'>
              <span className='text-sm'>Video (16:9)</span>
            </div>
          </AspectRatio>
        </div>
      ),
      code: `<AspectRatio ratio="square">
  <div className="bg-primary/10 flex items-center justify-center rounded">
    <span className="text-sm">Square (1:1)</span>
  </div>
</AspectRatio>`,
    },
    {
      name: 'Container',
      description: 'Container query component',
      category: 'layout',
      component: (
        <Container name='demo' className='rounded-lg border-2 border-dashed border-border p-4'>
          <div className='@container'>
            <div className='mb-2 font-bold @xs/demo:text-sm @md/demo:text-base @lg/demo:text-lg'>
              Responsive Container
            </div>
            <p className='text-muted-foreground @xs/demo:text-xs @md/demo:text-sm'>
              This text adapts to the container size, not the viewport.
            </p>
          </div>
        </Container>
      ),
      code: `<Container name="demo" className="border-2 border-dashed border-border rounded-lg p-4">
  <div className="@container">
    <div className="@xs/demo:text-sm @md/demo:text-base @lg/demo:text-lg font-bold mb-2">
      Responsive Container
    </div>
    <p className="@xs/demo:text-xs @md/demo:text-sm text-muted-foreground">
      This text adapts to the container size, not the viewport.
    </p>
  </div>
</Container>`,
    },
  ]

  const categories = ['all', ...new Set(components.map(c => c.category))]
  const filteredComponents =
    selectedCategory === 'all'
      ? components
      : components.filter(c => c.category === selectedCategory)

  const activeComponent =
    components.find(c => c.name.toLowerCase() === selectedComponent.toLowerCase()) || components[0]

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='mb-8'>
        <h1 className='mb-2 text-3xl font-bold'>Component Playground</h1>
        <p className='text-muted-foreground'>
          Interactive examples of all UI components with live preview and code.
        </p>
      </div>

      <div className='grid grid-cols-1 gap-6 lg:grid-cols-4'>
        {/* Sidebar */}
        <div className='lg:col-span-1'>
          <div className='space-y-4'>
            <div>
              <Label htmlFor='category'>Category</Label>
              <Select
                value={selectedCategory}
                onValueChange={value => {
                  setSelectedCategory(value)
                  const newFiltered =
                    value === 'all' ? components : components.filter(c => c.category === value)
                  setSelectedComponent(newFiltered[0]?.name.toLowerCase() || 'button')
                }}
              >
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder='Select category' />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor='component'>Component</Label>
              <Select value={selectedComponent} onValueChange={setSelectedComponent}>
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder='Select a component' />
                </SelectTrigger>
                <SelectContent>
                  {filteredComponents.map(component => (
                    <SelectItem key={component.name} value={component.name.toLowerCase()}>
                      {component.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className='space-y-2'>
              <h3 className='text-sm font-semibold'>Components ({filteredComponents.length})</h3>
              <div className='space-y-1'>
                {filteredComponents.map(component => (
                  <button
                    key={component.name}
                    onClick={() => setSelectedComponent(component.name.toLowerCase())}
                    className={`w-full rounded px-2 py-1 text-left text-sm transition-colors ${
                      selectedComponent === component.name.toLowerCase()
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted'
                    }`}
                  >
                    {component.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className='lg:col-span-3'>
          <div className='space-y-6'>
            {/* Component Info */}
            <div>
              <h2 className='mb-2 text-2xl font-bold'>
                {activeComponent?.name || 'Unknown Component'}
              </h2>
              <p className='mb-4 text-muted-foreground'>
                {activeComponent?.description || 'No description available'}
              </p>
              <div className='flex gap-2'>
                <span className='rounded bg-primary/10 px-2 py-1 text-xs text-primary'>
                  {activeComponent?.category || 'unknown'}
                </span>
                <span className='rounded bg-secondary px-2 py-1 text-xs'>Interactive</span>
              </div>
            </div>

            {/* Live Preview */}
            <div>
              <h3 className='mb-3 text-lg font-semibold'>Live Preview</h3>
              <div className='rounded-lg border bg-background p-6'>
                {activeComponent?.component || <div>No component available</div>}
              </div>
            </div>

            {/* Code Example */}
            <div>
              <h3 className='mb-3 text-lg font-semibold'>Code</h3>
              <div className='overflow-x-auto rounded-lg border bg-muted p-4'>
                <pre className='text-sm'>
                  <code>{activeComponent?.code || '// No code available'}</code>
                </pre>
              </div>
            </div>

            {/* Usage Tips */}
            <div>
              <h3 className='mb-3 text-lg font-semibold'>Usage Tips</h3>
              <div className='rounded-lg bg-muted/50 p-4'>
                <ul className='space-y-1 text-sm text-muted-foreground'>
                  <li>• Import components from `@/components/ui`</li>
                  <li>• All components support TypeScript</li>
                  <li>• Use className prop for additional styling</li>
                  <li>• Components are responsive and accessible</li>
                  <li>• Check individual component docs for more props</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
