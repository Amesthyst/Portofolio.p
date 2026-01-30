//Ricky
"use client";

import { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

interface LinkItem {
  id: string;
  title: string;
  url: string;
  active: boolean;
  order: number;
}

export default function HomePage() {
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/Link")
      .then((res) => res.json())
      .then((data) => setLinks(data));
  }, []);

  const handleAdd = async () => {
    if (!newTitle || !newUrl) return alert("Title and URL required");

    const res = await fetch("/api/Link", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTitle, url: newUrl }),
    });

    const added = await res.json();
    setLinks((prev) => [...prev, added]);
    setNewTitle("");
    setNewUrl("");
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/Link/${id}`, { method: "DELETE" });
    setLinks((prev) => prev.filter((l) => l.id !== id));
  };

  const handleToggle = async (link: LinkItem) => {
    const updated = { ...link, active: !link.active };
    await fetch(`/api/Link/${link.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    });
    setLinks((prev) =>
      prev.map((l) => (l.id === link.id ? updated : l))
    );
  };

  const handleUpdate = async (id: string) => {
    const link = links.find((l) => l.id === id);
    if (!link) return;

    await fetch(`/api/Link/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(link),
    });
    setEditingId(null);
  };

  const onDragEnd = async (result: any) => {
    if (!result.destination) return;

    const reordered = Array.from(links);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);
    for (let i = 0; i < reordered.length; i++) {
      reordered[i].order = i;
      await fetch(`/api/Link/${reordered[i].id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reordered[i]),
      });
    }

    setLinks(reordered);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex justify-between items-center bg-white shadow-md px-4 py-3 mb-6">
        <a
          href="/Login"
          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 flex items-center gap-1"
        >
          <span className="font-bold">&larr;</span> Logout
        </a>

        <h1 className="text-xl font-bold text-center flex-1">
          Dashboard
        </h1>

        <a href="/Profile" className="ml-auto">
          <img
            src="/avatar.png"
            alt="Avatar"
            className="w-10 h-10 rounded-full border border-gray-300"
          />
        </a>
      </div>

      <div className="max-w-2xl mx-auto p-4">
        {/* Add new link */}
        <div className="flex gap-2 mb-4">
          <input
            className="border p-2 flex-1"
            placeholder="Title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <input
            className="border p-2 flex-1"
            placeholder="URL"
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
          />
          <button
            className="bg-blue-500 text-white px-4"
            onClick={handleAdd}
          >
            Add
          </button>
        </div>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="links">
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                {links.map((link, index) => (
                  <Draggable
                    key={link.id}
                    draggableId={link.id}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="flex items-center justify-between border p-2 mb-2 bg-white rounded shadow-sm"
                      >
                        <div className="flex flex-col flex-1">
                          {editingId === link.id ? (
                            <>
                              <input
                                className="border p-1 mb-1"
                                value={link.title}
                                onChange={(e) =>
                                  setLinks((prev) =>
                                    prev.map((l) =>
                                      l.id === link.id
                                        ? { ...l, title: e.target.value }
                                        : l
                                    )
                                  )
                                }
                              />
                              <input
                                className="border p-1"
                                value={link.url}
                                onChange={(e) =>
                                  setLinks((prev) =>
                                    prev.map((l) =>
                                      l.id === link.id
                                        ? { ...l, url: e.target.value }
                                        : l
                                    )
                                  )
                                }
                              />
                            </>
                          ) : (
                            <a
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`${
                                link.active ? "text-blue-600" : "text-gray-400"
                              }`}
                            >
                              {link.title} : {link.url}
                            </a>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <button
                            className={`px-2 ${
                              link.active
                                ? "bg-green-500"
                                : "bg-gray-400"
                            } text-white`}
                            onClick={() => handleToggle(link)}
                          >
                            {link.active ? "On" : "Off"}
                          </button>

                          {editingId === link.id ? (
                            <button
                              className="bg-blue-500 text-white px-2"
                              onClick={() => handleUpdate(link.id)}
                            >
                              Save
                            </button>
                          ) : (
                            <button
                              className="bg-yellow-500 text-white px-2"
                              onClick={() => setEditingId(link.id)}
                            >
                              Edit
                            </button>
                          )}

                          <button
                            className="bg-red-500 text-white px-2"
                            onClick={() => handleDelete(link.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}

                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
}
