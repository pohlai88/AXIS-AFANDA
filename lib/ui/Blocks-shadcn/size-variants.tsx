'use client'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'

// Complete Size Variants System

export function ComponentSizeShowcase() {
  return (
    <div className='space-y-8'>
      <div>
        <h3 className='mb-4 text-lg font-semibold'>Button Sizes</h3>
        <ButtonSizeVariants />
      </div>

      <div>
        <h3 className='mb-4 text-lg font-semibold'>Input Sizes</h3>
        <InputSizeVariants />
      </div>

      <div>
        <h3 className='mb-4 text-lg font-semibold'>Card Sizes</h3>
        <CardSizeVariants />
      </div>

      <div>
        <h3 className='mb-4 text-lg font-semibold'>Form Element Sizes</h3>
        <FormElementSizeVariants />
      </div>
    </div>
  )
}

export function ButtonSizeVariants() {
  return (
    <div className='space-y-4'>
      <div>
        <Label className='text-sm text-muted-foreground'>Extra Small</Label>
        <div className='flex gap-2'>
          <Button size='sm' className='h-6 px-2 text-xs'>
            XS
          </Button>
          <Button size='sm' variant='outline' className='h-6 px-2 text-xs'>
            XS
          </Button>
          <Button size='sm' variant='secondary' className='h-6 px-2 text-xs'>
            XS
          </Button>
        </div>
      </div>

      <div>
        <Label className='text-sm text-muted-foreground'>Small</Label>
        <div className='flex gap-2'>
          <Button size='sm'>Small</Button>
          <Button size='sm' variant='outline'>
            Small
          </Button>
          <Button size='sm' variant='secondary'>
            Small
          </Button>
        </div>
      </div>

      <div>
        <Label className='text-sm text-muted-foreground'>Default</Label>
        <div className='flex gap-2'>
          <Button>Default</Button>
          <Button variant='outline'>Default</Button>
          <Button variant='secondary'>Default</Button>
        </div>
      </div>

      <div>
        <Label className='text-sm text-muted-foreground'>Large</Label>
        <div className='flex gap-2'>
          <Button size='lg'>Large</Button>
          <Button size='lg' variant='outline'>
            Large
          </Button>
          <Button size='lg' variant='secondary'>
            Large
          </Button>
        </div>
      </div>

      <div>
        <Label className='text-sm text-muted-foreground'>Extra Large</Label>
        <div className='flex gap-2'>
          <Button size='lg' className='h-12 px-8 text-lg'>
            XL
          </Button>
          <Button size='lg' variant='outline' className='h-12 px-8 text-lg'>
            XL
          </Button>
          <Button size='lg' variant='secondary' className='h-12 px-8 text-lg'>
            XL
          </Button>
        </div>
      </div>
    </div>
  )
}

export function InputSizeVariants() {
  return (
    <div className='space-y-4'>
      <div>
        <Label className='text-sm text-muted-foreground'>Extra Small</Label>
        <Input placeholder='Extra small input' className='h-6 px-2 text-xs' />
      </div>

      <div>
        <Label className='text-sm text-muted-foreground'>Small</Label>
        <Input placeholder='Small input' className='h-8 px-2 text-sm' />
      </div>

      <div>
        <Label className='text-sm text-muted-foreground'>Default</Label>
        <Input placeholder='Default input' />
      </div>

      <div>
        <Label className='text-sm text-muted-foreground'>Large</Label>
        <Input placeholder='Large input' className='h-12 px-4 text-lg' />
      </div>

      <div>
        <Label className='text-sm text-muted-foreground'>Extra Large</Label>
        <Input placeholder='Extra large input' className='h-14 px-4 text-xl' />
      </div>
    </div>
  )
}

export function CardSizeVariants() {
  return (
    <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
      <Card className='w-48 p-3'>
        <CardHeader className='p-0 pb-2'>
          <CardTitle className='text-sm'>Tiny Card</CardTitle>
          <CardDescription className='text-xs'>Compact content</CardDescription>
        </CardHeader>
        <CardContent className='p-0'>
          <p className='text-xs text-muted-foreground'>Minimal card with tiny footprint</p>
        </CardContent>
      </Card>

      <Card className='w-56 p-4'>
        <CardHeader className='p-0 pb-3'>
          <CardTitle className='text-sm'>Small Card</CardTitle>
          <CardDescription className='text-xs'>Compact design</CardDescription>
        </CardHeader>
        <CardContent className='p-0'>
          <p className='text-sm text-muted-foreground'>Compact card for minimal interfaces</p>
        </CardContent>
      </Card>

      <Card className='w-64 p-6'>
        <CardHeader>
          <CardTitle>Default Card</CardTitle>
          <CardDescription>Standard size</CardDescription>
        </CardHeader>
        <CardContent>
          <p className='text-sm'>Standard card with balanced proportions</p>
        </CardContent>
      </Card>

      <Card className='w-80 p-8'>
        <CardHeader>
          <CardTitle className='text-lg'>Large Card</CardTitle>
          <CardDescription className='text-base'>Spacious layout</CardDescription>
        </CardHeader>
        <CardContent>
          <p className='text-base'>Large card with generous spacing and prominent content</p>
        </CardContent>
      </Card>

      <Card className='w-96 p-10'>
        <CardHeader>
          <CardTitle className='text-xl'>Extra Large Card</CardTitle>
          <CardDescription className='text-lg'>Maximum space</CardDescription>
        </CardHeader>
        <CardContent>
          <p className='text-lg'>
            Extra large card for featured content with maximum visual impact
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

export function FormElementSizeVariants() {
  return (
    <div className='space-y-6'>
      <div>
        <Label className='text-sm text-muted-foreground'>Badge Sizes</Label>
        <div className='flex items-center gap-2'>
          <Badge className='px-1 py-0.5 text-xs'>XS</Badge>
          <Badge className='px-2 py-1 text-sm'>SM</Badge>
          <Badge>Default</Badge>
          <Badge className='px-3 py-1.5 text-base'>LG</Badge>
          <Badge className='px-4 py-2 text-lg'>XL</Badge>
        </div>
      </div>

      <div>
        <Label className='text-sm text-muted-foreground'>Avatar Sizes</Label>
        <div className='flex items-center gap-2'>
          <Avatar className='h-6 w-6'>
            <AvatarFallback>A</AvatarFallback>
          </Avatar>
          <Avatar className='h-8 w-8'>
            <AvatarFallback>A</AvatarFallback>
          </Avatar>
          <Avatar className='h-10 w-10'>
            <AvatarFallback>A</AvatarFallback>
          </Avatar>
          <Avatar className='h-12 w-12'>
            <AvatarFallback>A</AvatarFallback>
          </Avatar>
          <Avatar className='h-16 w-16'>
            <AvatarFallback>A</AvatarFallback>
          </Avatar>
        </div>
      </div>

      <div>
        <Label className='text-sm text-muted-foreground'>Switch & Checkbox Sizes</Label>
        <div className='space-y-3'>
          <div className='flex items-center gap-2'>
            <Switch className='scale-75' />
            <Label className='text-xs'>Extra Small</Label>
          </div>
          <div className='flex items-center gap-2'>
            <Switch className='scale-90' />
            <Label className='text-sm'>Small</Label>
          </div>
          <div className='flex items-center gap-2'>
            <Switch />
            <Label>Default</Label>
          </div>
          <div className='flex items-center gap-2'>
            <Switch className='scale-110' />
            <Label className='text-base'>Large</Label>
          </div>
        </div>
      </div>

      <div>
        <Label className='text-sm text-muted-foreground'>Textarea Sizes</Label>
        <div className='space-y-2'>
          <Textarea placeholder='Extra small' className='h-16 resize-none px-2 py-1 text-xs' />
          <Textarea placeholder='Small' className='h-20 resize-none px-2 py-1 text-sm' />
          <Textarea placeholder='Default' className='resize-none' />
          <Textarea placeholder='Large' className='h-32 resize-none px-4 py-3 text-lg' />
        </div>
      </div>

      <div>
        <Label className='text-sm text-muted-foreground'>Select Sizes</Label>
        <div className='space-y-2'>
          <Select>
            <SelectTrigger className='h-8 px-2 text-xs'>
              <SelectValue placeholder='Extra small' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='xs'>Extra Small</SelectItem>
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger className='h-9 px-2 text-sm'>
              <SelectValue placeholder='Small' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='sm'>Small</SelectItem>
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger>
              <SelectValue placeholder='Default' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='default'>Default</SelectItem>
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger className='h-12 px-4 text-lg'>
              <SelectValue placeholder='Large' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='lg'>Large</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}

export function ResponsiveSizeVariants() {
  return (
    <div className='space-y-4'>
      <div>
        <Label className='text-sm text-muted-foreground'>Responsive Buttons</Label>
        <div className='flex flex-col gap-2 sm:flex-row'>
          <Button size='sm' className='sm:hidden'>
            Mobile Small
          </Button>
          <Button size='default' className='hidden sm:block lg:hidden'>
            Tablet Default
          </Button>
          <Button size='lg' className='hidden lg:block'>
            Desktop Large
          </Button>
        </div>
      </div>

      <div>
        <Label className='text-sm text-muted-foreground'>Responsive Cards</Label>
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          <Card className='p-4 sm:p-6'>
            <CardHeader className='p-0 pb-2'>
              <CardTitle className='text-sm sm:text-base'>Responsive Card</CardTitle>
            </CardHeader>
            <CardContent className='p-0'>
              <p className='text-xs sm:text-sm'>Adapts to screen size</p>
            </CardContent>
          </Card>

          <Card className='p-4 sm:p-6'>
            <CardHeader className='p-0 pb-2'>
              <CardTitle className='text-sm sm:text-base'>Another Card</CardTitle>
            </CardHeader>
            <CardContent className='p-0'>
              <p className='text-xs sm:text-sm'>Flexible layout</p>
            </CardContent>
          </Card>

          <Card className='p-4 sm:p-6'>
            <CardHeader className='p-0 pb-2'>
              <CardTitle className='text-sm sm:text-base'>Third Card</CardTitle>
            </CardHeader>
            <CardContent className='p-0'>
              <p className='text-xs sm:text-sm'>Grid responsive</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
