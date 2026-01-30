'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';

type Link = { id: string; name: string; url: string; userName: string; active: boolean };

export default function AdminDashboard() {
  const router = useRouter();

  const [name, setName] = useState(''); 
  const [avatar, setAvatar] = useState('');

  const [links, setLinks] = useState<Link[]>([]);

  const [newLink, setNewLink] = useState({ name: '', url: '' });

  useEffect(() => {
    async function fetchData() {
      try {
        const resLinks = await fetch('/api/links');
        const linksData = await resLinks.json();

        if (linksData.length > 0) {
          setName(linksData[0].userName);
          setAvatar(linksData[0].avatar || '');
        }

        setLinks(
          linksData.map((l: any) => ({
            id: l.id,
            name: l.title,
            url: l.url,
            userName: l.userName,
            active: l.active,
          }))
        );
      } catch (err) {
        console.error(err);
      }
    }
    fetchData();
  }, []);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const items = Array.from(links);
    const [reordered] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reordered);
    setLinks(items);
  };

  const deleteLink = (id: string) => {
    setLinks(links.filter(link => link.id !== id));
  };

  const addLink = () => {
    if (newLink.name && newLink.url) {
      setLinks([...links, { id: Date.now().toString(), ...newLink, userName: name, active: true }]);
      setNewLink({ name: '', url: '' });
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 p-6 flex flex-col gap-10">
      <div className="flex items-center justify-between mb-6">
        <a
          href="/Login"
          className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300 mr-4"
        >
          ← Login
        </a>

        <h1 className="text-2xl font-bold">Dashboard</h1>

        <div
          className="flex items-center gap-4 cursor-pointer"
          onClick={() => router.push('/Profile')}
        >
          <span className="font-medium">{name}</span>
          <div className="w-12 h-12 relative rounded-full overflow-hidden border-2 border-gray-300">
            {avatar ? (
              <Image src={avatar} alt="Avatar" fill className="object-cover" />
            ) : (
              <div className="bg-gray-300 w-full h-full flex items-center justify-center text-white font-bold">
                {name ? name.charAt(0) : 'U'}
              </div>
            )}
          </div>
        </div>
      </div>

      <section className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Manage Links</h2>

        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Link Name"
            value={newLink.name}
            onChange={(e) => setNewLink({ ...newLink, name: e.target.value })}
            className="border p-2 rounded flex-1"
          />
          <input
            type="text"
            placeholder="URL"
            value={newLink.url}
            onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
            className="border p-2 rounded flex-1"
          />
          <button
            onClick={addLink}
            className="bg-blue-500 text-white px-4 rounded hover:bg-blue-600"
          >
            Add
          </button>
        </div>

        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="links">
            {(provided) => (
              <ul {...provided.droppableProps} ref={provided.innerRef} className="flex flex-col gap-2">
                {links.map((link, index) => (
                  <Draggable key={link.id} draggableId={link.id} index={index}>
                    {(provided) => (
                      <li
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="flex items-center justify-between border p-2 rounded shadow-sm bg-gray-50"
                      >
                        <div className="flex flex-col">
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {link.name}: {link.url}
                          </a>
                          <span className="text-gray-500 text-sm">{link.userName}</span>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => deleteLink(link.id)}
                            className="px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600"
                          >
                            Delete
                          </button>
                        </div>
                      </li>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </DragDropContext>
      </section>
    </main>
  );
}
