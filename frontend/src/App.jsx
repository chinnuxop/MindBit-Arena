import React from 'react'
import { Route, Routes,Navigate} from 'react-router-dom';
import Home from './pages/Home';
import MyResultPage from './pages/MyResultPage';
import { useAuth,Show } from '@clerk/react';


const App = () => {
  const { isLoaded } = useAuth();
  if (!isLoaded) return null;
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/result" element={
        <>
          <Show when="signed-in">
            <MyResultPage />
          </Show>
          <Show when="signed-out">
            <Navigate to="/" />
          </Show>
        </>
      } />
    </Routes>

  )
}

export default App