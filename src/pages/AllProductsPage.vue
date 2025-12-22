<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

const store = useStore()
const router = useRouter()

const products = computed(() => store.getters.allProducts)

const categories = [
    'All',
    'T-Shirts', 'Shirts', 'Jackets', 'Hoodies & Sweaters',
    'Jeans', 'Pants', 'Skirts', 'Dresses',
    'Shoes', 'Accessories', 'Hats'
]

// --- STATE FILTERS ---
const selectedCategory = ref('All')
const storeSearch = ref('')
const minPrice = ref(null)
const maxPrice = ref(null)
const sortBy = ref('newest')
const showLoginModal = ref(false)

// --- STATE PAGINATION ---
const currentPage = ref(1)
const itemsPerPage = 8 

// --- HELPER DATE ---
const parseDate = (dateInput) => {
    if (!dateInput) return new Date(0)
    if (dateInput.toDate) return dateInput.toDate()
    return new Date(dateInput)
}

const filteredProducts = computed(() => {
    let result = products.value.filter(product => {
        const query = store.getters.getSearchQuery.toLowerCase()
        const matchSearch = product.name?.toLowerCase().includes(query)

        let matchCategory = true
        if (selectedCategory.value !== 'All') {
            matchCategory = product.categories === selectedCategory.value
        }

        const matchStore = storeSearch.value === '' ||
            product.storeName?.toLowerCase().includes(storeSearch.value.toLowerCase())

        const price = Number(product.price)
        const matchMinPrice = !minPrice.value || price >= minPrice.value
        const matchMaxPrice = !maxPrice.value || price <= maxPrice.value

        return matchSearch && matchCategory && matchStore && matchMinPrice && matchMaxPrice
    })

    if (sortBy.value === 'popular') {
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0))
    } else if (sortBy.value === 'newest') {
        result.sort((a, b) => parseDate(b.createdAt) - parseDate(a.createdAt))
    } else if (sortBy.value === 'price_low') {
        result.sort((a, b) => a.price - b.price)
    } else if (sortBy.value === 'price_high') {
        result.sort((a, b) => b.price - a.price)
    }

    return result
})

const paginatedProducts = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage
    const end = start + itemsPerPage
    return filteredProducts.value.slice(start, end)
})

const totalPages = computed(() => {
    return Math.ceil(filteredProducts.value.length / itemsPerPage)
})

const changePage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }
}

watch([selectedCategory, storeSearch, minPrice, maxPrice, sortBy, () => store.getters.getSearchQuery], () => {
    currentPage.value = 1
})

const setCategory = (cat) => { selectedCategory.value = cat }

const resetFilter = () => {
    selectedCategory.value = 'All'
    storeSearch.value = ''
    minPrice.value = null
    maxPrice.value = null
    sortBy.value = 'newest'
    router.replace({ query: null })
}

const formatRupiah = (number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(number)

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

const goToDetail = (id) => {
    router.push(`/product/${id}`)
}

onMounted(() => {
    store.dispatch('fetchProducts')
})
</script>

<template>
    <div class="all-products-page">
        <div class="container-allProduct">

            <div class="page-header">
                <div>
                    <h2>All Products</h2>
                    <p class="subtitle">Find your favorite vintage style here</p>
                </div>
                <div class="header-right">
                    <span class="item-count">{{ filteredProducts.length }} Items Found</span>
                    <span class="page-info" v-if="filteredProducts.length > 0">
                        Page {{ currentPage }} of {{ totalPages }}
                    </span>
                </div>
            </div>

            <div v-if="filteredProducts.length > 0" class="product-grid">
                <div v-for="product in paginatedProducts" :key="product.id" class="product-card"
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
            </div>

            <div v-else class="empty-state">
                <div class="icon-search">🔍</div>
                <h3>No products found</h3>
                <p>We couldn't find matches for "{{ storeSearch }}" in category "{{ selectedCategory }}".</p>
                <button class="btn-reset" @click="resetFilter">Clear All Filters</button>
            </div>

            <div class="filter-section">
                <div v-if="totalPages > 1" class="pagination-container">
                    <button class="page-btn nav-btn" :disabled="currentPage === 1" @click="changePage(currentPage - 1)">
                        ← Prev
                    </button>

                    <div class="page-numbers">
                        <button v-for="page in totalPages" :key="page" class="page-btn number-btn"
                            :class="{ active: currentPage === page }" @click="changePage(page)">
                            {{ page }}
                        </button>
                    </div>

                    <button class="page-btn nav-btn" :disabled="currentPage === totalPages"
                        @click="changePage(currentPage + 1)">
                        Next →
                    </button>
                </div>
                <div class="filter-group full-width">
                    <label>Categories</label>
                    <div class="category-pills">
                        <button v-for="cat in categories" :key="cat"
                            :class="['pill-btn', { active: selectedCategory === cat }]" @click="setCategory(cat)">
                            {{ cat }}
                        </button>
                    </div>
                </div>

                <div class="filter-row">
                    <div class="filter-group">
                        <label>Search Store</label>
                        <div class="input-icon-wrapper">
                            <input type="text" v-model="storeSearch" placeholder="Type store name..."
                                class="filter-input" />
                        </div>
                    </div>

                    <div class="filter-group">
                        <label>Price Range</label>
                        <div class="price-inputs">
                            <input type="number" v-model.number="minPrice" placeholder="Min" class="filter-input" />
                        </div>
                    </div>
                    <div class="filter-group">
                        <div class="price-inputs">
                            <input type="number" v-model.number="maxPrice" placeholder="Max" class="filter-input" />
                        </div>
                    </div>

                    <div class="filter-group">
                        <label>Sort By</label>
                        <select v-model="sortBy" class="filter-input select-input">
                            <option value="newest">Newest Arrivals</option>
                            <option value="popular">Most Popular (Rating)</option>
                            <option value="price_low">Price: Low to High</option>
                            <option value="price_high">Price: High to Low</option>
                        </select>
                    </div>

                    <div class="filter-group end">
                        <button class="btn-link" @click="resetFilter" title="Reset Filters">
                            ↺ Reset
                        </button>
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