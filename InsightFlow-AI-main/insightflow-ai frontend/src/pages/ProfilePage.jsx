import { useState } from 'react'
import { User, Mail } from 'lucide-react'
import PageHeader from '../components/ui/PageHeader'
import Card, { CardTitle, CardDescription } from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input, { Label } from '../components/ui/Input'
import Avatar from '../components/ui/Avatar'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../components/ui/Toaster'

export default function ProfilePage() {
  const { user, updateProfile } = useAuth()
  const { addToast } = useToast()
  const [isSaving, setIsSaving] = useState(false)
  const [name, setName] = useState(user?.name || '')

  const handleSave = async (e) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      await updateProfile({ name })
      addToast('Profile changes saved successfully.', 'success')
    } catch (error) {
      addToast(error.message || 'Failed to save profile', 'error')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full">
      <PageHeader eyebrow="Preferences" title="Profile" description="Manage your personal information." />

      <form onSubmit={handleSave} className="flex flex-col gap-6">
        <Card>
          <CardTitle>Personal Info</CardTitle>
          <CardDescription>Update your photo and personal details here.</CardDescription>
          
          <div className="mt-6 flex items-center gap-4">
            <Avatar name={user?.name || 'User'} size="lg" src={user?.avatar_url} />
            <div>
              <Button variant="secondary" size="sm" type="button">Change avatar</Button>
              <p className="mt-1.5 text-xs text-ink-faint">JPG or PNG, up to 2MB.</p>
            </div>
          </div>
          
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label htmlFor="fname">Full Name</Label>
              <Input id="fname" value={name} onChange={(e) => setName(e.target.value)} icon={User} required />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="pemail">Email Address</Label>
              <Input id="pemail" type="email" defaultValue={user?.email || ''} icon={Mail} disabled />
              <p className="mt-1.5 text-[12px] text-ink-faint">Your email address is managed by your organization.</p>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end border-t border-border pt-5">
            <Button type="submit" disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save changes'}
            </Button>
          </div>
        </Card>
      </form>
    </div>
  )
}
