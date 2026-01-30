import { AlertCircle, CheckCircle2, BookOpen, Info } from 'lucide-react'
import type { SerializedEvent } from '@/server/functions/events'
import { motion } from 'motion/react'

interface EventDetailsProps {
  event: SerializedEvent
}

export function EventDetails({ event }: EventDetailsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 space-y-8"
    >
      {/* Description */}
      {event.description && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-[#1e3a5f]" />
            <h2 className="text-xl font-display font-bold text-gray-900">
              About This Class
            </h2>
          </div>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {event.description}
            </p>
          </div>
        </section>
      )}

      {/* Prerequisites */}
      {event.prerequisites && (
        <section className="pt-8 border-t border-gray-100">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h2 className="text-xl font-display font-bold text-gray-900 mb-1">
                Prerequisites
              </h2>
              <p className="text-sm text-gray-600">
                Please complete these requirements before attending
              </p>
            </div>
          </div>
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {event.prerequisites}
            </p>
          </div>
        </section>
      )}

      {/* Subject Area */}
      {event.subjectArea && (
        <section className="pt-8 border-t border-gray-100">
          <div className="flex items-center gap-2 mb-3">
            <Info className="w-5 h-5 text-[#1e3a5f]" />
            <h2 className="text-xl font-display font-bold text-gray-900">
              Subject Area
            </h2>
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#1e3a5f]/5 border border-[#1e3a5f]/10 rounded-lg">
            <span className="text-[#1e3a5f] font-medium">
              {event.subjectArea}
            </span>
          </div>
        </section>
      )}

      {/* What to Bring / Prepare */}
      <section className="pt-8 border-t border-gray-100">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h2 className="text-xl font-display font-bold text-gray-900 mb-1">
              What to Bring
            </h2>
            <p className="text-sm text-gray-600">
              Come prepared for a great learning experience
            </p>
          </div>
        </div>
        <ul className="space-y-2 text-gray-700">
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <span>Scout handbook and merit badge workbook</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <span>Pen or pencil for taking notes</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <span>Completed prerequisite requirements (if any)</span>
          </li>
          {event.isVirtual && (
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span>Computer or device with camera and microphone</span>
            </li>
          )}
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <span>Positive attitude and willingness to learn!</span>
          </li>
        </ul>
      </section>

      {/* Important Notes */}
      <section className="pt-8 border-t border-gray-100">
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-gray-700 space-y-2">
              <p className="font-semibold text-blue-900">Important Notes:</p>
              <ul className="space-y-1 list-disc list-inside">
                <li>
                  Attendance at this class does not guarantee completion of the
                  merit badge
                </li>
                <li>Scouts must complete all requirements to earn the badge</li>
                <li>
                  Parents/guardians may be required to attend for certain age
                  groups
                </li>
                <li>Registration may be required - check with the organizer</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  )
}
