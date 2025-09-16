import { notFound } from 'next/navigation';

export default function AdminDashboard() {
  // Return 404 to hide the existence of admin panel
  notFound();
}
