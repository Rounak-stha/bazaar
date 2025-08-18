'use client'

import { CalendarIcon } from 'lucide-react'
import { subDays, format } from 'date-fns'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { type DateRange } from 'react-day-picker'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/utilities/ui'

export function AdminDatePicker({ className }: React.HTMLAttributes<HTMLDivElement>) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 640)
    }

    checkIsMobile()

    window.addEventListener('resize', checkIsMobile)

    return () => window.removeEventListener('resize', checkIsMobile)
  }, [])

  const [date, setDate] = useState<DateRange | undefined>(() => {
    const fromParam = searchParams.get('from')
    const toParam = searchParams.get('to')

    if (fromParam) {
      return {
        from: new Date(fromParam),
        to: toParam ? new Date(toParam) : undefined,
      }
    }

    return {
      from: subDays(new Date(), 30),
      to: new Date(),
    }
  })

  const setDateRange = (dateRange: DateRange | undefined) => {
    if (!dateRange) return

    setDate(dateRange)

    const params = new URLSearchParams(searchParams)
    if (dateRange.from) {
      params.set('from', format(dateRange.from, 'yyyy-MM-dd'))
    } else {
      params.delete('from')
    }

    if (dateRange.to) {
      params.set('to', format(dateRange.to, 'yyyy-MM-dd'))
    } else {
      params.delete('to')
    }
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className={cn('grid min-h-[36px] gap-2', className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="outline"
            size="sm"
            className={cn('h-full justify-start gap-2', !date && 'text-payload-elevation-900')}
          >
            <CalendarIcon className="-mt-[2px]" width={20} height={20} />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, 'LLL dd, y')} - {format(date.to, 'LLL dd, y')}
                </>
              ) : (
                format(date.from, 'LLL dd, y')
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align={isMobile ? 'start' : 'end'}>
          <Calendar
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDateRange}
            numberOfMonths={2}
            classNames={{
              day_today: 'bg-accent',
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
