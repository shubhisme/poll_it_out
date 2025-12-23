import React from 'react'
import Navbar from '../components/Navbar'
import Hero from './_components/Hero'
import SyncUser from '../components/SyncUser'

function Page() {
  return (
    <>
        <SyncUser/>
        <Navbar/>
        <Hero/>
    </>
  )
}

export default Page