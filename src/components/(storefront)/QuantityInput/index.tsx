import { Input } from '@/components/ui/input'
import { MinusIcon, PlusIcon } from 'lucide-react'

import { cn } from '@/utilities/ui'

export const QuantityInput = ({
  minQuantity,
  maxQuantity,
  quantity,
  updateQuantity,
  inputVariant = 'default',
  disabled = false,
}: {
  minQuantity: number
  maxQuantity: number
  quantity: number
  updateQuantity: (delta: number) => void
  inputVariant?: 'default' | 'cart'
  disabled?: boolean
}) => {
  const handleIncreaseQuantity = () => {
    if (quantity < maxQuantity) {
      updateQuantity(1)
    }
  }

  const handleDecreaseQuantity = () => {
    if (quantity > minQuantity) {
      updateQuantity(-1)
    }
  }

  return (
    <div
      className={cn(
        'flex w-fit items-center border border-gray-200',
        inputVariant === 'default' ? 'sm:ml-4' : 'py-[2px]',
      )}
    >
      <button
        type="button"
        className={cn(
          'cursor-pointer p-2',
          (quantity <= minQuantity || disabled) && 'cursor-not-allowed opacity-25',
          inputVariant === 'cart' && 'p-1',
        )}
        disabled={quantity <= minQuantity || disabled}
        onClick={handleDecreaseQuantity}
      >
        <MinusIcon width={20} height={20} />
      </button>
      <p
        className={cn(
          `mx-auto h-full w-full min-w-10 max-w-16 p-2 text-center outline-hidden [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`,
          inputVariant === 'cart' && 'p-1',
        )}
      >
        {quantity}
      </p>
      <button
        className={cn(
          'cursor-pointer p-2',
          (quantity >= maxQuantity || disabled) && 'cursor-not-allowed opacity-25',
          inputVariant === 'cart' && 'p-1',
        )}
        type="button"
        disabled={quantity >= maxQuantity || disabled}
        onClick={handleIncreaseQuantity}
      >
        <PlusIcon width={20} height={20} />
      </button>
    </div>
  )
}
