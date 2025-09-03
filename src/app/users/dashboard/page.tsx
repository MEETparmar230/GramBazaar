'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

interface BookingItem {
    name: string;
    price: number;
    quantity: number;
}

interface Booking {
    items: BookingItem[];
}

// Helper function to merge duplicate items
function mergeItems(items: BookingItem[]): BookingItem[] {
    const merged: Record<string, BookingItem> = {};

    items.forEach((item) => {
        const key = `${item.name}-${item.price}`;
        if (merged[key]) {
            merged[key].quantity += item.quantity;
        } else {
            merged[key] = { ...item };
        }
    });

    return Object.values(merged);
}

export default function Dashboard() {
    const [user, setUser] = useState({ name: '', email: '', phone: '' });
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);

    const [editName, setEditName] = useState('');
    const [editPhone, setEditPhone] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userRes = await axios.get('/api/users/user');
                const bookingRes = await axios.get('/api/users/bookings');

                setUser(userRes.data.user);
                setBookings(bookingRes.data.bookings);
                setEditName(userRes.data.user.name);
                setEditPhone(userRes.data.user.phone);
            } catch (err) {
                console.error('Error loading dashboard:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleUpdate = async () => {
        try {
            await axios.put('/api/users/user', {
                name: editName,
                phone: editPhone,
            });
            alert('Profile updated!');
        } catch (err) {
            alert('Failed to update profile.');
        }
    };

    if (loading) return <p className="text-center mt-10">Loading dashboard...</p>;

    return (
        <div className="max-w-3xl md:mx-auto lg:mx-auto mx-2  p-6 my-4 bg-white shadow rounded-lg">
            <h1 className="text-2xl font-bold mb-4">Welcome, {user.name} 👋</h1>
            <p className="mb-6 text-gray-600">Email: {user.email}</p>

            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">📦 Your Bookings</h2>

            {bookings.length === 0 ? (
                <p className="text-gray-500 mb-4">No bookings yet.</p>
            ) : (
                <div className="space-y-4 mb-4">
                    {bookings.map((booking, idx) => {
                        const merged = mergeItems(booking.items);
                        return (
                            <div
                                key={idx}
                                className="border rounded-md p-3 bg-white shadow-sm"
                            >
                                <p className="text-xs text-gray-400 mb-2">Booking #{idx + 1}</p>
                                <ul className="divide-y divide-gray-100">
                                    {merged.map((item, i) => (
                                        <li
                                            key={i}
                                            className="flex justify-between py-1 text-gray-800 text-sm"
                                        >
                                            <span className="font-medium">{item.name}</span>
                                            <span>
                                                ₹{item.price}
                                                {item.quantity > 1 && ` × ${item.quantity}`}
                                            </span>
                                        </li>

                                    ))}
                                </ul>
                                <p className="mt-1 text-right text-sm font-semibold">
                                    Total: ₹
                                    {merged.reduce(
                                        (total, item) => total + item.price * item.quantity,
                                        0
                                    )}
                                </p>
                            </div>
                        );
                    })}
                </div>
            )}

            <h2 className="text-xl font-semibold mb-2">✏️ Edit Profile</h2>
            <div className="space-y-4">
                <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="Name"
                    className="w-full border px-3 py-2 rounded"
                />
                <input
                    type="text"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    placeholder="Phone"
                    className="w-full border px-3 py-2 rounded"
                />
                <button
                    onClick={handleUpdate}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                    Update Profile
                </button>
            </div>
        </div>
    );
}
