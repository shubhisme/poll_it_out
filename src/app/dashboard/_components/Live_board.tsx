import React from 'react'

function Live_board() {
  return (
    <section className='mt-10'>
        <div className='flex justify-around border-2 px-15 py-3 bg-[#f3f4f6]'>

            <div className='flex flex-col gap-y-1 justify-center'>
                <p className='text-3xl'>1000</p>
                <p className='text-gray-600 font-light'>Polls Created</p>
            </div>

            <div className='flex flex-col gap-y-1 justify-center'>
                <p className='text-3xl'>2566</p>
                <p className='text-gray-600 font-light'>Responses</p>
            </div>

            <div className='flex flex-col gap-y-1 justify-center'>
                <p className='text-3xl'>2600</p>
                <p className='text-gray-600 font-light'>Active Users</p>
            </div>

            <div className='flex flex-col gap-y-1 justify-center'>
                <p className='text-3xl'>95%</p>
                <p className='text-gray-600 font-light'>Up Time</p>
            </div>
        </div>
    </section>
  )
}

export default Live_board