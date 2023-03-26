import { useUser } from '@auth0/nextjs-auth0/client';
import Head from 'next/head'
import Image from 'next/image'
import Dashboard from '../components/Dashboard';
import Welcome from '../components/Welcome';

export default function Home() {

  const { user, error, isLoading } = useUser();

  return (
    <div>
      {isLoading && (
        <div>Loading...</div>
      )}

      {!user && !isLoading && (
        <Welcome />
      )}

      {user && (
        <Dashboard />
      )}
    </div>
  )
}