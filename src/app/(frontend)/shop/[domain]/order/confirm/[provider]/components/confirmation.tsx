import Link from 'next/link'

import { Media } from '@/components/Media'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Paths } from '@/lib/url'
import { CheckCircleIcon, CreditCard, Mail, MapPin, PackageIcon } from 'lucide-react'
import { Order } from '@/payload-types'

export function OrderConfirmation({ order }: { order: Order | null }) {
  return (
    <div className="container py-8">
      {/* Success Header */}
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="rounded-full bg-success/10 p-4">
            <CheckCircleIcon className="w-12 h-12 text-success" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Order Confirmed!</h1>
        <p className="text-muted-foreground text-lg">
          Thank you for your purchase. We&apos;ve received your order and will send you a
          confirmation email shortly.
        </p>
      </div>

      {/* Order Details Card */}
      <Card className="mb-6">
        <CardHeader className="border-b border-border">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="text-xl">Order Details</CardTitle>
              <p className="text-muted-foreground mt-1">Order #{order?.id}</p>
            </div>
            <div className="flex gap-2">
              <Badge>Confirmed</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Order Summary */}
            <div>
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <PackageIcon className="w-4 h-4" />
                Order Summary
              </h3>
              <div className="space-y-4">
                {order?.items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted">
                      <Media
                        resource={item.image}
                        alt={item.productTitle}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{item.productTitle}</h4>
                      <p className="text-sm text-muted-foreground">
                        {item.variantName} • Qty: {item.quantity}
                      </p>
                      <p className="font-semibold">NPR {item.pricing.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-border space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>NPR {order?.subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{order?.shippingCost === 0 ? 'Free' : `NPR ${order?.shippingCost}`}</span>
                </div>
                <div className="flex justify-between font-semibold text-lg pt-2 border-t border-border">
                  <span>Total</span>
                  <span>NPR {order?.total}</span>
                </div>
              </div>
            </div>

            {/* Customer Information */}
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Shipping Address
                </h3>
                <div className="text-sm space-y-1">
                  <p className="font-medium">{order?.shippingAddress.fullName}</p>
                  <p>{order?.shippingAddress.street}</p>
                  <p>
                    {order?.shippingAddress.city}, {order?.shippingAddress.province}
                  </p>
                  <p>{order?.shippingAddress.phone}</p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Contact Information
                </h3>
                <p className="text-sm">{order?.shippingAddress.email}</p>
              </div>

              <div>
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  Payment Method
                </h3>
                <p className="text-sm">Cash on Delivery</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">What&apos;s Next?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-accent">
              <h4 className="font-semibold mb-2">Order Processing</h4>
              <p className="text-sm text-muted-foreground">
                We&apos;ll prepare your order within 1-2 business days.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-accent">
              <h4 className="font-semibold mb-2">Delivery Timeline</h4>
              <p className="text-sm text-muted-foreground">
                Expected delivery within 3-5 business days to your specified address.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-center items-center">
        <Link href={Paths.shop}>
          <Button className="sm:w-auto">Continue Shopping</Button>
        </Link>
      </div>
    </div>
  )
}
