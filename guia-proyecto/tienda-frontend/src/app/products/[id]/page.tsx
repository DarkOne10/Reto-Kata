import { buttonVariants } from "@/components/ui/button";
import { getProduct } from "../products.api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";


interface Props {
    params: Promise<{
        id: string
    }>
}

async function ProductDetailPage({params}: Props) {
    const resolvedParams = await params;
    const product = await getProduct(resolvedParams.id);
    console.log(product);

    return <div>

        <Card>
        <CardHeader>
            <CardTitle className="flex justify-between">
                Product Detail: {product.id}
                <Link
                    className={buttonVariants()}
                    href="/"
                >
                    Go back
                </Link>
            </CardTitle>
        </CardHeader>
        <CardContent>
            <h1>{product.name}</h1>
            <p>{product.description}</p>
            <p>${product.price}</p>
            <img src={product.image} alt="" 
                className="w-full h-64 object-cover"
            />
        </CardContent>
    </Card>
    </div>;
}

export default ProductDetailPage;