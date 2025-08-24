import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { XCircle, CreditCard, Phone, RefreshCcw, ArrowLeft, AlertCircle } from 'lucide-react'

import { Order, Transaction } from '@/payload-types'
import Link from 'next/link'
import { Paths } from '@/lib/url'

export function PaymentFailure({
  order,
  failure,
}: {
  order?: Order | null
  failure: Extract<Transaction['status'], 'failed' | 'expired' | 'user_cancelled'>
}) {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Error Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-destructive/10 p-4">
              <XCircle className="w-12 h-12 text-destructive" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Payment{' '}
            {failure == 'expired' ? 'Expired' : failure == 'failed' ? 'Failed' : 'Cancelled'}
          </h1>
          <p className="text-muted-foreground text-lg">
            {failure == 'expired' && 'The payment session has expired.'}
            {failure == 'failed' &&
              'We encountered an unexpected error while processing your payment.'}
            {failure == 'user_cancelled' && 'Sad to see you cancellign the payment.'}
          </p>
        </div>

        {/* Order Information */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Transaction Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Order Id:</span>
                <span className="font-medium">{order?.id}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount:</span>
                <span className="font-medium">Rs {order?.total}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status:</span>
                <span className="text-destructive font-medium">Failed</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Error Alert */}
        <Alert className="mb-6 border-warning bg-warning/5">
          <AlertCircle className="h-4 w-4 text-warning" />
          <AlertDescription className="text-foreground">
            <strong>Don't worry!</strong> If you have any inconviniences, reach out to us.
          </AlertDescription>
        </Alert>

        {/* Troubleshooting Steps */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">What You Can Do</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center text-xs font-semibold mt-0.5">
                  1.
                </div>
                <span className="text-sm">Please try again in a few minutes</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center text-xs font-semibold mt-0.5">
                  2
                </div>
                <span className="text-sm">If the problem persists, contact our support team</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href={Paths.shop}>
              <Button className="flex-1 sm:flex-none">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to shopping
              </Button>
            </Link>
          </div>
        </div>

        {/* Support Information */}
        <Card className="mt-8 bg-muted/50">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="font-semibold mb-2">Need Help?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Our support team is here to help you complete your purchase.
              </p>
              <div className="space-y-2 text-sm">
                <p>
                  <strong>Email:</strong> support@company.com
                </p>
                <p>
                  <strong>Phone:</strong> +977-1-XXXXXXX
                </p>
                <p className="text-muted-foreground">Available 24/7 to assist you</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
