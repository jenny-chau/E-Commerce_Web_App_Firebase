import { Route, Routes } from 'react-router-dom';
import HomePage from './Components/HomePage';
import "./App.css"
import { useEffect, useState } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth, db } from './firebaseConfig';
import Profile from './Components/User/Profile';
import UserContext from './Components/UserContext';
import MyOrdersPage from './Components/Orders/MyOrdersPage';
import { doc, getDoc } from 'firebase/firestore';
import { useDispatch } from 'react-redux';
import { setProductState } from './Redux/cartSlice';
import type { AppDispatch } from './Redux/store';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState<boolean>(true); // wait for auth to finish loading before rendering the rest of the app

  const dispatch = useDispatch<AppDispatch>();

  const getShoppingCart = async () => {
    try {
      if (auth.currentUser) {
            // Load shopping cart data from Firestore to session storage
            const cartRef = doc(db, "shoppingCart", auth.currentUser.uid);
            const cartDoc = await getDoc(cartRef);
            if (cartDoc.exists()) {
                try {
                    sessionStorage.setItem('shoppingCart', cartDoc.data().cart);
                    dispatch(setProductState());
                } catch (err: any) {
                    // If there's an error, set session storage to an empty cart
                    sessionStorage.setItem('shoppingCart', JSON.stringify({
                        products: [],
                        totalNumberItems: 0,
                        totalPrice: 0
                    }));
                    console.log(err);
                }
            }
        }
      } catch (err: any) {
          console.log(err);
      }
    }
    // Set up listener for user authentication state
    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
        if (!sessionStorage.getItem('shoppingCart')) {
          getShoppingCart();
        }
        setIsLoadingAuth(false);
      });
      return () => unsubscribe();
    }, []);

  return (
    <>
      {!isLoadingAuth &&
        <UserContext.Provider value={{ user }}>
            <div>
              <Routes>
                <Route 
                  path='/' 
                  element={<HomePage/>} 
                />
                <Route 
                  path='/profile' 
                  element={<Profile/>} 
                />
                <Route 
                  path='/myOrders' 
                  element={<MyOrdersPage/>} 
                />
              </Routes>
            </div>
        </UserContext.Provider>
      }
    </>
  );
  
};

export default App;