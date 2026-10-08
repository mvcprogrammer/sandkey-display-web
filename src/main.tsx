import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { App } from './App'
import { Stage } from './components/Stage'

// Bootstrap is loaded for its reboot, not its components: the kiosk layout was built in 2013
// against a page where box-sizing was border-box, and every panel is sized in absolute pixels.
// Removing it moves things. It is a candidate for removal once the stylesheet is modernised.
import 'bootstrap/dist/css/bootstrap.css'
import './styles/site.css'

const container = document.getElementById('body')

if (container === null) {
  throw new Error('The kiosk root element is missing from index.html.')
}

createRoot(container).render(
  <StrictMode>
    <BrowserRouter>
      <Stage>
        <App />
      </Stage>
    </BrowserRouter>
  </StrictMode>,
)
