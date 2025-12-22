<template>
  <div class="image-upload-container">
    <label class="upload-box">
      <div v-if="!previewUrl" class="placeholder">
        <span class="icon">📷</span>
        <span>Klik untuk upload foto</span>
        <span class="sub-text">(Otomatis dikompres &lt; 500KB)</span>
      </div>

      <img v-else :src="previewUrl" class="preview-img" alt="Preview" />

      <input type="file" accept="image/*" @change="handleFileChange" class="hidden-input" />
    </label>

    <button v-if="previewUrl" @click.prevent="removeImage" class="btn-remove">
      Hapus Gambar
    </button>

    <p v-if="isProcessing" class="loading-text">Sedang memproses...</p>

    <div v-if="showModal" class="modal-overlay">
      <div class="modal-content">
        
        <div class="modal-header">
          <h3>{{ modalTitle }}</h3>
          <button class="close-icon" @click="closeModal">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        <div class="modal-body">
          <p>{{ modalMessage }}</p>
        </div>

        <div class="modal-footer">
          <button class="btn-cancel" @click="closeModal">Tutup</button>
        </div>

      </div>
    </div>
    </div>
</template>

<script>
export default {
  name: 'InputGambar',
  data() {
    return {
      previewUrl: null,
      isProcessing: false,
      // State untuk Modal Custom
      showModal: false,
      modalTitle: '',
      modalMessage: ''
    };
  },
  methods: {
    // --- FUNGSI UNTUK MEMUNCULKAN MODAL ---
    triggerModal(title, message) {
      this.modalTitle = title;
      this.modalMessage = message;
      this.showModal = true;
    },
    
    closeModal() {
      this.showModal = false;
    },

    handleFileChange(event) {
      const file = event.target.files[0];
      if (!file) return;

      // 1. Validasi Tipe File
      if (!file.type.match('image.*')) {
        this.triggerModal('Format Salah', 'Mohon pilih file gambar (JPG, JPEG, atau PNG).');
        event.target.value = ''; // Reset input
        return;
      }

      this.isProcessing = true;

      // 2. Proses Kompresi
      this.compressImage(file, 800, 0.7)
        .then((base64String) => {
          this.previewUrl = base64String;
          this.isProcessing = false;
          this.$emit('gambar-ready', base64String);
        })
        .catch((err) => {
          console.error(err);
          this.isProcessing = false;
          this.triggerModal('Gagal', 'Terjadi kesalahan saat memproses gambar.');
        });
    },

    removeImage() {
      this.previewUrl = null;
      this.$emit('gambar-ready', null);
    },

    compressImage(file, maxWidth, quality) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
          const img = new Image();
          img.src = event.target.result;
          img.onload = () => {
            let width = img.width;
            let height = img.height;
            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            }
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL('image/jpeg', quality));
          };
          img.onerror = (err) => reject(err);
        };
        reader.onerror = (err) => reject(err);
      });
    }
  }
};
</script>

<style scoped>
.image-upload-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
}

.upload-box {
    width: 100%;
    max-width: 300px;
    height: 200px;
    border: 2px dashed #ccc;
    border-radius: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    overflow: hidden;
    position: relative;
    transition: border-color 0.3s;
}

.upload-box:hover {
    border-color: #42b983; /* Warna Vue */
}

.placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    color: #888;
    text-align: center;
}

.icon { font-size: 2rem; margin-bottom: 5px; }
.sub-text { font-size: 0.8rem; margin-top: 5px; }

.preview-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.hidden-input { display: none; }

.btn-remove {
    background: #ff4d4f;
    color: white;
    border: none;
    padding: 5px 10px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 0.9rem;
}

.loading-text {
    color: #666;
    font-size: 0.9rem;
    font-style: italic;
}
</style>