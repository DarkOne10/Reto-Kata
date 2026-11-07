'use client';

import { useEffect, useState } from 'react';
import { getCart, updateCartItem, removeFromCart, checkout } from './cart.api';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useRouter } from 'next/navigation';

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

export default function CartPage() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      const data = await getCart();
      setCart(data);
    } catch (err) {
      setError('Failed to load cart');
    }
  };

  const handleUpdateQuantity = async (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setLoading(true);
    try {
      await updateCartItem(itemId, newQuantity);
      await loadCart();
    } catch (err) {
      setError('Failed to update quantity');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = async (itemId: number) => {
    setLoading(true);
    try {
      await removeFromCart(itemId);
      await loadCart();
    } catch (err) {
      setError('Failed to remove item');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = async () => {
    setLoading(true);
    try {
      await checkout();
      router.push('/orders/success');
    } catch (err) {
      setError('Checkout failed');
    } finally {
      setLoading(false);
    }
  };

  if (!cart) {
    return <div className="p-4">Loading...</div>;
  }

  if (cart.items.length === 0) {
    return (
      <div className="p-4 text-center">
        <h2 className="text-xl font-bold mb-4">Your cart is empty</h2>
        <Button onClick={() => router.push('/')}>Continue Shopping</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="grid gap-4">
        {cart.items.map((item) => (
          <Card key={item.id} className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {item.product.image && (
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                )}
                <div>
                  <h3 className="font-semibold">{item.product.name}</h3>
                  <p className="text-gray-600">${item.product.price}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                    disabled={loading}
                  >
                    -
                  </Button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                    disabled={loading}
                  >
                    +
                  </Button>
                </div>
                
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleRemoveItem(item.id)}
                  disabled={loading}
                >
                  Remove
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-6 flex flex-col items-end">
        <div className="text-xl font-bold mb-4">
          Total: ${cart.total.toFixed(2)}
        </div>
        <Button
          className="w-full md:w-auto"
          onClick={handleCheckout}
          disabled={loading}
        >
          Proceed to Checkout
        </Button>
      </div>
    </div>
  );
}
