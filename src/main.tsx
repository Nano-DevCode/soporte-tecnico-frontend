import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { SoporteTecnico } from './SoporteTecnico'
import './i18n/config';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SoporteTecnico/>
  </StrictMode>,
)
