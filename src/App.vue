<script setup>
import Navbar from './components/header/NavBar.vue'
import Footer from './components/footer/Footer.vue'
</script>

<template>
    <div id="app-layout">
        <Navbar />

        <main class="main-content">
            <router-view v-slot="{ Component }">
                <transition name="fade" mode="out-in">
                    <component :is="Component" />
                </transition>
            </router-view>
        </main>

        <Footer />
    </div>
</template>

<style>

/* --- ANIMASI FADE (PUDAR) --- */
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px); 
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease-in-out;
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>
