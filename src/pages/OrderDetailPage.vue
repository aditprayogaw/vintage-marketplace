<script setup>
import { computed, ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { db } from '../FireBase'
import { collection, addDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore'

const store = useStore()
const router = useRouter()

const user = computed(() => store.getters.currentUser)
const checkoutItems = computed(() => store.getters.getCheckoutItems)

onMounted(() => {
    if (checkoutItems.value.length === 0) {
        router.push('/cart')
    }
})

const address = ref({
    fullName: user.value?.displayName || '',
    phone: '',
    city: '',
    district: '',
    fullAddress: ''
})

const baliCities = ['Denpasar', 'Badung', 'Gianyar', 'Tabanan', 'Bangli', 'Klungkung', 'Karangasem', 'Buleleng', 'Jembrana']
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
}
const availableDistricts = computed(() => districtsData[address.value.city] || [])

const shippingMethod = ref('flat') // 'flat' or 'standard'
const paymentMethod = ref('Transfer Bank - BCA')
const isProcessing = ref(false)

// State Modals
const showSuccessModal = ref(false)
const showValidationModal = ref(false)

// --- COMPUTED ---
const standardShippingCost = computed(() => {
    if (!address.value.city) return 0
    let totalCost = 0
    checkoutItems.value.forEach(item => {
        const storeCity = item.storeLocation || 'Denpasar'
        if (storeCity === address.value.city) totalCost += 10000
        else totalCost += 25000
    })
    return totalCost
})

const shippingCost = computed(() => {
    if (shippingMethod.value === 'flat') return 35000
    return standardShippingCost.value
})

const subtotal = computed(() => checkoutItems.value.reduce((sum, item) => sum + (item.price * item.quantity), 0))
const grandTotal = computed(() => subtotal.value + shippingCost.value)
const formatRupiah = (val) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(val)

// --- ACTIONS ---
const handlePlaceOrder = async () => {
    if (!address.value.city || !address.value.district || !address.value.fullAddress || !address.value.phone) {
        showValidationModal.value = true
        return
    }

    isProcessing.value = true

    try {
        const orderData = {
            buyerId: user.value.uid,
            buyerName: address.value.fullName,
            createdAt: new Date().toISOString(),
            timestamp: serverTimestamp(),
            shippingAddress: { ...address.value },
            shippingMethod: shippingMethod.value === 'flat' ? 'Express Flat Rate' : 'Standard Shipping',
            shippingCost: shippingCost.value,
            items: checkoutItems.value,
            paymentMethod: paymentMethod.value,
            totalPrice: grandTotal.value,
            status: 'Paid'
        }

        await addDoc(collection(db, "transactions"), orderData)

        const userRef = doc(db, "users", user.value.uid)
        await updateDoc(userRef, { address: address.value })

        const currentCart = store.getters.cartItems
        const purchasedIds = checkoutItems.value.map(i => i.id)
        const remainingCart = currentCart.filter(item => !purchasedIds.includes(item.id))

        store.commit('setCart', remainingCart)
        await updateDoc(userRef, { cart: remainingCart })

        showSuccessModal.value = true

    } catch (error) {
        console.error(error)
        alert("Failed to place order. Please try again.")
    } finally {
        isProcessing.value = false
    }
}

const finishOrder = () => {
    showSuccessModal.value = false
    router.push('/')
}
</script>

<template>
    <div class="checkout-page">
        <div class="container">
            <h2 class="page-title">Order Details</h2>

            <div class="checkout-grid">
                <div class="left-column">
                    <div class="section-box">
                        <h3>Items Ordered</h3>
                        <div class="item-list">
                            <div v-for="item in checkoutItems" :key="item.id" class="checkout-item">
                                <img :src="item.image" alt="Product">
                                <div class="item-info">
                                    <p class="name">{{ item.name }}</p>
                                    <p class="meta">{{ item.size }} | {{ item.color }} | {{ item.quantity }} pcs</p>
                                    <p class="price">{{ formatRupiah(item.price * item.quantity) }}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="section-box">
                        <h3>Shipping Address</h3>
                        <form class="address-form" @submit.prevent>
                            <div class="form-row">
                                <div class="form-group">
                                    <label>Recipient Name</label>
                                    <input v-model="address.fullName" type="text" placeholder="Full Name">
                                </div>
                                <div class="form-group">
                                    <label>Phone Number</label>
                                    <input v-model="address.phone" type="text" placeholder="081...">
                                </div>
                            </div>

                            <div class="form-row">
                                <div class="form-group">
                                    <label>City / Regency (Bali)</label>
                                    <select v-model="address.city">
                                        <option disabled value="">Select City</option>
                                        <option v-for="city in baliCities" :key="city" :value="city">{{ city }}</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label>District</label>
                                    <select v-model="address.district" :disabled="!address.city">
                                        <option disabled value="">Select District</option>
                                        <option v-for="dist in availableDistricts" :key="dist" :value="dist">{{ dist }}
                                        </option>
                                    </select>
                                </div>
                            </div>

                            <div class="form-group">
                                <label>Full Address</label>
                                <textarea v-model="address.fullAddress" rows="2"
                                    placeholder="Street name, house number, etc."></textarea>
                            </div>
                        </form>
                    </div>

                    <div class="section-box">
                        <h3>Delivery Details</h3>
                        <div class="shipping-options">
                            <label class="radio-card" :class="{ active: shippingMethod === 'flat' }">
                                <input type="radio" value="flat" v-model="shippingMethod">
                                <div class="radio-info">
                                    <span class="radio-title">Express Flat Rate</span>
                                    <span class="radio-desc">Fixed price to anywhere in Bali.</span>
                                </div>
                                <span class="radio-price">Rp 35.000,00</span>
                            </label>
                            <label class="radio-card" :class="{ active: shippingMethod === 'standard' }">
                                <input type="radio" value="standard" v-model="shippingMethod">
                                <div class="radio-info">
                                    <span class="radio-title">Standard Shipping</span>
                                    <span class="radio-desc">Calculated based on store distance.</span>
                                </div>
                                <span class="radio-price">{{ address.city ? formatRupiah(standardShippingCost) : 'Select City first' }}</span>
                            </label>
                        </div>
                    </div>

                    <div class="section-box">
                        <h3>Payment Method</h3>
                        <select v-model="paymentMethod"
                            style="width:100%; padding:12px; border:1px solid #ddd; border-radius:6px; outline:none;">
                            <option>Transfer Bank - BCA</option>
                            <option>Transfer Bank - Mandiri</option>
                            <option>E-Wallet (GoPay/OVO)</option>
                            <option>Credit Card (Visa/Mastercard)</option>
                        </select>
                    </div>
                </div>

                <div class="right-column">
                    <div class="summary-card">
                        <h3>Order Summary</h3>
                        <div class="summary-row"><span>Subtotal</span><span>{{ formatRupiah(subtotal) }}</span></div>
                        <div class="summary-row"><span>Shipping</span><span>{{ formatRupiah(shippingCost) }}</span>
                        </div>
                        <div class="divider"></div>
                        <div class="summary-row total"><span>Total</span><span>{{ formatRupiah(grandTotal) }}</span>
                        </div>
                        <button class="btn-order" @click="handlePlaceOrder" :disabled="isProcessing">
                            {{ isProcessing ? 'Processing...' : 'Order Now' }}
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="showValidationModal" class="modal-overlay">
            <div class="modal-content">
                <div class="modal-icon warning">
                    <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#FF9800" stroke-width="2"
                        stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                </div>
                <h2>Incomplete Details</h2>
                <p>Please complete your shipping address details before placing the order.</p>
                <button class="warning-btn" @click="showValidationModal = false">OK, I'll fill it</button>
            </div>
        </div>

        <div v-if="showSuccessModal" class="modal-overlay">
            <div class="modal-content">
                <div class="modal-body">
                    
                </div>
                <div class="modal-body success">
                    <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#4CAF50" stroke-width="2">
                        <circle cx="12" cy="12" r="11" />
                        <path d="M7 13L10 16L17 9" />
                    </svg>
                    <h2>Order Successful!</h2>
                    <p>Thank you for your purchase. Your order has been placed successfully.</p>
                </div>

                <div class="modal-footer">
                    <button class="btn-home" @click="finishOrder">Back to Home</button>
                </div>
            </div>
        </div>

    </div>
</template>