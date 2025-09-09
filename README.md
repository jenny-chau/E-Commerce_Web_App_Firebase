# Coins - React E-Commerce Web App - Firebase

# [App Hosted on Vercel](https://e-commerce-web-app-firebase.vercel.app/)

## Introduction
Coins is an online department store. Users are able to add products to populate the store. Items are categorized and can be added to your shopping cart for checkout. Items are not actually purchaseable. 

## Languages, Libraries, and Key Elements Used
- Typescript for type checking to catch potential errors
- React
- Bootstrap for styling (Modal, Offcanvas, NavBar, Cards, Alert, Button)
- Redux Toolkit for managing application state 
- CRUD for user profile and products
- Firebase for managing users and user authentication
- Firestore for storing product, shopping cart, user profile, and order data
- sessionStorage stores user's shopping cart data until they logout
- Jest and Babel for unit tests and integration tests
- Github Actions for CI/CD to Vercel 

## Features
- Login/Register
  - Users must log in or register an account to view the store
  - If user is logging in, their shopping cart from the previous session will be retrieved from Firestore
- Nav Bar at the top with the Brand name in the left corner. After logging in, buttons for "My Orders", "Profile", and the shopping cart will appear. The shopping cart has a badge to indicate the number of items in the cart in real time.
- "Shop" page
  - Main body of the page has the list of products retrieved from Firestore (will be empty until users add products)
    - "Category" dropdown to filter the products based on category
    - "Add Product" button at the bottom of the page brings up the form with fields to input the product details: title, description, category (dropdown with the option to add a custom category), price, and image link
      - Once the product details pass verification, it gets saved to Firestore and will show up in the list of products on the page.
    - "Edit Products" button toggles the "Edit" and "Delete" button for each product, where users can update the product listing or delete the product entirely
    - Each product has the product name, image, category, rating, description, price, and an "Add to Cart" button 
      - Clicking the "Add to Cart" button adds the item to the shopping cart (the badge number next to the cart in the NavBar will increase by one)
      - Rating is set to 0/5 (0 reviews) as the initial state. The feature to rate items has not been implemented yet.
  - Shopping cart can be revealed by clicking on the cart icon in the top right corner of the page
    - Items that were added to the cart will be displayed in the cart with: 
      - The item's image, name, price
      - The quantity (initially 1) and can be incremented or decremented (minimum of 1). 
      - A delete button to remove the item from the shopping cart.
    - Bottom of the shopping cart displays:
      - The total price of the items in the cart 
      - "Clear" button to clear the cart 
      - "Checkout" button (clears the cart, displays a successfully checked out message to the user, and stores the order details to Firestore)
    - Cart is stored in session storage for the duration of the user's session
- "My Orders" page
  - Displays user's orders in chronological order, with the most recent orders at the top of the page
  - Each order has a "Details" button to reveal the specifics of the order, including the item details (title, photo, price), quantity, total number of items, total cost, and order date and time.
- "Profile" page
  - Shows user profile information (name, phone number, address, photo URL)
  - User may update their profile or delete their account
- "Logout" button
  - Allows user to log out
  - Shopping cart is saved to Firestore and the session storage is cleared

## Future features/updates (not implemented yet)
  - Allow users to update their email and password
  - Order deletion
  - Delete/edit categories
  - Product rating feature
  - Allow users who are not logged in or registered to shop
