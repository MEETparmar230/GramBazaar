'use client'

interface ServiceCardProps {
  name: string;
  icon: string;
}

export default function ServiceCard({ name, icon }: ServiceCardProps) {
  return (
    <div className="bg-white shadow p-4 rounded-lg shadow-md text-center min-w-60">
      <img src={icon} alt={name} className="w-40 h-40 mx-auto mb-2 object-cover" />
      <p className="font-semibold">{name}</p>
    </div>
  );
}
