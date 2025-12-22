<script setup>
import { computed, ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

// MENERIMA PROPS AGAR DINAMIS
const props = defineProps({
    // ID Produk yang sedang dilihat (agar tidak muncul di rekomendasi sendiri)
    excludeId: { type: String, default: null },
    // Opsi: Filter barang yang sudah ada di keranjang? (Default: false)
    filterInCart: { type: Boolean, default: false }
})

const store = useStore()
const router = useRouter()
const showLoginModal = ref(false)

const allProducts = computed(() => store.getters.allProducts)
const cartItems = computed(() => store.getters.cartItems)

// --- LOGIC FILTERING BARU ---
const otherProducts = computed(() => {
    let items = [...allProducts.value]
    if (props.excludeId) {
        items = items.filter(p => p.id !== props.excludeId)
    }

    if (props.filterInCart) {
        items = items.filter(p => !cartItems.value.find(c => c.id === p.id))
    }

    return items.slice(0, 4)
})

const formatRupiah = (val) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(val)

const goToDetail = (id) => {
    router.push(`/product/${id}`)
    window.scrollTo({ top: 0, behavior: 'smooth' })
}

const toggleLike = (product) => {
    if (!store.getters.isLoggedIn) {
        showLoginModal.value = true
        return
    }
    store.commit('toggleWishlist', product)
}

const confirmLogin = () => {
    showLoginModal.value = false
    router.push('/login')
}

onMounted(() => {
    if (allProducts.value.length === 0) {
        store.dispatch('fetchProducts')
    }
})
</script>

<template>
    <div class="other-products-container" v-if="otherProducts.length > 0">
        <h3 class="section-title">You Might Also Like</h3>

        <div class="product-grid">
            <div v-for="product in otherProducts" :key="product.id" class="product-card"
                @click="goToDetail(product.id)">
                <div class="store-badge">{{ product.storeName || 'Unknown Store' }}</div>
                <div class="img-wrapper">
                    <img :src="product.image || 'https://via.placeholder.com/300'" :alt="product.name">
                </div>
                <div class="card-info">
                    <div class="header-row">
                        <h4 class="price">{{ formatRupiah(product.price) }}</h4>
                        <div class="rating-badge" v-if="product.rating">⭐ {{ product.rating }}</div>
                    </div>
                    <p class="name">{{ product.name }}</p>
                    <div class="meta">
                        <span>{{ product.size || 'All Size' }} | {{ product.condition || 'Preloved' }}</span>
                        <div class="like-wrap" @click.stop="toggleLike(product)">
                            <span class="heart-icon">
                                <svg v-if="store.getters.isInWishlist(product.id)" width="20" height="20"
                                    viewBox="0 0 24 24" fill="red" stroke="red" stroke-width="2">
                                    <path
                                        d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z">
                                    </path>
                                </svg>
                                <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ccc"
                                    stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path
                                        d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z">
                                    </path>
                                </svg>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="showLoginModal" class="modal-overlay">
            <div class="modal-content login-modal">
                <div class="modal-icon">
                    <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="3" y="11" width="18" height="11" rx="2" stroke="#D32F2F" stroke-width="2" />
                        <path d="M7 11V7C7 4.23858 9.23858 2 12 2C14.7614 2 17 4.23858 17 7V11" stroke="#D32F2F"
                            stroke-width="2" stroke-linecap="round" />
                        <circle cx="12" cy="16" r="1" fill="#D32F2F" />
                    </svg>
                </div>
                <h2>Login Required</h2>
                <p>You need to login first to add items to your wishlist.</p>
                <div class="modal-actions">
                    <button class="btn-cancel" @click="showLoginModal = false">Cancel</button>
                    <button class="btn-login" @click="confirmLogin">Login Now</button>
                </div>
            </div>
        </div>
    </div>
</template>