import React from 'react';

export default function Contact() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-4">Contact</h1>
      <p className="text-gray-600 mb-6">We’d love to hear from you.</p>
      <form className="bg-white border border-orange-100 rounded-2xl shadow p-6 space-y-4">
        <input className="w-full border border-orange-200 rounded-lg px-3 py-2" placeholder="Your name"/>
        <input className="w-full border border-orange-200 rounded-lg px-3 py-2" type="email" placeholder="Email"/>
        <textarea className="w-full border border-orange-200 rounded-lg px-3 py-2 min-h-[120px]" placeholder="Message"/>
        <button className="px-4 py-2 rounded-lg bg-orange-500 text-white hover:bg-orange-600">Send</button>
      </form>
    </div>
  );
}