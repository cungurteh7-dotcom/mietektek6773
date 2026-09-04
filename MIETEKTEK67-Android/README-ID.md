# MIETEKTEK67 POS — Project Android

Project ini mengubah kode React/JSX yang diberikan menjadi aplikasi web React yang siap dibungkus menjadi APK Android menggunakan Capacitor.

## Struktur

- `src/App.jsx` — kode aplikasi MIETEKTEK67 dari sumber yang diberikan.
- `src/main.jsx` — entry point React.
- `src/styles.css` — Tailwind + CSS Android safe-area.
- `vite.config.js` — konfigurasi build dengan `base: './'` agar asset aman di Android WebView.
- `capacitor.config.ts` — identitas aplikasi Android: `com.mietektek67.pos`.
- `resources/icon.svg` — ikon dasar kuning tanpa lingkaran.

## Membuat APK

Persyaratan: Node.js, Android Studio, Android SDK, dan JDK yang kompatibel dengan versi Capacitor/Android Studio yang digunakan.

```bash
npm install
npm run build
npx cap add android
npx cap sync android
npx cap open android
```

Setelah Android Studio terbuka:
1. Tunggu Gradle selesai.
2. Pilih emulator atau HP Android.
3. Jalankan **Run** untuk pengujian.
4. Untuk APK: **Build > Build APK(s)**.

Untuk perubahan kode berikutnya:

```bash
npm run android:sync
```

## Catatan penting

Fitur printer pada kode asli menggunakan Web Bluetooth. Pada Android WebView, dukungan Web Bluetooth dapat berbeda menurut perangkat/WebView. Kode asli sudah memiliki fallback printer virtual sehingga aplikasi tidak crash ketika Bluetooth Web API tidak tersedia.

Gambar menu pada kode sumber masih menggunakan URL Unsplash. Untuk aplikasi yang benar-benar offline, gambar sebaiknya dipindahkan ke `public/images/` dan URL diganti menjadi file lokal.
