<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

const store = useStore()
const router = useRouter()

const wishlist = computed(() => store.getters.wishlistItems)
const authReady = computed(() => store.getters.isAuthReady)

const formatRupiah = (number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(number)

const toggleLike = (product) => {
    store.dispatch('toggleWishlist', product)
}

const goToDetail = (id) => {
    router.push(`/product/${id}`)
}
</script>

<template>
    <div class="wishlist-page">
        <div class="container">
            <div class="page-header">
                <h2>Wishlist</h2>
                <span v-if="wishlist.length > 0" class="badge-count">{{ wishlist.length }} items</span>
            </div>

            <div v-if="!authReady" class="loading">
                <p>Loading data...</p>
            </div>

            <div v-else-if="wishlist.length === 0" class="empty-wishlist">
                <div class="icon-container">
                    <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M22 19C22 20.1046 21.1046 21 20 21H4C2.89543 21 2 20.1046 2 19V5C2 3.89543 2.89543 3 4 3H9L11 5H20C21.1046 5 22 5.89543 22 7V19Z"
                            fill="#008080" fill-opacity="0.1" stroke="#008080" stroke-width="2" stroke-linecap="round"
                            stroke-linejoin="round" />
                        <path
                            d="M12 10.5C12 10.5 13.5 8.5 16 8.5C18.5 8.5 20 10.5 20 13.5C20 16.5 12 21 12 21C12 21 4 16.5 4 13.5C4 10.5 5.5 8.5 8 8.5C10.5 8.5 12 10.5 12 10.5Z"
                            fill="#008080" stroke="#008080" stroke-width="2" stroke-linejoin="round" />
                    </svg>
                </div>
                <h3>No favorite items yet</h3>
                <p>When add item to favorite, the item will appear on the favorite list.</p>
                <button class="btn-find" @click="router.push('/products')">Find Products</button>
            </div>

            <div v-else class="product-grid">
                <div v-for="product in wishlist" :key="product.id" class="product-card" @click="goToDetail(product.id)">

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
                            <span class="size">{{ product.size || 'One Size' }}</span>
                            <div class="like-btn active" @click.stop="toggleLike(product)">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="#D32F2F" stroke="#D32F2F"
                                    stroke-width="2">
                                    <path
                                        d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z">
                                    </path>
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>