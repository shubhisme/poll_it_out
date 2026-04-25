import React from 'react'
import Hero from './_components/Hero'
import SyncUser from '../components/SyncUser'
import {AppSidebar} from '../components/Sidebar_Nav'

function Page() {
  return (
    <>
        <SyncUser/>
        <AppSidebar/>
        <Hero/>
    </>
  )
}

export default Page