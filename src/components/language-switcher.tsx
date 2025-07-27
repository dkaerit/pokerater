'use client'

import { usePathname, useRouter } from 'next/navigation'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function LanguageSwitcher({ lang }: { lang: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

  const handleLanguageChange = (newLocale: string) => {
    const newPath = pathname.replace(`${basePath}/${lang}`, `${basePath}/${newLocale}`)
    router.push(newPath)
  }

  return (
    <Select value={lang} onValueChange={handleLanguageChange}>
      <SelectTrigger className="w-[120px]">
        <SelectValue placeholder="Language" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="es">Español</SelectItem>
        <SelectItem value="en">English</SelectItem>
      </SelectContent>
    </Select>
  )
}
