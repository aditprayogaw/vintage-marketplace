<script setup>
import { ref } from 'vue'
import { getAuth, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth'

const auth = getAuth()

const oldPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const showPass = ref({ old: false, new: false, confirm: false })
const isLoading = ref(false)

// State for Success Modal
const showSuccessModal = ref(false)

const toggle = (field) => {
    showPass.value[field] = !showPass.value[field]
}

const handleChangePassword = async () => {
    const user = auth.currentUser;

    if (!user) {
        alert("Session expired. Please login again.")
        return;
    }

    if (newPassword.value !== confirmPassword.value) {
        alert("New password and confirmation do not match!")
        return
    }
    if (newPassword.value.length < 6) {
        alert("Password must be at least 6 characters.")
        return
    }

    isLoading.value = true
    try {
        // Re-authenticate User
        const credential = EmailAuthProvider.credential(user.email, oldPassword.value)
        await reauthenticateWithCredential(user, credential)

        // Update Password
        await updatePassword(user, newPassword.value)

        // Show Success Modal
        showSuccessModal.value = true

        // Reset form
        oldPassword.value = ''
        newPassword.value = ''
        confirmPassword.value = ''
        showPass.value = { old: false, new: false, confirm: false }

    } catch (error) {
        console.error(error)
        if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
            alert("Incorrect old password.")
        } else if (error.code === 'auth/too-many-requests') {
            alert("Too many failed attempts. Please try again later.")
        } else {
            alert("An error occurred: " + error.message)
        }
    } finally {
        isLoading.value = false
    }
}
</script>

<template>
    <div class="card">
        <h3 class="section-title" style="margin-top:0; border-bottom:1px solid #eee; padding-bottom:15px; margin-bottom:20px;">Change Password</h3>

        <form @submit.prevent="handleChangePassword">

            <div class="form-group">
                <label>Old Password</label>
                <div class="input-wrapper">
                    <input :type="showPass.old ? 'text' : 'password'" v-model="oldPassword" placeholder="Old password" required />
                    <span class="eye-icon" @click="toggle('old')">
                        <svg v-if="!showPass.old" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                        <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                    </span>
                </div>
            </div>

            <div class="form-group">
                <label>New Password</label>
                <div class="input-wrapper">
                    <input :type="showPass.new ? 'text' : 'password'" v-model="newPassword" placeholder="New password" required />
                    <span class="eye-icon" @click="toggle('new')">
                        <svg v-if="!showPass.new" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                        <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                    </span>
                </div>
            </div>

            <div class="form-group">
                <label>Confirmation New Password</label>
                <div class="input-wrapper">
                    <input :type="showPass.confirm ? 'text' : 'password'" v-model="confirmPassword" placeholder="Confirmation password" required />
                    <span class="eye-icon" @click="toggle('confirm')">
                        <svg v-if="!showPass.confirm" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                        <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                    </span>
                </div>
            </div>

            <div style="text-align: right; margin-top: 30px;">
                <button type="submit" class="btn-save" :disabled="isLoading">
                    {{ isLoading ? 'Processing...' : 'Save Changes' }}
                </button>
            </div>
        </form>

        <div v-if="showSuccessModal" class="modal-overlay">
            <div class="modal-content">
                <div class="modal-icon">
                    <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#4CAF50" stroke-width="2">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M8 12L11 15L16 9" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
                <h2>Change Password Successfully</h2>
                <p>Your password has been successfully updated.</p>
                <div class="modal-actions">
                    <button class="btn-primary" @click="showSuccessModal = false">Close</button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* Only card-specific styling remains */
.card {
    background: white;
    padding: 40px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.02);
}
</style>