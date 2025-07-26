
import { redirect } from 'next/navigation'

export default function RootPage() {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  redirect(`${basePath}/es`)
}
