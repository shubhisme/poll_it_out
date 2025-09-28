import { Book, Plus, Users } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

function Navbar() {
  return (
    <div className='flex items-center justify-center'>
        <nav className='w-[100%] bg-white h-full flex justify-between px-15 py-4 border-b-2 items-center'>
            <p>Poll It Out</p>

            <ul className='flex justify-around gap-x-5 items-center'>
                <li className='flex items-center gap-x-2'>
                    <Link href="/dashboard/create-poll" className='flex items-center gap-x-2 border-2 px-2'>
                        <Plus className='w-4 h-4 text-black'/>
                        <p>Create Poll</p>
                    </Link>
                </li>

                <li className='flex items-center gap-x-2'>
                    <Link href="/dashboard/create-poll" className='flex items-center gap-x-2 border-2 px-2'>
                        <Users className='w-4 h-4 text-black'/>
                        <p>Join A Poll</p>
                    </Link>
                </li>

                <li>
                    <Link href="/dashboard/create-poll" className='flex items-center gap-x-2 border-2 px-2'>
                        <Book className='w-4 h-4 text-black'/>
                        <p>About</p>
                    </Link>
                </li>
            </ul>

            <ul className="flex justify-around items-center gap-x-3">
            <li>Account</li>

            <li>
                <Link href="/signin">
                <button
                    className="font-semibold bg-black text-white px-2 py-1 shadow-[2px_2px_0px_gray]
                            active:translate-y-[2px] active:shadow-none transition-all cursor-pointer flex items-center gap-x-1"
                >
                    Sign In
                </button>
                </Link>
            </li>

            <li>
                <Link href="/signup">
                <button
                    className="font-semibold bg-black text-white px-2 py-1 shadow-[2px_2px_0px_gray]
                            active:translate-y-[2px] active:shadow-none transition-all cursor-pointer"
                >
                    Sign Up
                </button>
                </Link>
            </li>
            </ul>

        </nav>
    </div>
  )
}

export default Navbar