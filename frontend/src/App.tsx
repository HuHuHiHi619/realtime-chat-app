
import { BrowserRouter , Routes , Route } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Auth from "./pages/Auth"
import { useEffect } from "react";
import { useAuthStore, useSocketStore } from "./store";


function App() {

   const  { connect , disconnect} = useSocketStore((state) => state)
   const { isAuthenticated } = useAuthStore((state) => state)

   useEffect(() => {
      if(isAuthenticated){
         connect()
      } else {
         disconnect()
      }

      return () => {
         disconnect()
      }
   },[isAuthenticated, connect, disconnect])

  return (
    <div>
      <BrowserRouter>
         <Routes>
           
            <Route path="/" element={<Auth/> } />
            <Route path="/chat" element={<Home /> } />
         </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
