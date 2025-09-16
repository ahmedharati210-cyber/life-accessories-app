import { redirect } from 'next/navigation';

export default function HaratiPage() {
  // Always redirect to dashboard - authentication will be handled there
  redirect('/harati/dashboard');
}