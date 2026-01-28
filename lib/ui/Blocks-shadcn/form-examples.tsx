'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Icons } from '@/components/ui/icons'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import * as React from 'react'

// Advanced Form Examples

export function FormExamplesShowcase() {
  return (
    <div className='space-y-8'>
      <div>
        <h3 className='mb-4 text-lg font-semibold'>Contact Form</h3>
        <ContactForm />
      </div>

      <div>
        <h3 className='mb-4 text-lg font-semibold'>Settings Form</h3>
        <SettingsForm />
      </div>

      <div>
        <h3 className='mb-4 text-lg font-semibold'>Survey Form</h3>
        <SurveyForm />
      </div>

      <div>
        <h3 className='mb-4 text-lg font-semibold'>Multi-step Form</h3>
        <MultiStepForm />
      </div>
    </div>
  )
}

// Contact Form Example
export function ContactForm() {
  const [isLoading, setIsLoading] = React.useState(false)
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    priority: 'normal',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      // Form submitted successfully!
    }, 2000)
  }

  return (
    <Card className='max-w-2xl'>
      <CardHeader>
        <CardTitle>Contact Us</CardTitle>
        <CardDescription>
          Send us a message and we'll get back to you as soon as possible.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className='space-y-6'>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <div className='space-y-2'>
              <Label htmlFor='name'>Name *</Label>
              <Input
                id='name'
                placeholder='John Doe'
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='email'>Email *</Label>
              <Input
                id='email'
                type='email'
                placeholder='john@example.com'
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='subject'>Subject *</Label>
            <Input
              id='subject'
              placeholder='How can we help you?'
              value={formData.subject}
              onChange={e => setFormData({ ...formData, subject: e.target.value })}
              required
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='priority'>Priority</Label>
            <Select
              value={formData.priority}
              onValueChange={value => setFormData({ ...formData, priority: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder='Select priority' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='low'>Low</SelectItem>
                <SelectItem value='normal'>Normal</SelectItem>
                <SelectItem value='high'>High</SelectItem>
                <SelectItem value='urgent'>Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='message'>Message *</Label>
            <Textarea
              id='message'
              placeholder='Tell us more about your inquiry...'
              className='min-h-[120px]'
              value={formData.message}
              onChange={e => setFormData({ ...formData, message: e.target.value })}
              required
            />
          </div>

          <Button type='submit' disabled={isLoading} className='w-full'>
            {isLoading && <Icons.spinner className='mr-2 h-4 w-4 animate-spin' />}
            {isLoading ? 'Sending...' : 'Send Message'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

// Settings Form Example
export function SettingsForm() {
  const [settings, setSettings] = React.useState({
    emailNotifications: true,
    pushNotifications: false,
    marketingEmails: true,
    twoFactorAuth: false,
    publicProfile: true,
    showEmail: false,
    theme: 'light',
    language: 'en',
    timezone: 'UTC',
  })

  return (
    <Card className='max-w-2xl'>
      <CardHeader>
        <CardTitle>Settings</CardTitle>
        <CardDescription>Manage your account settings and preferences.</CardDescription>
      </CardHeader>
      <CardContent className='space-y-6'>
        <div>
          <h4 className='mb-4 text-sm font-medium'>Notifications</h4>
          <div className='space-y-3'>
            <div className='flex items-center justify-between'>
              <div className='space-y-0.5'>
                <Label htmlFor='email-notifications'>Email Notifications</Label>
                <p className='text-sm text-muted-foreground'>
                  Receive email updates about your account activity.
                </p>
              </div>
              <Switch
                id='email-notifications'
                checked={settings.emailNotifications}
                onCheckedChange={checked =>
                  setSettings({ ...settings, emailNotifications: checked })
                }
              />
            </div>

            <div className='flex items-center justify-between'>
              <div className='space-y-0.5'>
                <Label htmlFor='push-notifications'>Push Notifications</Label>
                <p className='text-sm text-muted-foreground'>
                  Receive push notifications on your devices.
                </p>
              </div>
              <Switch
                id='push-notifications'
                checked={settings.pushNotifications}
                onCheckedChange={checked =>
                  setSettings({ ...settings, pushNotifications: checked })
                }
              />
            </div>

            <div className='flex items-center justify-between'>
              <div className='space-y-0.5'>
                <Label htmlFor='marketing-emails'>Marketing Emails</Label>
                <p className='text-sm text-muted-foreground'>
                  Receive emails about new features and updates.
                </p>
              </div>
              <Switch
                id='marketing-emails'
                checked={settings.marketingEmails}
                onCheckedChange={checked => setSettings({ ...settings, marketingEmails: checked })}
              />
            </div>
          </div>
        </div>

        <Separator />

        <div>
          <h4 className='mb-4 text-sm font-medium'>Security</h4>
          <div className='space-y-3'>
            <div className='flex items-center justify-between'>
              <div className='space-y-0.5'>
                <Label htmlFor='2fa'>Two-Factor Authentication</Label>
                <p className='text-sm text-muted-foreground'>
                  Add an extra layer of security to your account.
                </p>
              </div>
              <Switch
                id='2fa'
                checked={settings.twoFactorAuth}
                onCheckedChange={checked => setSettings({ ...settings, twoFactorAuth: checked })}
              />
            </div>
          </div>
        </div>

        <Separator />

        <div>
          <h4 className='mb-4 text-sm font-medium'>Privacy</h4>
          <div className='space-y-3'>
            <div className='flex items-center justify-between'>
              <div className='space-y-0.5'>
                <Label htmlFor='public-profile'>Public Profile</Label>
                <p className='text-sm text-muted-foreground'>
                  Make your profile visible to other users.
                </p>
              </div>
              <Switch
                id='public-profile'
                checked={settings.publicProfile}
                onCheckedChange={checked => setSettings({ ...settings, publicProfile: checked })}
              />
            </div>

            <div className='flex items-center justify-between'>
              <div className='space-y-0.5'>
                <Label htmlFor='show-email'>Show Email</Label>
                <p className='text-sm text-muted-foreground'>
                  Display your email address on your public profile.
                </p>
              </div>
              <Switch
                id='show-email'
                checked={settings.showEmail}
                onCheckedChange={checked => setSettings({ ...settings, showEmail: checked })}
              />
            </div>
          </div>
        </div>

        <Separator />

        <div>
          <h4 className='mb-4 text-sm font-medium'>Preferences</h4>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
            <div className='space-y-2'>
              <Label htmlFor='theme'>Theme</Label>
              <Select
                value={settings.theme}
                onValueChange={value => setSettings({ ...settings, theme: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='light'>Light</SelectItem>
                  <SelectItem value='dark'>Dark</SelectItem>
                  <SelectItem value='system'>System</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='language'>Language</Label>
              <Select
                value={settings.language}
                onValueChange={value => setSettings({ ...settings, language: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='en'>English</SelectItem>
                  <SelectItem value='es'>Spanish</SelectItem>
                  <SelectItem value='fr'>French</SelectItem>
                  <SelectItem value='de'>German</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='timezone'>Timezone</Label>
              <Select
                value={settings.timezone}
                onValueChange={value => setSettings({ ...settings, timezone: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='UTC'>UTC</SelectItem>
                  <SelectItem value='EST'>EST</SelectItem>
                  <SelectItem value='PST'>PST</SelectItem>
                  <SelectItem value='CET'>CET</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className='flex justify-end'>
          <Button>Save Changes</Button>
        </div>
      </CardContent>
    </Card>
  )
}

// Survey Form Example
export function SurveyForm() {
  const [surveyData, setSurveyData] = React.useState({
    satisfaction: 7,
    recommend: 8,
    features: [] as string[],
    comments: '',
    experience: 'good',
  })

  return (
    <Card className='max-w-2xl'>
      <CardHeader>
        <CardTitle>Customer Satisfaction Survey</CardTitle>
        <CardDescription>Help us improve our service by sharing your feedback.</CardDescription>
      </CardHeader>
      <CardContent className='space-y-6'>
        <div className='space-y-2'>
          <Label>How satisfied are you with our service?</Label>
          <div className='space-y-2'>
            <Slider
              value={[surveyData.satisfaction]}
              onValueChange={value => setSurveyData({ ...surveyData, satisfaction: value[0] || 0 })}
              max={10}
              step={1}
              className='w-full'
            />
            <div className='flex justify-between text-xs text-muted-foreground'>
              <span>Very Dissatisfied</span>
              <span className='font-medium'>Rating: {surveyData.satisfaction}/10</span>
              <span>Very Satisfied</span>
            </div>
          </div>
        </div>

        <div className='space-y-2'>
          <Label>How likely are you to recommend us?</Label>
          <div className='space-y-2'>
            <Slider
              value={[surveyData.recommend]}
              onValueChange={value => setSurveyData({ ...surveyData, recommend: value[0] || 0 })}
              max={10}
              step={1}
              className='w-full'
            />
            <div className='flex justify-between text-xs text-muted-foreground'>
              <span>Not Likely</span>
              <span className='font-medium'>Rating: {surveyData.recommend}/10</span>
              <span>Very Likely</span>
            </div>
          </div>
        </div>

        <div className='space-y-2'>
          <Label>Which features do you use most? (Select all that apply)</Label>
          <div className='grid grid-cols-2 gap-2'>
            {['Dashboard', 'Analytics', 'Reports', 'API', 'Mobile App', 'Integrations'].map(
              feature => (
                <div key={feature} className='flex items-center space-x-2'>
                  <Checkbox
                    id={feature}
                    checked={surveyData.features.includes(feature)}
                    onCheckedChange={checked => {
                      if (checked) {
                        setSurveyData({
                          ...surveyData,
                          features: [...surveyData.features, feature],
                        })
                      } else {
                        setSurveyData({
                          ...surveyData,
                          features: surveyData.features.filter(f => f !== feature),
                        })
                      }
                    }}
                  />
                  <Label htmlFor={feature} className='text-sm'>
                    {feature}
                  </Label>
                </div>
              )
            )}
          </div>
        </div>

        <div className='space-y-2'>
          <Label>Overall experience</Label>
          <RadioGroup
            value={surveyData.experience}
            onValueChange={value => setSurveyData({ ...surveyData, experience: value })}
          >
            <div className='flex items-center space-x-2'>
              <RadioGroupItem value='excellent' id='excellent' />
              <Label htmlFor='excellent'>Excellent</Label>
            </div>
            <div className='flex items-center space-x-2'>
              <RadioGroupItem value='good' id='good' />
              <Label htmlFor='good'>Good</Label>
            </div>
            <div className='flex items-center space-x-2'>
              <RadioGroupItem value='average' id='average' />
              <Label htmlFor='average'>Average</Label>
            </div>
            <div className='flex items-center space-x-2'>
              <RadioGroupItem value='poor' id='poor' />
              <Label htmlFor='poor'>Poor</Label>
            </div>
          </RadioGroup>
        </div>

        <div className='space-y-2'>
          <Label htmlFor='comments'>Additional comments</Label>
          <Textarea
            id='comments'
            placeholder='Share any additional feedback or suggestions...'
            className='min-h-[100px]'
            value={surveyData.comments}
            onChange={e => setSurveyData({ ...surveyData, comments: e.target.value })}
          />
        </div>

        <div className='flex justify-end'>
          <Button>Submit Survey</Button>
        </div>
      </CardContent>
    </Card>
  )
}

// Multi-step Form Example
export function MultiStepForm() {
  const [currentStep, setCurrentStep] = React.useState(1)
  const [formData, setFormData] = React.useState({
    // Step 1
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    // Step 2
    company: '',
    jobTitle: '',
    industry: '',
    companySize: '',
    // Step 3
    goals: [] as string[],
    challenges: '',
    timeline: '',
  })

  const steps = [
    { id: 1, title: 'Personal Information', description: 'Tell us about yourself' },
    { id: 2, title: 'Company Information', description: 'Tell us about your company' },
    { id: 3, title: 'Goals & Challenges', description: 'What are you looking to achieve?' },
  ]

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = () => {
    // Form submitted successfully!
    // Reset form
    setCurrentStep(1)
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      company: '',
      jobTitle: '',
      industry: '',
      companySize: '',
      goals: [],
      challenges: '',
      timeline: '',
    })
  }

  return (
    <Card className='max-w-2xl'>
      <CardHeader>
        <CardTitle>Multi-step Registration</CardTitle>
        <CardDescription>Complete your profile in a few simple steps.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className='mb-8'>
          <div className='mb-4 flex items-center justify-between'>
            {steps.map((step, index) => (
              <div key={step.id} className='flex items-center'>
                <div
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium',
                    currentStep >= step.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  )}
                >
                  {step.id}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      'mx-4 h-1 flex-1',
                      currentStep > step.id ? 'bg-primary' : 'bg-muted'
                    )}
                  />
                )}
              </div>
            ))}
          </div>
          <div className='text-center'>
            <h3 className='font-medium'>{steps[currentStep - 1]?.title || "Step"}</h3>
            <p className='text-sm text-muted-foreground'>{steps[currentStep - 1]?.description || ""}</p>
          </div>
        </div>

        <form className='space-y-6'>
          {currentStep === 1 && (
            <div className='space-y-4'>
              <div className='grid grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <Label htmlFor='firstName'>First Name</Label>
                  <Input
                    id='firstName'
                    value={formData.firstName}
                    onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='lastName'>Last Name</Label>
                  <Input
                    id='lastName'
                    value={formData.lastName}
                    onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                  />
                </div>
              </div>
              <div className='space-y-2'>
                <Label htmlFor='email'>Email</Label>
                <Input
                  id='email'
                  type='email'
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='phone'>Phone</Label>
                <Input
                  id='phone'
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='company'>Company</Label>
                <Input
                  id='company'
                  value={formData.company}
                  onChange={e => setFormData({ ...formData, company: e.target.value })}
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='jobTitle'>Job Title</Label>
                <Input
                  id='jobTitle'
                  value={formData.jobTitle}
                  onChange={e => setFormData({ ...formData, jobTitle: e.target.value })}
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='industry'>Industry</Label>
                <Select
                  value={formData.industry}
                  onValueChange={value => setFormData({ ...formData, industry: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Select industry' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='technology'>Technology</SelectItem>
                    <SelectItem value='healthcare'>Healthcare</SelectItem>
                    <SelectItem value='finance'>Finance</SelectItem>
                    <SelectItem value='education'>Education</SelectItem>
                    <SelectItem value='retail'>Retail</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className='space-y-2'>
                <Label htmlFor='companySize'>Company Size</Label>
                <Select
                  value={formData.companySize}
                  onValueChange={value => setFormData({ ...formData, companySize: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Select company size' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='1-10'>1-10 employees</SelectItem>
                    <SelectItem value='11-50'>11-50 employees</SelectItem>
                    <SelectItem value='51-200'>51-200 employees</SelectItem>
                    <SelectItem value='201-500'>201-500 employees</SelectItem>
                    <SelectItem value='500+'>500+ employees</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className='space-y-4'>
              <div className='space-y-2'>
                <Label>What are your primary goals? (Select all that apply)</Label>
                <div className='grid grid-cols-2 gap-2'>
                  {[
                    'Increase Revenue',
                    'Reduce Costs',
                    'Improve Efficiency',
                    'Better Analytics',
                    'Customer Satisfaction',
                    'Market Expansion',
                  ].map(goal => (
                    <div key={goal} className='flex items-center space-x-2'>
                      <Checkbox
                        id={goal}
                        checked={formData.goals.includes(goal)}
                        onCheckedChange={checked => {
                          if (checked) {
                            setFormData({ ...formData, goals: [...formData.goals, goal] })
                          } else {
                            setFormData({
                              ...formData,
                              goals: formData.goals.filter(g => g !== goal),
                            })
                          }
                        }}
                      />
                      <Label htmlFor={goal} className='text-sm'>
                        {goal}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              <div className='space-y-2'>
                <Label htmlFor='challenges'>What are your biggest challenges?</Label>
                <Textarea
                  id='challenges'
                  placeholder='Describe your main challenges...'
                  className='min-h-[100px]'
                  value={formData.challenges}
                  onChange={e => setFormData({ ...formData, challenges: e.target.value })}
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='timeline'>Timeline for implementation</Label>
                <Select
                  value={formData.timeline}
                  onValueChange={value => setFormData({ ...formData, timeline: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Select timeline' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='immediately'>Immediately</SelectItem>
                    <SelectItem value='1-3-months'>1-3 months</SelectItem>
                    <SelectItem value='3-6-months'>3-6 months</SelectItem>
                    <SelectItem value='6-12-months'>6-12 months</SelectItem>
                    <SelectItem value='12-plus-months'>12+ months</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <div className='flex justify-between pt-6'>
            <Button type='button' variant='outline' onClick={prevStep} disabled={currentStep === 1}>
              Previous
            </Button>
            {currentStep === steps.length ? (
              <Button type='button' onClick={handleSubmit}>
                Submit
              </Button>
            ) : (
              <Button type='button' onClick={nextStep}>
                Next
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
