import { CheckoutForm } from './components/CheckoutForm'

export const OneStepWithSummary = async () => {
  return (
    <div className="relative container">
      <div className="pt-4 pb-24">
        <h2 className="sr-only">Checkout</h2>
        <CheckoutForm />
      </div>
      <div className="absolute top-1/2 left-1/2 -z-10 h-full min-h-dvh w-screen -translate-1/2 bg-gray-50"></div>
    </div>
  )
}
