import React from 'react';
import Footer from './Footer';
import Header from './Header';
import Sidebar from './Sidebar';
import Login from './Login';
import { useAuth } from '../context/AuthContext';
import AccessDenied from './AccessDenied';

export default function Layout(props) {
  const { children } = props;
  const {currentUser, isAdmin} = useAuth();


  return (
    <div className='flex flex-col min-h-screen relative bg-neutral-800 text-white'> 
      <Header />
      <div className='sidebar-and-main'>
        <Sidebar />
        <main className='flex-1 flex flex-col p-4 inline-block max-w-[82vw] ml-auto'>
          {!currentUser && <Login />}
          {currentUser && isAdmin ? (
            <>
              {children}
            </>
          ) : currentUser && !isAdmin ? (
            <AccessDenied />
          ) : null}
        </main>
      </div>
      <Footer />
    </div>
  );
}
