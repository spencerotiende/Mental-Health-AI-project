import { Routes, Route } from 'react-router-dom'
import Home from './Home'
import Result from './Result'
import TherapyBot from './Chatbot/TherapyBot'
import Test from './Test'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/assessment" element={<Test />} />
      <Route path="/result" element={<Result />} />
      <Route path="/chat_bot" element={<TherapyBot />} />
    </Routes>
  )
}
