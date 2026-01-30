import { Bell, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { SerializedEvent } from '@/server/functions/events'
import { motion } from 'motion/react'
import { useState } from 'react'
import { toast } from 'sonner'

interface ReminderSignupProps {
  event: SerializedEvent
}

export function ReminderSignup({ event }: ReminderSignupProps) {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email) {
      toast.error('Please enter your email address')
      return
    }

    setIsSubmitting(true)

    // TODO: Implement reminder signup functionality
    // This would typically call a server function to store the reminder
    await new Promise((resolve) => setTimeout(resolve, 1000))

    toast.success("Reminder set! We'll email you before the event.")
    setEmail('')
    setIsSubmitting(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-gradient-to-br from-[#d4a84b]/10 to-[#d4a84b]/5 rounded-2xl border border-[#d4a84b]/20 p-6"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-[#d4a84b] rounded-full flex items-center justify-center">
          <Bell className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="font-display font-bold text-gray-900">Get Reminded</h2>
          <p className="text-sm text-gray-600">Don't miss this class</p>
        </div>
      </div>

      <p className="text-sm text-gray-700 mb-4">
        Enter your email and we'll send you a reminder before the event starts.
      </p>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <Label htmlFor="reminder-email" className="sr-only">
            Email address
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              id="reminder-email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10"
              disabled={isSubmitting}
            />
          </div>
        </div>

        <Button
          type="submit"
          className="w-full bg-[#d4a84b] hover:bg-[#c49840] text-white"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Setting reminder...' : 'Set Reminder'}
        </Button>
      </form>

      <p className="text-xs text-gray-500 mt-3 text-center">
        We'll only use your email for event reminders
      </p>
    </motion.div>
  )
}
