import { CheckCircle, Package, Mail } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const OrderConfirmation = () => {
  // Mock order data - in real app this would come from props/state/URL params
  const orderData = {
    orderNumber: "ORD-2024-001234",
    email: "customer@example.com",
    total: "$800.00",
    estimatedDelivery: "5-7 business days",
    items: [
      {
        name: "Momo Bag",
        color: "Green",
        price: "$800.00",
        quantity: 1,
        image: "/lovable-uploads/055d3491-4d3b-4d39-9e5f-4bcd68ca73d1.png",
      },
    ],
  };

  return (
    <div className="bg-background flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Success Header */}
        <div className="animate-fade-in mb-8 text-center">
          <div className="mb-6 flex justify-center">
            <div className="relative">
              <CheckCircle className="text-success animate-scale-in h-16 w-16" />
            </div>
          </div>

          <h1 className="text-foreground mb-2 text-3xl font-bold">Order Confirmed!</h1>
          <p className="text-muted-foreground text-lg">
            Thank you for your purchase. Your order has been successfully placed.
          </p>
        </div>

        {/* Order Details Card */}
        <Card className="animate-fade-in mb-6 p-6 [animation-delay:200ms]">
          <div className="space-y-6">
            {/* Order Info */}
            <div className="flex items-start justify-between border-b pb-4">
              <div>
                <h2 className="text-lg font-semibold">Order Details</h2>
                <p className="text-muted-foreground text-sm">Order #{orderData.orderNumber}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold">{orderData.total}</p>
                <p className="text-muted-foreground text-sm">Total</p>
              </div>
            </div>

            {/* Items */}
            <div className="space-y-4">
              {orderData.items.map((item, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="bg-muted flex h-16 w-16 items-center justify-center overflow-hidden rounded-lg">
                    <Package className="text-muted-foreground h-8 w-8" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-muted-foreground text-sm">{item.color}</p>
                    <p className="text-muted-foreground text-sm">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{item.price}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Delivery Info */}
            <div className="bg-primary-muted border-primary/20 rounded-lg border p-4">
              <div className="flex items-center space-x-3">
                <div className="bg-celebration/10 flex h-10 w-10 items-center justify-center rounded-full">
                  <Package className="text-primary animate-bounce-subtle h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium">Estimated Delivery</p>
                  <p className="text-primary font-semibold">{orderData.estimatedDelivery}</p>
                </div>
              </div>
            </div>

            {/* Email Confirmation */}
            <div className="text-muted-foreground flex items-center space-x-3 text-sm">
              <Mail className="h-4 w-4" />
              <span>Confirmation email sent to {orderData.email}</span>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="animate-fade-in flex items-center justify-center [animation-delay:400ms]">
          <Link href="/">
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
