<script setup>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../../FireBase'

const store = useStore()
const router = useRouter()
const user = computed(() => store.getters.currentUser)
const userStore = computed(() => store.getters.userStore)

const showSuccessModal = ref(false)
const isLoading = ref(false)

const product = ref({
    name: '', price: '', description: '', size: 'M', condition: 'Good', categories: 'T-Shirts', color: '', image: ''
})

const categories = ['T-Shirts', 'Shirts', 'Jackets', 'Hoodies & Sweaters', 'Jeans', 'Pants', 'Shorts', 'Skirts', 'Dresses', 'Hats', 'Accessories', 'Shoes', 'Outerwear']
const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'All Size']
const conditions = ['New', 'Second']

const handleSubmit = async () => {
    if (!product.value.name || !product.value.price || !product.value.image) {
        alert("Please fill in Name, Price, and Image URL")
        return
    }
    if (!userStore.value) {
        alert("Store data not found! Please register your store first.")
        router.push('/user/open-shop')
        return
    }
    isLoading.value = true
    try {
        const newProduct = {
            ...product.value,
            price: Number(product.value.price),
            storeId: user.value.uid,
            storeName: userStore.value.name,
            storeCity: userStore.value.city,
            storeDistrict: userStore.value.district || '',
            rating: 0,
            reviewCount: 0,
            createdAt: serverTimestamp()
        }
        await addDoc(collection(db, "products"), newProduct)
        showSuccessModal.value = true
    } catch (error) {
        console.error("Error adding product: ", error)
        alert("Failed to add product.")
    } finally {
        isLoading.value = false
    }
}

const goToDashboard = () => {
    showSuccessModal.value = false
    router.push('/user/store-dashboard')
}
</script>

<template>
    <div class="add-product-page">
        <div class="page-header-row">
            <button class="btn-back" @click="router.back()">← Back</button>
            <h2>Sell New Item</h2>
        </div>

        <form @submit.prevent="handleSubmit" class="form-card">
            <div class="form-group">
                <label>Image URL *</label>
                <div class="image-input-wrapper">
                    <input v-model="product.image" type="text" placeholder="Paste image link here..." required>
                    <div v-if="product.image" class="img-preview">
                        <img :src="product.image" alt="Preview" @error="product.image = ''">
                    </div>
                </div>
            </div>

            <div class="form-group">
                <label>Product Name *</label>
                <input v-model="product.name" type="text" placeholder="e.g. 90s Vintage Nike Windbreaker" required>
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label>Price (Rp) *</label>
                    <input v-model="product.price" type="number" placeholder="e.g. 150000" required>
                </div>
                <div class="form-group">
                    <label>Category</label>
                    <select v-model="product.categories">
                        <option v-for="c in categories" :key="c" :value="c">{{ c }}</option>
                    </select>
                </div>
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label>Size</label>
                    <select v-model="product.size">
                        <option v-for="s in sizes" :key="s" :value="s">{{ s }}</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Condition</label>
                    <select v-model="product.condition">
                        <option v-for="con in conditions" :key="con" :value="con">{{ con }}</option>
                    </select>
                </div>
            </div>

            <div class="form-group">
                <label>Color</label>
                <input v-model="product.color" type="text" placeholder="e.g. Faded Black, Navy">
            </div>

            <div class="form-group">
                <label>Description</label>
                <textarea v-model="product.description" rows="4"
                    placeholder="Describe defects, material, or measurements..."></textarea>
            </div>

            <button type="submit" class="btn-submit" :disabled="isLoading">
                {{ isLoading ? 'Uploading...' : 'Publish Product' }}
            </button>
        </form>

        <div v-if="showSuccessModal" class="modal-overlay">
            <div class="modal-content">
                <div class="modal-icon">
                    <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#008080" stroke-width="2">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M8 12L11 15L16 9" />
                    </svg>
                </div>
                <h2>Product Published!</h2>
                <p>Your item is now live and ready to be sold.</p>
                <div class="modal-actions">
                    <button class="btn-primary" @click="goToDashboard">Go to Store Dashboard</button>
                </div>
            </div>
        </div>
    </div>
</template>