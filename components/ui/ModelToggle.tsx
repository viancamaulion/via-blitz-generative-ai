"use client"

import { Button } from "@/components/ui/button"

export interface ModelOption {
  label: string
  value: string
}

interface ModelToggleProps {
  options: ModelOption[]
  selected: string
  onChange: (value: string) => void
}

export function ModelToggle({ options, selected, onChange }: ModelToggleProps) {
  return (
    <div className='flex gap-2 items-center justify-start py-2'>
      {options.map((option) => (
        <Button
          key={option.value}
          variant={selected === option.value ? "default" : "secondary"}
          size='sm'
          onClick={() => onChange(option.value)}
          aria-pressed={selected === option.value}
        >
          {option.label}
        </Button>
      ))}
    </div>
  )
}
