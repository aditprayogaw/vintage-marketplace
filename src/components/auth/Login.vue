<script setup>
import { ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

const store = useStore()
const router = useRouter()

// --- FORM STATE ---
const email = ref('')
const password = ref('')

// --- UI STATE ---
const errorMessage = ref('')
const isLoading = ref(false)
const showPassword = ref(false)
const showSuccessModal = ref(false) 

// --- ACTION ---
const handleLogin = async () => {
    errorMessage.value = ''
    isLoading.value = true

    try {
        await store.dispatch('login', { email: email.value, password: password.value })

        showSuccessModal.value = true;

    } catch (error) {
        switch (error.code) {
            case 'auth/user-not-found':
            case 'auth/wrong-password':
            case 'auth/invalid-credential':
            case 'auth/invalid-email':
                errorMessage.value = "Email atau Password salah."
                break;
            case 'auth/too-many-requests':
                errorMessage.value = "Terlalu banyak percobaan gagal. Coba lagi nanti."
                break;
            default:
                errorMessage.value = "Login gagal: " + error.message
        }
    } finally {
        isLoading.value = false
    }
}

const goToHome = () => {
    showSuccessModal.value = false
    router.push('/')
}

const closeForm = () => {
    router.push('/')
}
</script>

<template>
    <div class="auth-container">
        <div class="auth-card">
            <div class="card-header">
                <h2>Login</h2>
            </div>
            <p class="subtitle">Enter your details below</p>

            <form @submit.prevent="handleLogin">
                <div class="form-group">
                    <label>Email</label>
                    <input type="email" v-model="email" placeholder="Enter your email" required />
                </div>

                <div class="form-group">
                    <label>Password</label>
                    <div class="input-wrapper">
                        <input :type="showPassword ? 'text' : 'password'" v-model="password"
                            placeholder="Enter your password" required />
                        <span class="eye-icon" @click="showPassword = !showPassword">
                            <svg v-if="!showPassword" width="20" height="20" viewBox="0 0 24 24" fill="none"
                                stroke="#999" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                <circle cx="12" cy="12" r="3"></circle>
                            </svg>
                            <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#999"
                                stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path
                                    d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24">
                                </path>
                                <line x1="1" y1="1" x2="23" y2="23"></line>
                            </svg>
                        </span>
                    </div>
                </div>

                <p v-if="errorMessage" class="error">{{ errorMessage }}</p>

                <button type="submit" class="btn-submit" :disabled="isLoading">
                    {{ isLoading ? 'Logging in...' : 'Sign In' }}
                </button>
            </form>

            <p class="switch-text">
                Don't have an account? <router-link to="/register">Sign up</router-link>
            </p>
        </div>

        <div v-if="showSuccessModal" class="modal-overlay">
            <div class="modal-content">
                <div class="modal-body">
                    <h2>Login Successful</h2>
                    <p>Welcome back! Happy shopping at Vintage.</p>

                    <button class="btn-home" @click="goToHome">
                        Go to Home Page
                    </button>
                </div>

            </div>
        </div>
    </div>
</template>