import React from 'react'
import MagicButton from './ui/MagicButton'
import { FaLocationArrow } from 'react-icons/fa'
import { socialMedia } from '@/data'
import { div } from 'motion/react-client'

const Footer = () => {
  return (
    <footer className='w-full pt-20 pb-10' id="contact">

        <div className='flex flex-col items-center'>
            <h1 className='heading lg:max-w-[45vw]'>Ready to take {' '} <span className='text-purple'>your digital presence</span> to the next level?</h1>
            <p className='text-white-200 lg:mt-10 my-5 text-center'>Reach out now! Let's make a plan.</p>
            <a href="mailto:contact@tejjzakaria.com">
                <MagicButton title="Send an email" icon={<FaLocationArrow></FaLocationArrow>} position="right"></MagicButton>
            </a>
        </div>

        <div className='flex mt-16 md:flex-row flex-col justify-between items-center'>
            <p className='md:text-base text-sm md:font-normal font-light'>Copyright © 2025.</p>
            <div className='flex items-center md:gap-3 gap-6 mt-5'>
                {socialMedia.map((profile) => (
                    <div key={profile.id} className='w-10 h-10 cursor-pointer flex justify-center items-center backdrop-filter backdrop-blur-lg saturate-180 bg-black-200 rounded-lg border border-black-300'>
                        <img src={profile.img} width={20} height={20}/>
                    </div>
                ))}
            </div>
        </div>
    </footer>
  )
}

export default Footer
