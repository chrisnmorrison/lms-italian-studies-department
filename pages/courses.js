import Head from 'next/head'
import Image from 'next/image'
import Login from '../components/Login'
import Courses from '../components/Courses'
import {useAuth} from '../context/AuthContext'
import AccessDenied from "../components/AccessDenied";

export default function Home() {
  const {currentUser, isAdmin} = useAuth()

  return (
      < >
        <Head>
          <title>Course List</title>
          <meta name="description" content="Generated by create next app"/>
          <link rel="icon" href="/favicon.ico"/>
        </Head>
        {!currentUser && <Login/>}
        {currentUser && isAdmin && <Courses/>}
        {currentUser && !isAdmin && <AccessDenied/>}
      </>
  )
}
