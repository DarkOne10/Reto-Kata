import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductEditForm } from "./product-edit-form";
import { getProduct } from "../../products.api";

interface Props {
  params: Promise<{
    id: string;
  }>
}

async function ProductEditPage({ params }: Props) {
  const resolvedParams = await params;
  const product = await getProduct(resolvedParams.id);

  return (
    <div className="h-screen flex justify-center items-center">
      <Card>
        <CardHeader>
          <CardTitle>
            Edit Product
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ProductEditForm product={product} />
        </CardContent>
      </Card>
    </div>
  );
}

export default ProductEditPage;
