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

    if (loading) return (
        <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )

    return (
        <div className="md:w-3/4 md:mx-auto lg:mx-auto mx-2  p-6 mt-10 mb-4 bg-white shadow rounded-lg ring-2 ring-green-200">
            <h1 className="text-2xl font-bold mb-4">Welcome, {user.name} 👋</h1>
            <p className="mb-6 text-gray-600">Email: {user.email}</p>

            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2 text-zinc-800">📦 Your Bookings</h2>

            {bookings.length === 0 ? (
                <p className="text-gray-500 mb-4">No bookings yet.</p>
            ) : (
                <div className="space-y-4 grid gap-6 grid-cols-[repeat(auto-fit,minmax(220px,1fr))]">
                    {bookings.map((booking, idx) => {
                        const merged = mergeItems(booking.items);
                        return (
                            <div
                                key={idx}
                                className="border rounded-md px-3 py-1 bg-white shadow-sm ring-1 ring-green-200 h-full"
                            >
                                <p className="text-md text-gray-400 mb-1">Booking #{idx + 1}</p>
                                <ul className="divide-y divide-gray-100">
                                    {merged.map((item, i) => (
                                        <li
                                            key={i}
                                            className="flex justify-between py-1 text-gray-800 text-md"
                                        >
                                            <span className="font-medium mt-1">{item.name}</span>
                                            <span>
                                                ₹{item.price}
                                                {item.quantity > 1 && ` × ${item.quantity}`}
                                            </span>
                                        </li>

                                    ))}
                                </ul>
                                <p className="text-right text-md font-semibold">
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
            
            <h2 className="text-xl font-semibold mb-3 text-zinc-800 mt-10">✏️ Edit Profile</h2>
            <div className='ring-2 ring-green-200  md:w-2/4 mx-auto rounded p-5 '>
            <div className="space-y-4 flex flex-col items-center">
                <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="Name"
                    className="w-2/3 border px-3 py-2 rounded outline-none ring-1 ring-green-200 focus:ring-green-400"
                />
                <input
                    type="text"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    placeholder="Phone"
                    className="w-2/3 border px-3 py-2 rounded outline-none ring-1 ring-green-200 focus:ring-green-400"
                />
                <button
                    onClick={handleUpdate}
                    className="bg-green-600 text-white px-4 py-2 w-2/3 rounded hover:bg-green-700 whitespace-nowrap"
                >
                    Update Profile
                </button>
            </div>
            </div>
        </div>
    );
}
