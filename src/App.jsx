import { BrowserRouter } from "react-router-dom"
import { ClerkProvider } from '@clerk/clerk-react'
import Index from './Index.jsx'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || 'pk_test_placeholder'

console.log('Clerk Publishable Key:', PUBLISHABLE_KEY)
export default function App() {
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <BrowserRouter>
        <div className="img-background-container h-screen">
          <Index />
        </div>
      </BrowserRouter>
    </ClerkProvider>
  )
}