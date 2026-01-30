//Ricky
'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ProfilePage() {
  const { data: session } = useSession();
  const router = useRouter();

  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState('');

  useEffect(() => {
    async function fetchUser() {
      if (!session) return;

      try {
        const res = await fetch('/api/user/me');
        const data = await res.json();
        setName(data.name || '');
        setBio(data.bio || '');
        setAvatar(data.avatar || '');
      } catch (err) {
        console.error(err);
      }
    }

    fetchUser();
  }, [session]);

  const saveProfile = async () => {
    try {
      const res = await fetch('/api/user/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bio, avatar }),
      });

      if (!res.ok) throw new Error('Failed to update profile');

      alert('Profile updated!');
    } catch (err) {
      console.error(err);
      alert('Failed to update profile');
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center bg-gray-50 py-6 px-4">
      <div className="w-full max-w-md flex justify-between items-center mb-6">
        <Link
          href="/Home"
          className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
        >
          ← Home
        </Link>
        <h1 className="text-2xl font-bold">{name}</h1>
        <div className="w-10" />
      </div>

      <div className="w-full max-w-md flex flex-col gap-4 bg-white p-6 rounded-lg shadow">
        <div className="flex flex-col gap-2">
          <label className="font-semibold">Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="border p-2 rounded"
            placeholder="Your bio"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-semibold">Avatar URL</label>
          <input
            type="text"
            value={avatar}
            onChange={(e) => setAvatar(e.target.value)}
            className="border p-2 rounded"
            placeholder="Enter avatar URL"
          />
        </div>

        <button
          onClick={saveProfile}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Save
        </button>
      </div>

      {avatar && (
        <div className="mt-6 w-32 h-32 rounded-full overflow-hidden border-2 border-gray-300">
          <img
            src={avatar}
            alt={`${name}'s Avatar`}
            className="w-full h-full object-cover"
          />
        </div>
      )}
    </main>
  );
}
