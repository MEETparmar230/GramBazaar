"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { toast } from "react-hot-toast"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import { Trash } from "lucide-react"

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

  async function fetchMessages() {
    setFetching(true)
    try {
      const res = await axios.get("/api/admin/contact")
      if (res.data.success) {
        setMessages(res.data.data)
      } else {
        toast.error(res.data.message || "Failed to fetch messages")
      }
    } catch {
      toast.error("Failed to fetch messages")
    }
    setFetching(false)
  }

  useEffect(() => {
    fetchMessages()
  }, [])

  async function deleteMessage(id: string) {
    if (!confirm("Delete this message?")) return
    try {
      await axios.delete(`/api/admin/contact/${id}`)
      toast.success("Message deleted")
      fetchMessages()
    } catch {
      toast.error("Failed to delete message")
    }
  }

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
    } catch {
      toast.error("Failed to delete selected messages")
    } finally {
      setLoading(false)
    }
  }

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
    )
  }

  return (
    <div className="py-6 px-2 md:px-6">
      <h1 className="text-2xl font-bold mb-4 text-zinc-800">Contact Messages</h1>

      <Card className="ring-2 ring-green-200">
        <CardContent className="p-4">
          {/* Bulk actions */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={toggleSelectAll}>
                {selectedIds.length === messages.length && messages.length > 0
                  ? "Unselect All"
                  : "Select All"}
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={deleteSelected}
                disabled={loading || selectedIds.length === 0}
              >
                {loading
                  ? "Deleting..."
                  : `Delete Selected (${selectedIds.length})`}
              </Button>
            </div>
            <span className="text-sm text-gray-500 whitespace-nowrap">
              {messages.length} {messages.length === 1 ? "message" : "messages"}
            </span>
          </div>

          {/* Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">
                  <input
                    type="checkbox"
                    checked={
                      selectedIds.length === messages.length &&
                      messages.length > 0
                    }
                    onChange={toggleSelectAll}
                  />
                </TableHead>
                <TableHead className="text-center">Name</TableHead>
                <TableHead className="text-center">Email</TableHead>
                <TableHead className="text-center">Message</TableHead>
                <TableHead className="text-center">Date</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {messages.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="p-6 text-center text-gray-500"
                  >
                    🚫 No messages found
                  </TableCell>
                </TableRow>
              ) : (
                messages.map((msg) => (
                  <TableRow key={msg._id} className="text-center">
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(msg._id)}
                        onChange={() => toggleSelect(msg._id)}
                      />
                    </TableCell>
                    <TableCell>{msg.name}</TableCell>
                    <TableCell>{msg.email}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      {msg.message}
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-600">
                        {new Date(msg.createdAt).toLocaleString()}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteMessage(msg._id)}
                      >
                        <Trash className="h-4 w-4 mr-1" /> Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
