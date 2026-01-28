/**
 * @file        forms-demo.tsx
 * @description TODO: Add description
 *
 * @repo        AXIS-V3
 * @path        components\\forms-demo.tsx
 *
 * @since       2026-01-26
 * @changedate  2026-01-26
 * @changeref   {{changeRef}}
 *
 * @category    General
 * @tags        TODO
 */

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Radio } from '@/components/ui/radio'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import logger from '@/lib/logger'
import { useState } from 'react'

export default function FormsDemo() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    message: '',
    category: '',
    subscribe: false,
    newsletter: false,
    priority: 'medium',
    terms: false,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (process.env.NODE_ENV === 'development') {
      logger.info(formData, 'Form submitted')
    }
    // In a real app, you would handle form submission here
    // alert('Form submitted successfully!')
  }

  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className='container mx-auto space-y-12 px-4 py-8'>
      <section>
        <h2 className='mb-6 text-2xl font-bold'>Basic Form Elements</h2>
        <div className='grid gap-8 md:grid-cols-2'>
          <div className='space-y-4'>
            <h3 className='text-lg font-semibold'>Input Types</h3>
            <div className='space-y-3'>
              <Input placeholder='Text input' />
              <Input type='email' placeholder='Email input' />
              <Input type='password' placeholder='Password input' />
              <Input type='number' placeholder='Number input' />
              <Input type='tel' placeholder='Phone input' />
              <Input type='url' placeholder='URL input' />
              <Input type='date' />
              <Input type='time' />
              <Input type='search' placeholder='Search input' />
              <Input disabled placeholder='Disabled input' />
            </div>
          </div>

          <div className='space-y-4'>
            <h3 className='text-lg font-semibold'>Other Elements</h3>
            <div className='space-y-3'>
              <Textarea placeholder='Textarea' rows={3} />
              <Select>
                <option value=''>Select an option</option>
                <option value='option1'>Option 1</option>
                <option value='option2'>Option 2</option>
                <option value='option3'>Option 3</option>
              </Select>
              <select multiple className='h-24 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm'>
                <option value='option1'>Option 1</option>
                <option value='option2'>Option 2</option>
                <option value='option3'>Option 3</option>
                <option value='option4'>Option 4</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className='mb-6 text-2xl font-bold'>Checkboxes and Radio Buttons</h2>
        <div className='grid gap-8 md:grid-cols-2'>
          <div className='space-y-4'>
            <h3 className='text-lg font-semibold'>Checkboxes</h3>
            <div className='space-y-3'>
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
              <label className='flex items-center space-x-2'>
                <Checkbox className='rounded-full' />
                <span>Round checkbox</span>
              </label>
              <label className='flex items-center space-x-2'>
                <Checkbox className='h-6 w-6' />
                <span>Large checkbox</span>
              </label>
            </div>
          </div>

          <div className='space-y-4'>
            <h3 className='text-lg font-semibold'>Radio Buttons</h3>
            <div className='space-y-3'>
              <label className='flex items-center space-x-2'>
                <Radio name='radio1' defaultChecked />
                <span>Selected radio</span>
              </label>
              <label className='flex items-center space-x-2'>
                <Radio name='radio1' />
                <span>Unselected radio</span>
              </label>
              <label className='flex items-center space-x-2'>
                <Radio disabled />
                <span>Disabled radio</span>
              </label>
              <label className='flex items-center space-x-2'>
                <Radio name='radio2' className='h-6 w-6' />
                <span>Large radio</span>
              </label>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className='mb-6 text-2xl font-bold'>Form Layout Examples</h2>
        <div className='grid gap-8 md:grid-cols-2'>
          <div className='space-y-4'>
            <h3 className='text-lg font-semibold'>Stacked Form</h3>
            <form className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='stacked-name'>Name</Label>
                <Input id='stacked-name' placeholder='Enter your name' />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='stacked-email'>Email</Label>
                <Input id='stacked-email' type='email' placeholder='Enter your email' />
              </div>
              <Button type='submit' className='w-full'>
                Submit
              </Button>
            </form>
          </div>

          <div className='space-y-4'>
            <h3 className='text-lg font-semibold'>Inline Form</h3>
            <form className='flex gap-2'>
              <Input placeholder='Search...' className='flex-1' />
              <Button type='submit'>Search</Button>
            </form>
            <form className='flex gap-2'>
              <Input placeholder='Email' type='email' className='flex-1' />
              <Button type='submit' variant='outline'>
                Subscribe
              </Button>
            </form>
          </div>
        </div>
      </section>

      <section>
        <h2 className='mb-6 text-2xl font-bold'>Grid Form Layout</h2>
        <form className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
          <div className='space-y-2'>
            <Label htmlFor='grid-first'>First Name</Label>
            <Input id='grid-first' placeholder='First name' />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='grid-last'>Last Name</Label>
            <Input id='grid-last' placeholder='Last name' />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='grid-email'>Email</Label>
            <Input id='grid-email' type='email' placeholder='Email' />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='grid-phone'>Phone</Label>
            <Input id='grid-phone' type='tel' placeholder='Phone' />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='grid-company'>Company</Label>
            <Input id='grid-company' placeholder='Company' />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='grid-role'>Role</Label>
            <Select>
              <SelectTrigger id='grid-role'>
                <SelectValue placeholder='Select role' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='developer'>Developer</SelectItem>
                <SelectItem value='designer'>Designer</SelectItem>
                <SelectItem value='manager'>Manager</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </form>
      </section>

      <section>
        <h2 className='mb-6 text-2xl font-bold'>Complete Form Example</h2>
        <form onSubmit={handleSubmit} className='mx-auto max-w-2xl space-y-6'>
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
            <div className='space-y-2'>
              <Label htmlFor='name'>Name *</Label>
              <Input
                id='name'
                value={formData.name}
                onChange={e => handleChange('name', e.target.value)}
                placeholder='Enter your full name'
                required
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='email'>Email *</Label>
              <Input
                id='email'
                type='email'
                value={formData.email}
                onChange={e => handleChange('email', e.target.value)}
                placeholder='Enter your email'
                required
              />
            </div>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='password'>Password *</Label>
            <Input
              id='password'
              type='password'
              value={formData.password}
              onChange={e => handleChange('password', e.target.value)}
              placeholder='Enter a secure password'
              required
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='category'>Category</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => handleChange('category', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder='Select a category' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='general'>General Inquiry</SelectItem>
                <SelectItem value='support'>Technical Support</SelectItem>
                <SelectItem value='feedback'>Feedback</SelectItem>
                <SelectItem value='partnership'>Partnership</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='priority'>Priority</Label>
            <div className='space-y-2'>
              <label className='flex items-center space-x-2'>
                <Radio
                  name='priority'
                  value='low'
                  checked={formData.priority === 'low'}
                  onChange={e => handleChange('priority', e.target.value)}
                />
                <span>Low</span>
              </label>
              <label className='flex items-center space-x-2'>
                <Radio
                  name='priority'
                  value='medium'
                  checked={formData.priority === 'medium'}
                  onChange={e => handleChange('priority', e.target.value)}
                />
                <span>Medium</span>
              </label>
              <label className='flex items-center space-x-2'>
                <Radio
                  name='priority'
                  value='high'
                  checked={formData.priority === 'high'}
                  onChange={e => handleChange('priority', e.target.value)}
                />
                <span>High</span>
              </label>
            </div>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='message'>Message</Label>
            <Textarea
              id='message'
              value={formData.message}
              onChange={e => handleChange('message', e.target.value)}
              placeholder='Enter your message or inquiry'
              rows={4}
            />
          </div>

          <div className='space-y-3'>
            <label className='flex items-center space-x-2'>
              <Checkbox
                checked={formData.subscribe}
                onCheckedChange={(checked) => handleChange('subscribe', checked)}
              />
              <span>Subscribe to our newsletter for updates</span>
            </label>
            <label className='flex items-center space-x-2'>
              <Checkbox
                checked={formData.newsletter}
                onCheckedChange={(checked) => handleChange('newsletter', checked)}
              />
              <span>Receive promotional offers and discounts</span>
            </label>
            <label className='flex items-center space-x-2'>
              <Checkbox
                checked={formData.terms}
                onCheckedChange={(checked) => handleChange('terms', checked)}
                required
              />
              <span>I agree to the terms and conditions *</span>
            </label>
          </div>

          <div className='flex gap-4'>
            <Button type='submit' className='flex-1'>
              Submit Form
            </Button>
            <Button
              type='button'
              variant='outline'
              onClick={() =>
                setFormData({
                  name: '',
                  email: '',
                  password: '',
                  message: '',
                  category: '',
                  subscribe: false,
                  newsletter: false,
                  priority: 'medium',
                  terms: false,
                })
              }
            >
              Reset
            </Button>
          </div>
        </form>
      </section>

      <section>
        <h2 className='mb-6 text-2xl font-bold'>Custom Styled Examples</h2>
        <div className='grid gap-8 md:grid-cols-2'>
          <div className='space-y-4'>
            <h3 className='text-lg font-semibold'>Custom Colors</h3>
            <div className='space-y-3'>
              <input
                type='text'
                placeholder='Blue border'
                className='w-full rounded-lg border-2 border-blue-500 px-4 py-2 focus:border-blue-600 focus:outline-none'
              />
              <input
                type='text'
                placeholder='Green background'
                className='w-full rounded-lg border-green-200 bg-green-50 px-4 py-2 focus:bg-green-100 focus:outline-none'
              />
              <input
                type='text'
                placeholder='Purple gradient'
                className='w-full rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2 text-white placeholder:text-white/70 focus:outline-none focus:ring-2 focus:ring-purple-500'
              />
            </div>
          </div>

          <div className='space-y-4'>
            <h3 className='text-lg font-semibold'>Custom Shapes</h3>
            <div className='space-y-3'>
              <input
                type='text'
                placeholder='Rounded full'
                className='border-primary focus:ring-primary w-full rounded-full border-2 px-6 py-3 focus:outline-none focus:ring-2'
              />
              <input
                type='text'
                placeholder='No border'
                className='bg-muted focus:bg-accent w-full rounded-lg px-4 py-2 focus:outline-none'
              />
              <input
                type='text'
                placeholder='Bottom border only'
                className='border-primary focus:border-primary/80 w-full border-b-2 bg-transparent px-0 py-2 focus:outline-none'
              />
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className='mb-6 text-2xl font-bold'>Dark Mode Examples</h2>
        <div className='grid gap-8 md:grid-cols-2'>
          <div className='space-y-4'>
            <h3 className='text-lg font-semibold'>Light Mode</h3>
            <div className='bg-background space-y-3 rounded-lg border p-6'>
              <Input placeholder='Light mode input' />
              <Select>
                <option>Light mode select</option>
              </Select>
              <Textarea placeholder='Light mode textarea' rows={3} />
              <div className='flex items-center space-x-2'>
                <Checkbox />
                <span>Light mode checkbox</span>
              </div>
            </div>
          </div>

          <div className='space-y-4'>
            <h3 className='text-lg font-semibold'>Dark Mode</h3>
            <div className='bg-muted space-y-3 rounded-lg border p-6'>
              <Input placeholder='Dark mode input' />
              <Select>
                <option>Dark mode select</option>
              </Select>
              <Textarea placeholder='Dark mode textarea' rows={3} />
              <div className='flex items-center space-x-2'>
                <Checkbox />
                <span>Dark mode checkbox</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
