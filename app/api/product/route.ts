import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const barcode = searchParams.get("barcode");

    if (!barcode) {
      return NextResponse.json({
        success: false,
        message: "Barcode missing",
      });
    }

    const response = await fetch(
      `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`
    );

    const data = await response.json();

    if (data.status === 0) {
      return NextResponse.json({
        success: false,
        message: "Product not found",
      });
    }

    const product = data.product;

    return NextResponse.json({
      success: true,

      product: {
        name: product.product_name,
        brand: product.brands,

        image: product.image_url,

        ingredients:
          product.ingredients_text || "No ingredients available",

        nutriscore: product.nutriscore_grade,

        nova: product.nova_group,

        energy: product.nutriments?.energy_kcal,

        sugar: product.nutriments?.sugars,

        fat: product.nutriments?.fat,

        salt: product.nutriments?.salt,
      },
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Server error",
    });
  }
}