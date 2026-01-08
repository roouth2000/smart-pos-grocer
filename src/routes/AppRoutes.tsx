import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import Categories from '../pages/Categories';
import Products from '../pages/Products';
import Billing from '../pages/Billing';
import Salesoforder from "../pages/sales/Salesoforder";
import WebLayout from '../components/Layout/WebLayout';
import PurchaseOrder from '../pages/purchase/PurchaseOrder';
import BranchManagement from '../pages/branch/BranchManagement';
import SalesReport from '../pages/reports/SalesReport';
import PurchaseReport from '../pages/reports/PurchaseReport';
import StockReport from '../pages/reports/StockReport';
import StockMaintenance from '../pages/reports/StockMaintenance';
import UserManagement from '../pages/users/UserManagement';
import RolesPermissions from '../pages/users/RolesPermissions';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const AppRoutes: React.FC = () => {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route element={<ProtectedRoute><WebLayout /></ProtectedRoute>}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/products" element={<Products />} />
                <Route path="/billing" element={<Billing />} />
                {/* Sales Routes */}
                {/* Sales Routes */}
                <Route path="/salesoforder" element={<Salesoforder />} />
                <Route path="/sales/order" element={<Salesoforder />} />
                {/* Purchase Routes */}
                <Route path="/purchase" element={<PurchaseOrder />} />
                {/* Branch Routes */}
                <Route path="/branches" element={<BranchManagement />} />
                {/* Report Routes */}
                <Route path="/reports/sales" element={<SalesReport />} />
                <Route path="/reports/purchase" element={<PurchaseReport />} />
                <Route path="/reports/stock" element={<StockReport />} />
                <Route path="/reports/maintenance" element={<StockMaintenance />} />
                {/* User Mgmt Routes */}
                <Route path="/users" element={<UserManagement />} />
                <Route path="/roles" element={<RolesPermissions />} />
            </Route>
            <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
    );
};

export default AppRoutes;
