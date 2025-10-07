# Absensi Klinik - Frontend

Aplikasi web untuk manajemen absensi karyawan klinik berbasis lokasi. Dibangun menggunakan React, Vite, dan Tailwind CSS.

## 🌟 Fitur Utama

-   **Autentikasi Pengguna:** Sistem login yang aman dengan token JWT.
-   **Absensi Berbasis Lokasi:** Karyawan hanya bisa melakukan absensi jika berada dalam radius yang ditentukan dari lokasi klinik.
-   **Manajemen Perangkat:** Setiap karyawan hanya bisa login dari satu perangkat yang terdaftar untuk mencegah penyalahgunaan.
-   **Dashboard Karyawan:** Menampilkan status absensi harian dan memungkinkan karyawan untuk melakukan absensi.
-   **Panel Admin:**
    -   Melihat riwayat absensi semua karyawan.
    -   Memfilter riwayat absensi (hari ini, minggu ini, bulan ini, atau rentang tanggal).
    -   Manajemen data pengguna (tambah pengguna baru).
    -   Reset password dan Device ID untuk karyawan.
-   **Desain Responsif:** Tampilan yang optimal di berbagai perangkat, dari desktop hingga mobile.
-   **UI Modern:** Dibuat dengan `shadcn/ui` dan `Tailwind CSS` untuk tampilan yang bersih dan modern.

## 🚀 Teknologi yang Digunakan

-   **Framework:** [React](https://reactjs.org/)
-   **Build Tool:** [Vite](https://vitejs.dev/)
-   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
-   **UI Components:** [shadcn/ui](https://ui.shadcn.com/)
-   **Routing:** [React Router](https://reactrouter.com/)
-   **HTTP Client:** [Axios](https://axios-http.com/)
-   **Animasi:** [Framer Motion](https://www.framer.com/motion/)
-   **Manajemen Tanggal:** [date-fns](https://date-fns.org/)

## 📂 Struktur Folder

```
/
├── public/
│   └── vite.svg
├── src/
│   ├── api/
│   │   └── apiClient.js      # Konfigurasi instance Axios untuk koneksi ke backend
│   ├── assets/               # Aset statis seperti gambar dan SVG
│   ├── components/
│   │   ├── admin/            # Komponen khusus untuk panel admin
│   │   ├── auth/             # Komponen untuk halaman login
│   │   ├── common/           # Komponen umum (ProtectedRoute, AdminRoute)
│   │   ├── layout/           # Komponen layout (AdminLayout)
│   │   └── ui/               # Komponen UI dari shadcn/ui
│   ├── context/
│   │   └── AuthContext.jsx   # Context untuk manajemen state autentikasi global
│   ├── hooks/
│   │   ├── useGeolocation.js # Hook untuk mendapatkan lokasi pengguna
│   │   └── use-toast.js      # Hook untuk menampilkan notifikasi (toast)
│   ├── lib/
│   │   └── utils.js          # Utilitas umum (seperti `cn` dari tailwind-merge)
│   ├── pages/
│   │   ├── admin/            # Halaman-halaman untuk panel admin
│   │   ├── DashboardPage.jsx # Halaman dashboard karyawan
│   │   └── LoginPage.jsx     # Halaman login
│   ├── App.jsx               # Komponen utama yang mengatur routing aplikasi
│   ├── index.css             # File CSS global dan konfigurasi Tailwind
│   └── main.jsx              # Titik masuk aplikasi (entry point)
├── .gitignore
├── package.json              # Daftar dependensi dan skrip proyek
└── vite.config.js            # Konfigurasi Vite
```

## 🏁 Memulai Proyek

### Prasyarat

-   [Node.js](https://nodejs.org/) (versi 18 atau lebih baru)
-   [npm](https://www.npmjs.com/) atau package manager lain (yarn, pnpm)

### Instalasi

1.  **Clone repositori:**
    ```bash
    git clone https://github.com/RvLionXz/Absensi-Klinik-Frontend.git
    cd Absensi-Klinik-Frontend
    ```

2.  **Install dependensi:**
    ```bash
    npm install
    ```

### Menjalankan Aplikasi

1.  **Jalankan server development:**
    ```bash
    npm run dev
    ```
    Aplikasi akan berjalan di `http://localhost:5173` (atau port lain jika 5173 sudah digunakan).

2.  **Konfigurasi Backend:**
    Pastikan backend sudah berjalan dan URL-nya sudah dikonfigurasi dengan benar di `src/api/apiClient.js`.

    ```javascript
    // src/api/apiClient.js
    const apiClient = axios.create({
    	baseURL: "URL_BACKEND_ANDA", // <-- Ganti dengan URL backend Anda
    });
    ```

## 📜 Skrip yang Tersedia

-   `npm run dev`: Menjalankan aplikasi dalam mode development.
-   `npm run build`: Membuat build produksi dari aplikasi di folder `dist/`.
-   `npm run lint`: Menjalankan ESLint untuk memeriksa masalah pada kode.
-   `npm run preview`: Menjalankan server lokal untuk melihat hasil build produksi.

## 🧩 Logika dan Komponen Kunci

### Autentikasi (`src/context/AuthContext.jsx`)

-   Menggunakan React Context untuk menyediakan data autentikasi (user, token) ke seluruh aplikasi.
-   Menangani proses `login` dan `logout`.
-   Secara otomatis menginisialisasi status login dari `localStorage` saat aplikasi dimuat.
-   Menyediakan `ProtectedRoute` dan `AdminRoute` untuk melindungi halaman berdasarkan status login dan peran pengguna.

### Koneksi API (`src/api/apiClient.js`)

-   Menggunakan `axios` untuk semua komunikasi dengan backend.
-   Sebuah *interceptor* ditambahkan untuk menyisipkan token JWT (`Authorization: Bearer ...`) secara otomatis ke setiap *request* jika token tersedia di `localStorage`.

### Geolocation (`src/hooks/useGeolocation.js`)

-   Hook kustom yang menggunakan `navigator.geolocation.watchPosition` untuk memantau lokasi pengguna secara *real-time*.
-   Menghitung jarak antara pengguna dan lokasi klinik.
-   Menentukan apakah pengguna berada di dalam radius yang diizinkan (`isWithinClinicRadius`).

### Halaman Admin

-   **Riwayat Absensi (`AdminAbsensiPage.jsx`):**
    -   Menampilkan data absensi dalam bentuk tabel (desktop) dan kartu (mobile).
    -   Memiliki fitur filter berdasarkan periode waktu.
-   **Manajemen Pengguna (`AdminUsersPage.jsx`):**
    -   Menampilkan daftar semua pengguna.
    -   Menyediakan fungsionalitas untuk menambah pengguna baru.
    -   Admin dapat me-reset password dan Device ID karyawan melalui menu aksi.