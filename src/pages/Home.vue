<script setup>
import { computed, onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

const store = useStore()
const router = useRouter()

const products = computed(() => store.getters.allProducts)

// --- HELPER DATE ---
const parseDate = (dateInput) => {
    if (!dateInput) return new Date(0)
    if (dateInput.toDate) return dateInput.toDate()
    return new Date(dateInput)
}

// --- POPULAR PRODUCTS (Top Rated) ---
const popularProducts = computed(() => {
    const sorted = [...products.value]
    sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0))
    return sorted.slice(0, 4)
})

// --- NEW PRODUCTS (Newest Arrivals) ---
const newProducts = computed(() => {
    const sorted = [...products.value]
    sorted.sort((a, b) => parseDate(b.createdAt) - parseDate(a.createdAt))
    return sorted.slice(0, 4)
})

const availableStores = computed(() => {
    const stores = products.value.map(p => p.storeName).filter(Boolean)
    return [...new Set(stores)]
})

const showLoginModal = ref(false)

const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(number)
}

const goToDetail = (id) => {
    router.push(`/product/${id}`)
    window.scrollTo({ top: 0, behavior: 'smooth' })
}

const goToAllProducts = () => {
    router.push('/products')
    window.scrollTo({ top: 0, behavior: 'smooth' })
}

const filterByStore = (storeName) => {
    router.push({ path: '/products', query: { store: storeName } })
}

const toggleLike = async (product) => {
    if (!store.getters.isLoggedIn) {
        showLoginModal.value = true
        return
    }
    try {
        await store.dispatch('toggleWishlist', product)
    } catch (e) {
        console.error(e)
    }
}

const confirmLogin = () => {
    showLoginModal.value = false
    router.push('/login')
}

onMounted(() => {
    store.dispatch('fetchProducts')
})
</script>

<template>
    <div class="home-page">
        <section class="hero"
            style="background-image: url('https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=2070&auto=format&fit=crop');">
            <div class="hero-overlay">
                <div class="hero-card">
                    <h1>Ready to declutter your closet?</h1>
                    <button class="btn-shop" @click="goToAllProducts">Shop Now</button>
                </div>
            </div>
        </section>

        <div class="container">

            <div class="section-header">
                <h2>Popular Items (Top Rated)</h2>
                <a href="#" @click.prevent="goToAllProducts" class="see-all-link">See all</a>
            </div>

            <div class="product-grid">
                <div v-for="product in popularProducts" :key="product.id" class="product-card"
                    @click="goToDetail(product.id)">

                    <div class="store-badge">
                        {{ product.storeName || 'Unknown Store' }}
                    </div>

                    <div class="img-wrapper">
                        <img :src="product.image || 'https://via.placeholder.com/300'" :alt="product.name">
                    </div>

                    <div class="card-info">
                        <div class="header-row">
                            <h4 class="price">{{ formatRupiah(product.price) }}</h4>
                            <div class="rating-badge" v-if="product.rating">
                                ⭐ {{ product.rating }}
                            </div>
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

                <div class="product-card see-all-card" @click="goToAllProducts">
                    <div class="see-all-content">
                        <h3>See All<br>Popular Items</h3>
                    </div>
                </div>
            </div>

            <div class="brand-section">
                <h2>Shop by Store</h2>
                <div class="brand-list">
                    <button v-for="storeName in availableStores" :key="storeName" class="brand-btn"
                        @click="filterByStore(storeName)">
                        {{ storeName }}
                    </button>
                </div>
            </div>

            <div class="section-header">
                <h2>New Arrivals</h2>
                <a href="#" @click.prevent="goToAllProducts" class="see-all-link">See all</a>
            </div>

            <div class="product-grid">
                <div v-for="product in newProducts" :key="product.id" class="product-card"
                    @click="goToDetail(product.id)">

                    <div class="store-badge">
                        {{ product.storeName || 'Unknown Store' }}
                    </div>

                    <div class="img-wrapper">
                        <img :src="product.image || 'https://via.placeholder.com/300'" :alt="product.name">
                    </div>

                    <div class="card-info">
                        <div class="header-row">
                            <h4 class="price">{{ formatRupiah(product.price) }}</h4>
                            <div class="rating-badge" v-if="product.rating">
                                ⭐ {{ product.rating }}
                            </div>
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

                <div class="product-card see-all-card blue-card" @click="goToAllProducts">
                    <div class="see-all-content">
                        <h3>See All<br>New Arrivals</h3>
                    </div>
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