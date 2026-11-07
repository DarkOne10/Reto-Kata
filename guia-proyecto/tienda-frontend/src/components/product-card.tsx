"use client"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {Button} from '@/components/ui/button';
import { deleteProduct } from "@/app/products/products.api";
import { useRouter } from "next/navigation";
import { addToCart } from "@/app/cart/cart.api";
import { useState } from "react";
import { toast } from 'sonner';

interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  image?: string;
  stock: number;
}

export function ProductCard({ product }: { product: Product }) {
    const router = useRouter();

    async function handleRemoveProduct(id: number) {
        try {
            await deleteProduct(id.toString());
            router.refresh();
        } catch (error) {
            console.error('Failed to delete product:', error);
            alert('Failed to delete product');
        }
    }

    return(
        <Card onClick={ () =>
            router.push(`/products/${product.id}`)
        }>
            <CardHeader>
              <CardTitle className="flex justify-between">
                {product.name}
                <span className="text-sm font-bold text-gray-500">
                  ${product.price}
                </span>
              </CardTitle>
            </CardHeader>
              <img src={product.image} alt="" />
            <CardContent>
              <p>
                {product.description}
              </p>      
            </CardContent>

            <CardFooter className="flex justify-between">
              <div className="flex gap-2">
                <Button className="mt-5"
                onClick={(e) =>{
                  e.stopPropagation();
                  router.push(`/products/${product.id}/edit`);
                }}
                >
                  Edit
                </Button>

                <Button className="mt-5" variant="destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveProduct(product.id);
                  }}
                >
                  Delete
                </Button>
              </div>

              <Button 
                className="mt-5"
                variant="secondary"
                onClick={async (e) => {
                  e.stopPropagation();
                  try {
                    await addToCart(product.id, 1);
                    toast.success('Added to cart!');
                  } catch (error) {
                    toast.error('Failed to add to cart');
                  }
                }}
                disabled={product.stock < 1}
              >
                {product.stock < 1 ? 'Out of Stock' : 'Add to Cart'}
              </Button>
            </CardFooter>
          </Card>
    );
}

