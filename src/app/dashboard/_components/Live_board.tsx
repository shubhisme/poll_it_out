import React from 'react'

function Live_board() {
  const stats = [
    { number: '1000', label: 'Polls Created' },
    { number: '2566', label: 'Responses' },
    { number: '2600', label: 'Active Users' },
    { number: '95%', label: 'Up Time' }
  ];

  return (
    <section className='my-16'>
      <div className='border-2 border-black bg-white'>
        <div className='grid grid-cols-2 md:grid-cols-4'>
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`p-8 flex flex-col items-center justify-center ${
                index !== stats.length - 1 ? 'md:border-r-2 border-black' : ''
              } ${index % 2 === 1 ? 'md:border-r-0' : ''} border-b-2 border-black md:border-b-0 last:border-b-0`}
            >
              <p className='text-4xl md:text-5xl font-bold text-black mb-2'>
                {stat.number}
              </p>
              <p className='text-gray-600 font-semibold text-sm text-center'>
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Live_board