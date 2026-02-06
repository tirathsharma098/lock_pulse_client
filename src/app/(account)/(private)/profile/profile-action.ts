'use server';
import { redirect } from 'next/navigation';

export async function redirectUserToLogin() {
  redirect('/login');
}