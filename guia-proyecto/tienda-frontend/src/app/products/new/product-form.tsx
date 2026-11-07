"use client"
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { createProduct } from "../products.api";
import { useRouter } from "next/navigation";

// se uso el hook useForm de react-hook-form para manejar el formulario de manera sencilla


export function ProductFrom() {

    const { register, handleSubmit } = useForm();
    const router =  useRouter();

    const onSubmit = handleSubmit(async data =>{
        console.log(data)
        await createProduct({
            ...data,
            price: parseFloat(data.price)
        });
        router.push('/'); // redirige al usuario a la pagina principal despues de crear el producto
        router.refresh(); // refresca la pagina para mostrar el nuevo producto
    })

    return (
        <form onSubmit={onSubmit}>
            <Label>
                Product Name
            </Label>
            <Input
             {...register('name')}
            />

            <Label>
                Description
            </Label>
            <Input 
             {...register('description')}
            />

            <Label>
                Price
            </Label>
            <Input 
             {...register('price')}
            />

            <Label>
                Image
            </Label>
            <Input 
             {...register('image')}
            />

            <Button>
                Create Product
            </Button>
        </form>
    )
}

