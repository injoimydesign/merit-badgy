import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { SearchPage } from '@/components/search/SearchPage'

const searchSchema = z.object({
  q: z.string().optional(),
  badgeName: z.string().optional(),
  subjectArea: z.string().optional(),
  virtual: z.string().optional(),
  eagle: z.string().optional(),
  timeframe: z.string().optional(),
  page: z.number().optional().default(1),
})

export const Route = createFileRoute('/_public/search')({
  component: SearchPage,
  validateSearch: searchSchema,
})
