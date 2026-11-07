import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductFrom } from "./product-form";
import { getProduct } from "../products.api";

interface Props {
  params: Promise<{
    id: string;
  }>
}

async function ProductsNewPage({params}: Props){
  //const resolvedParams = await params;
  //const product = await getProduct(resolvedParams.id);
  //console.log(product);

    return(
        <div className="h-screen flex justify-center items-center">
            <Card>
              <CardHeader>
                <CardTitle>
                  Create Product
                </CardTitle>
              </CardHeader>
                <CardContent>
                    <ProductFrom />
                </CardContent>
            </Card>
        </div>
    )
}

export default ProductsNewPage