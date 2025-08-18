import { AdminLoginForm } from '@/components/adminLogin'
import React from 'react'

const page = () => {
    return (
        <main className='h-screen relative bg-black-100 flex justify-center items-center flex-col mx-auto sm:px-10 px-5'>
            <div className='max-w-7xl w-full'>
                <AdminLoginForm></AdminLoginForm>
            </div>
        </main>
    )
}

export default page
