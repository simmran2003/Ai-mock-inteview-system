'use client'
import React, { useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link' // Import Link
import { UserButton } from '@clerk/nextjs'
import { usePathname } from 'next/navigation'

function Header() {
  const path = usePathname();

  useEffect(() => {
    console.log(path)
  }, [path]) // It's better to include path as a dependency

  return (
    <div className='flex p-4 items-center justify-between bg-secondary shadow-sm'>
      <Image src={'/logo.svg'} height={50} width={100} alt="logo" />
      <ul className='hidden md:flex gap-6'>
        <li>
          <Link href="/dashboard" className={`hover:text-primary hover:font-bold transition-all cursor-pointer ${path === '/dashboard' ? 'text-primary font-bold' : ''}`}>
            Dashboard
          </Link>
        </li>
        <li>
          <Link href="/dashboard/questions" className={`hover:text-primary hover:font-bold transition-all cursor-pointer ${path === '/dashboard/questions' ? 'text-primary font-bold' : ''}`}>
            Questions
          </Link>
        </li>
        <li>
          <Link href="/dashboard/upgrade" className={`hover:text-primary hover:font-bold transition-all cursor-pointer ${path === '/dashboard/upgrade' ? 'text-primary font-bold' : ''}`}>
            Upgrade
          </Link>
        </li>
        <li>
          <Link href="/dashboard/how" className={`hover:text-primary hover:font-bold transition-all cursor-pointer ${path === '/dashboard/how' ? 'text-primary font-bold' : ''}`}>
            How it Works
          </Link>
        </li>
      </ul>
      <UserButton />
    </div>
  )
}

export default Header