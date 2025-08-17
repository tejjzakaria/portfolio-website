import { workExperience } from '@/data'
import React from 'react'
import { Button } from './ui/MovingBorder'
import { div } from 'motion/react-client'

const Experience = () => {
    return (
        <div className='py-20'>
            <h1 className='heading'>What can {' '} <span className='text-purple'>i do?</span></h1>
            <div className='w-full mt-12 grid lg:grid-cols-2 grid-cols-1 gap-10'>
                {workExperience.map((card) => (
                    <div>

                        <Button key={card.id} borderRadius='1.75rem' className='h-[30vh] flex-1 text-white border-neutral-200 dark:border-slate-800 lg:py-6 px-8 py-3 gap-5'
                        duration={Math.floor(Math.random() * 10000 + 10000)}
                        >
                            <div className='flex lg:flex-row flex-col lg:items-center p-3 py-6 md:p-5 lg:p-10 gap-2'>
                                <img src={card.thumbnail} alt={card.title} className='lg:w-32 md:w-20 w-16'/>
                            </div>
                            <div className='lg:ms-5'>
                                <h1 className='text-start text-xl md:text-2xl font-bold'>{card.title}</h1>
                                <p className='text-start text-xs text-white-100 mt-3 font-semibold'>{card.desc}</p>
                            </div>
                        </Button>
                    </div>
                ))}

            </div>
        </div>
    )
}

export default Experience
