import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;
if (GA_ID) {
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(script);
  window.dataLayer = window.dataLayer || [];
  window.gtag = function(){ window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('config', GA_ID);
}
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
