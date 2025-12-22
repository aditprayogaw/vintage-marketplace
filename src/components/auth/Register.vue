<script setup>
import { ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

const store = useStore()
const router = useRouter()

// --- FORM STATE ---
const fullname = ref('')
const username = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const agreedToTerms = ref(false)

// --- UI STATE ---
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const errorMessage = ref('')
const isLoading = ref(false)
const showSuccessModal = ref(false)

// --- ACTION HANDLERS ---
const handleRegister = async () => {
    errorMessage.value = ''

    // Validasi
    if (password.value !== confirmPassword.value) {
        errorMessage.value = "Password dan Konfirmasi Password tidak sama!"
        return
    }

    if (!agreedToTerms.value) {
        errorMessage.value = "Anda harus menyetujui Syarat & Ketentuan."
        return
    }

    isLoading.value = true

    try {
        await store.dispatch('register', {
            email: email.value,
            password: password.value,
            name: fullname.value,
            username: username.value
        })
        showSuccessModal.value = true
    } catch (error) {
        switch (error.code) {
            case 'auth/email-already-in-use':
                errorMessage.value = "Email sudah terdaftar."
                break;
            case 'auth/weak-password':
                errorMessage.value = "Password minimal 6 karakter."
                break;
            default:
                errorMessage.value = "Terjadi kesalahan: " + error.message
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

            <div class="auth-header">
                <h2>Sign up</h2>
                <button class="close-btn" @click="closeForm">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                        stroke-linecap="round" stroke-linejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>

            <p class="auth-subtitle">Enter your details below</p>

            <form @submit.prevent="handleRegister">
                <div class="form-group">
                    <label>Full name <span style="color: var(--danger)">*</span></label>
                    <input type="text" v-model="fullname" placeholder="Enter your fullname" required />
                </div>

                <div class="form-group">
                    <label>Username <span style="color: var(--danger)">*</span></label>
                    <input type="text" v-model="username" placeholder="Enter your username" required />
                </div>

                <div class="form-group">
                    <label>Email <span style="color: var(--danger)">*</span></label>
                    <input type="email" v-model="email" placeholder="Enter your email" required />
                </div>

                <div class="form-group">
                    <label>Password <span style="color: var(--danger)">*</span></label>
                    <div class="input-wrapper">
                        <input :type="showPassword ? 'text' : 'password'" v-model="password"
                            placeholder="Enter your password" required />
                        <span class="eye-icon" @click="showPassword = !showPassword">
                            <svg v-if="!showPassword" width="20" height="20" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                <circle cx="12" cy="12" r="3"></circle>
                            </svg>
                            <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path
                                    d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24">
                                </path>
                                <line x1="1" y1="1" x2="23" y2="23"></line>
                            </svg>
                        </span>
                    </div>
                </div>

                <div class="form-group">
                    <label>Confirmation Password <span style="color: var(--danger)">*</span></label>
                    <div class="input-wrapper">
                        <input :type="showConfirmPassword ? 'text' : 'password'" v-model="confirmPassword"
                            placeholder="Confirm password" required />
                        <span class="eye-icon" @click="showConfirmPassword = !showConfirmPassword">
                            <svg v-if="!showConfirmPassword" width="20" height="20" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                <circle cx="12" cy="12" r="3"></circle>
                            </svg>
                            <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path
                                    d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24">
                                </path>
                                <line x1="1" y1="1" x2="23" y2="23"></line>
                            </svg>
                        </span>
                    </div>
                </div>

                <div class="checkbox-group">
                    <input type="checkbox" id="terms" v-model="agreedToTerms">
                    <label for="terms">
                        By clicking sign up, I hereby agree and consent to <a href="#">Term & Conditions</a>; I confirm
                        that I have read <a href="#">Privacy policy</a>.
                    </label>
                </div>

                <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>

                <button type="submit" class="btn-submit" :disabled="isLoading">
                    {{ isLoading ? 'Processing...' : 'Sign up' }}
                </button>
            </form>

            <p class="switch-text">
                Already have an account? <router-link to="/login">Sign in</router-link>
            </p>
        </div>

        <div v-if="showSuccessModal" class="modal-overlay">
            <div class="modal-content">
                <div class="modal-body">
                    <div class="modal-icon">
                        <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22 2L11 13" stroke="#4FB5E6" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round" />
                            <path d="M22 2L15 22L11 13L2 9L22 2Z" fill="#4FB5E6" fill-opacity="0.2" stroke="#4FB5E6"
                                stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                    </div>
                    <h2>Successfully Register</h2>
                    <p>Thank you for registering at vintage. Start finding your favorite pre-loved product here.</p>
                    <div class="modal-actions">
                        <button class="btn-primary" @click="goToHome">Go to Home Page</button>
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>

<style scoped>
.checkbox-group {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    margin: 20px 0;
}

.checkbox-group input {
    width: 18px;
    height: 18px;
    accent-color: var(--primary);
    margin-top: 2px;
    cursor: pointer;
}

.checkbox-group label {
    font-size: 13px;
    font-weight: 400;
    color: #555;
    line-height: 1.4;
    cursor: pointer;
}

.checkbox-group a {
    color: var(--primary);
    text-decoration: none;
}
</style>