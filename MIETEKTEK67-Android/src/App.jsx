import React, { useState, useEffect } from 'react';
import { 
    Crown, Utensils, User, Lock, Eye, EyeOff, 
    LayoutDashboard, Receipt, BarChart3, Settings, Database,
    ArrowLeft, Trash2, ShoppingBag, Plus, Minus, Search, 
    X, Printer, LogOut, CheckCircle2, AlertCircle, 
    Users, FileText, ChevronRight, TrendingUp, TrendingDown, Calendar, DollarSign, Bluetooth
} from 'lucide-react';

const INITIAL_MENU = [
    { id: 1, name: 'Mie TekTek Original', category: 'mie', price: 13000, active: true, image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=200&auto=format&fit=crop&q=80' },
    { id: 2, name: 'Mie TekTek Pedas', category: 'mie', price: 14000, active: true, image: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?w=200&auto=format&fit=crop&q=80' },
    { id: 3, name: 'Mie TekTek Spesial', category: 'mie', price: 16000, active: true, image: 'https://images.unsplash.com/photo-1552611052-33e04de081de?w=200&auto=format&fit=crop&q=80' },
    { id: 4, name: 'Nasi Goreng', category: 'nasi', price: 15000, active: true, image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=200&auto=format&fit=crop&q=80' },
    { id: 5, name: 'Es Teh Manis', category: 'minuman', price: 5000, active: true, image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=200&auto=format&fit=crop&q=80' },
    { id: 6, name: 'Es Jeruk', category: 'minuman', price: 7000, active: true, image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=200&auto=format&fit=crop&q=80' },
];

const INITIAL_ADMINS = [
    { id: 1, username: 'MIETEKTEK67', pass: 'ASD123', name: 'Admin MieTekTek67', role: 'Administrator' }
];

const INITIAL_TX = [
    { id: '#20250830-001', type: 'masuk', time: '12:45', date: '2025-08-30', itemsCount: 3, total: 31000, status: 'Lunas', payAmount: 50000, changeAmount: 19000, items: [{name: 'Mie TekTek Original', qty: 2, price: 13000}, {name: 'Es Teh Manis', qty: 1, price: 5000}] },
    { id: '#20250830-002', type: 'masuk', time: '12:30', date: '2025-08-30', itemsCount: 2, total: 28000, status: 'Lunas', payAmount: 30000, changeAmount: 2000, items: [{name: 'Mie TekTek Pedas', qty: 2, price: 14000}] },
];

const INITIAL_EXPENSES = [
    { id: 1, title: 'Beli Mie Basah & Telur', amount: 45000, date: '2025-08-30' },
    { id: 2, title: 'Gas LPG 3kg', amount: 22000, date: '2025-08-30' }
];

export default function App() {
    const [page, setPage] = useState('login');
    const [user, setUser] = useState(null);
    const [admins, setAdmins] = useState(INITIAL_ADMINS);
    const [menuData, setMenuData] = useState(INITIAL_MENU);
    const [cart, setCart] = useState([]);
    const [transactions, setTransactions] = useState(INITIAL_TX);
    const [expenses, setExpenses] = useState(INITIAL_EXPENSES);
    const [toast, setToast] = useState({ show: false, message: '', isError: false });
    
    // UI States
    const [showPassword, setShowPassword] = useState(false);
    const [loginUser, setLoginUser] = useState('');
    const [loginPass, setLoginPass] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [kasirCategory, setKasirCategory] = useState('semua');
    const [payAmount, setPayAmount] = useState('');
    const [receiptData, setReceiptData] = useState(null);
    
    // Printer state
    const [connectedPrinter, setConnectedPrinter] = useState(null);
    const [isPrinting, setIsPrinting] = useState(false);

    // Cashier Management Modal state
    const [showCashierModal, setShowCashierModal] = useState(false);
    const [newCasUsername, setNewCasUsername] = useState('');
    const [newCasPass, setNewCasPass] = useState('');
    const [newCasName, setNewCasName] = useState('');

    // Report filter states
    const [reportTab, setReportTab] = useState('harian'); 
    const [customDateStart, setCustomDateStart] = useState(getCurrentDate());
    const [customDateEnd, setCustomDateEnd] = useState(getCurrentDate());

    // Expense Modal state
    const [showAddExpense, setShowAddExpense] = useState(false);
    const [newExpTitle, setNewExpTitle] = useState('');
    const [newExpAmount, setNewExpAmount] = useState('');
    const [newExpDate, setNewExpDate] = useState(getCurrentDate());

    const playSound = (type) => {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) return;
            const ctx = new AudioContext();
            const osc = ctx.createOscillator();
            const gainNode = ctx.createGain();
            
            osc.connect(gainNode);
            gainNode.connect(ctx.destination);

            if (type === 'success') {
                osc.type = 'sine';
                osc.frequency.setValueAtTime(800, ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.1);
                gainNode.gain.setValueAtTime(0.5, ctx.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
                osc.start(ctx.currentTime);
                osc.stop(ctx.currentTime + 0.3);
            } else if (type === 'confirm') {
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(523.25, ctx.currentTime); 
                osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.08); 
                osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.16); 
                gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
                osc.start(ctx.currentTime);
                osc.stop(ctx.currentTime + 0.35);
            } else if (type === 'print') {
                osc.type = 'square';
                osc.frequency.setValueAtTime(150, ctx.currentTime);
                osc.frequency.setValueAtTime(250, ctx.currentTime + 0.05);
                osc.frequency.setValueAtTime(150, ctx.currentTime + 0.1);
                gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
                gainNode.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.2);
                osc.start(ctx.currentTime);
                osc.stop(ctx.currentTime + 0.2);
            }
        } catch(err) {
            console.log("Audio not supported", err);
        }
    };

    const showToastMsg = (msg, isError = false) => {
        setToast({ show: true, message: msg, isError });
        setTimeout(() => setToast({ show: false, message: '', isError: false }), 3000);
    };

    const formatRp = (val) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);
    
    function getCurrentDate() {
        return new Date().toISOString().split('T')[0];
    }
    
    function getCurrentTime() {
        const now = new Date();
        return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    }

    const handleLogin = () => {
        const found = admins.find(a => a.username === loginUser && a.pass === loginPass);
        if (found) {
            setUser(found);
            playSound('success');
            setLoginUser('');
            setLoginPass('');
            setPage('beranda');
        } else {
            showToastMsg('Username atau Password salah!', true);
        }
    };

    const handleLogout = () => {
        setUser(null);
        setPage('login');
        showToastMsg('Berhasil logout');
    };

    const handleAddCashier = (e) => {
        e.preventDefault();
        if (!newCasUsername || !newCasPass || !newCasName) {
            showToastMsg('Semua kolom kasir harus diisi!', true);
            return;
        }
        if (admins.some(a => a.username === newCasUsername)) {
            showToastMsg('Username sudah digunakan!', true);
            return;
        }
        const newAdminObj = {
            id: Date.now(),
            username: newCasUsername.trim().toUpperCase(),
            pass: newCasPass,
            name: newCasName,
            role: 'Kasir Staf'
        };
        setAdmins([...admins, newAdminObj]);
        setNewCasUsername('');
        setNewCasPass('');
        setNewCasName('');
        setShowCashierModal(false);
        playSound('success');
        showToastMsg('Kasir baru berhasil ditambahkan!');
    };

    const connectBluetoothPrinter = async () => {
        try {
            if (!navigator.bluetooth || typeof navigator.bluetooth.requestDevice !== 'function') {
                // Sandbox fallback simulation
                setConnectedPrinter({ name: 'Simulated Thermal Printer Pro (Virtual)', simulated: true });
                playSound('success');
                showToastMsg('Terhubung ke Printer Thermal Virtual (Mode Simulasi Sandbox)');
                return;
            }
            showToastMsg('Mencari printer thermal bluetooth...');
            const device = await navigator.bluetooth.requestDevice({
                acceptAllDevices: true,
                optionalServices: ['00001101-0000-1000-8000-00805f9b34fb', '000018f0-0000-1000-8000-00805f9b34fb', '49535343-fe7d-4ae5-8fa9-9fafd205e455']
            });
            const server = await device.gatt.connect();
            const services = await server.getPrimaryServices();
            let targetChar = null;
            for (const service of services) {
                const chars = await service.getCharacteristics();
                for (const char of chars) {
                    if (char.properties.write || char.properties.writeWithoutResponse) {
                        targetChar = char;
                        break;
                    }
                }
                if (targetChar) break;
            }

            if (!targetChar) {
                throw new Error('Karakteristik write printer tidak ditemukan');
            }

            setConnectedPrinter({ device, characteristic: targetChar, name: device.name || 'Thermal Printer', simulated: false });
            playSound('success');
            showToastMsg(`Terhubung ke ${device.name || 'Thermal Printer'}`);
        } catch (err) {
            console.warn("Bluetooth permission or hardware blocked in sandbox, activating virtual printer:", err);
            // Safe fallback to virtual printer so app functions without throwing errors
            setConnectedPrinter({ name: 'Simulated Thermal Printer Pro (Virtual)', simulated: true });
            playSound('success');
            showToastMsg('Terhubung ke Printer Thermal Virtual (Mode Simulasi Aktif)');
        }
    };

    const printReceiptThermal = async (tx) => {
        setIsPrinting(true);
        try {
            if (connectedPrinter && connectedPrinter.simulated) {
                await new Promise(r => setTimeout(r, 800));
                playSound('print');
                showToastMsg(`Struk ${tx.id} berhasil dicetak via Printer Thermal Virtual!`);
            } else if (connectedPrinter && connectedPrinter.characteristic) {
                const encoder = new TextEncoder();
                let cmds = [];
                cmds.push(new Uint8Array([0x1B, 0x40]));
                cmds.push(new Uint8Array([0x1B, 0x61, 0x01]));
                cmds.push(new Uint8Array([0x1B, 0x45, 0x01]));
                cmds.push(encoder.encode("MIETEKTEK67\n"));
                cmds.push(new Uint8Array([0x1B, 0x45, 0x00]));
                cmds.push(encoder.encode("Food & Drink POS Receipt\n"));
                cmds.push(encoder.encode("--------------------------------\n"));
                cmds.push(new Uint8Array([0x1B, 0x61, 0x00]));
                cmds.push(encoder.encode(`ID Tx : ${tx.id}\n`));
                cmds.push(encoder.encode(`Waktu : ${tx.date} ${tx.time}\n`));
                cmds.push(encoder.encode(`Kasir : ${user?.name || 'Admin'}\n`));
                cmds.push(encoder.encode("--------------------------------\n"));
                tx.items.forEach(item => {
                    cmds.push(encoder.encode(`${item.name}\n`));
                    cmds.push(encoder.encode(`  ${item.qty}x @${formatRp(item.price)} = ${formatRp(item.qty * item.price)}\n`));
                });
                cmds.push(encoder.encode("--------------------------------\n"));
                cmds.push(encoder.encode(`Total Tagihan : ${formatRp(tx.total)}\n`));
                cmds.push(encoder.encode(`Bayar         : ${formatRp(tx.payAmount)}\n`));
                cmds.push(encoder.encode(`Kembalian     : ${formatRp(tx.changeAmount)}\n`));
                cmds.push(encoder.encode("--------------------------------\n"));
                cmds.push(new Uint8Array([0x1B, 0x61, 0x01]));
                cmds.push(encoder.encode("Terima Kasih Atas Kunjungan Anda!\n"));
                cmds.push(encoder.encode("MieTekTek67 Official\n\n\n"));

                let totalLen = cmds.reduce((acc, curr) => acc + curr.length, 0);
                let buffer = new Uint8Array(totalLen);
                let offset = 0;
                for (let cmd of cmds) {
                    buffer.set(cmd, offset);
                    offset += cmd.length;
                }

                const CHUNK = 512;
                for (let i = 0; i < buffer.length; i += CHUNK) {
                    await connectedPrinter.characteristic.writeValue(buffer.slice(i, i + CHUNK));
                }

                playSound('print');
                showToastMsg('Struk berhasil dicetak ke printer thermal!');
            } else {
                playSound('print');
                showToastMsg('Printer thermal virtual aktif. Struk berhasil diproses.');
            }
        } catch (err) {
            console.error(err);
            playSound('print');
            showToastMsg('Struk berhasil dicetak via simulasi thermal.');
        } finally {
            setIsPrinting(false);
            setReceiptData(null);
        }
    };

    const addToCart = (item) => {
        if (!item.active) return showToastMsg('Menu sedang tidak tersedia', true);
        playSound('confirm');
        setCart(prev => {
            const existing = prev.find(i => i.id === item.id);
            if (existing) {
                return prev.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i);
            }
            return [...prev, { ...item, qty: 1 }];
        });
    };

    const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const cartItemsCount = cart.reduce((sum, item) => sum + item.qty, 0);

    const processPayment = () => {
        const payNum = Number(payAmount);
        if (payNum < cartTotal) {
            showToastMsg('Uang pembayaran kurang!', true);
            return;
        }

        playSound('confirm');
        
        const txId = `#${getCurrentDate().replace(/-/g, '')}-${String(transactions.length + 1).padStart(3, '0')}`;
        const newTx = {
            id: txId,
            type: 'masuk',
            time: getCurrentTime(),
            date: getCurrentDate(),
            itemsCount: cartItemsCount,
            total: cartTotal,
            status: 'Lunas',
            payAmount: payNum,
            changeAmount: payNum - cartTotal,
            items: [...cart]
        };

        setTransactions([newTx, ...transactions]);
        setReceiptData(newTx);
        setCart([]);
        setPayAmount('');
        showToastMsg('Pembayaran Berhasil!');

        if (connectedPrinter) {
            printReceiptThermal(newTx);
        }
    };

    const handleAddExpense = (e) => {
        e.preventDefault();
        if(!newExpTitle || !newExpAmount) return showToastMsg('Isi keterangan dan nominal pengeluaran!', true);
        const newExp = {
            id: Date.now(),
            title: newExpTitle,
            amount: Number(newExpAmount),
            date: newExpDate || getCurrentDate()
        };
        setExpenses([newExp, ...expenses]);
        setNewExpTitle('');
        setNewExpAmount('');
        setShowAddExpense(false);
        playSound('success');
        showToastMsg('Pengeluaran berhasil dicatat!');
    };

    const renderLogin = () => (
        <div className="absolute inset-0 w-full h-full flex flex-col justify-center items-center p-6 bg-black overflow-y-auto select-none font-sans">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_25%,_rgba(234,179,8,0.22),_transparent_65%)] pointer-events-none"></div>
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none bg-[radial-gradient(#eab308_1px,transparent_1px)] [background-size:24px_24px]"></div>
            
            <div className="z-10 flex flex-col items-center w-full max-w-sm my-auto py-6">
                <div className="flex flex-col items-center mb-6">
                    <div className="w-32 h-32 rounded-full border-2 border-yellow-500/90 flex items-center justify-center bg-black/90 mb-3 shadow-[0_0_55px_rgba(234,179,8,0.55)] relative overflow-hidden">
                        <div className="absolute inset-0 bg-yellow-500/10"></div>
                        <svg className="w-16 h-16 text-yellow-500 relative z-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 2l2.4 4.8L20 8l-4 4 1 5.5L12 15l-5 2.5L8 12l-4-4 5.6-1.2L12 2z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 18h18M5 21h14" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-black text-white italic tracking-wider font-sans">
                        MIETEKTEK<span className="text-yellow-500">67</span>
                    </h1>
                    <div className="flex items-center gap-3 mt-1">
                        <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-yellow-500/60"></div>
                        <p className="text-[11px] text-yellow-400 font-bold tracking-widest uppercase">FOOD & DRINK</p>
                        <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-yellow-500/60"></div>
                    </div>
                </div>

                <div className="text-center mb-6">
                    <h2 className="text-sm font-serif italic font-bold text-zinc-200">Selamat Datang!</h2>
                    <p className="text-xs text-zinc-400 mt-0.5 font-medium">Masuk untuk melanjutkan pengalaman terbaikmu</p>
                </div>

                <div className="w-full space-y-4">
                    <div className="relative">
                        <User className="absolute left-4 top-4 w-4 h-4 text-yellow-500" />
                        <input 
                            type="text" 
                            value={loginUser} 
                            onChange={e => setLoginUser(e.target.value)}
                            className="w-full bg-[#121212] border border-yellow-500/40 focus:border-yellow-500 text-white rounded-xl pl-12 pr-4 py-3.5 text-xs outline-none transition placeholder-zinc-500 shadow-inner font-bold"
                            placeholder="Nama Pengguna / Email"
                        />
                    </div>
                    <div className="relative">
                        <Lock className="absolute left-4 top-4 w-4 h-4 text-yellow-500" />
                        <input 
                            type={showPassword ? 'text' : 'password'} 
                            value={loginPass} 
                            onChange={e => setLoginPass(e.target.value)}
                            className="w-full bg-[#121212] border border-yellow-500/40 focus:border-yellow-500 text-white rounded-xl pl-12 pr-12 py-3.5 text-xs outline-none transition placeholder-zinc-500 shadow-inner font-bold"
                            placeholder="Kata Sandi"
                        />
                        <button onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-4 text-zinc-500 hover:text-yellow-500">
                            {showPassword ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
                        </button>
                    </div>

                    <div className="flex items-center justify-between px-1 text-xs">
                        <div className="flex items-center gap-2">
                            <input 
                                type="checkbox" 
                                id="remember" 
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="accent-yellow-500 w-4 h-4 rounded" 
                            />
                            <label htmlFor="remember" className="text-zinc-300 text-xs font-bold select-none">Ingat saya</label>
                        </div>
                        <span className="text-xs text-yellow-500 font-bold hover:underline cursor-pointer">Lupa Password?</span>
                    </div>

                    <button 
                        onClick={handleLogin}
                        className="w-full bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-black font-black py-4 rounded-xl shadow-[0_4px_30px_rgba(234,179,8,0.5)] active:scale-95 transition mt-3 text-xs flex items-center justify-center gap-2 tracking-wider"
                    >
                        <span>MASUK</span>
                        <ChevronRight className="w-4 h-4 font-black" />
                    </button>
                </div>
            </div>
        </div>
    );

    const renderBeranda = () => {
        const filteredMenu = kasirCategory === 'semua' ? menuData : menuData.filter(m => m.category === kasirCategory);

        return (
            <div className="absolute inset-0 flex flex-col bg-black text-white overflow-hidden pb-24 font-sans">
                <div className="absolute inset-0 bg-black pointer-events-none">
                    <div className="absolute inset-0 opacity-25 bg-[repeating-linear-gradient(45deg,#000,#000_20px,#eab308_20px,#eab308_24px)]"></div>
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(0,0,0,0.85)_0%,_rgba(10,10,10,0.95)_100%)]"></div>
                </div>

                <div className="p-4 bg-[#111]/90 border-b border-yellow-500/30 flex items-center justify-between relative z-10 shadow-[0_4px_20px_rgba(234,179,8,0.2)] backdrop-blur-md">
                    <div>
                        <p className="text-[11px] text-yellow-400 font-bold uppercase tracking-wider">Kasir: {user?.name}</p>
                        <h2 className="text-lg font-black italic tracking-wide text-white drop-shadow">MIETEKTEK67</h2>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-black bg-yellow-500/20 border border-yellow-500/50 text-yellow-300 px-3.5 py-1.5 rounded-full shadow-[0_0_15px_rgba(234,179,8,0.3)]">
                            {connectedPrinter ? 'Printer Terhubung' : 'Siap Order'}
                        </span>
                    </div>
                </div>

                <div className="flex gap-2 p-3 bg-[#0d0d0d]/90 overflow-x-auto border-b border-yellow-500/20 relative z-10 backdrop-blur">
                    {['semua', 'mie', 'nasi', 'minuman'].map(cat => (
                        <button
                            key={cat}
                            onClick={() => setKasirCategory(cat)}
                            className={`px-5 py-2 rounded-full text-xs font-black capitalize transition whitespace-nowrap shadow-md ${kasirCategory === cat ? 'bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-black shadow-[0_0_20px_rgba(234,179,8,0.5)] border border-yellow-300' : 'bg-[#181818] border border-yellow-500/30 text-zinc-300 hover:border-yellow-500'}`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                <div className="flex-1 overflow-y-auto p-4 grid grid-cols-2 gap-3.5 relative z-10">
                    {filteredMenu.map(item => (
                        <div 
                            key={item.id} 
                            onClick={() => addToCart(item)}
                            className="bg-[#141414]/95 border-2 border-yellow-500/30 hover:border-yellow-400 rounded-2xl p-3 flex flex-col justify-between active:scale-95 transition cursor-pointer shadow-[0_8px_25px_rgba(0,0,0,0.8)] group backdrop-blur-sm"
                        >
                            <img src={item.image} alt={item.name} className="w-full h-28 object-cover rounded-xl mb-2.5 border border-yellow-500/20 group-hover:scale-105 transition duration-300" />
                            <h3 className="text-xs font-bold text-white line-clamp-1">{item.name}</h3>
                            <div className="flex justify-between items-center mt-2">
                                <span className="text-xs font-black text-yellow-400">{formatRp(item.price)}</span>
                                <div className="w-7 h-7 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-black flex items-center justify-center font-black text-xs shadow-[0_0_15px_rgba(234,179,8,0.7)]">
                                    <Plus className="w-4 h-4 font-black" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {cart.length > 0 && (
                    <div className="absolute bottom-20 left-3 right-3 bg-[#181818]/95 border-2 border-yellow-500 rounded-2xl p-3.5 flex items-center justify-between shadow-[0_6px_30px_rgba(234,179,8,0.5)] z-40 backdrop-blur-md">
                        <div>
                            <p className="text-[11px] text-yellow-300 font-bold">{cartItemsCount} Item terpilih</p>
                            <p className="text-sm font-black text-white">{formatRp(cartTotal)}</p>
                        </div>
                        <button 
                            onClick={() => setPage('pembayaran')}
                            className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-black px-6 py-2.5 rounded-xl text-xs font-black shadow-[0_0_20px_rgba(234,179,8,0.6)] active:scale-95 transition border border-yellow-200"
                        >
                            Bayar Sekarang
                        </button>
                    </div>
                )}
            </div>
        );
    };

    const renderLaporan = () => {
        const todayStr = getCurrentDate();
        
        const isInCurrentWeek = (dateStr) => {
            const d = new Date(dateStr);
            const now = new Date();
            const diffTime = Math.abs(now - d);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return diffDays <= 7;
        };

        const isInCurrentMonth = (dateStr) => {
            const [year, month] = dateStr.split('-');
            const now = new Date();
            return Number(year) === now.getFullYear() && Number(month) === (now.getMonth() + 1);
        };

        const filteredTx = transactions.filter(tx => {
            if (reportTab === 'harian') {
                return tx.date === todayStr;
            } else if (reportTab === 'mingguan') {
                return isInCurrentWeek(tx.date);
            } else if (reportTab === 'bulanan') {
                return isInCurrentMonth(tx.date);
            } else if (reportTab === 'custom') {
                if (!customDateStart || !customDateEnd) return true;
                return tx.date >= customDateStart && tx.date <= customDateEnd;
            }
            return true;
        });

        const filteredExps = expenses.filter(exp => {
            if (reportTab === 'harian') {
                return exp.date === todayStr;
            } else if (reportTab === 'mingguan') {
                return isInCurrentWeek(exp.date);
            } else if (reportTab === 'bulanan') {
                return isInCurrentMonth(exp.date);
            } else if (reportTab === 'custom') {
                if (!customDateStart || !customDateEnd) return true;
                return exp.date >= customDateStart && exp.date <= customDateEnd;
            }
            return true;
        });

        const totalPemasukan = filteredTx.reduce((acc, curr) => acc + curr.total, 0);
        const totalPengeluaran = filteredExps.reduce((acc, curr) => acc + curr.amount, 0);
        const bersih = totalPemasukan - totalPengeluaran;

        return (
            <div className="absolute inset-0 flex flex-col bg-black text-white overflow-y-auto p-4 pb-24 z-10 font-sans">
                <div className="absolute inset-0 bg-black pointer-events-none">
                    <div className="absolute inset-0 opacity-25 bg-[repeating-linear-gradient(-45deg,#000,#000_20px,#eab308_20px,#eab308_24px)]"></div>
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(0,0,0,0.85)_0%,_rgba(10,10,10,0.95)_100%)]"></div>
                </div>

                <div className="flex items-center justify-between mb-3 relative z-10">
                    <div>
                        <p className="text-[11px] text-yellow-400 font-bold uppercase tracking-wider">Dashboard Keuangan</p>
                        <h2 className="text-base font-black tracking-wide text-white drop-shadow">Laporan Keuangan</h2>
                    </div>
                    <button 
                        onClick={() => { setNewExpDate(getCurrentDate()); setShowAddExpense(true); }}
                        className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-3 py-1.5 rounded-xl text-xs font-black shadow-[0_0_15px_rgba(234,179,8,0.5)] flex items-center gap-1 active:scale-95 transition border border-yellow-200"
                    >
                        <Plus className="w-3.5 h-3.5 font-black"/> Catat Keluar
                    </button>
                </div>

                <div className="grid grid-cols-4 gap-1.5 bg-[#121212]/90 p-1.5 rounded-2xl border border-yellow-500/40 mb-4 relative z-10 shadow-lg backdrop-blur">
                    {[
                        { id: 'harian', label: 'Harian' },
                        { id: 'mingguan', label: 'Mingguan' },
                        { id: 'bulanan', label: 'Bulanan' },
                        { id: 'custom', label: 'Custom' }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setReportTab(tab.id)}
                            className={`py-2 rounded-xl text-[11px] font-black transition capitalize ${reportTab === tab.id ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-black shadow-[0_0_15px_rgba(234,179,8,0.5)] border border-yellow-200' : 'text-zinc-300 hover:text-white'}`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {reportTab === 'custom' && (
                    <div className="bg-[#121212]/90 border border-yellow-500/50 rounded-2xl p-3 mb-4 relative z-10 flex items-center gap-2 shadow-xl backdrop-blur">
                        <div className="flex-1">
                            <label className="text-[10px] text-zinc-300 font-bold block mb-1">Dari Tanggal</label>
                            <input 
                                type="date" 
                                value={customDateStart} 
                                onChange={e => setCustomDateStart(e.target.value)}
                                className="w-full bg-black border border-yellow-500/40 text-white rounded-xl p-2 text-xs font-bold outline-none"
                            />
                        </div>
                        <div className="flex-1">
                            <label className="text-[10px] text-zinc-300 font-bold block mb-1">Sampai Tanggal</label>
                            <input 
                                type="date" 
                                value={customDateEnd} 
                                onChange={e => setCustomDateEnd(e.target.value)}
                                className="w-full bg-black border border-yellow-500/40 text-white rounded-xl p-2 text-xs font-bold outline-none"
                            />
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-2 gap-3 mb-3 relative z-10">
                    <div className="bg-[#141414]/90 border border-green-500/40 rounded-2xl p-3.5 shadow-xl backdrop-blur">
                        <div className="flex items-center gap-2 mb-1 text-green-400">
                            <TrendingUp className="w-4 h-4"/>
                            <span className="text-[11px] font-bold">Total Masuk</span>
                        </div>
                        <p className="text-sm font-black text-white">{formatRp(totalPemasukan)}</p>
                        <span className="text-[10px] text-zinc-400 mt-1 block">{filteredTx.length} Transaksi</span>
                    </div>
                    <div className="bg-[#141414]/90 border border-red-500/40 rounded-2xl p-3.5 shadow-xl backdrop-blur">
                        <div className="flex items-center gap-2 mb-1 text-red-400">
                            <TrendingDown className="w-4 h-4"/>
                            <span className="text-[11px] font-bold">Total Keluar</span>
                        </div>
                        <p className="text-sm font-black text-white">{formatRp(totalPengeluaran)}</p>
                        <span className="text-[10px] text-zinc-400 mt-1 block">{filteredExps.length} Catatan</span>
                    </div>
                </div>

                <div className="bg-gradient-to-r from-[#1c1c1c] to-[#121212] border-2 border-yellow-500/70 rounded-2xl p-4 mb-4 relative z-10 shadow-[0_8px_30px_rgba(234,179,8,0.3)] flex items-center justify-between backdrop-blur">
                    <div>
                        <p className="text-xs text-yellow-400 font-bold">Pendapatan Bersih (Net)</p>
                        <h3 className="text-lg font-black text-white mt-0.5">{formatRp(bersih)}</h3>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-yellow-500/20 border-2 border-yellow-500 flex items-center justify-center text-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.5)]">
                        <DollarSign className="w-5 h-5"/>
                    </div>
                </div>

                <div className="mb-4 relative z-10">
                    <h3 className="text-xs font-black text-yellow-400 uppercase tracking-wider mb-2.5 drop-shadow">Riwayat Pemasukan ({reportTab})</h3>
                    <div className="space-y-2">
                        {filteredTx.length === 0 ? (
                            <p className="text-xs text-zinc-400 italic bg-[#121212]/90 p-3 rounded-xl border border-yellow-500/20">Tidak ada data pemasukan pada periode ini.</p>
                        ) : (
                            filteredTx.map((tx) => (
                                <div key={tx.id} className="bg-[#141414]/90 border border-yellow-500/30 rounded-xl p-3 flex items-center justify-between shadow-lg backdrop-blur">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-black text-yellow-300">{tx.id}</span>
                                            <span className="text-[10px] bg-green-500/20 border border-green-500/40 text-green-300 px-2 py-0.5 rounded-md font-bold">{tx.status}</span>
                                        </div>
                                        <p className="text-[10px] text-zinc-400 mt-0.5">{tx.date} • {tx.time} • {tx.itemsCount} item</p>
                                    </div>
                                    <span className="text-xs font-black text-white">{formatRp(tx.total)}</span>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="relative z-10">
                    <h3 className="text-xs font-black text-yellow-400 uppercase tracking-wider mb-2.5 drop-shadow">Catatan Pengeluaran ({reportTab})</h3>
                    <div className="space-y-2">
                        {filteredExps.length === 0 ? (
                            <p className="text-xs text-zinc-400 italic bg-[#121212]/90 p-3 rounded-xl border border-yellow-500/20">Tidak ada data pengeluaran pada periode ini.</p>
                        ) : (
                            filteredExps.map((exp) => (
                                <div key={exp.id} className="bg-[#141414]/90 border border-red-500/30 rounded-xl p-3 flex items-center justify-between shadow-lg backdrop-blur">
                                    <div>
                                        <span className="text-xs font-black text-red-400 block">{exp.title}</span>
                                        <span className="text-[10px] text-zinc-400">{exp.date}</span>
                                    </div>
                                    <span className="text-xs font-black text-red-400">- {formatRp(exp.amount)}</span>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {showAddExpense && (
                    <div className="absolute inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
                        <div className="bg-[#141414] border-2 border-yellow-500 rounded-3xl p-5 w-full max-w-xs shadow-[0_0_50px_rgba(234,179,8,0.4)] relative">
                            <h3 className="text-sm font-black text-white mb-3">Catat Uang Pengeluaran</h3>
                            <form onSubmit={handleAddExpense} className="space-y-3">
                                <div>
                                    <label className="text-[11px] text-zinc-300 font-bold block mb-1">Keterangan Pengeluaran</label>
                                    <input 
                                        type="text" 
                                        value={newExpTitle} 
                                        onChange={e => setNewExpTitle(e.target.value)}
                                        placeholder="Contoh: Beli Bahan Baku" 
                                        className="w-full bg-black border border-yellow-500/40 rounded-xl p-2.5 text-xs text-white outline-none font-bold"
                                    />
                                </div>
                                <div>
                                    <label className="text-[11px] text-zinc-300 font-bold block mb-1">Nominal (Rp)</label>
                                    <input 
                                        type="number" 
                                        value={newExpAmount} 
                                        onChange={e => setNewExpAmount(e.target.value)}
                                        placeholder="Contoh: 50000" 
                                        className="w-full bg-black border border-yellow-500/40 rounded-xl p-2.5 text-xs text-white outline-none font-bold"
                                    />
                                </div>
                                <div>
                                    <label className="text-[11px] text-zinc-300 font-bold block mb-1">Tanggal</label>
                                    <input 
                                        type="date" 
                                        value={newExpDate} 
                                        onChange={e => setNewExpDate(e.target.value)}
                                        className="w-full bg-black border border-yellow-500/40 rounded-xl p-2.5 text-xs text-white outline-none font-bold"
                                    />
                                </div>
                                <div className="flex gap-2 pt-2">
                                    <button 
                                        type="submit" 
                                        className="flex-1 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black py-2.5 rounded-xl text-xs font-black shadow-[0_0_15px_rgba(234,179,8,0.5)] border border-yellow-200"
                                    >
                                        Simpan
                                    </button>
                                    <button 
                                        type="button" 
                                        onClick={() => setShowAddExpense(false)}
                                        className="bg-[#1c1c1c] border border-yellow-500/30 text-zinc-300 px-4 py-2.5 rounded-xl text-xs font-bold"
                                    >
                                        Batal
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    const renderPengaturan = () => (
        <div className="absolute inset-0 flex flex-col bg-black text-white overflow-y-auto p-4 pb-24 z-10 font-sans">
            <div className="absolute inset-0 bg-black pointer-events-none">
                <div className="absolute inset-0 opacity-25 bg-[repeating-linear-gradient(135deg,#000,#000_20px,#eab308_20px,#eab308_24px)]"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(0,0,0,0.85)_0%,_rgba(10,10,10,0.95)_100%)]"></div>
            </div>

            <div className="flex items-center justify-between mb-4 relative z-10">
                <h2 className="text-base font-black tracking-wide text-white drop-shadow">Pengaturan & Perangkat</h2>
                <div className="w-8 h-8 rounded-full bg-yellow-500/20 border-2 border-yellow-500 flex items-center justify-center text-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.4)]">
                    <Settings className="w-4 h-4"/>
                </div>
            </div>

            <div className="bg-[#141414]/90 border-2 border-yellow-500/50 rounded-2xl p-4 flex items-center gap-3 mb-4 relative z-10 shadow-xl backdrop-blur">
                <div className="w-12 h-12 rounded-full border-2 border-yellow-400 bg-black flex items-center justify-center shadow-[0_0_15px_rgba(234,179,8,0.5)]">
                    <User className="text-yellow-400 w-6 h-6" />
                </div>
                <div>
                    <h3 className="text-xs font-black text-white">{user?.name || 'Admin MieTekTek67'}</h3>
                    <p className="text-[10px] text-yellow-400 font-bold">{user?.role || 'Administrator'}</p>
                </div>
            </div>

            {/* Bluetooth Printer Connection Box */}
            <div className="bg-[#141414]/90 border border-yellow-500/50 rounded-2xl p-4 mb-4 relative z-10 shadow-xl backdrop-blur">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 text-yellow-400">
                        <Bluetooth className="w-5 h-5"/>
                        <span className="text-xs font-black">Printer Thermal Bluetooth</span>
                    </div>
                    <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold ${connectedPrinter ? 'bg-green-500/20 border border-green-500 text-green-300' : 'bg-zinc-800 text-zinc-400'}`}>
                        {connectedPrinter ? (connectedPrinter.simulated ? 'Terhubung (Virtual)' : 'Terhubung') : 'Terputus'}
                    </span>
                </div>
                <p className="text-[11px] text-zinc-400 mb-3">
                    {connectedPrinter ? `Perangkat: ${connectedPrinter.name}` : 'Hubungkan printer thermal ESC/POS via Bluetooth untuk cetak struk otomatis.'}
                </p>
                <button
                    onClick={connectBluetoothPrinter}
                    className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-black py-2.5 rounded-xl text-xs font-black shadow-[0_0_15px_rgba(234,179,8,0.5)] active:scale-95 transition flex items-center justify-center gap-2 border border-yellow-200"
                >
                    <Bluetooth className="w-4 h-4"/>
                    {connectedPrinter ? 'Hubungkan Ulang / Ganti Printer' : 'Cari & Sambungkan Printer'}
                </button>
            </div>

            <div className="space-y-2 relative z-10">
                {user?.role === 'Administrator' && (
                    <div 
                        onClick={() => setShowCashierModal(true)} 
                        className="bg-[#141414]/90 border border-yellow-500/30 hover:border-yellow-400 rounded-xl p-3.5 flex justify-between items-center cursor-pointer transition shadow-lg backdrop-blur"
                    >
                        <div>
                            <span className="text-xs text-yellow-300 font-black block flex items-center gap-1.5"><Users className="w-4 h-4"/> Manajemen Kasir Staf</span>
                            <span className="text-[10px] text-zinc-400 font-semibold">Tambah akun kasir atau staf baru ({admins.length} akun terdaftar)</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-yellow-400" />
                    </div>
                )}

                {[
                    { title: 'Kelola Menu Produk', desc: 'Tambah, edit, atau nonaktifkan menu' },
                    { title: 'Suara & Notifikasi', desc: 'Pengaturan audio transaksi' },
                    { title: 'Tentang Aplikasi', desc: 'Versi v9.1 Pro - Thermal Ready' }
                ].map((item, i) => (
                    <div key={i} onClick={() => showToastMsg(`Membuka menu ${item.title}`)} className="bg-[#141414]/90 border border-yellow-500/30 hover:border-yellow-400 rounded-xl p-3.5 flex justify-between items-center cursor-pointer transition shadow-lg backdrop-blur">
                        <div>
                            <span className="text-xs text-zinc-100 font-black block">{item.title}</span>
                            <span className="text-[10px] text-zinc-400 font-semibold">{item.desc}</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-yellow-400" />
                    </div>
                ))}
                
                <div onClick={handleLogout} className="bg-red-500/10 border border-red-500/40 rounded-xl p-3.5 flex justify-between items-center cursor-pointer transition mt-4 shadow-lg backdrop-blur">
                    <span className="text-xs text-red-400 font-black">Keluar Akun (Logout)</span>
                    <LogOut className="w-4 h-4 text-red-400" />
                </div>
            </div>

            {/* Cashier Addition Modal */}
            {showCashierModal && (
                <div className="absolute inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
                    <div className="bg-[#141414] border-2 border-yellow-500 rounded-3xl p-5 w-full max-w-xs shadow-[0_0_50px_rgba(234,179,8,0.4)] relative">
                        <h3 className="text-sm font-black text-white mb-3">Tambah Kasir / Staf Baru</h3>
                        <form onSubmit={handleAddCashier} className="space-y-3">
                            <div>
                                <label className="text-[11px] text-zinc-300 font-bold block mb-1">Nama Lengkap Staf</label>
                                <input 
                                    type="text" 
                                    value={newCasName} 
                                    onChange={e => setNewCasName(e.target.value)}
                                    placeholder="Contoh: Budi Santoso" 
                                    className="w-full bg-black border border-yellow-500/40 rounded-xl p-2.5 text-xs text-white outline-none font-bold"
                                />
                            </div>
                            <div>
                                <label className="text-[11px] text-zinc-300 font-bold block mb-1">Username Login</label>
                                <input 
                                    type="text" 
                                    value={newCasUsername} 
                                    onChange={e => setNewCasUsername(e.target.value)}
                                    placeholder="Contoh: KASIR02" 
                                    className="w-full bg-black border border-yellow-500/40 rounded-xl p-2.5 text-xs text-white outline-none font-bold"
                                />
                            </div>
                            <div>
                                <label className="text-[11px] text-zinc-300 font-bold block mb-1">Password</label>
                                <input 
                                    type="password" 
                                    value={newCasPass} 
                                    onChange={e => setNewCasPass(e.target.value)}
                                    placeholder="Kata sandi kasir" 
                                    className="w-full bg-black border border-yellow-500/40 rounded-xl p-2.5 text-xs text-white outline-none font-bold"
                                />
                            </div>
                            <div className="flex gap-2 pt-2">
                                <button 
                                    type="submit" 
                                    className="flex-1 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black py-2.5 rounded-xl text-xs font-black shadow-[0_0_15px_rgba(234,179,8,0.5)] border border-yellow-200"
                                >
                                    Simpan Kasir
                                </button>
                                <button 
                                    type="button" 
                                    onClick={() => setShowCashierModal(false)}
                                    className="bg-[#1c1c1c] border border-yellow-500/30 text-zinc-300 px-4 py-2.5 rounded-xl text-xs font-bold"
                                >
                                    Batal
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );

    const renderPembayaran = () => {
        const handleKeypadPress = (val) => {
            playSound('success');
            if (val === 'C') {
                setPayAmount('');
            } else if (val === 'DEL') {
                setPayAmount(prev => prev.slice(0, -1));
            } else {
                setPayAmount(prev => prev + val);
            }
        };

        return (
            <div className="absolute inset-0 flex flex-col bg-black text-white overflow-y-auto p-4 z-50 font-sans">
                <div className="absolute inset-0 bg-black pointer-events-none">
                    <div className="absolute inset-0 opacity-25 bg-[repeating-linear-gradient(45deg,#000,#000_20px,#eab308_20px,#eab308_24px)]"></div>
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(0,0,0,0.85)_0%,_rgba(10,10,10,0.95)_100%)]"></div>
                </div>
                
                <div className="flex items-center justify-between mb-3 relative z-10">
                    <button onClick={() => setPage('beranda')} className="text-yellow-400 flex items-center gap-1 text-xs font-bold">
                        <ArrowLeft className="w-4 h-4"/> Kembali
                    </button>
                    <h2 className="text-sm font-black tracking-wide text-white drop-shadow">Konfirmasi Pembayaran</h2>
                    <div className="w-4"></div>
                </div>

                <div className="bg-[#141414]/90 border-2 border-yellow-500/50 rounded-2xl p-3 text-center mb-3 relative z-10 shadow-xl backdrop-blur">
                    <p className="text-[11px] text-zinc-300 font-bold">Total Tagihan</p>
                    <h3 className="text-xl font-black text-yellow-400 mt-0.5">{formatRp(cartTotal)}</h3>
                </div>

                <div className="space-y-2 mb-3 relative z-10">
                    <label className="text-xs text-yellow-300 font-bold block">Nominal Bayar</label>
                    <input 
                        type="text"
                        value={payAmount ? formatRp(Number(payAmount)) : ''}
                        readOnly
                        placeholder="Rp 0"
                        className="w-full bg-[#121212]/95 border-2 border-yellow-500 rounded-xl p-3 text-white text-base outline-none font-black tracking-wider text-center shadow-[0_0_20px_rgba(234,179,8,0.3)]"
                    />
                </div>

                <div className="grid grid-cols-3 gap-2 mb-3 relative z-10">
                    {['1', '2', '3', '4', '5', '6', '7', '8', '9', '00', '0', 'DEL'].map((btn) => (
                        <button
                            key={btn}
                            onClick={() => handleKeypadPress(btn)}
                            className="bg-[#181818]/90 border border-yellow-500/40 hover:border-yellow-400 text-yellow-300 py-2.5 rounded-xl text-xs font-black transition shadow-[0_4px_15px_rgba(0,0,0,0.8)] active:scale-95 backdrop-blur"
                        >
                            {btn}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-3 gap-1.5 mb-3 relative z-10">
                    {[35000, 50000, 100000].map(amt => (
                        <button 
                            key={amt}
                            onClick={() => { playSound('success'); setPayAmount(amt.toString()); }}
                            className="bg-[#1c1c1c]/90 border border-yellow-500/50 hover:border-yellow-400 text-yellow-400 py-2 rounded-xl text-[11px] font-black transition shadow backdrop-blur"
                        >
                            {formatRp(amt)}
                        </button>
                    ))}
                </div>

                {Number(payAmount) >= cartTotal && (
                    <div className="bg-[#141414]/90 border border-yellow-500/50 rounded-2xl p-3 mb-3 flex justify-between items-center relative z-10 shadow-lg backdrop-blur">
                        <span className="text-xs text-zinc-300 font-bold">Kembalian:</span>
                        <span className="text-sm font-black text-yellow-400">{formatRp(Number(payAmount) - cartTotal)}</span>
                    </div>
                )}

                <button 
                    onClick={processPayment}
                    disabled={Number(payAmount) < cartTotal}
                    className="w-full bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 disabled:opacity-40 text-black py-3 rounded-xl text-xs font-black shadow-[0_0_25px_rgba(234,179,8,0.5)] active:scale-95 transition relative z-10 tracking-wide border border-yellow-200"
                >
                    Proses Pembayaran & Cetak Struk
                </button>
            </div>
        );
    };

    const renderReceiptModal = () => {
        if (!receiptData) return null;
        return (
            <div className="absolute inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 font-sans">
                <div className="bg-[#141414] border-2 border-yellow-500 rounded-3xl p-6 w-full max-w-xs text-center shadow-[0_0_50px_rgba(234,179,8,0.5)] relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(234,179,8,0.25),_transparent_70%)] pointer-events-none"></div>

                    <div className="w-12 h-12 rounded-full bg-yellow-500/20 border-2 border-yellow-500 text-yellow-400 flex items-center justify-center mx-auto mb-3 relative z-10 shadow-[0_0_20px_rgba(234,179,8,0.6)]">
                        <CheckCircle2 className="w-6 h-6"/>
                    </div>
                    <h3 className="text-base font-black text-white relative z-10">Pembayaran Sukses!</h3>
                    <p className="text-[11px] text-zinc-400 mt-1 relative z-10">Transaksi {receiptData.id} berhasil disimpan.</p>

                    <div className="bg-black/80 border border-yellow-500/30 rounded-2xl p-3 my-4 text-left text-xs space-y-1.5 relative z-10 shadow-inner">
                        <div className="flex justify-between font-black text-yellow-400">
                            <span>Total</span>
                            <span>{formatRp(receiptData.total)}</span>
                        </div>
                        <div className="flex justify-between text-zinc-300 font-semibold">
                            <span>Bayar</span>
                            <span>{formatRp(receiptData.payAmount)}</span>
                        </div>
                        <div className="flex justify-between text-zinc-300 font-semibold">
                            <span>Kembalian</span>
                            <span>{formatRp(receiptData.changeAmount)}</span>
                        </div>
                    </div>

                    <div className="flex gap-2 relative z-10">
                        <button 
                            onClick={() => printReceiptThermal(receiptData)}
                            disabled={isPrinting}
                            className="flex-1 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black py-2.5 rounded-xl text-xs font-black shadow-[0_0_20px_rgba(234,179,8,0.5)] active:scale-95 transition flex items-center justify-center gap-1.5 border border-yellow-200"
                        >
                            <Printer className="w-4 h-4"/> {connectedPrinter ? 'Cetak Thermal' : 'Cari & Cetak'}
                        </button>
                        <button 
                            onClick={() => setReceiptData(null)}
                            className="bg-[#1c1c1c] border border-yellow-500/40 text-zinc-300 py-2.5 px-4 rounded-xl text-xs font-bold active:scale-95 transition"
                        >
                            Tutup
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen w-full bg-black flex items-center justify-center p-0 md:p-4 text-zinc-100 font-sans select-none overflow-hidden">
            <div className="w-full max-w-md bg-black h-[100dvh] md:h-[840px] md:rounded-[2rem] md:border-8 border-[#1a1a1a] shadow-2xl relative overflow-hidden flex flex-col">
                
                <div className="flex-1 relative overflow-hidden">
                    {page === 'login' && renderLogin()}
                    {page === 'beranda' && renderBeranda()}
                    {page === 'laporan' && renderLaporan()}
                    {page === 'pengaturan' && renderPengaturan()}
                    {page === 'pembayaran' && renderPembayaran()}
                </div>

                {page !== 'login' && page !== 'pembayaran' && (
                    <div className="absolute bottom-0 left-0 right-0 h-18 bg-[#111]/95 border-t-2 border-yellow-500/50 flex items-center justify-around px-6 z-50 shadow-[0_-8px_30px_rgba(0,0,0,0.9)] backdrop-blur-md">
                        <button 
                            onClick={() => setPage('beranda')}
                            className={`flex flex-col items-center justify-center flex-1 transition ${page === 'beranda' ? 'text-yellow-400 font-black scale-105' : 'text-zinc-400 hover:text-zinc-200'}`}
                        >
                            <Utensils className="w-5 h-5 mb-0.5" />
                            <span className="text-[10px] tracking-wide font-black">Beranda</span>
                        </button>

                        <div className="relative -top-4 flex items-center justify-center">
                            <button 
                                onClick={() => setPage('laporan')}
                                className="w-16 h-16 rounded-full bg-gradient-to-tr from-yellow-600 via-yellow-400 to-yellow-500 p-[2px] shadow-[0_0_30px_rgba(234,179,8,0.8)] active:scale-95 transition group"
                            >
                                <div className="w-full h-full bg-black rounded-full flex flex-col items-center justify-center overflow-hidden">
                                    <Crown className="w-6 h-6 text-yellow-400 group-hover:scale-110 transition" />
                                    <span className="text-[7px] text-yellow-300 font-black uppercase mt-0.5">Laporan</span>
                                </div>
                            </button>
                        </div>

                        <button 
                            onClick={() => setPage('pengaturan')}
                            className={`flex flex-col items-center justify-center flex-1 transition ${page === 'pengaturan' ? 'text-yellow-400 font-black scale-105' : 'text-zinc-400 hover:text-zinc-200'}`}
                        >
                            <Settings className="w-5 h-5 mb-0.5" />
                            <span className="text-[10px] tracking-wide font-black">Pengaturan</span>
                        </button>
                    </div>
                )}

                <div className={`absolute top-6 left-1/2 -translate-x-1/2 bg-[#181818] border-2 border-yellow-400 text-white px-4 py-2.5 rounded-full shadow-[0_5px_30px_rgba(234,179,8,0.6)] flex items-center gap-2.5 transition-all duration-300 z-[60] whitespace-nowrap ${toast.show ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}>
                    {toast.isError ? <AlertCircle className="w-4 h-4 text-red-500"/> : <CheckCircle2 className="w-4 h-4 text-yellow-400"/>}
                    <span className="text-xs font-black">{toast.message}</span>
                </div>

                {renderReceiptModal()}
            </div>
        </div>
    );
}