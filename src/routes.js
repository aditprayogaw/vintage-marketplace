import { createRouter, createWebHistory } from 'vue-router'

import Home from './pages/Home.vue' 
import Login from './components/auth/Login.vue' 
import Register from './components/auth/Register.vue'
import AllProductsPage from './pages/AllProductsPage.vue'
import ProductDetailPage from './pages/ProductDetailPage.vue'

// USER
import UserPage from './components/user/UserPage.vue'
import ProfileDetails from './components/user/ProfileDetails.vue'
import ChangePassword from './components/user/ChangePassword.vue'
import TransactionHistory from './components/user/TransactionHistory.vue'
import CartPage from './pages/CartPage.vue'
import WishlistPage from './pages/WishlistPage.vue'
import OrderDetailPage from './pages/OrderDetailPage.vue'

// STORE
import StoreRegistration from './components/store/StoreRegistration.vue'
import StoreDashboard from './components/store/StoreDashboard.vue'
import AddProduct from './components/store/AddProduct.vue'
import EditProduct from './components/store/EditProduct.vue'


const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/login',
        name: 'Login',
        component: Login
    },
    {
        path: '/register',
        name: 'Register',
        component: Register
    },
    { 
        path: '/products', 
        name: 'Products', 
        component: AllProductsPage },
    {
        path: '/user',
        component: UserPage,
        children: [
            { path: 'profile', name: 'Profile', component: ProfileDetails },
            { path: 'change-password', name: 'ChangePassword', component: ChangePassword },
            { path: 'order', name: 'Order', component: TransactionHistory },
            // STORE
            { path: 'open-shop', component: StoreRegistration },
            { path: 'store-dashboard', component: StoreDashboard },
            { path: 'add-product', component: AddProduct },
            { path: 'edit-product/:id', component: EditProduct },
        ],
        meta: { requiresAuth: true }
    },
    { 
        path: '/cart', 
        name: 'Cart', 
        component: CartPage 
    },
    { 
        path: '/checkout', 
        component: OrderDetailPage,
        meta: { requiresAuth: true }
    },
    { 
        path: '/wishlist', 
        name: 'Wishlist', 
        component: WishlistPage 
    },
    { 
        path: '/product/:id', 
        name: 'ProductDetail', 
        component: ProductDetailPage, 
        props: true 
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router