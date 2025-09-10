"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Trash } from "lucide-react";


interface UserType {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  createdAt: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<UserType[]>([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [updatingRole, setUpdatingRole] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  // Debounce search (500ms delay)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    fetchUsers();
  }, [debouncedSearch]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/admin/users?q=" + debouncedSearch);
      setUsers(res.data);
    } catch {
      toast.error("Failed to fetch users");
    }
    setLoading(false);
  };

  const deleteUser = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    setDeleting(id);
    try {
      await axios.delete("/api/admin/users?id=" + id);
      toast.success("User deleted");
      fetchUsers();
    } catch {
      toast.error("Failed to delete user");
    }
    setDeleting(null);
  };

  const updateRole = async (id: string, role: "user" | "admin") => {
    setUpdatingRole(id);
    try {
      await axios.put("/api/admin/users", { id, role });
      toast.success("Role updated");
      fetchUsers();
    } catch {
      toast.error("Failed to update role");
    }
    setUpdatingRole(null);
  };

  return (
    <div className="py-6 px-2 md:px-6">
      <h1 className="text-2xl font-bold mb-4 text-zinc-800">User Management</h1>

      <Card className="ring-2 ring-green-200">
        <CardContent className="p-4">
          {/* Search */}
          <div className="flex justify-between items-center mb-4">
            <Input
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-72"
            />
            <span className="text-sm text-gray-500 px-2 whitespace-nowrap">
              {users.length} {users.length === 1 ? "user" : "users"}
            </span>
          </div>

          {/* Table */}
          <Table>
  <TableHeader>
    <TableRow>
      <TableHead className="text-center">Name</TableHead>
      <TableHead className="text-center">Email</TableHead>
      <TableHead className="text-center">Role</TableHead>
      <TableHead className="text-center">Registered</TableHead>
      <TableHead className="text-center">Actions</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {loading ? (
      <TableRow>
        <TableCell colSpan={5}>
          <div className="flex justify-center items-center h-44">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </TableCell>
      </TableRow>
    ) : users.length === 0 ? (
      <TableRow>
        <TableCell colSpan={5} className="p-6 text-center text-gray-500">
          🚫 No users found {debouncedSearch && `for "${debouncedSearch}"`}
          {debouncedSearch && (
            <Button
              variant="outline"
              size="sm"
              className="ml-2"
              onClick={() => setSearch("")}
            >
              Clear search
            </Button>
          )}
        </TableCell>
      </TableRow>
    ) : (
      users.map((u) => (
        <TableRow key={u._id} className="text-center">
          <TableCell>{u.name}</TableCell>
          <TableCell>{u.email}</TableCell>
          <TableCell>
            <select
              value={u.role}
              disabled={updatingRole === u._id}
              onChange={(e) =>
                updateRole(u._id, e.target.value as "user" | "admin")
              }
              className="border rounded px-2 py-1"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </TableCell>
          <TableCell>
            <span className="text-sm text-gray-600">
              {new Date(u.createdAt).toLocaleString()}
            </span>
          </TableCell>
          <TableCell className="flex justify-center gap-2">
            <Button
              variant="destructive"
              size="sm"
              disabled={deleting === u._id}
              onClick={() => deleteUser(u._id)}
            >
              {deleting === u._id ? "Deleting..." : <><Trash className="h-4 w-4 mr-1" /> Delete</>}
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
  );
}
