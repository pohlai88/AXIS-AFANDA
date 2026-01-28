'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import * as React from 'react'
import { useTheme } from './theme-provider'

const themes = [
  { name: 'Slate', value: 'slate', light: 'bg-slate-50', dark: 'bg-slate-950' },
  { name: 'Gray', value: 'gray', light: 'bg-gray-50', dark: 'bg-gray-950' },
  { name: 'Zinc', value: 'zinc', light: 'bg-zinc-50', dark: 'bg-zinc-950' },
  { name: 'Neutral', value: 'neutral', light: 'bg-neutral-50', dark: 'bg-neutral-950' },
  { name: 'Stone', value: 'stone', light: 'bg-stone-50', dark: 'bg-stone-950' },
]

export function ThemeCustomizer() {
  const { theme, setTheme } = useTheme()
  const [selectedTheme, setSelectedTheme] = React.useState('slate')
  const [radius, setRadius] = React.useState(0.5)

  return (
    <Card className='w-full max-w-md'>
      <CardHeader>
        <CardTitle>Customize Theme</CardTitle>
        <CardDescription>Customize the appearance of your application.</CardDescription>
      </CardHeader>
      <CardContent className='space-y-6'>
        <div className='space-y-2'>
          <Label>Color Scheme</Label>
          <Select
            value={theme}
            onValueChange={(value: 'light' | 'dark' | 'system') => setTheme(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder='Select color scheme' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='light'>Light</SelectItem>
              <SelectItem value='dark'>Dark</SelectItem>
              <SelectItem value='system'>System</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className='space-y-2'>
          <Label>Theme Color</Label>
          <div className='grid grid-cols-5 gap-2'>
            {themes.map(t => (
              <Button
                key={t.value}
                variant={selectedTheme === t.value ? 'default' : 'outline'}
                size='sm'
                onClick={() => {
                  setSelectedTheme(t.value)
                  // Apply theme color by updating CSS variables
                  const root = document.documentElement
                  const lightColor = {
                    slate: '222.2 84% 4.9%',
                    gray: '220 14.3% 4.1%',
                    zinc: '240 4.8% 3.9%',
                    neutral: '0 0% 3.9%',
                    stone: '60 4.8% 3.9%',
                  }[t.value]
                  if (lightColor) {
                    root.style.setProperty('--background', lightColor)
                  }
                }}
                className='h-8 w-8 p-0'
              >
                <div className={`h-4 w-4 rounded-full ${theme === 'light' ? t.light : t.dark}`} />
              </Button>
            ))}
          </div>
        </div>

        <div className='space-y-2'>
          <Label>Border Radius</Label>
          <div className='flex items-center space-x-2'>
            <span className='text-sm text-muted-foreground'>0</span>
            <input
              type='range'
              min='0'
              max='1'
              step='0.1'
              value={radius}
              onChange={e => {
                const value = parseFloat(e.target.value)
                setRadius(value)
                document.documentElement.style.setProperty('--radius', `${value}rem`)
              }}
              className='flex-1'
            />
            <span className='text-sm text-muted-foreground'>1</span>
          </div>
        </div>

        <div className='space-y-2'>
          <div className='flex items-center justify-between'>
            <Label>Compact Mode</Label>
            <Switch />
          </div>
        </div>

        <Button
          variant='outline'
          className='w-full'
          onClick={() => {
            // Reset to defaults
            setSelectedTheme('slate')
            setRadius(0.5)
            setTheme('system')
            const root = document.documentElement
            root.style.removeProperty('--background')
            root.style.removeProperty('--radius')
          }}
        >
          Reset to Defaults
        </Button>
      </CardContent>
    </Card>
  )
}
