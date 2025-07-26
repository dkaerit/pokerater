import Link from 'next/link'

export default function NotFound() {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
      <p className="mt-4 text-lg">Oops! The page you are looking for does not exist.</p>
      <Link href={`${basePath}/`} className="mt-8 px-4 py-2 text-white bg-primary rounded-md hover:bg-primary/90">
        Go back home
      </Link>
    </div>
  )
}
