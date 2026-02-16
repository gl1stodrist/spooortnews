import { useParams } from 'react-router-dom'

export default function SportPage() {
  const { sport } = useParams()
  return (
    <div className="min-h-screen pt-20 bg-black text-white flex items-center justify-center">
      <h1 className="text-5xl font-black text-yellow-400">
        {sport?.toUpperCase() || 'Категория'} — прогнозы скоро появятся!
      </h1>
    </div>
  )
}
