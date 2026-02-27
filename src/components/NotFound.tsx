import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white font-sans">
      <Helmet><title>404 | spooort.ru</title></Helmet>

      <div className="text-center">
        <h1 className="text-9xl font-black text-red-600">404</h1>
        <p className="text-2xl mb-8">Страница не найдена</p>
        <Link to="/" className="inline-block bg-red-600 hover:bg-red-700 px-8 py-4 rounded-3xl text-xl font-medium">Вернуться на главную</Link>
      </div>
    </div>
  );
}

export default NotFound;
