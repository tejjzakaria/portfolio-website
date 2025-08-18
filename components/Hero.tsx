import React from 'react'
import { Spotlight } from './ui/Spotlight'
import { cn } from "@/lib/utils";
import { TextGenerateEffect } from './ui/text-generate-effect';
import MagicButton from './ui/MagicButton';
import { FaLocationArrow } from 'react-icons/fa';

const Hero = () => {
    return (
        <div className='pb-20 pt-36'>
            <div>
                <Spotlight className='-top-40 -left-10 md:-left-32 md:-top-20 h-screen' fill='white'></Spotlight>
                <Spotlight className='top-10 left-full h-[80vh] w-[50vw]' fill='purple'></Spotlight>
                <Spotlight className='top-28 left-80 h-[80vh] w-[50vw]' fill='blue'></Spotlight>

            </div>


            <div className="flex h-screen w-full items-center justify-center bg-white dark:bg-white/[0.05] absolute top-0 left-0">
                <div
                    className={cn(
                        "absolute inset-0",
                        "[background-size:40px_40px]",
                        "[background-image:linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)]",
                        "dark:[background-image:linear-gradient(to_right,rgba(38,38,38,0.2)_1px,transparent_1px),linear-gradient(to_bottom,rgba(38,38,38,0.2)_1px,transparent_1px)]",
                    )}
                />
                {/* Radial gradient for the container to give a faded look */}
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-black"></div>
                <p className="relative z-20 bg-gradient-to-b from-neutral-200 to-neutral-500 bg-clip-text py-8 text-4xl font-bold text-transparent sm:text-7xl">
                
                </p>
            </div>

            <div className='flex justify-center relative my-20 z-10'>
                <div className='max-w-[89vw] md:max-w-2xl lg:max-w-[60vw] flex flex-col items-center justify-center'>
                    <h2 className='uppercase tracking-widest text-xs text-center text-blue-100 max-w-100'>Turning vision into {' '} <span className='text-purple'>digital reality.</span> </h2>
                    <TextGenerateEffect className='text-center text-[40px] md:text-5xl lg:text-6xl' words='I don’t just build websites, I craft solutions.'></TextGenerateEffect>

                    <p className='text-center w-[40vw] md:tracking-wider mb-4 text-sm md:text-lg lg:text-2xl'>Hi, I'm Zakaria, a third year AI bachelor student at VU Amsterdam</p>
                    <a href="#projects">
                    <MagicButton title='Check my work' icon={<FaLocationArrow/>} position='right'></MagicButton>
                    </a>
                </div>

            </div>

            <div>

            </div>
        </div>
    )
}

export default Hero
