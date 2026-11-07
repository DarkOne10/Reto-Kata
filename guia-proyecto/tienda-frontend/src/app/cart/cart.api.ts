import { getAuthToken } from '../auth/auth.utils';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface CartItem {
  id: number;
  quantity: number;
  product: {
    id: number;
    name: string;
    price: number;
    image?: string;
  };
}

interface Cart {
  items: CartItem[];
  total: number;
}

export const addToCart = async (productId: number, quantity: number = 1): Promise<CartItem> => {
  const token = getAuthToken();
  if (!token) throw new Error('Not authenticated');

  const response = await fetch(`${API_URL}/cart/add`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ productId, quantity }),
  });

  if (!response.ok) {
    throw new Error('Failed to add to cart');
  }

  const result = await response.json();
  window.dispatchEvent(new Event('cartUpdate'));
  return result;
};

export const getCart = async (): Promise<Cart> => {
  const token = getAuthToken();
  if (!token) throw new Error('Not authenticated');

  const response = await fetch(`${API_URL}/cart`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to get cart');
  }

  return response.json();
};

export const updateCartItem = async (itemId: number, quantity: number): Promise<CartItem> => {
  const token = getAuthToken();
  if (!token) throw new Error('Not authenticated');

  const response = await fetch(`${API_URL}/cart/${itemId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ quantity }),
  });

  if (!response.ok) {
    throw new Error('Failed to update cart item');
  }

  const result = await response.json();
  window.dispatchEvent(new Event('cartUpdate'));
  return result;
};

export const removeFromCart = async (itemId: number): Promise<void> => {
  const token = getAuthToken();
  if (!token) throw new Error('Not authenticated');

  const response = await fetch(`${API_URL}/cart/${itemId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to remove from cart');
  }
  
  window.dispatchEvent(new Event('cartUpdate'));
};

export const checkout = async (): Promise<any> => {
  const token = getAuthToken();
  if (!token) throw new Error('Not authenticated');

  const response = await fetch(`${API_URL}/cart/checkout`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to checkout');
  }

  const result = await response.json();
  window.dispatchEvent(new Event('cartUpdate'));
  return result;
};
