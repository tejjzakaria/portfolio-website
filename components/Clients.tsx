import React from 'react'
import { InfiniteMovingCards } from './ui/InfiniteMovingCards'
import { companies, testimonials } from '@/data'

const Clients = () => {
    return (
        <div className='py-20'>
            <h1 className='heading'>Kind words from {' '} <span className='text-purple'>satisfied clients</span></h1>
            <div className='flex flex-col items-center mt-10'>
                <div className='min-h-[30rem] w-full max-w-7xl rounded-md flex flex-col antialiased items-center px-4'>
                    <InfiniteMovingCards items={testimonials} direction='right' speed='slow' />

                    <div className='flex flex-wrap justify-center items-center gap-10 my-8'>
                        {companies.map(({id, img, name, nameImg}) => (
                            <div key={id} className='flex md:max-w-60 max-w-32 gap-2'>
                                <img src={img} alt={name} className='md:w-10 w-5'/>
                                <img src={nameImg} alt={name} className='md:w-24 w-5'/>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Clients
