import { loadStripe } from '@stripe/stripe-js';

//todo: убрать хардкод ключа
const stripePromise = loadStripe("pk_test_51R8I4YPKC0yc4b10A9SqHFI8LfCxGvAslts7ce9xQhIvm8ZeqHMuxghMe2bf3v7idg06v2fE4KQ7KDR6i9BnNrTd00Fu7PWHrV");

export default stripePromise;