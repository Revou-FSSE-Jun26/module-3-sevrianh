/* ============================================================
   script.js — Profile Page (RevoShop Checkpoint 1)
   Tugas 4: Interaktivitas JavaScript
   ============================================================ */

/* --- Tugas 4.1: Variabel, tipe data, operator, dan fungsi --- */

// STRING: teks
const ownerName = "Nama Kamu";

// NUMBER: angka
const birthYear = 2000;
const currentYear = 2025;

// BOOLEAN: nilai benar/salah
let isAvailableForWork = true;

// ARRAY: daftar nilai (di sini daftar string nama skill)
const skills = ["HTML", "CSS", "JavaScript", "TypeScript", "Tailwind CSS", "Git"];

// OBJECT: kumpulan pasangan key-value
const profile = {
  name: ownerName,
  role: "Aspiring Frontend Developer",
  city: "Indonesia",
};

/* FUNGSI: membungkus logika agar bisa dipakai ulang.
   Fungsi ini memakai OPERATOR aritmatika (-) untuk menghitung umur. */
function calculateAge(bornYear, nowYear) {
  return nowYear - bornYear; // operator pengurangan
}

// Memakai operator perbandingan & logika untuk menyusun pesan status.
function getStatusMessage(available) {
  // operator ternary: kondisi ? nilai_jika_true : nilai_jika_false
  return available ? "Terbuka untuk peluang kerja" : "Sedang tidak tersedia";
}

// Uji cepat di console browser (buka DevTools -> Console untuk melihat).
console.log("Halo,", ownerName);
console.log("Umur:", calculateAge(birthYear, currentYear));
console.log("Status:", getStatusMessage(isAvailableForWork));
console.log("Jumlah skill:", skills.length);


/* ============================================================
   Tugas 4.2: Manipulasi DOM
   ============================================================ */

/* 1) SELEKSI ELEMEN
   Mengambil referensi ke elemen di HTML agar bisa kita olah. */
const skillsList = document.getElementById("skills-list");   // <ul>
const toggleBtn = document.getElementById("toggle-skills");  // <button>

/* 2) MEMBUAT ELEMEN BARU
   Fungsi ini membuat satu <li> untuk sebuah nama skill, lalu
   menambahkannya ke dalam <ul>. */
function addSkill(name) {
  const li = document.createElement("li"); // buat elemen <li> baru
  li.className = "skill-card";              // beri class agar dapat styling grid
  li.textContent = name;                    // isi teksnya dengan nama skill
  skillsList.appendChild(li);               // tempelkan ke dalam <ul>
}

/* 3) RENDER SELURUH DAFTAR
   Mengosongkan dulu list, lalu membuat ulang <li> dari array 'skills'
   (array ini sudah dideklarasikan di Tugas 4.1). */
function renderSkills() {
  skillsList.innerHTML = ""; // kosongkan isi sebelumnya (hapus elemen lama)
  skills.forEach(function (skill) {
    addSkill(skill);         // buat <li> untuk tiap skill
  });
}

// Render pertama kali saat halaman dimuat.
renderSkills();


/* 4) UPDATE KONTEN + TOGGLE CLASS lewat tombol
   Saat tombol diklik:
   - toggle class 'hidden' pada <ul> (menyembunyikan/menampilkan)
   - update teks tombol sesuai kondisi terbaru */
toggleBtn.addEventListener("click", function () {
  // toggleClass mengembalikan true jika class SEKARANG terpasang.
  const isHidden = skillsList.classList.toggle("hidden"); // TOGGLE CLASS

  // UPDATE KONTEN tombol berdasarkan kondisi.
  toggleBtn.textContent = isHidden ? "Tampilkan Keahlian" : "Sembunyikan Keahlian";
});


/* ============================================================
   Tugas 4.3: Event handler SUBMIT + preventDefault
   ============================================================ */

// SELEKSI elemen form dan area status (pakai querySelector sebagai variasi).
const contactForm = document.querySelector("#contact-form");
const formStatus = document.querySelector("#form-status");

/* Event handler 'submit' pada Contact Form.
   Parameter 'event' mewakili peristiwa submit yang terjadi. */
contactForm.addEventListener("submit", function (event) {
  // preventDefault MENCEGAH perilaku bawaan form (reload/navigasi halaman).
  event.preventDefault();

  // Ambil nilai input (pakai .value) dan rapikan spasi dengan .trim().
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();

  // Validasi sederhana memakai operator logika.
  if (name === "" || email === "") {
    formStatus.textContent = "Mohon isi nama dan email terlebih dahulu.";
    formStatus.style.color = "#ff5a5a"; // light-red untuk pesan error
    return; // hentikan proses jika belum valid
  }

  // Jika valid: tampilkan pesan sukses dan reset form.
  formStatus.textContent = `Terima kasih, ${name}! Pesanmu sudah diterima.`;
  formStatus.style.color = "#5a4a9c"; // indigo untuk pesan sukses
  contactForm.reset(); // kosongkan semua field setelah berhasil
});


/* ============================================================
   Tugas 4.4: Array methods (forEach, map, filter, reduce)
   ============================================================ */

/* Data: array berisi OBJECT skill dengan level (1-5).
   Dipakai untuk melatih transformasi & agregasi array. */
const skillLevels = [
  { name: "HTML", level: 5 },
  { name: "CSS", level: 4 },
  { name: "JavaScript", level: 3 },
  { name: "TypeScript", level: 2 },
  { name: "Tailwind CSS", level: 3 },
  { name: "Git", level: 4 },
];

const summaryEl = document.getElementById("skills-summary");

/* 1) forEach — ITERASI: menjalankan sesuatu untuk tiap elemen.
   Di sini kita cetak tiap skill ke console (tidak mengubah array). */
skillLevels.forEach(function (item) {
  console.log(`Skill: ${item.name} (level ${item.level})`);
});

/* 2) map — TRANSFORMASI: membuat array BARU hasil ubahan tiap elemen.
   Di sini: array objek -> array string "Nama (Lv.n)". */
const skillLabels = skillLevels.map(function (item) {
  return `${item.name} (Lv.${item.level})`;
});

/* 3) filter — PENYARINGAN: array BARU berisi elemen yang lolos kondisi.
   Di sini: hanya skill dengan level >= 4 (dianggap "mahir"). */
const advancedSkills = skillLevels.filter(function (item) {
  return item.level >= 4;
});

/* 4) reduce — AGREGASI: menggabungkan semua elemen jadi SATU nilai.
   Di sini: menjumlahkan seluruh level untuk menghitung rata-rata.
   'total' adalah akumulator, 0 adalah nilai awal. */
const totalLevel = skillLevels.reduce(function (total, item) {
  return total + item.level;
}, 0);
const averageLevel = (totalLevel / skillLevels.length).toFixed(1);

// Tampilkan hasil agregasi & penyaringan ke halaman.
summaryEl.textContent =
  `Total ${skillLevels.length} skill — ${advancedSkills.length} di antaranya mahir ` +
  `(level >= 4). Rata-rata level: ${averageLevel}.`;

console.log("Label (map):", skillLabels);
console.log("Mahir (filter):", advancedSkills);
console.log("Rata-rata level (reduce):", averageLevel);
