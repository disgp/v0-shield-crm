'use client'

import Image from 'next/image'

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo and Title */}
        <div className="flex flex-col items-center space-y-4">
          <div className="flex h-28 w-28 items-center justify-center rounded-[28px] bg-white shadow-lg">
            <Image
              src="https://i.ibb.co/JjL0219x/shield-roof-coating-texas-logo-icon-small.png"
              alt="Shield CRM"
              width={96}
              height={96}
              className="h-20 w-20"
              priority
            />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">Shield CRM</h1>
        </div>

        {/* Sign In Card */}
        <div className="rounded-2xl bg-white px-8 py-10 shadow-lg">
          <div className="space-y-6">
            <div className="text-center text-gray-500">
              <span className="text-sm">Sign in with email</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
