import React from 'react';
import { Post } from '../App';

interface Props {
  post: Post;
}

export function PredictionCard({ post }: Props) {
  return (
    <div className="bg-zinc-900 p-6 rounded-3xl border border-zinc-800 hover:border-red-500 transition-all shadow-lg">
      <h3>{post.title}</h3>
    </div>
  );
}
