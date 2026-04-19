import { ChartArea, Layers, MonitorCog } from 'lucide-react'
import React from 'react'

function Info_hero() {
  const features = [
    {
      icon: MonitorCog,
      title: 'Instant Setup',
      description: 'Create polls in seconds with no registration required. Share a simple code and start collecting responses immediately.'
    },
    {
      icon: ChartArea,
      title: 'Live Results',
      description: 'Watch responses come in real-time with live charts and analytics. Perfect for interactive presentations and audience engagement.'
    },
    {
      icon: Layers,
      title: 'Multiple Formats',
      description: 'Support for multiple choice, ratings, and more. Customize your polls to suit any need or event.'
    }
  ];

  return (
    <div className='mt-16'>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <div
              key={index}
              className='border-2 border-black bg-white p-6 hover:shadow-[4px_4px_0px_rgba(0,0,0,0.1)] transition-all duration-200'
            >
              <div className='flex items-center gap-3 mb-4'>
                <Icon className='text-black' size={24} />
                <h3 className='font-bold text-black text-lg'>{feature.title}</h3>
              </div>
              <p className='text-gray-600 text-sm leading-relaxed'>
                {feature.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  )
}

export default Info_hero