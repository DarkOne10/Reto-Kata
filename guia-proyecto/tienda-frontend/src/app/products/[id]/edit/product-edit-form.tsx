"use client"
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { updateProduct } from "../../products.api";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface ProductFormProps {
    product: {
        id: string;
        name: string;
        description: string;
        price: number;
        image: string;
    }
}

export function ProductEditForm({ product }: ProductFormProps) {
    const { register, handleSubmit, setValue } = useForm();
    const router = useRouter();

    useEffect(() => {
        setValue('name', product.name);
        setValue('description', product.description);
        setValue('price', product.price);
        setValue('image', product.image);
    }, [product, setValue]);

    const onSubmit = handleSubmit(async data => {
        console.log(data);
        await updateProduct(product.id, {
            ...data,
            price: parseFloat(data.price)
        });
        router.push('/');
        router.refresh();
    });

    return (
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
            <div>
                <Label htmlFor="name">
                    Product Name
                </Label>
                <Input
                    id="name"
                    {...register('name')}
                />
            </div>

            <div>
                <Label htmlFor="description">
                    Description
                </Label>
                <Input
                    id="description"
                    {...register('description')}
                />
            </div>

            <div>
                <Label htmlFor="price">
                    Price
                </Label>
                <Input
                    id="price"
                    type="number"
                    step="0.01"
                    {...register('price')}
                />
            </div>

            <div>
                <Label htmlFor="image">
                    Image URL
                </Label>
                <Input
                    id="image"
                    {...register('image')}
                />
            </div>

            <Button className="mt-4">
                Update Product
            </Button>
        </form>
    );
}
