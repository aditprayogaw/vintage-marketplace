<script setup>
import { computed, ref, watch } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import OtherProduct from '../components/OtherProduct.vue'

const store = useStore()
const router = useRouter()

const cartItems = computed(() => store.getters.cartItems)
const selectedIds = ref([])

// State Modal Remove
const showRemoveModal = ref(false)
const itemToRemoveId = ref(null)

// Computed Total
const selectedTotal = computed(() => {
    return cartItems.value
        .filter(item => selectedIds.value.includes(item.id))
        .reduce((sum, item) => sum + (item.price * item.quantity), 0)
})

const selectedCount = computed(() => selectedIds.value.length)
const formatRupiah = (val) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(val)

const updateQty = (id, currentQty, change) => {
    const newQty = currentQty + change
    if (newQty > 0) {
        store.dispatch('updateCartQuantity', { productId: id, quantity: newQty })
    }
}

const confirmRemoveItem = (id) => {
    itemToRemoveId.value = id
    showRemoveModal.value = true
}

const executeRemove = () => {
    if (itemToRemoveId.value) {
        store.dispatch('removeFromCart', itemToRemoveId.value)
        selectedIds.value = selectedIds.value.filter(itemId => itemId !== itemToRemoveId.value)
    }
    showRemoveModal.value = false
    itemToRemoveId.value = null
}

const toggleSelectAll = (e) => {
    if (e.target.checked) {
        selectedIds.value = cartItems.value.map(item => item.id)
    } else {
        selectedIds.value = []
    }
}

const handleCheckout = () => {
    if (selectedIds.value.length === 0) {
        alert("Please select at least one item to checkout.")
        return
    }
    const itemsToCheckout = cartItems.value.filter(item => selectedIds.value.includes(item.id))
    store.commit('setCheckoutItems', itemsToCheckout)
    router.push('/checkout')
}

watch(cartItems, (newVal) => {
    if (newVal.length === 0) selectedIds.value = []
})
</script>

<template>
    <div class="cart-page">
        <div class="container">
            <h2 style="margin-bottom: 20px;">Your Shopping Cart</h2>

            <div v-if="cartItems.length === 0" class="empty-cart">
                <div class="empty-icon">🛒</div>
                <p>Your cart is currently empty.</p>
                <button class="btn-shop" @click="router.push('/products')">Start Shopping</button>
            </div>

            <div v-else class="cart-content">
                <div class="cart-header">
                    <div class="col-check">
                        <input type="checkbox" @change="toggleSelectAll"
                            :checked="selectedIds.length === cartItems.length && cartItems.length > 0">
                    </div>
                    <div class="col-product">Product</div>
                    <div class="col-price">Price</div>
                    <div class="col-qty">Quantity</div>
                    <div class="col-total">Total</div>
                    <div class="col-action"></div>
                </div>

                <div class="cart-items">
                    <div v-for="item in cartItems" :key="item.id" class="cart-row"
                        :class="{ selected: selectedIds.includes(item.id) }">
                        <div class="col-check">
                            <input type="checkbox" :value="item.id" v-model="selectedIds">
                        </div>

                        <div class="col-product product-info">
                            <img :src="item.image" alt="Product">
                            <div class="info-text">
                                <p class="p-name">{{ item.name }}</p>
                                <p class="p-meta">{{ item.size || 'One Size' }} | {{ item.color || '-' }}</p>
                            </div>
                        </div>

                        <div class="col-price mobile-label" data-label="Price">
                            {{ formatRupiah(item.price) }}
                        </div>

                        <div class="col-qty">
                            <div class="qty-control">
                                <button @click="updateQty(item.id, item.quantity, -1)">-</button>
                                <span>{{ item.quantity }}</span>
                                <button @click="updateQty(item.id, item.quantity, 1)">+</button>
                            </div>
                        </div>

                        <div class="col-total mobile-label" data-label="Total">
                            <strong>{{ formatRupiah(item.price * item.quantity) }}</strong>
                        </div>

                        <div class="col-action">
                            <button class="btn-remove" @click="confirmRemoveItem(item.id)">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    stroke-width="2">
                                    <polyline points="3 6 5 6 21 6"></polyline>
                                    <path
                                        d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2">
                                    </path>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div class="cart-summary-bar">
                    <div class="summary-left">
                        <input type="checkbox" @change="toggleSelectAll"
                            :checked="selectedIds.length === cartItems.length">
                        <span>Select All ({{ cartItems.length }})</span>
                    </div>

                    <div class="summary-right">
                        <div class="total-info">
                            <span>Total ({{ selectedCount }} item):</span>
                            <span class="total-price">{{ formatRupiah(selectedTotal) }}</span>
                        </div>
                        <button class="btn-checkout" :disabled="selectedCount === 0" @click="handleCheckout">
                            Checkout
                        </button>
                    </div>
                </div>
            </div>

            <OtherProduct :filterInCart="true" />

        </div>

        <div v-if="showRemoveModal" class="modal-overlay">
            <div class="modal-content remove-modal">
                <div class="modal-header">
                    <h3>Remove Item</h3>
                    <span class="close-icon" @click="showRemoveModal = false">&times;</span>
                </div>
                <div class="modal-body">
                    <p>Are you sure want to remove this item from cart?</p>
                </div>
                <div class="modal-footer">
                    <button class="btn-cancel" @click="showRemoveModal = false">Close</button>
                    <button class="btn-delete-confirm" @click="executeRemove">Remove</button>
                </div>
            </div>
        </div>
    </div>
</template>