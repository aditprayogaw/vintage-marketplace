<script setup>
import { ref, onMounted, computed } from 'vue'
import { useStore } from 'vuex'
import { db } from '../../FireBase'
import { collection, query, where, getDocs } from 'firebase/firestore'
import ReviewModal from './ReviewModal.vue'

const store = useStore()
const currentUser = computed(() => store.getters.currentUser)

const transactions = ref([])
const isLoading = ref(true)
const reviewedSet = ref(new Set())

const showReviewModal = ref(false)
const selectedProduct = ref(null)
const selectedTrxId = ref(null)

const formatRupiah = (val) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(val)
const formatDate = (isoString) => {
    if (!isoString) return '-'
    const date = new Date(isoString)
    return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(date)
}

const fetchTransactions = async () => {
    if (!currentUser.value) return
    try {
        const q = query(collection(db, "transactions"), where("buyerId", "==", currentUser.value.uid))
        const querySnapshot = await getDocs(q)
        const data = []
        querySnapshot.forEach((doc) => { data.push({ id: doc.id, ...doc.data() }) })
        data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        transactions.value = data
    } catch (error) {
        console.error("Error fetching transactions:", error)
    } finally {
        isLoading.value = false
    }
}

const fetchUserReviews = async () => {
    if (!currentUser.value) return
    try {
        const q = query(collection(db, "reviews"), where("userId", "==", currentUser.value.uid))
        const querySnapshot = await getDocs(q)
        const newSet = new Set()
        querySnapshot.forEach((doc) => {
            const data = doc.data()
            const uniqueKey = `${data.transactionId}_${data.productId}`
            newSet.add(uniqueKey)
        })
        reviewedSet.value = newSet
    } catch (error) {
        console.error("Error fetching reviews:", error)
    }
}

const isReviewed = (trxId, productId) => {
    const key = `${trxId}_${productId}`
    return reviewedSet.value.has(key)
}

const openRateModal = (item, trxId) => {
    selectedProduct.value = item
    selectedTrxId.value = trxId
    showReviewModal.value = true
}

const handleReviewSubmitted = async () => {
    await fetchUserReviews()
    fetchTransactions()
}

onMounted(async () => {
    await Promise.all([fetchTransactions(), fetchUserReviews()])
})
</script>

<template>
    <div class="history-container">
        <h3 class="section-title" style="margin-top:0; border:none; padding:0; margin-bottom:20px;">Transaction History
        </h3>

        <div v-if="isLoading" class="loading">Loading history...</div>

        <div v-else-if="transactions.length === 0" class="empty-state">
            <p>You haven't made any purchases yet.</p>
        </div>

        <div v-else class="transaction-list">
            <div v-for="trx in transactions" :key="trx.id" class="trx-card">

                <div class="trx-header">
                    <div class="date-info">
                        <span class="date">{{ formatDate(trx.createdAt) }}</span>
                        <span class="order-id">ID: {{ trx.id }}</span>
                    </div>
                    <span class="status-badge" :class="trx.status.toLowerCase()">{{ trx.status }}</span>
                </div>

                <div class="trx-items">
                    <div v-for="(item, index) in trx.items" :key="index" class="item-row">
                        <img :src="item.image" alt="Product">
                        <div class="item-detail">
                            <p class="name">{{ item.name }}</p>
                            <p class="meta">{{ item.quantity }} x {{ formatRupiah(item.price) }}</p>
                        </div>

                        <div class="item-action">
                            <div v-if="isReviewed(trx.id, item.id)" class="reviewed-badge">
                                <span>✓</span> Reviewed
                            </div>
                            <button v-else class="btn-rate" @click="openRateModal(item, trx.id)">
                                ★ Review
                            </button>
                        </div>
                    </div>
                </div>

                <div class="trx-footer">
                    <div class="total-label">Total Order</div>
                    <div class="trx-total-price">{{ formatRupiah(trx.totalPrice) }}</div>
                </div>

            </div>
        </div>

        <ReviewModal v-if="showReviewModal" :product="selectedProduct" :transactionId="selectedTrxId"
            @close="showReviewModal = false" @submitted="handleReviewSubmitted" />
    </div>
</template>