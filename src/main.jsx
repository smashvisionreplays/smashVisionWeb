import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../stylesheet/index.css'
import Index from './Index.jsx'
import {BrowserRouter} from "react-router-dom"
// import 'bootstrap/dist/css/bootstrap.min.css';

import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)

// createRoot(document.getElementById('root')).render(
//     <BrowserRouter>
//       <div className="img-background-container h-screen">
//         <Index />
//       </div>
//     </BrowserRouter>
// )
