import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ProductsProvider } from '@/stores/ProductsContext'
import { BasketProvider } from '@/stores/BasketContext'
import App from './App'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ProductsProvider>
        <BasketProvider>
          <App />
        </BasketProvider>
      </ProductsProvider>
    </BrowserRouter>
  </StrictMode>
)
