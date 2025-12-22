<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../../FireBase'

const router = useRouter()
const route = useRoute()
const productId = route.params.id

const showSuccessModal = ref(false)
const isLoading = ref(true)
const isSubmitting = ref(false)

const product = ref({
    name: '', price: '', description: '', size: 'M', condition: 'Good', categories: 'T-Shirts', color: '', image: ''
})

const categories = ['T-Shirts', 'Shirts', 'Jackets', 'Hoodies & Sweaters', 'Jeans', 'Pants', 'Skirts', 'Dresses', 'Hats', 'Accessories', 'Shoes', 'Outerwear']
const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'All Size']
const conditions = ['New', 'Second (Pre-loved)', 'Vintage (Good)', 'Vintage (Fair)']

const fetchProductData = async () => {
    try {
        const docRef = doc(db, "products", productId)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
            const data = docSnap.data()
            product.value = {
                name: data.name, price: data.price, description: data.description, size: data.size,
                condition: data.condition, categories: data.categories, color: data.color, image: data.image
            }
        } else {
            alert("Product not found!")
            router.push('/user/store-dashboard')
        }
    } catch (error) { console.error("Error fetching product:", error) }
    finally { isLoading.value = false }
}

const handleUpdate = async () => {
    if (!product.value.name || !product.value.price || !product.value.image) {
        alert("Please fill in required fields")
        return
    }
    isSubmitting.value = true
    try {
        const productRef = doc(db, "products", productId)
        await updateDoc(productRef, {
            ...product.value,
            price: Number(product.value.price),
            updatedAt: serverTimestamp()
        })
        showSuccessModal.value = true
    } catch (error) {
        console.error("Error updating product:", error)
        alert("Failed to update product.")
    } finally {
        isSubmitting.value = false
    }
}

const goToDashboard = () => {
    showSuccessModal.value = false
    router.push('/user/store-dashboard')
}

onMounted(() => { fetchProductData() })
</script>

<template>
    <div class="edit-product-page">
        <div class="page-header-row">
            <button class="btn-back" @click="router.back()">← Back</button>
            <h2>Edit Product</h2>
        </div>

        <div v-if="isLoading" class="loading">Loading product data...</div>

        <form v-else @submit.prevent="handleUpdate" class="form-card">
            <div class="form-group">
                <label>Image URL *</label>
                <div class="image-input-wrapper">
                    <input v-model="product.image" type="text" required>
                    <div v-if="product.image" class="img-preview">
                        <img :src="product.image" alt="Preview" @error="product.image = ''">
                    </div>
                </div>
            </div>

            <div class="form-group">
                <label>Product Name *</label>
                <input v-model="product.name" type="text" required>
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label>Price (Rp) *</label>
                    <input v-model="product.price" type="number" required>
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
                <input v-model="product.color" type="text">
            </div>

            <div class="form-group">
                <label>Description</label>
                <textarea v-model="product.description" rows="4"></textarea>
            </div>

            <div class="modal-footer" style="margin-top: 30px; justify-content: flex-start;">
                <button type="button" class="btn-cancel" @click="router.back()">Cancel</button>
                <button type="submit" class="btn-submit" :disabled="isSubmitting" style="flex: 2;">
                    {{ isSubmitting ? 'Saving...' : 'Update Product' }}
                </button>
            </div>
        </form>

        <div v-if="showSuccessModal" class="modal-overlay">
            <div class="modal-content">
                <div class="modal-icon">
                    <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#008080" stroke-width="2">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M8 12L11 15L16 9" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
                <h2>Update Successful!</h2>
                <p>Your product information has been updated.</p>
                <div class="modal-actions">
                    <button class="btn-primary" @click="goToDashboard">Back to Dashboard</button>
                </div>
            </div>
        </div>
    </div>
</template>