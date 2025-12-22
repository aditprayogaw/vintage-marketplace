<script setup>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { updateProfile } from 'firebase/auth'
import { db } from '../../FireBase' 

const store = useStore()
const currentUser = computed(() => store.getters.currentUser)

// Form State
const fullname = ref('')
const username = ref('')
const email = ref('')
const isLoading = ref(false)
const photoPreview = ref(null)

// --- STATE MODAL POPUP ---
const showModal = ref(false)
const modalTitle = ref('')
const modalMessage = ref('')

const triggerModal = (title, message) => {
    modalTitle.value = title
    modalMessage.value = message
    showModal.value = true
}

const closeModal = () => {
    showModal.value = false
}

const compressImage = (file, maxWidth, quality) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = (event) => {
            const img = new Image()
            img.src = event.target.result
            img.onload = () => {
                let width = img.width
                let height = img.height
                if (width > maxWidth) {
                    height = Math.round((height * maxWidth) / width)
                    width = maxWidth
                }
                const canvas = document.createElement('canvas')
                canvas.width = width
                canvas.height = height
                const ctx = canvas.getContext('2d')
                ctx.drawImage(img, 0, 0, width, height)
                resolve(canvas.toDataURL('image/jpeg', quality))
            }
            img.onerror = (err) => reject(err)
        }
        reader.onerror = (err) => reject(err)
    })
}

const fetchUserData = async () => {
    if (currentUser.value) {
        fullname.value = currentUser.value.displayName || ''
        email.value = currentUser.value.email || ''
        photoPreview.value = currentUser.value.photoURL || null

        try {
            const docRef = doc(db, "users", currentUser.value.uid)
            const docSnap = await getDoc(docRef)
            if (docSnap.exists()) {
                const data = docSnap.data()
                username.value = data.username || ''
                if (data.imageProfile) {
                    photoPreview.value = data.imageProfile
                }
            }
        } catch (e) {
            console.error("Error fetching user data:", e)
        }
    }
}

const fileInput = ref(null)

const triggerFileInput = () => {
    fileInput.value.click()
}

const handleFileChange = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    // Validasi tipe file
    if (!file.type.match('image.*')) {
        triggerModal('Format Salah', 'Please upload a valid image file (JPG/PNG).')
        return
    }

    try {
        isLoading.value = true
        const base64String = await compressImage(file, 600, 0.7)
        await updateDoc(doc(db, "users", currentUser.value.uid), {
            imageProfile: base64String
        })
        photoPreview.value = base64String
        store.commit('UPDATE_USER_PHOTO', base64String)
        triggerModal('Success', 'Photo updated successfully!')

    } catch (error) {
        console.error(error)
        triggerModal('Error', 'Failed to process photo.')
    } finally {
        isLoading.value = false
        if (fileInput.value) fileInput.value.value = ''
    }
}

const handleUpdateProfile = async () => {
    isLoading.value = true
    try {
        await updateProfile(currentUser.value, { displayName: fullname.value })
        await updateDoc(doc(db, "users", currentUser.value.uid), {
            fullname: fullname.value,
            username: username.value
        })
        
        triggerModal('Success', 'Profile info updated!')
    } catch (error) {
        console.error(error)
        triggerModal('Error', 'Failed to update profile info.')
    } finally {
        isLoading.value = false
    }
}

onMounted(() => {
    fetchUserData()
})
</script>

<template>
    <div class="card">
        <h3 class="section-title">Edit Profile</h3>

        <div class="photo-section">
            <div class="label">Photo</div>
            <div class="photo-wrapper">
                <div class="avatar-large">
                    <img v-if="photoPreview" :src="photoPreview" alt="User Avatar">
                    <span v-else class="initial">{{ fullname.charAt(0).toUpperCase() }}</span>
                </div>

                <input type="file" ref="fileInput" @change="handleFileChange" accept="image/*" style="display: none;" />

                <button class="btn-choose" @click="triggerFileInput" :disabled="isLoading">
                    {{ isLoading ? 'Processing...' : 'Choose Photo' }}
                </button>
                <span class="file-info">JPG, JPEG or PNG. Auto-compressed.</span>
            </div>
        </div>

        <form @submit.prevent="handleUpdateProfile">
            <div class="form-group">
                <label>Full Name</label>
                <input type="text" v-model="fullname" placeholder="Enter full name" />
            </div>

            <div class="form-group">
                <label>Username</label>
                <input type="text" v-model="username" placeholder="Enter username" />
            </div>

            <div class="form-group">
                <label>Email</label>
                <input type="email" v-model="email" disabled class="input-disabled" />
            </div>

            <div class="action-buttons">
                <button type="submit" class="btn-save" :disabled="isLoading">
                    {{ isLoading ? 'Saving...' : 'Update Profile' }}
                </button>
            </div>
        </form>

        <div v-if="showModal" class="modal-overlay">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>{{ modalTitle }}</h3>
                    <button class="close-icon" @click="closeModal">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                </div>
                <div class="modal-body success">
                    <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#4CAF50" stroke-width="2">
                        <circle cx="12" cy="12" r="11" />
                        <path d="M7 13L10 16L17 9" />
                    </svg>
                    <h2>Update Profile Successful!</h2>
                </div>
                <div class="modal-footer">
                    <button class="btn-cancel" @click="closeModal">Close</button>
                </div>
            </div>
        </div>
        </div>
</template>

<style scoped>
.card {
    background: white;
    padding: 40px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.02);
}

.section-title {
    margin-top: 0;
    border-bottom: 1px solid #eee;
    padding-bottom: 15px;
    margin-bottom: 20px;
    font-size: 1.25rem;
    color: #333;
}

.photo-section {
    display: flex;
    align-items: center;
    margin-bottom: 30px;
}

.label {
    width: 100px;
    font-weight: 600;
    font-size: 14px;
    color: #333;
}

.photo-wrapper {
    display: flex;
    align-items: center;
    gap: 15px;
}

.avatar-large {
    width: 60px;
    height: 60px;
    background: #E0F2F1;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    color: #008080;
    overflow: hidden;
    border: 1px solid #eee;
}

.avatar-large img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.file-info {
    font-size: 12px;
    color: #999;
}

.form-group {
    margin-bottom: 20px;
}

.form-group label {
    display: block;
    margin-bottom: 8px;
    font-size: 14px;
    font-weight: 500;
    color: #333;
}

.form-group input {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 14px;
}

.input-disabled {
    background-color: #f9f9f9;
    color: #888;
    cursor: not-allowed;
}

.action-buttons {
    text-align: right;
    margin-top: 30px;
}
</style>