<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '../FireBase'
import OtherProduct from '../components/OtherProduct.vue'

const route = useRoute()
const router = useRouter()
const store = useStore()

const product = ref(null)
const isLoading = ref(true)
const selectedImage = ref(null)

const showSuccessModal = ref(false)
const showLoginModal = ref(false)

const formatRupiah = (number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(number)

const fetchProduct = async () => {
    isLoading.value = true
    try {
        const docRef = doc(db, "products", route.params.id)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
            product.value = { id: docSnap.id, ...docSnap.data() }
            selectedImage.value = product.value.image
        } else {
            alert("Product not found!")
            router.push('/')
        }
    } catch (e) {
        console.error(e)
    } finally {
        isLoading.value = false
    }
}

const addToCart = () => {
    if (!store.getters.isLoggedIn) {
        showLoginModal.value = true
        return;
    }
    store.dispatch('addToCart', product.value)
    showSuccessModal.value = true
}

const toggleWishlist = () => {
    if (!store.getters.isLoggedIn) {
        showLoginModal.value = true
        return;
    }
    store.dispatch('toggleWishlist', product.value)
}

const isInWishlist = computed(() => {
    if (!product.value) return false
    return store.getters.isInWishlist(product.value.id)
})

const goToCart = () => router.push('/cart')
const confirmLogin = () => { showLoginModal.value = false; router.push('/login') }

watch(() => route.params.id, () => {
    fetchProduct()
})

onMounted(() => {
    fetchProduct()
})
</script>

<template>
    <div class="detail-page">
        <div class="container" v-if="product">

            <div class="breadcrumb">
                <span @click="router.push('/')">Home</span> >
                <span @click="router.push('/products')">Products</span> >
                <span class="active">{{ product.name }}</span>
            </div>

            <div class="product-wrapper">
                <div class="gallery-section">
                    <div class="main-image">
                        <img :src="selectedImage || 'https://via.placeholder.com/500'" alt="Main Product">
                    </div>
                </div>

                <div class="info-section">
                    <h1 class="product-title">{{ product.name }}</h1>

                    <div class="meta-row">
                        <div class="rating-badge">⭐ {{ product.rating || 0 }} / 5.0</div>
                        <div class="divider">|</div>
                        <div class="store-info">
                            <span class="store-icon">🏪</span>
                            <span>{{ product.storeName || 'Vintage Store' }}</span>
                            <span class="location-badge">📍 {{ product.storeCity || 'Bali' }}</span>
                        </div>
                    </div>

                    <h2 class="price">{{ formatRupiah(product.price) }}</h2>

                    <div class="attributes-grid">
                        <div class="attr-box">
                            <span class="label">Condition</span>
                            <span class="value">{{ product.condition || 'Pre-loved' }}</span>
                        </div>
                        <div class="attr-box">
                            <span class="label">Size</span>
                            <span class="value">{{ product.size || 'All Size' }}</span>
                        </div>
                        <div class="attr-box">
                            <span class="label">Color</span>
                            <span class="value">{{ product.color || '-' }}</span>
                        </div>
                        <div class="attr-box">
                            <span class="label">Category</span>
                            <span class="value">{{ product.categories || 'Fashion' }}</span>
                        </div>
                    </div>

                    <div class="description">
                        <h3>Description</h3>
                        <p>{{ product.description || 'No description provided.' }}</p>
                    </div>

                    <div class="action-buttons">
                        <button class="btn-cart btn-primary" @click="addToCart">Add to Cart</button>
                        <button class="btn-wishlist" @click="toggleWishlist" :class="{ active: isInWishlist }">
                            {{ isInWishlist ? '❤️ In Wishlist' : '♡ Add to Wishlist' }}
                        </button>
                    </div>
                </div>
            </div>

            <OtherProduct :excludeId="product.id" />

        </div>
        <div v-else-if="isLoading" class="loading">Loading product...</div>

        <div v-if="showSuccessModal" class="modal-overlay">
            <div class="modal-content">
                <div class="modal-header">
                </div>
                <div class="modal-body">
                    <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#4CAF50" stroke-width="2">
                        <circle cx="12" cy="12" r="11" />
                        <path d="M7 13L10 16L17 9" />
                    </svg>
                    <h2>Added to Cart!</h2>
                </div>
                <div class="modal-footer">
                    <button class="btn-secondary" @click="showSuccessModal = false">Continue Shopping</button>
                    <button class="btn-primary" @click="goToCart">View Cart</button>
                </div>
            </div>
        </div>

        <div v-if="showLoginModal" class="modal-overlay">
            <div class="modal-content">
                <div class="modal-body">
                    <div class="modal-icon">
                        <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#D32F2F" stroke-width="2">
                            <rect x="3" y="11" width="18" height="11" rx="2" />
                            <path d="M7 11V7C7 4.2 9.2 2 12 2S17 4.2 17 7V11" />
                            <circle cx="12" cy="16" r="1" />
                        </svg>
                    </div>
                    <h2>Login Required</h2>
                    <div class="modal-footer">
                        <button class="btn-secondary" @click="showLoginModal = false">Cancel</button>
                        <button class="btn-primary" @click="confirmLogin">Login Now</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>