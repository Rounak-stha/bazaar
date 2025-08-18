import { SlideOver } from './variants/SlideOver'

export const WishList = async () => {
  try {
    /**
     * Later we can add a global to add different options for Shop Layout and render differnt Wishlist Component
     */
    return <SlideOver />
  } catch (error) {
    console.log(error)
  }
}
