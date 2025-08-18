import { SlideOver } from './variants/SlideOver'

export const Cart = async () => {
  try {
    return <SlideOver />
  } catch (error) {
    console.log(error)
  }
}
