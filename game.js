const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Inisialisasi Database Lokal jika belum ada (Sinkronisasi Sistem Admin)
if (!localStorage.getItem('demo_balance')) localStorage.setItem('demo_balance', '100000.00');
if (!localStorage.getItem('admin_rtp')) localStorage.setItem('admin_rtp', '96');

let balance = parseFloat(localStorage.getItem('demo_balance'));
let bet = 12.00;

// Daftar Simbol Mahjong tiruan
const SYMBOLS = ['🀄', '🀅', '🀆', '🪙', '🎋', '🀘']; 
let grid = [];

function updateUI() {
    document.getElementById('balanceDisplay').innerText = balance.toLocaleString('en-US', {minimumFractionDigits: 2});
    localStorage.setItem('demo_balance', balance.toFixed(2));
}

// Generate Grid Simbol Acak (5 Gulungan x 4 Baris)
function generateGrid() {
    grid = [];
    const rtpSetting = parseInt(localStorage.getItem('admin_rtp'));
    
    for (let row = 0; row < 4; row++) {
        let rowData = [];
        for (let col = 0; col < 5; col++) {
            // Logika Manipulasi RTP dari Admin Panel
            let symbol;
            if (Math.random() * 100 < rtpSetting - 40) {
                symbol = '🀄'; // Tingkatkan frekuensi simbol kembar jika RTP tinggi
            } else {
                symbol = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
            }
            rowData.push(symbol);
        }
        grid.push(rowData);
    }
}

// Menggambar Balok Mahjong ke HTML5 Canvas
function drawGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const cellWidth = canvas.width / 5;
    const cellHeight = canvas.height / 4;

    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 5; col++) {
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(col * cellWidth + 4, row * cellHeight + 4, cellWidth - 8, cellHeight - 8);
            ctx.strokeStyle = "#b0957d";
            ctx.lineWidth = 2;
            ctx.strokeRect(col * cellWidth + 4, row * cellHeight + 4, cellWidth - 8, cellHeight - 8);

            // Gambar Font Karakter Huruf Cina / Balok Mahjong
            ctx.fillStyle = "#d62828";
            ctx.font = "30px Arial";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(grid[row][col], col * cellWidth + cellWidth/2, row * cellHeight + cellHeight/2);
        }
    }
}

document.getElementById('btnSpin').addEventListener('click', () => {
    // Sinkronisasi ulang data saldo dari Admin Panel
    balance = parseFloat(localStorage.getItem('demo_balance'));
    
    if (balance >= bet) {
        balance -= bet;
        updateUI();
        
        let spinTicks = 0;
        let interval = setInterval(() => {
            generateGrid();
            drawGrid();
            spinTicks++;
            if (spinTicks > 10) {
                clearInterval(interval);
                // Tambahkan acak simulasi menang / kalah
                if (Math.random() * 100 < parseInt(localStorage.getItem('admin_rtp'))) {
                    let winAmount = bet * 2.5;
                    balance += winAmount;
                    alert(`Menang beruntun! Multiplier x2 aktif! Mendapat: +${winAmount}`);
                }
                updateUI();
            }
        }, 60);
    } else {
        alert("Saldo Demo Habis! Silakan masuk ke panel admin.html untuk suntik saldo.");
    }
});

// Load awal
generateGrid();
drawGrid();
updateUI();
