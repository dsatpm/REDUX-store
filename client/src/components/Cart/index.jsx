// import React dependencies
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

// import apollo dependency
import { useLazyQuery } from '@apollo/react-hooks';

// import Stripe dependency
import { loadStripe } from '@stripe/stripe-js';

// import utils, actions, auths, and queries
import { TOGGLE_CART, ADD_MULTIPLE_TO_CART } from '../../utils/actions';
import { QUERY_CHECKOUT } from '../../utils/queries';
import { idbPromise } from '../../utils/helpers';
import Auth from '../../utils/auth';

// import components
import CartItem from '../CartItem';

// import css
import './style.css';

// initialize stripe promise
const stripePromise = loadStripe('pk_test_TYooMQauvdEDq54NiTphI7jx');

const Cart = () => {
	const dispatch = useDispatch();
	const cart = useSelector((state) => state.cart);
	const [getCheckout, { data }] = useLazyQuery(QUERY_CHECKOUT);

	// if data is returned from useLazyQuery, redirect to checkout
	useEffect(() => {
		if (data) {
			stripePromise.then((res) => {
				res.redirectToCheckout({ sessionId: data.checkout.session });
			});
		}
	}, [data]);

	// if cart has data, get items from session and populate cart
	useEffect(() => {
		async function getCart() {
			const cart = await idbPromise('cart', 'get');
			dispatch({ type: ADD_MULTIPLE_TO_CART, products: [...cart] });
		}

		if (!cart.length) {
			getCart();
		}
	}, [cart.length, dispatch]);

	// toggle cart when icon is clicked
	function toggleCart() {
		dispatch({ type: TOGGLE_CART });
	}

	// loop through each cart item and calculate total
	function calculateTotal() {
		let sum = 0;
		cart.forEach((item) => {
			sum += item.price * item.purchaseQuantity;
		});
		return sum.toFixed(2);
	}

	// loop through each cart item and add item._id to productIds array
	function submitCheckout() {
		const productIds = [];

		cart.forEach((item) => {
			for (let i = 0; i < item.purchaseQuantity; i++) {
				productIds.push(item._id);
			}
		});

		getCheckout({
			variables: { products: productIds },
		});
	}

	if (!cart.length) {
		return (
			<div
				className='cart-closed'
				onClick={toggleCart}>
				<span
					role='img'
					aria-label='trash'>
					🛒
				</span>
			</div>
		);
	}

	return (
		<div className='cart'>
			<div
				className='close'
				onClick={toggleCart}>
				[close]
			</div>
			<h2>Shopping Cart</h2>
			{cart.length ? (
				<div>
					{cart.map((item) => (
						<CartItem
							key={item._id}
							item={item}
						/>
					))}

					<div className='flex-row space-between'>
						<strong>Total: ${calculateTotal()}</strong>

						{Auth.loggedIn() ? (
							<button onClick={submitCheckout}>Checkout</button>
						) : (
							<span>(log in to check out)</span>
						)}
					</div>
				</div>
			) : (
				<h3>
					<span
						role='img'
						aria-label='shocked'>
						😱
					</span>
					You haven&apos;t added anything to your cart yet!
				</h3>
			)}
		</div>
	);
};

export default Cart;
