"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { toast } from "react-hot-toast"

interface MessageType {
  _id: string
  name: string
  email: string
  message: string
  createdAt: string
}

export default function ContactMessagesPage() {
  const [messages, setMessages] = useState<MessageType[]>([])
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(false)
  // ✅ Extracted fetch function
  async function fetchMessages() {
    setFetching(true)
    try {
      const res = await axios.get("/api/admin/contact")
      if (res.data.success) {
        setMessages(res.data.data)
      } else {
        toast.error(res.data.message || "Failed to fetch messages")
      }
    } catch (err) {
      console.error(err)
      toast.error("Failed to fetch messages")
    }
    setFetching(false)
  }

  useEffect(() => {
    
    fetchMessages()
    
  }, [])

  // ✅ Delete one message
  async function deleteMessage(id: string) {
    if (!confirm("Delete this message?")) return
    try {
      await axios.delete(`/api/admin/contact/${id}`)
      toast.success("Message deleted")
      fetchMessages()
    } catch (err) {
      console.error(err)
      toast.error("Failed to delete message")
    }
  }

  // ✅ Bulk delete
  async function deleteSelected() {
    if (selectedIds.length === 0) {
      toast.error("No messages selected")
      return
    }
    if (!confirm(`Delete ${selectedIds.length} messages?`)) return

    setLoading(true)
    try {
      const res = await axios.post("/api/admin/contact", { ids: selectedIds })
      if (res.data.success) {
        toast.success(res.data.message)
        setSelectedIds([])
        fetchMessages()
      } else {
        toast.error(res.data.message || "Failed to delete messages")
      }
    } catch (err) {
      console.error(err)
      toast.error("Failed to delete selected messages")
    } finally {
      setLoading(false)
    }
  }

  // ✅ Checkbox toggles
  function toggleSelect(id: string) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  function toggleSelectAll() {
    if (selectedIds.length === messages.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(messages.map((m) => m._id))
    }
  }


   if (fetching) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="md:p-6 py-4 mx-6 overflow-x-auto">
      <h1 className="text-2xl font-bold mb-4">Contact Messages</h1>

      <div className="mb-4 flex gap-2">
        <button
          onClick={toggleSelectAll}
          className="px-3 py-1 rounded bg-gray-200"
        >
          {selectedIds.length === messages.length && messages.length > 0
            ? "Unselect All"
            : "Select All"}
        </button>
        <button
          onClick={deleteSelected}
          disabled={loading || selectedIds.length === 0}
          className="px-3 py-1 rounded bg-red-500 text-white disabled:opacity-50"
        >
          {loading ? "Deleting..." : `Delete Selected (${selectedIds.length})`}
        </button>
      </div>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">
              <input
                type="checkbox"
                checked={
                  selectedIds.length === messages.length && messages.length > 0
                }
                onChange={toggleSelectAll}
              />
            </th>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Message</th>
            <th className="p-2 border">Date</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {messages.length === 0 ? (
            <tr>
              <td colSpan={6} className="p-4 text-center text-gray-500">
                No messages found
              </td>
            </tr>
          ) : (
            messages.map((msg) => (
              <tr key={msg._id} className="border-b">
                <td className="p-2 border text-center">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(msg._id)}
                    onChange={() => toggleSelect(msg._id)}
                  />
                </td>
                <td className="p-2 border">{msg.name}</td>
                <td className="p-2 border">{msg.email}</td>
                <td className="p-2 border">{msg.message}</td>
                <td className="p-2 border">
                  {new Date(msg.createdAt).toLocaleString()}
                </td>
                <td className="p-2 border">
                  <button
                    onClick={() => deleteMessage(msg._id)}
                    className="px-2 py-1 bg-red-500 text-white rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
