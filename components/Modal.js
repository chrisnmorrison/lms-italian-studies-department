import React from 'react'
import ReactDOM from 'react-dom'
import { useAuth } from '../context/AuthContext'

export default function Modal({ setOpenModal }) {
    const { logout } = useAuth()

    return ReactDOM.createPortal(
        <div className='z-50 fixed inset-0 bg-white text-slate-900 text-lg sm:text-xl flex flex-col'>
            <div className='flex items-center justify-between border-b border-solid border-slate-900 p-4'>
                <h1 className='font-extrabold text-2xl sm:text-5xl select-none'>MENU</h1>
                <i 
                    onClick={() => setOpenModal(false)} 
                    className="fa-solid fa-xmark duration-300 hover:rotate-90 text-lg sm:text-3xl cursor-pointer"
                />
            </div>
            <div className='p-4 flex flex-col gap-3'>
                <h2 
                    onClick={() => {
                        logout()
                        setOpenModal(false)
                    }} 
                    className='select-none duration-300 hover:pl-2 cursor-pointer'
                >
                    Logout
                </h2>
            </div>
        </div>,
        document.getElementById('portal')
    )
}
