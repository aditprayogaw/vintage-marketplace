import { createStore } from 'vuex'
import { db, auth } from '../FireBase.js'
import { collection, getDocs, doc, setDoc, getDoc, updateDoc } from 'firebase/firestore'
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    updateProfile,
    onAuthStateChanged 
} from 'firebase/auth'

const store = createStore({
    state() {
        return {
            products: [],
            searchQuery: '',
            cart: [],
            wishlist: [],
            user: null,
            authIsReady: false,
            checkoutItems: [],
            userStore: null
        }
    },
    mutations: {
        setProducts(state, payload) { state.products = payload },
        setSearchQuery(state, payload) { state.searchQuery = payload },
        
        setUser(state, payload) { 
            state.user = payload 
        },
        
        UPDATE_USER_PHOTO(state, photoBase64) {
            if (state.user) {
                state.user = { ...state.user, photoURL: photoBase64 }
            }
        },
        
        setCart(state, payload) { state.cart = payload },
        setWishlist(state, payload) { state.wishlist = payload },
        setAuthIsReady(state, payload) { state.authIsReady = payload },
        setCheckoutItems(state, payload) { state.checkoutItems = payload },
        setUserStore(state, payload) { state.userStore = payload },
    },
    actions: {
        async fetchProducts({ commit }) {
            const querySnapshot = await getDocs(collection(db, 'products'))
            commit('setProducts', querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
        },

        async fetchUserData({ commit }, uid) {
            try {
                const docRef = doc(db, "users", uid)
                const docSnap = await getDoc(docRef)
    
                if (docSnap.exists()) {
                    const data = docSnap.data()
    
                    commit('setCart', data.cart || [])
                    commit('setWishlist', data.wishlist || [])
                    commit('setUserStore', data.store || null)

                    if (data.imageProfile) {
                        commit('UPDATE_USER_PHOTO', data.imageProfile)
                    }
                }
            } catch (error) {
                console.error("Error fetching user data:", error)
            }
        },

        async register({ commit }, { email, password, name, username }) {
            const res = await createUserWithEmailAndPassword(auth, email, password)
            await updateProfile(res.user, { displayName: name })
            await setDoc(doc(db, "users", res.user.uid), {
                uid: res.user.uid, 
                fullname: name, 
                username: username, 
                email, 
                cart: [], 
                wishlist: [],
                imageProfile: null 
            })

            commit('setUser', { 
                uid: res.user.uid, 
                email: res.user.email, 
                displayName: name, 
                photoURL: null 
            })
        },

        async login({ commit, dispatch }, { email, password }) {
            const res = await signInWithEmailAndPassword(auth, email, password)
            commit('setUser', {
                uid: res.user.uid,
                email: res.user.email,
                displayName: res.user.displayName,
                photoURL: res.user.photoURL
            })
 
            await dispatch('fetchUserData', res.user.uid)
        },

        async logout({ commit }) {
            await signOut(auth)
            commit('setUser', null)
            commit('setCart', [])
            commit('setWishlist', [])
            commit('setUserStore', null)
        },

        async registerStore({ commit, state }, storeData) {
            if (!state.user) return
            const userRef = doc(db, "users", state.user.uid)
            await updateDoc(userRef, { store: storeData })
            commit('setUserStore', storeData)
        },

        async toggleWishlist({ commit, state }, product) {
            if (!state.user) return
            let newWishlist = [...state.wishlist]
            const index = newWishlist.findIndex(item => item.id === product.id)
            if (index !== -1) newWishlist.splice(index, 1)
            else newWishlist.push(product)

            commit('setWishlist', newWishlist)
            const userRef = doc(db, "users", state.user.uid)
            await updateDoc(userRef, { wishlist: newWishlist })
        },

        async addToCart({ commit, state }, product) {
            if (!state.user) return
            let newCart = [...state.cart]
            const itemIndex = newCart.findIndex(i => i.id === product.id)

            if (itemIndex !== -1) {
                newCart[itemIndex] = { ...newCart[itemIndex], quantity: newCart[itemIndex].quantity + 1 }
            } else {
                newCart.push({ ...product, quantity: 1 })
            }

            commit('setCart', newCart)
            await updateDoc(doc(db, "users", state.user.uid), { cart: newCart })
        },

        async removeFromCart({ commit, state }, productId) {
            if (!state.user) return
            const newCart = state.cart.filter(item => item.id !== productId)
            commit('setCart', newCart)
            await updateDoc(doc(db, "users", state.user.uid), { cart: newCart })
        },

        async updateCartQuantity({ commit, state }, { productId, quantity }) {
            if (!state.user) return
            const newCart = state.cart.map(item => {
                if (item.id === productId) {
                    return { ...item, quantity: quantity }
                }
                return item
            })
            commit('setCart', newCart)
            await updateDoc(doc(db, "users", state.user.uid), { cart: newCart })
        }
    },
    getters: {
        allProducts: (state) => state.products,
        getSearchQuery: (state) => state.searchQuery,
        currentUser: (state) => state.user,
        isLoggedIn: (state) => !!state.user,
        wishlistItems: (state) => state.wishlist,
        wishlistCount: (state) => state.wishlist.length,
        isInWishlist: (state) => (id) => state.wishlist.some(item => item.id === id),
        cartItems: (state) => state.cart,
        isAuthReady: (state) => state.authIsReady,
        getCheckoutItems: (state) => state.checkoutItems,
        cartTotalPrice: (state) => state.cart.reduce((total, item) => total + (item.price * item.quantity), 0),
        userStore: (state) => state.userStore,
        hasStore: (state) => !!state.userStore
    }
})

// --- LISTENER AUTH (DIPERBAIKI) ---
const unsub = onAuthStateChanged(auth, async (user) => {
    if (user) {
        store.commit('setUser', {
            uid: user.uid,
            email: user.email,
            displayName: us
        })

        await store.dispatch('fetchUserData', user.uid)
    } else {
        store.commit('setUser', null)
        store.commit('setCart', [])
        store.commit('setWishlist', [])
        store.commit('setUserStore', null)
    }
    
    store.commit('setAuthIsReady', true)
})

export default store