<script setup>
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

const store = useStore()
const router = useRouter()
const user = computed(() => store.getters.currentUser)
const hasStore = computed(() => store.getters.hasStore)
const showLogoutModal = ref(false)
const handleLogout = () => {
    showLogoutModal.value = true
}
const confirmLogout = async () => {
    try {
        await store.dispatch('logout')
        showLogoutModal.value = false
        router.push('/')
    } catch (error) {
        console.error("Logout failed:", error)
    }
}
</script>

<template>
    <div class="user-page">
        <div class="container">

            <div>
                <h1>Settings</h1>
            </div>

            <div class="user-layout">

                <aside class="sidebar">

                    <ul class="menu-list">
                        <li>
                            <router-link to="/user/profile" active-class="active-link">
                                Profile details
                            </router-link>
                        </li>

                        <li>
                            <router-link to="/user/order" active-class="active-link">
                                Transaction History
                            </router-link>
                        </li>

                        <li>
                            <router-link to="/user/change-password" active-class="active-link">
                                Change Password
                            </router-link>
                        </li>

                        <li>
                            <router-link v-if="hasStore" to="/user/store-dashboard" active-class="active-link">
                                My Shop
                            </router-link>
                            <router-link v-else to="/user/open-shop" active-class="active-link">
                                Open Shop
                            </router-link>
                        </li>
                    </ul>
                </aside>

                <main class="content-area">
                    <router-view v-slot="{ Component }">
                        <transition name="fade" mode="out-in">
                            <component :is="Component" />
                        </transition>
                    </router-view>
                </main>

            </div>
        </div>

        <div v-if="showLogoutModal" class="modal-overlay">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Logout</h3>
                    <span class="close-icon" @click="showLogoutModal = false">&times;</span>
                </div>

                <div class="modal-body">
                    <p>Are you sure want to logout from Vintage?</p>
                </div>

                <div class="modal-footer">
                    <button class="btn-cancel" @click="showLogoutModal = false">Close</button>
                    <button class="btn-confirm-logout" @click="confirmLogout">Logout</button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.user-page {
    padding: 40px 0;
    background-color: #F9FAFB;
    min-height: 80vh;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

.page-header h1 {
    font-family: 'Georgia', serif;
    font-size: 28px;
    color: #333;
    margin-bottom: 30px;
}

.user-layout {
    display: flex;
    gap: 40px;
    align-items: flex-start;
}

.sidebar {
    width: 280px;
    flex-shrink: 0;
    background: white;
    padding: 30px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.02);
}

.user-info-mini {
    text-align: center;
    margin-bottom: 30px;
    border-bottom: 1px solid #f0f0f0;
    padding-bottom: 20px;
}

.avatar-circle {
    width: 70px;
    height: 70px;
    background: #008080;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 10px;
    color: white;
    font-size: 24px;
    font-weight: bold;
    overflow: hidden;
}

.avatar-circle img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.u-name {
    font-weight: 600;
    color: #333;
    margin: 0;
    font-size: 16px;
}

.menu-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.menu-list a {
    text-decoration: none;
    color: #666;
    font-size: 15px;
    font-weight: 500;
    display: block;
    padding: 12px 15px;
    border-radius: 6px;
    transition: all 0.2s;
}

.menu-list a:hover {
    background-color: #f5f5f5;
    color: #008080;
}

.menu-list a.active-link {
    background-color: #E0F2F1;
    color: #008080;
    font-weight: 600;
}

.btn-logout {
    width: 100%;
    text-align: left;
    background: none;
    border: none;
    padding: 12px 15px;
    color: #d32f2f;
    font-size: 15px;
    font-weight: 500;
    cursor: pointer;
    border-radius: 6px;
    margin-top: 10px;
    border-top: 1px solid #f9f9f9;
}

.btn-logout:hover {
    background-color: #ffebee;
}

/* CONTENT AREA */
.content-area {
    flex: 1;
}

/* TRANSISI HALUS */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

/* RESPONSIF */
@media (max-width: 768px) {
    .user-layout {
        flex-direction: column;
    }

    .sidebar {
        width: 100%;
        margin-bottom: 30px;
    }
}

/* --- MODAL STYLES --- */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 2000;
}

.modal-content {
    background: white;
    border-radius: 8px;
    width: 90%;
    max-width: 400px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    overflow: hidden;
    animation: fadeIn 0.2s ease-out;
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 20px;
    border-bottom: 1px solid #eee;
}

.modal-header h3 {
    margin: 0;
    font-size: 18px;
    color: #333;
    font-weight: 700;
}

.close-icon {
    font-size: 24px;
    cursor: pointer;
    color: #888;
    line-height: 1;
}

.modal-body {
    padding: 25px 20px;
    color: #555;
    font-size: 15px;
}

.modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    padding: 15px 20px;
    background-color: #f9f9f9;
}

.btn-cancel {
    padding: 8px 16px;
    border: 1px solid #ddd;
    background: white;
    color: #333;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 500;
}

.btn-confirm-logout {
    padding: 8px 16px;
    background-color: #D32F2F;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 600;
}

.btn-confirm-logout:hover {
    background-color: #B71C1C;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: scale(0.95);
    }

    to {
        opacity: 1;
        transform: scale(1);
    }
}
</style>