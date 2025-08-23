# Coins - React E-Commerce Web App

## Introduction
Coins is an online department store featuring items from the FakeStoreAPI. Items are categorized and can be added to your shopping cart for checkout. Items are not actually purchaseable.

## Languages, Libraries, and Key Elements Used
- Typescript for type checking to catch potential errors
- React
- Bootstrap for styling (Modal, Offcanvas, NavBar, Cards, Button)
- Redux Toolkit for managing application state 
- React Query for data-fetching and managing server state
- Stores shopping cart state in sessionStorage

## Features
- Nav Bar at the top with the Brand name in the left corner and the shopping cart on the right corner. The shopping cart has a badge to indicate the number of items in the cart in real time
- Main body of the page has the list of products retrieved from the FakeStoreAPI
  - There's a category filter to filter the products based on category
  - Each product has the product name, image, category, rating, description, price, and an "Add to Cart" button 
    - Clicking the "Add to Cart" button adds the item to the shopping cart (the badge number next to the cart in the NavBar will increase by one)
- Shopping cart can be revealed by clicking on the cart icon in the top right corner of the page
  - Items that were added to the cart will be displayed in the cart with: 
    - The item's image, name, price
    - The quantity (initially 1) and can be incremented or decremented (minimum of 1). 
    - A delete button to remove the item from the shopping cart.
  - Bottom of the shopping cart displays:
    - The total price of the items in the cart 
    - "Clear" button to clear the cart 
    - "Checkout" button (that clears the cart and displays a successfully checked out message)

## Getting started
1. Clone this Github repository
2. Navigate to the "E-Commerce_Web_App" directory
3. Install dependencies: `npm install`
4. Start the app with: `npm run dev`