import { useParams } from 'react-router-dom'

export default function SportPage() {
  const { sport } = useParams()
  return (
    <div className="min-h-screen pt-24 bg-black text-white flex flex-col items-center justify-center">
      <h1 className="text-6xl font-black text-yellow-400">
        {sport ? sport.toUpperCase() : 'Категория'}
      </h1>
      <p className="text-2xl text-gray-400 mt-8">
        Прогнозы скоро появятся!
      </p>
    </div>
  )
}
