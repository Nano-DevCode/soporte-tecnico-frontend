import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { SoporteTecnico } from './SoporteTecnico'
import './i18n/config'

// --- PARCHE ANTI-TRADUCTOR DE GOOGLE CON TIPADO ESTRICTO ---
if (typeof window !== 'undefined' && typeof Node === 'function' && Node.prototype) {
  
  // 1. Guardamos las referencias originales
  const originalRemoveChild = Node.prototype.removeChild;
  const originalInsertBefore = Node.prototype.insertBefore;

  // 2. Parcheamos removeChild definiendo <T extends Node> y this: Node
  Node.prototype.removeChild = function <T extends Node>(this: Node, child: T): T {
    if (child.parentNode !== this) {
      if (console) {
        console.warn('Interceptado crash de React por Traductor (removeChild).', child);
      }
      return child;
    }
    return originalRemoveChild.call(this, child) as T;
  };

  // 3. Parcheamos insertBefore con sus tipos correspondientes
  Node.prototype.insertBefore = function <T extends Node>(this: Node, newNode: T, referenceNode: Node | null): T {
    if (referenceNode && referenceNode.parentNode !== this) {
      if (console) {
        console.warn('Interceptado crash de React por Traductor (insertBefore).', referenceNode);
      }
      return newNode;
    }
    return originalInsertBefore.call(this, newNode, referenceNode) as T;
  };
}
// -----------------------------------------------------------

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SoporteTecnico/>
  </StrictMode>,
)