<script setup>
import { computed, ref, reactive, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { doc, updateDoc, collection, query, where, getDocs, deleteDoc } from 'firebase/firestore'
import { db } from '../../FireBase'

const store = useStore()
const router = useRouter()
const user = computed(() => store.getters.currentUser)
const userStore = computed(() => store.getters.userStore)

const myProducts = ref([])
const totalSales = ref(0)
const totalOrders = ref(0)
const isLoadingData = ref(true)

// --- STATE MODAL EDIT STORE (DIPERBARUI) ---
const showEditModal = ref(false)
const isUpdating = ref(false)

// Form Data Reactive (Nama, Kota, Kecamatan)
const editForm = reactive({
    name: '',
    city: '',
    district: ''
})

// Data Lokasi (Sama seperti Checkout)
const baliCities = ['Denpasar', 'Badung', 'Gianyar', 'Tabanan', 'Bangli', 'Klungkung', 'Karangasem', 'Buleleng', 'Jembrana'];

const districtsData = {
    'Denpasar': [
        'Denpasar Barat', 'Denpasar Selatan', 'Denpasar Timur', 'Denpasar Utara'
    ],
    'Badung': [
        'Abiansemal', 'Kuta', 'Kuta Selatan', 'Kuta Utara', 'Mengwi', 'Petang'
    ],
    'Gianyar': [
        'Blahbatuh', 'Gianyar', 'Payangan', 'Sukawati', 'Tampaksiring', 'Tegallalang', 'Ubud'
    ],
    'Tabanan': [
        'Baturiti', 'Kediri', 'Kerambitan', 'Marga', 'Penebel', 
        'Pupuan', 'Selemadeg', 'Selemadeg Barat', 'Selemadeg Timur', 'Tabanan'
    ],
    'Bangli': [
        'Bangli', 'Kintamani', 'Susut', 'Tembuku'
    ],
    'Klungkung': [
        'Banjarangkan', 'Dawan', 'Klungkung', 'Nusa Penida'
    ],
    'Karangasem': [
        'Abang', 'Bebandem', 'Karangasem', 'Kubu', 'Manggis', 
        'Rendang', 'Selat', 'Sidemen'
    ],
    'Buleleng': [
        'Banjar', 'Buleleng', 'Busungbiu', 'Gerokgak', 'Kubutambahan', 
        'Sawan', 'Seririt', 'Sukasada', 'Tejakula'
    ],
    'Jembrana': [
        'Jembrana', 'Melaya', 'Mendoyo', 'Negara', 'Pekutatan'
    ]
};
const availableDistricts = computed(() => districtsData[editForm.city] || [])

// --- STATE MODAL DELETE ---
const showDeleteModal = ref(false)
const productToDeleteId = ref(null)
const isDeleting = ref(false)

const formatRupiah = (val) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(val)

const fetchData = async () => {
    if (!user.value) return
    isLoadingData.value = true
    try {
        const productsQuery = query(collection(db, "products"), where("storeId", "==", user.value.uid))
        const productSnap = await getDocs(productsQuery)
        const products = []
        productSnap.forEach((doc) => { products.push({ id: doc.id, ...doc.data() }) })
        myProducts.value = products

        const trxQuery = query(collection(db, "transactions"))
        const trxSnap = await getDocs(trxQuery)
        let salesSum = 0; let orderCount = 0
        trxSnap.forEach((doc) => {
            const trx = doc.data()
            let isMyStore = false
            if (trx.items) {
                trx.items.forEach(item => {
                    if (item.storeId === user.value.uid) {
                        salesSum += (item.price * item.quantity)
                        isMyStore = true
                    }
                })
            }
            if (isMyStore) orderCount++
        })
        totalSales.value = salesSum
        totalOrders.value = orderCount
    } catch (error) { console.error(error) }
    finally { isLoadingData.value = false }
}

const goToAddProduct = () => router.push('/user/add-product')
const handleEditProduct = (id) => router.push(`/user/edit-product/${id}`)
const confirmDelete = (id) => { productToDeleteId.value = id; showDeleteModal.value = true }

const executeDelete = async () => {
    if (!productToDeleteId.value) return
    isDeleting.value = true
    try {
        await deleteDoc(doc(db, "products", productToDeleteId.value))
        myProducts.value = myProducts.value.filter(p => p.id !== productToDeleteId.value)
        showDeleteModal.value = false
    } catch (error) { console.error(error); alert("Failed to delete") }
    finally { isDeleting.value = false; productToDeleteId.value = null }
}

// --- LOGIC EDIT STORE PROFILE ---
const openEditModal = () => {
    // Isi form dengan data saat ini
    editForm.name = userStore.value.name
    editForm.city = userStore.value.city || ''
    editForm.district = userStore.value.district || ''
    showEditModal.value = true
}

const handleUpdateStore = async () => {
    if (!editForm.name || !editForm.city || !editForm.district) {
        alert("Please fill all fields")
        return
    }

    isUpdating.value = true
    try {
        const userRef = doc(db, "users", user.value.uid)

        // Update Firestore
        await updateDoc(userRef, {
            "store.name": editForm.name,
            "store.city": editForm.city,
            "store.district": editForm.district
        })

        // Update Vuex State Lokal agar UI langsung berubah tanpa refresh
        const updatedStore = {
            ...userStore.value,
            name: editForm.name,
            city: editForm.city,
            district: editForm.district
        }
        store.commit('setUserStore', updatedStore)

        showEditModal.value = false
    } catch (e) {
        console.error(e)
        alert("Failed to update store profile")
    }
    finally { isUpdating.value = false }
}

onMounted(() => { fetchData() })
</script>

<template>
    <div>

        <div class="store-header">
            <div class="store-info-wrapper">
                <div class="store-details">
                    <div class="store-name-row">
                        <h1>{{ userStore?.name }}</h1>
                        <button class="btn-icon-edit" @click="openEditModal" title="Edit Store Profile">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
                        </button>
                    </div>
                    <p class="store-location">
                        <span class="icon">📍</span> {{ userStore?.city }}, {{ userStore?.district }}
                    </p>
                    <p class="store-desc">{{ userStore?.description }}</p>
                </div>
            </div>

            <div class="header-actions">
                <button class="btn-primary btn-add" @click="goToAddProduct">
                    + Add Product
                </button>
            </div>
        </div>

        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-label">Total Products</div>
                <div class="stat-value">{{ myProducts.length }}</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">Total Sales</div>
                <div class="stat-value highlight">{{ formatRupiah(totalSales) }}</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">Total Orders</div>
                <div class="stat-value">{{ totalOrders }}</div>
            </div>
        </div>

        <div class="products-section">
            <div class="section-head">
                <h3>Your Products</h3>
            </div>

            <div v-if="isLoadingData" class="loading">Loading data...</div>

            <div v-else-if="myProducts.length === 0" class="empty-state">
                <p>You haven't uploaded any products yet.</p>
                <button class="btn-link" @click="goToAddProduct">Upload your first item</button>
            </div>

            <div v-else class="product-grid">
                <div v-for="product in myProducts" :key="product.id" class="product-card">
                    <div class="img-wrapper">
                        <img :src="product.image" :alt="product.name">

                        <div class="card-actions-overlay">
                            <button class="action-btn edit" @click.stop="handleEditProduct(product.id)" title="Edit">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    stroke-width="2">
                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                </svg>
                            </button>
                            <button class="action-btn delete" @click.stop="confirmDelete(product.id)" title="Delete">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    stroke-width="2">
                                    <polyline points="3 6 5 6 21 6"></polyline>
                                    <path
                                        d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2">
                                    </path>
                                </svg>
                            </button>
                        </div>
                    </div>

                    <div class="card-info">
                        <h4 class="product-name">{{ product.name }}</h4>
                        <p class="product-price">{{ formatRupiah(product.price) }}</p>
                        <div class="product-meta">
                            <span>{{ product.size }}</span>
                            <span class="condition-badge">{{ product.condition }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="showEditModal" class="modal-overlay">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Edit Store Profile</h3>
                    <button class="close-icon" @click="showEditModal = false">✕</button>
                </div>

                <div class="modal-body" style="text-align: left;">
                    <div class="modal-form-group">
                        <label class="modal-label">Store Name</label>
                        <input v-model="editForm.name" type="text" class="modal-input" placeholder="Enter store name">
                    </div>

                    <div class="modal-form-group">
                        <label class="modal-label">City (Bali)</label>
                        <select v-model="editForm.city" class="modal-select">
                            <option disabled value="">Select City</option>
                            <option v-for="city in baliCities" :key="city" :value="city">{{ city }}</option>
                        </select>
                    </div>

                    <div class="modal-form-group">
                        <label class="modal-label">District</label>
                        <select v-model="editForm.district" class="modal-select" :disabled="!editForm.city">
                            <option disabled value="">Select District</option>
                            <option v-for="dist in availableDistricts" :key="dist" :value="dist">{{ dist }}</option>
                        </select>
                    </div>
                </div>

                <div class="modal-footer">
                    <button class="btn-cancel" @click="showEditModal = false">Cancel</button>
                    <button class="btn-primary" style="width:auto; padding:10px 20px;" @click="handleUpdateStore"
                        :disabled="isUpdating">
                        {{ isUpdating ? 'Saving...' : 'Save Changes' }}
                    </button>
                </div>
            </div>
        </div>

        <div v-if="showDeleteModal" class="modal-overlay">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Delete Product</h3>
                    <button class="close-icon" @click="showDeleteModal = false">✕</button>
                </div>
                <div class="modal-body">
                    <p>Are you sure you want to delete this item? This action cannot be undone.</p>
                </div>
                <div class="modal-footer">
                    <button class="btn-cancel" @click="showDeleteModal = false">Cancel</button>
                    <button class="btn-danger" @click="executeDelete" :disabled="isDeleting">
                        {{ isDeleting ? 'Deleting...' : 'Delete' }}
                    </button>
                </div>
            </div>
        </div>

    </div>
</template>