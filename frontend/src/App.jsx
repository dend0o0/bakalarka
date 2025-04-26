import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import ShoppingList from "./pages/ShoppingList.jsx";
import ShoppingLists from "./pages/ShoppingLists.jsx";
import Login from "./pages/Login.jsx";
import Logout from "./components/Logout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { AuthProvider, useAuth } from "./context/AuthProvider.jsx";
import Header from "./components/Header.jsx";
import AddShop from "./pages/AddShop.jsx";


function AppContent() {
    const { user,  isLoading } = useAuth();

    if (isLoading) {
        return <p>Načítava sa...</p>;
    }

    return (

        <Router>
            <Header></Header>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
                <Route path="/list/:id" element={<ProtectedRoute><ShoppingList /></ProtectedRoute>} />
                <Route path="/:shop_id" element={<ProtectedRoute><ShoppingLists /></ProtectedRoute>} />
                <Route path="/add_shop" element={<ProtectedRoute><AddShop /></ProtectedRoute>} />
                <Route path="/admin" element={<ProtectedRoute adminOnly={true}></ProtectedRoute> } />
            </Routes>
        </Router>
    );
}

export default function App() {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
}