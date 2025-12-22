<script setup>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

const store = useStore()
const router = useRouter()
const user = computed(() => store.getters.currentUser)
const isLoading = ref(false)

const handleInstantActivation = async () => {
    isLoading.value = true
    try {
        const storeData = {
            name: `${user.value.displayName || 'User'}'s Shop`,
            description: "Welcome to my vintage collection.",
            city: "Denpasar",
            district: "Denpasar Selatan",
            image: user.value.photoURL || "https://via.placeholder.com/150?text=My+Shop",
            createdAt: new Date().toISOString()
        }

        await store.dispatch('registerStore', storeData)
        router.push('/user/store-dashboard')

    } catch (error) {
        console.error(error)
        alert("Failed to activate store.")
    } finally {
        isLoading.value = false
    }
}
</script>

<template>
    <div class="activation-card">
        <div class="activation-icon">
            🏪
        </div>
        <h2>Become a Seller</h2>
        <p>
            Start selling instantly using your current profile details.<br>
            You can edit your shop information later.
        </p>

        <div class="preview-info">
            <p><strong>Shop Name:</strong> {{ user?.displayName || 'User' }}'s Shop</p>
            <p><strong>Location:</strong> Denpasar, Bali (Default)</p>
        </div>

        <button @click="handleInstantActivation" class="btn-primary" style="width:100%" :disabled="isLoading">
            {{ isLoading ? 'Activating...' : 'Activate My Shop Now' }}
        </button>
    </div>
</template>