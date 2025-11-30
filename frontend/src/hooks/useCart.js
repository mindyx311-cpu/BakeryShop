// src/hooks/useCart.js
import { useCartContext } from '../context/CartContext.jsx';
            

export default function useCart() {
  return useCartContext();
}
