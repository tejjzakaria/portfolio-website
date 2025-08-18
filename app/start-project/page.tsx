import { StartProjectForm } from '@/components/StartProjectForm'
import React from 'react'

const page = () => {
  return (
    <main className='relative bg-black-100 flex justify-center items-center flex-col mx-auto sm:px-10 px-5'>
        <div className='max-w-7xl w-full'>
            <StartProjectForm></StartProjectForm>
        </div>
    </main>
  )
}

export default page
