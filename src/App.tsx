import { Route, Routes } from 'react-router-dom';
import HomePage from './Components/HomePage';
import "./App.css"
import { useEffect, useState } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from './firebaseConfig';
import Profile from './Components/User/Profile';
import UserContext from './Components/UserContext';
import MyOrdersPage from './Components/Orders/MyOrdersPage';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState<boolean>(true); // wait for auth to finish loading before rendering the rest of the app

    // Set up listener for user authentication state
    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
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