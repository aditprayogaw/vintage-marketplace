<script setup>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { db } from '../../FireBase'
import { collection, addDoc, serverTimestamp, doc, updateDoc, increment } from 'firebase/firestore'

const props = defineProps({
    product: Object,
    transactionId: String
})

const emit = defineEmits(['close', 'submitted'])
const store = useStore()
const currentUser = computed(() => store.getters.currentUser)

// Form State
const rating = ref(0)
const comment = ref('')
const isSubmitting = ref(false)
const isSuccess = ref(false) // State untuk mengontrol tampilan Sukses

// Star Logic
const setRating = (star) => { rating.value = star }

const submitReview = async () => {
    if (rating.value === 0) {
        alert("Please give a rating star!")
        return
    }

    isSubmitting.value = true

    try {
        // 1. Simpan Review ke Collection 'reviews'
        await addDoc(collection(db, "reviews"), {
            userId: currentUser.value.uid,
            userName: currentUser.value.displayName,
            userImage: currentUser.value.photoURL || null,
            productId: props.product.id,
            transactionId: props.transactionId,
            rating: rating.value,
            comment: comment.value,
            productName: props.product.name,
            productImage: props.product.image,
            createdAt: serverTimestamp()
        })

        // 2. Update Rating Produk (Opsional: update rata-rata rating produk)
        // Disini kita hanya contoh update counter sederhana
        /* const productRef = doc(db, "products", props.product.id)
        await updateDoc(productRef, {
            reviewCount: increment(1)
            // Logic update rating average butuh cloud function atau kalkulasi manual
        }) 
        */

        // 3. Ubah Tampilan ke SUKSES (Pop-up Style)
        isSuccess.value = true

    } catch (error) {
        console.error("Error submit review:", error)
        alert("Failed to submit review")
    } finally {
        isSubmitting.value = false
    }
}

const closeAndRefresh = () => {
    emit('submitted') // Refresh data di parent
    emit('close')     // Tutup modal
}
</script>

<template>
    <div class="modal-overlay">
        <div class="modal-content">

            <div v-if="!isSuccess">
                <div class="modal-header">
                    <h3>Write a Review</h3>
                    <span class="close-icon" @click="$emit('close')">&times;</span>
                </div>

                <div class="product-info">
                    <img :src="product.image" alt="Product">
                    <div class="info-text">
                        <h4>{{ product.name }}</h4>
                        <p>Rate this product</p>
                    </div>
                </div>

                <div class="star-rating">
                    <span v-for="star in 5" :key="star" class="star" :class="{ filled: star <= rating }"
                        @click="setRating(star)">
                        ★
                    </span>
                </div>

                <textarea v-model="comment" placeholder="Describe your experience (optional)..." rows="4"></textarea>

                <div class="modal-actions">
                    <button class="btn-submit" @click="submitReview" :disabled="isSubmitting">
                        {{ isSubmitting ? 'Submitting...' : 'Submit Review' }}
                    </button>
                </div>
            </div>

            <div v-else class="success-state">
                <div class="success-icon">
                    <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="10" stroke="#008080" stroke-width="2" />
                        <path d="M8 12L11 15L16 9" stroke="#008080" stroke-width="2" stroke-linecap="round"
                            stroke-linejoin="round" />
                    </svg>
                </div>
                <h2>Review Submitted!</h2>
                <p>Thank you for your feedback. Your review has been published successfully.</p>

                <button class="btn-ok" @click="closeAndRefresh">
                    Back to History
                </button>
            </div>

        </div>
    </div>
</template>

<style scoped>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.6);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 2000;
}

.modal-content {
    background: white;
    width: 90%;
    max-width: 420px;
    border-radius: 12px;
    padding: 30px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    animation: slideIn 0.3s ease;
    position: relative;
}

@keyframes slideIn {
    from {
        opacity: 0;
        transform: translateY(-20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* --- STYLE FORM REVIEW --- */
.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.modal-header h3 {
    margin: 0;
    font-size: 20px;
    color: #333;
}

.close-icon {
    font-size: 28px;
    cursor: pointer;
    color: #999;
}

.product-info {
    display: flex;
    gap: 15px;
    align-items: center;
    margin-bottom: 20px;
    background: #f9f9f9;
    padding: 10px;
    border-radius: 8px;
}

.product-info img {
    width: 50px;
    height: 50px;
    object-fit: cover;
    border-radius: 4px;
}

.info-text h4 {
    margin: 0 0 5px;
    font-size: 14px;
    color: #333;
}

.info-text p {
    margin: 0;
    font-size: 12px;
    color: #666;
}

.star-rating {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-bottom: 20px;
}

.star {
    font-size: 32px;
    cursor: pointer;
    color: #ddd;
    transition: color 0.2s;
}

.star.filled {
    color: #FFC107;
}

textarea {
    width: 100%;
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 8px;
    resize: none;
    font-family: inherit;
    margin-bottom: 20px;
}

textarea:focus {
    border-color: #008080;
    outline: none;
}

.btn-submit {
    width: 100%;
    padding: 12px;
    background: #008080;
    color: white;
    border: none;
    border-radius: 6px;
    font-weight: bold;
    cursor: pointer;
}

.btn-submit:disabled {
    background: #ccc;
}

/* --- STYLE SUCCESS STATE (Mirip Gambar) --- */
.success-state {
    text-align: center;
    padding: 10px 0;
}

.success-icon {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
}

.success-state h2 {
    font-size: 24px;
    font-weight: 600;
    color: #333;
    margin-bottom: 10px;
}

.success-state p {
    font-size: 14px;
    color: #666;
    line-height: 1.5;
    margin-bottom: 30px;
}

.btn-ok {
    width: 100%;
    padding: 12px;
    background-color: #008080;
    /* Warna Teal sesuai tema */
    color: white;
    border: none;
    border-radius: 6px;
    /* Rounded corners */
    font-weight: 600;
    font-size: 16px;
    cursor: pointer;
    transition: background 0.2s;
}

.btn-ok:hover {
    background-color: #006666;
}
</style>