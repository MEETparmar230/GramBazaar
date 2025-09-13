'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

interface BookingItem {
    name: string;
    price: number;
    quantity: number;
}

interface Booking {
    _id: string,
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
        <div className="md:w-3/4 md:mx-auto lg:mx-auto mx-2 p-6 mt-10 mb-4 bg-white shadow rounded-lg ring-2 ring-green-200">
            {/* Header skeleton */}
            <div className="mb-4">
                <div className="w-48 h-8 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-pulse rounded"></div>
            </div>
            <div className="mb-6">
                <div className="w-64 h-5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-pulse rounded"></div>
            </div>

            {/* Bookings section skeleton */}
            <div className="mb-6">
                <div className="w-40 h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-pulse rounded mb-3"></div>

                {/* Booking cards skeleton */}
                <div className="grid gap-6 grid-cols-[repeat(auto-fit,minmax(220px,1fr))]">
                    {[1, 2, 3].map((item, idx) => (
                        <div
                            key={idx}
                            className="border rounded-md px-3 py-1 bg-white shadow-sm ring-1 ring-green-200 h-full"
                        >
                            <div className="w-24 h-5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-pulse rounded mb-2" style={{ animationDelay: `${idx * 0.1}s` }}></div>

                            {/* Booking items skeleton */}
                            <div className="divide-y divide-gray-100">
                                {[1, 2].map((subItem, i) => (
                                    <div key={i} className="flex justify-between py-1">
                                        <div className="w-20 h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-pulse rounded" style={{ animationDelay: `${(idx + i) * 0.15}s` }}></div>
                                        <div className="w-16 h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-pulse rounded" style={{ animationDelay: `${(idx + i) * 0.2}s` }}></div>
                                    </div>
                                ))}
                            </div>

                            {/* Total skeleton */}
                            <div className="text-right mt-2">
                                <div className="w-20 h-5 bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300 bg-[length:200%_100%] animate-pulse rounded ml-auto mb-2"></div>
                            </div>

                            {/* Button skeleton */}
                            <div className="flex justify-end mt-2">
                                <div className="w-20 h-7 bg-gradient-to-r from-green-200 via-green-300 to-green-200 bg-[length:200%_100%] animate-pulse rounded"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Edit profile section skeleton */}
            <div className="mt-10">
                <div className="w-32 h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-pulse rounded mb-3"></div>

                <div className='ring-2 ring-green-200 md:w-2/4 mx-auto rounded p-5'>
                    <div className="space-y-4 flex flex-col items-center">
                        <div className="w-2/3 h-10 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-pulse rounded"></div>
                        <div className="w-2/3 h-10 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-pulse rounded"></div>
                        <div className="w-2/3 h-10 bg-gradient-to-r from-green-200 via-green-300 to-green-200 bg-[length:200%_100%] animate-pulse rounded"></div>
                    </div>
                </div>
            </div>
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
                                className="border rounded-md px-3 py-1 bg-white shadow-sm ring-1 ring-green-200 h-full flex flex-col"
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

                                {/* Push this div to bottom */}
                                <div className="flex justify-end mt-auto mb-2">
                                    <Link
                                        href={`/users/dashboard/bookings/${booking._id}`}
                                        className="text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                                    >
                                        View Details
                                    </Link>
                                </div>
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
