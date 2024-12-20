document.addEventListener('alpine:init', () => {
    Alpine.data('products', () => ({
        open: false,
        items: [
            { id: 1, name: 'Kopi Power-S', img: 'img1.jpg', price: 16000 },
            { id: 2, name: 'Kopi Susu', img: 'img2.jpg', price: 12000 },
            // { id: 3, name: 'YAMALUBE Gear Motor Oil', img: 'img3.jpg', price: 17000 },
            // { id: 4, name: 'Fedral Matic 30', img: 'img4.jpg', price: 48000 },
            // { id: 5, name: 'Fedral Racing Matic', img: 'img5.jpg', price: 68000 },
            // { id: 6, name: 'Fedral Matic Gear Oil', img: 'img6.jpg', price: 17000 },
        ],
    }));

    Alpine.store('cart', {
        items: [],
        total: 0,
        quantity: 0,
        add(newItem) {
            // Cari apakah item sudah ada di cart
            const cartItem = this.items.find((item) => item.id === newItem.id);

            if (!cartItem) {
                // Tambah item baru ke cart
                this.items.push({ ...newItem, quantity: 1, total: newItem.price });
                this.quantity++;
                this.total += newItem.price;
            } else {
                // Update item yang sudah ada di cart
                this.items = this.items.map((item) => {
                    if (item.id === newItem.id) {
                        item.quantity++;
                        item.total = item.price * item.quantity;
                        this.total += item.price;
                    }
                    return item;
                });
                this.quantity++;
            }
        },
        remove(id) {
            // Cari item berdasarkan ID
            const cartItem = this.items.find((item) => item.id === id);

            if (cartItem) {
                if (cartItem.quantity > 1) {
                    // Kurangi quantity jika lebih dari 1
                    this.items = this.items.map((item) => {
                        if (item.id === id) {
                            item.quantity--;
                            item.total = item.price * item.quantity;
                            this.total -= item.price;
                        }
                        return item;
                    });
                    this.quantity--;
                } else {
                    // Hapus item dari cart jika hanya 1
                    this.items = this.items.filter((item) => item.id !== id);
                    this.quantity--;
                    this.total -= cartItem.price;
                }
            }
        },
    });
});

// Form Validation
const checkoutButton = document.querySelector('.checkout-button');
checkoutButton.disabled = true;

const form = document.querySelector('#checkoutForm');

form.addEventListener('input', function () {
    let isValid = true;
    for (let i = 0; i < form.elements.length; i++) {
        if (form.elements[i].type !== 'submit' && form.elements[i].value.trim() === '') {
            isValid = false;
            break;
        }
    }
    checkoutButton.disabled = !isValid;
    checkoutButton.classList.toggle('disabled', !isValid);
});

// kirim data ketika tombol checkout diklik
checkoutButton.addEventListener('click', function (e) {
  e.preventDefault();
  const formData = new FormData(form);
  const data = new URLSearchParams(formData);
  const objData = Object.fromEntries(data);
  const massage = formatMassage(objData);
  window.open('http://wa.me/6281321592686?text=' + encodeURIComponent(massage));
})

// format pesan whatsapp
const formatMassage = (obj) => {
    return `Data Customer
      Nama: ${obj.name}
      Email: ${obj.email}
      No HP: ${obj.phone}
Data Pesanan
    ${JSON.parse(obj.items).map((item) => `${item.name} (${item.quantity} x ${rupiah(item.total)})\n`)}
    TOTAL: ${rupiah(obj.total)}
    Terima kasih.`;
}
// Konversi ke Rupiah
const rupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(number);
};
