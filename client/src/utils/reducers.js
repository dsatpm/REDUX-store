import {
	UPDATE_PRODUCTS,
	ADD_TO_CART,
	UPDATE_CART_QUANTITY,
	REMOVE_FROM_CART,
	ADD_MULTIPLE_TO_CART,
	UPDATE_CATEGORIES,
	UPDATE_CURRENT_CATEGORY,
	CLEAR_CART,
	TOGGLE_CART,
} from './actions';

const initialState = {
	products: [],
	cart: [],
	cartOpen: false,
	categories: [],
	currentCategory: '',
};

export const reducer = (state = initialState, action) => {
	switch (action.type) {
		// UPDATE_PRODUCTS replaces the state of products with a new array of products
		// ADD_TO_CART updates the state of cart depending on the cart being open or closed, and adds the product to the state of the cart
		// ADD_MULTIPLE_TO_CART does the same as ADD_TO_CART, but adds multiple products to the cart
		case UPDATE_PRODUCTS:
			return {
				...state,
				products: [...action.products],
			};

		case ADD_TO_CART:
			return {
				...state,
				cartOpen: true,
				cart: [...state.cart, action.product],
			};

		case ADD_MULTIPLE_TO_CART:
			return {
				...state,
				cart: [...state.cart, ...action.products],
			};
		// UPDATE_CART_QUANTITY populates cart with product quantity, and if the product is already in the cart, it updates the quantity based on product id in relation to the action
		case UPDATE_CART_QUANTITY:
			return {
				...state,
				cartOpen: true,
				cart: state.cart.map((product) => {
					if (action._id === product._id) {
						product.purchaseQuantity = action.purchaseQuantity;
					}
					return product;
				}),
			};

		// REMOVE_FROM_CART defines a new state, and filters through the cart array to remove the product id that does not match the action id
		// newCart will remain open as long as it is greater than 0
		// CLEAR_CART defines a new state, and sets cartOpen to false and clears the cart array
		// TOGGLE_CART defines a new state, and sets cartOpen to the opposite of what it currently is
		// UPDATE_CATEGORIES replaces the state of categories with a new array of categories
		// UPDATE_CURRENT_CATEGORY replaces the state of currentCategory with a new string
		case REMOVE_FROM_CART:
			let newState = state.cart.filter((product) => {
				return product._id !== action._id;
			});

			return {
				...state,
				cartOpen: newState.length > 0,
				cart: newState,
			};

		case CLEAR_CART:
			return {
				...state,
				cartOpen: false,
				cart: [],
			};

		case TOGGLE_CART:
			return {
				...state,
				cartOpen: !state.cartOpen,
			};

		case UPDATE_CATEGORIES:
			return {
				...state,
				categories: [...action.categories],
			};

		case UPDATE_CURRENT_CATEGORY:
			return {
				...state,
				currentCategory: action.currentCategory,
			};

		// if it's none of these actions, do not update state at all and keep things the same
		default:
			return state;
	}
};

export default reducer;