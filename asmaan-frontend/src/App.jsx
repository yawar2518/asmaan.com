import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <h1 className="text-4xl text-blue-600 font-bold text-center mt-20">Tailwind v4 is working!</h1>
  )
}

export default App
