import { useState, useEffect, useRef, FormEvent } from 'react';
import {
  Shield,
  Terminal as TerminalIcon,
  Settings,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Search,
  Bookmark,
  BookOpen,
  Cpu,
  Globe,
  Activity,
  Volume2,
  VolumeX,
  Info,
  Play,
  Square,
  Trash2,
  Lock,
  Wifi,
  Smartphone,
  ChevronRight,
  Sliders,
  Database,
  SearchCode,
  ExternalLink,
  Key,
  Users,
  WifiOff,
  MapPin,
  Eye,
  EyeOff,
  Radio,
  RefreshCw,
  Send,
  HelpCircle,
  Hash,
  FileText
} from 'lucide-react';
import {
  INITIAL_NETWORK_NODES,
  OWASP_VULNERABILITIES,
  HYGIENE_TIPS,
  BRUTE_FORCE_SIMULATION,
  PORT_SCAN_SIMULATION,
  DDOS_SIMULATION
} from './data';
import { NetworkNode, TelemetryLog, DefenseSettings, OwaspVulnerability, HygieneTip, SimulationStep } from './types';

export default function App() {
  // --- Workspace Navigation State ---
  const [activeTab, setActiveTab] = useState<'soc' | 'flipper' | 'attack' | 'admin'>('soc');

  // --- Brand & Global State ---
  const [nodes, setNodes] = useState<NetworkNode[]>(INITIAL_NETWORK_NODES);
  const [selectedNode, setSelectedNode] = useState<NetworkNode | null>(INITIAL_NETWORK_NODES[2]); // Default: SCADA Energy Node
  const [logs, setLogs] = useState<TelemetryLog[]>([
    { id: 'log-1', timestamp: new Date().toLocaleTimeString(), message: 'Jozef Cyber Mind Security - Terminal işə salındı.', type: 'info' },
    { id: 'log-2', timestamp: new Date().toLocaleTimeString(), message: 'SOC Mərkəzi aktivləşdirildi. Şəbəkə düyümləri qoşulub.', type: 'success' },
    { id: 'log-3', timestamp: new Date().toLocaleTimeString(), message: 'Şifrələnmiş Quantum Firewall müdafiəsi (192.168.1.1) 100% aktivdir.', type: 'success' },
    { id: 'log-4', timestamp: new Date().toLocaleTimeString(), message: 'Flipper Zero interaktiv emulyatoru qoşuldu.', type: 'info' }
  ]);
  const [logsPaused, setLogsPaused] = useState<boolean>(false);
  const [defense, setDefense] = useState<DefenseSettings>({
    ddosScrubbing: false,
    geoIPBlocking: true,
    deepPacketInspection: false
  });

  // --- Audio Engine ---
  const [isMuted, setIsMuted] = useState<boolean>(() => {
    const saved = localStorage.getItem('kiber_muted');
    return saved ? JSON.parse(saved) : false;
  });

  // --- Matrix Effect Toggle ---
  const [showMatrix, setShowMatrix] = useState<boolean>(true);

  // --- Clock ---
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');

  // --- Modals ---
  const [showAboutModal, setShowAboutModal] = useState<boolean>(false);

  // --- References & Library (Owasp + tips) ---
  const [tips, setTips] = useState<HygieneTip[]>(() => {
    const saved = localStorage.getItem('kiber_bookmarks');
    if (saved) {
      const bookmarkedIds: string[] = JSON.parse(saved);
      return HYGIENE_TIPS.map(tip => ({
        ...tip,
        bookmarked: bookmarkedIds.includes(tip.id)
      }));
    }
    return HYGIENE_TIPS;
  });
  const [tipFilter, setTipFilter] = useState<'all' | 'şifrə' | 'şəbəkə' | 'cihaz' | 'bookmarked'>('all');
  const [owaspSearch, setOwaspSearch] = useState<string>('');
  const [selectedOwasp, setSelectedOwasp] = useState<OwaspVulnerability>(OWASP_VULNERABILITIES[0]);

  // --- DOM References ---
  const terminalEndRef = useRef<HTMLDivElement | null>(null);
  const simTimeoutRef = useRef<number | null>(null);
  const matrixCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // --- FIPPER ZERO EMULATOR STATES ---
  const [flipperScreen, setFlipperScreen] = useState<'main' | 'subghz' | 'nfc' | 'badusb' | 'infrared' | 'dolphin' | 'result'>('dolphin');
  const [flipperDolphinState, setFlipperDolphinState] = useState<'happy' | 'coding' | 'scanning' | 'sad'>('happy');
  const [flipperMenuIndex, setFlipperMenuIndex] = useState<number>(0);
  const [flipperLog, setFlipperLog] = useState<string[]>([
    'Jozef Dolphin v1.4',
    'Status: Hazır',
    'Lvl 42 Hack-Giga'
  ]);
  const [flipperActionProgress, setFlipperActionProgress] = useState<number>(0);
  const [flipperIsRunning, setFlipperIsRunning] = useState<boolean>(false);
  const [flipperSelectedFrequency, setFlipperSelectedFrequency] = useState<string>('433.92 MHz');
  const [flipperClonedCode, setFlipperClonedCode] = useState<string | null>(null);

  const flipperMenuItems = [
    { id: 'dolphin', label: '🐬 Jozef Dolphin' },
    { id: 'subghz', label: '📡 Sub-GHz Radio' },
    { id: 'nfc', label: '🎴 RFID/NFC Reader' },
    { id: 'badusb', label: '⌨️ BadUSB Payloads' },
    { id: 'infrared', label: '🔌 Infrared Remote' }
  ];

  // --- ATTACK SIMULATOR STATES ---
  // A. WiFi Hacking
  const [wifiTarget, setWifiTarget] = useState<string>('Baku_SOC_HQ_Secure');
  const [wifiMethod, setWifiMethod] = useState<'dictionary' | 'wps'>('dictionary');
  const [wifiStatus, setWifiStatus] = useState<'idle' | 'handshake' | 'cracking' | 'cracked' | 'failed'>('idle');
  const [wifiProgress, setWifiProgress] = useState<number>(0);
  const [wifiCrackedPass, setWifiCrackedPass] = useState<string>('');
  const [wifiLogs, setWifiLogs] = useState<string[]>([]);

  // B. IP Config & Location Tracer
  const [ipInput, setIpInput] = useState<string>('194.135.152.12');
  const [ipTraceDetails, setIpTraceDetails] = useState<{
    status: 'idle' | 'tracing' | 'ready';
    isp: string;
    city: string;
    country: string;
    lat: number;
    lng: number;
    hops: string[];
    ports: number[];
  }>({
    status: 'idle',
    isp: 'Dövlət Şəbəkə Provayderi',
    city: 'Bakı',
    country: 'Azərbaycan',
    lat: 40.4093,
    lng: 49.8671,
    hops: [],
    ports: []
  });

  // C. DDoS Attack panel
  const [ddosTarget, setDdosTarget] = useState<string>('194.135.152.12');
  const [ddosType, setDdosType] = useState<'HTTP_FLOOD' | 'SYN_FLOOD' | 'UDP_STORM'>('HTTP_FLOOD');
  const [ddosThreads, setDdosThreads] = useState<number>(120);
  const [ddosStatus, setDdosStatus] = useState<'idle' | 'flooding'>('idle');
  const [ddosPPS, setDdosPPS] = useState<number>(0);
  const [ddosLoad, setDdosLoad] = useState<number>(0);
  const [ddosChartData, setDdosChartData] = useState<number[]>(new Array(15).fill(0));

  // D. Data Storage / Hash Dump simulation
  const [hashInput, setHashInput] = useState<string>('cbf5214811b707d31a810c326e0b2f15'); // md5 for "password123"
  const [hashStatus, setHashStatus] = useState<'idle' | 'dumping' | 'cracking' | 'success' | 'failed'>('idle');
  const [hashResult, setHashResult] = useState<string>('');
  const [hashProgress, setHashProgress] = useState<number>(0);

  // --- ADMIN PORTAL & SECURITY OVERRIDE STATES ---
  const [adminUsername, setAdminUsername] = useState<string>('');
  const [adminPassword, setAdminPassword] = useState<string>('');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);
  const [adminError, setAdminError] = useState<string | null>(null);
  
  // Custom interactive admin terminal commands
  const [terminalInputValue, setTerminalInputValue] = useState<string>('');
  const [adminTerminalOutputs, setAdminTerminalOutputs] = useState<string[]>([
    '==================================================',
    'JOZEF CYBER MIND SECURITY - SƏLAHIYYƏTLİ LOGİN UĞURLU',
    'Sistem: Linux kernel 6.1.12-quantum-amd64',
    'Kömək üçün "help" yazıb ENTER sıxın.',
    '=================================================='
  ]);

  // Simulated Harvested Credentials
  const [harvestedCreds, setHarvestedCreds] = useState([
    { id: 1, user: 'sysadmin', email: 'admin@gov.az', passRaw: 'Jozef_Secure_2026', ip: '194.135.152.10', origin: 'SCADA Damping' },
    { id: 2, user: 'f_aliyeva', email: 'f.aliyeva@fin.portal', passRaw: 'Aliyeva99_!', ip: '81.17.88.5', origin: 'Maliyyə Phishing' },
    { id: 3, user: 'doctor_t', email: 't.memmedov@tibb.shabake', passRaw: 'BakuDoctor321', ip: '85.117.112.20', origin: 'Tibb DB Dump' },
    { id: 4, user: 'edu_mod', email: 'moderator@edu.gov.az', passRaw: 'EduPass#44', ip: '217.64.17.11', origin: 'WPA2 Handshake' }
  ]);

  // --- Matrix Rain Effect ---
  useEffect(() => {
    if (!showMatrix || !matrixCanvasRef.current) return;
    const canvas = matrixCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = 120);

    const handleResize = () => {
      width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.height = 120;
    };
    window.addEventListener('resize', handleResize);

    const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$%^&*()_+{}|:<>?-=[]\\';
    const fontSize = 10;
    const columns = Math.floor(width / fontSize) + 1;
    const rainDrops = Array(columns).fill(1);

    const draw = () => {
      ctx.fillStyle = 'rgba(8, 11, 17, 0.15)';
      ctx.fillRect(0, 0, width, height);

      // We mix green and orange codes for the hacker cyber look
      ctx.fillStyle = 'rgba(16, 185, 129, 0.45)'; // emerald
      ctx.font = fontSize + 'px monospace';

      for (let i = 0; i < rainDrops.length; i++) {
        const text = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
        const x = i * fontSize;
        const y = rainDrops[i] * fontSize;

        // Randomly make some characters orange for brand highlight
        if (Math.random() > 0.95) {
          ctx.fillStyle = 'rgba(249, 115, 22, 0.8)'; // orange accent
        } else {
          ctx.fillStyle = 'rgba(16, 185, 129, 0.45)';
        }

        ctx.fillText(text, x, y);

        if (y > height && Math.random() > 0.975) {
          rainDrops[i] = 0;
        }
        rainDrops[i]++;
      }
      animationFrameId = requestAnimationFrame(draw);
    };

    animationFrameId = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [showMatrix, activeTab]);

  // --- Clock Sync ---
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('az-AZ', { hour12: false }));
      setCurrentDate(now.toLocaleDateString('az-AZ', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // --- Logs Auto Scroll ---
  useEffect(() => {
    if (terminalEndRef.current && !logsPaused) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, logsPaused]);

  // --- Active DDoS graph visualizer update ---
  useEffect(() => {
    if (ddosStatus === 'flooding') {
      const interval = setInterval(() => {
        // Random fluctuate PPS (Packets per second) around selected threads
        const basePPS = ddosThreads * 14500;
        const fluctuation = (Math.random() * 0.2 - 0.1) * basePPS;
        const currentPPSValue = Math.round(basePPS + fluctuation);
        setDdosPPS(currentPPSValue);

        // Network Bandwidth Gbps estimation
        const loadEst = Number(((currentPPSValue * 1500 * 8) / 1000000000).toFixed(2));
        setDdosLoad(loadEst);

        // Update charts array
        setDdosChartData(prev => {
          const next = [...prev.slice(1), currentPPSValue];
          return next;
        });

        // Add trace log random
        if (Math.random() > 0.6) {
          addLog(`[DDoS Attack] ${currentPPSValue.toLocaleString()} PPS göndərildi -> Hədəf: ${ddosTarget}`, 'warning');
        }
      }, 800);
      return () => clearInterval(interval);
    } else {
      setDdosPPS(0);
      setDdosLoad(0);
    }
  }, [ddosStatus, ddosThreads, ddosTarget]);

  // --- Background Node Variations ---
  useEffect(() => {
    const interval = setInterval(() => {
      setNodes(prevNodes =>
        prevNodes.map(node => {
          if (node.id === 'node-local') return node;

          const change = Math.floor(Math.random() * 3) - 1;
          const newShield = Math.max(10, Math.min(100, node.shield + change));

          let newStatus = node.status;
          if (Math.random() > 0.85) {
            if (newShield < 55) {
              newStatus = 'risk';
            } else if (newShield > 80) {
              newStatus = 'defended';
            } else {
              newStatus = 'active';
            }
          }

          return {
            ...node,
            shield: newShield,
            status: newStatus
          };
        })
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // --- Synth Sound Engine ---
  const triggerAudio = (freq: number, type: OscillatorType, duration: number) => {
    if (isMuted) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

      gainNode.gain.setValueAtTime(0.04, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      console.warn('Audio feedback blocked by browser policies.', e);
    }
  };

  // --- Global Log Adding ---
  const addLog = (message: string, type: 'info' | 'warning' | 'success' | 'error' = 'info') => {
    const newLog: TelemetryLog = {
      id: `log-${Date.now()}-${Math.random()}`,
      timestamp: new Date().toLocaleTimeString('az-AZ', { hour12: false }),
      message,
      type
    };
    setLogs(prev => {
      const trimmed = prev.length > 80 ? prev.slice(prev.length - 80) : prev;
      return [...trimmed, newLog];
    });
  };

  // --- Toggle Defense ---
  const handleDefenseToggle = (key: keyof DefenseSettings) => {
    const newValue = !defense[key];
    setDefense(prev => ({ ...prev, [key]: newValue }));

    const names: Record<keyof DefenseSettings, string> = {
      ddosScrubbing: 'Jozef Anti-DDoS Təmizləmə Mərkəzi',
      geoIPBlocking: 'Region-Lock IP Bloklama',
      deepPacketInspection: 'DPI (Həssas Paket Müfəttişi)'
    };

    if (newValue) {
      addLog(`${names[key]} aktivləşdirildi. Şəbəkə zireh gücləndi.`, 'success');
      triggerAudio(600, 'sine', 0.1);
    } else {
      addLog(`${names[key]} söndürüldü! İnfrastruktur təhdidə açıqdır.`, 'error');
      triggerAudio(220, 'sawtooth', 0.2);
    }
  };

  // --- Bookmark tips ---
  const toggleBookmark = (id: string) => {
    setTips(prevTips => {
      const updated = prevTips.map(tip => {
        if (tip.id === id) {
          const isBookmarked = !tip.bookmarked;
          triggerAudio(isBookmarked ? 680 : 320, 'sine', 0.1);
          return { ...tip, bookmarked: isBookmarked };
        }
        return tip;
      });
      const bookmarkedIds = updated.filter(t => t.bookmarked).map(t => t.id);
      localStorage.setItem('kiber_bookmarks', JSON.stringify(bookmarkedIds));
      return updated;
    });
  };

  // --- Sound Toggle ---
  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    localStorage.setItem('kiber_muted', JSON.stringify(nextMuted));
    if (!nextMuted) {
      setTimeout(() => { triggerAudio(600, 'sine', 0.1); }, 50);
    }
  };

  // --- FLIPPER ZERO INTERACTIVE KEYPAD NAV ---
  const handleFlipperKeypad = (action: 'up' | 'down' | 'left' | 'right' | 'ok' | 'back') => {
    triggerAudio(720, 'triangle', 0.05);

    if (flipperIsRunning) {
      setFlipperLog(prev => [...prev, 'Yüklənir, xahiş olunur gözləyin...']);
      return;
    }

    if (action === 'back') {
      setFlipperScreen('main');
      setFlipperDolphinState('happy');
      setFlipperActionProgress(0);
      setFlipperLog(['Menu geri qaytarıldı.', 'Jozef Dolphin hazırdır.']);
      return;
    }

    if (flipperScreen === 'dolphin') {
      if (action === 'ok') {
        setFlipperScreen('main');
        setFlipperMenuIndex(0);
        setFlipperLog(['Əsas Menu yükləndi.', 'İstədiyiniz modulu seçin.']);
      }
      return;
    }

    if (flipperScreen === 'main') {
      if (action === 'up') {
        setFlipperMenuIndex(prev => (prev > 0 ? prev - 1 : flipperMenuItems.length - 1));
      } else if (action === 'down') {
        setFlipperMenuIndex(prev => (prev < flipperMenuItems.length - 1 ? prev + 1 : 0));
      } else if (action === 'ok') {
        const selectedId = flipperMenuItems[flipperMenuIndex].id;
        setFlipperScreen(selectedId as any);
        setFlipperActionProgress(0);

        if (selectedId === 'dolphin') {
          setFlipperLog(['Dolphin rejimindədir.', 'Aktiv status: Lvl 42']);
        } else if (selectedId === 'subghz') {
          setFlipperLog(['Sub-GHz Modulu tapıldı.', 'Tezlik seçib OK sıxın.', 'Aktiv: 433.92 MHz']);
        } else if (selectedId === 'nfc') {
          setFlipperLog(['NFC Modulu qoşulub.', 'RFID (125kHz) / NFC', 'Yaxınlaşdırıb OK sıxın.']);
        } else if (selectedId === 'badusb') {
          setFlipperLog(['BadUSB virtual klaviatura', 'Skript siyahısı mövcuddur.', 'İcra üçün OK sıxın.']);
        } else if (selectedId === 'infrared') {
          setFlipperLog(['İnfraqırmızı pult emulyatoru', 'Siqnal göndərmək üçün', 'İstiqamət seçin və OK sıxın']);
        }
      }
      return;
    }

    // Interactive screen inputs
    if (flipperScreen === 'subghz') {
      if (action === 'left' || action === 'right') {
        const freq = flipperSelectedFrequency === '433.92 MHz' ? '868.35 MHz' : '433.92 MHz';
        setFlipperSelectedFrequency(freq);
        setFlipperLog(prev => [...prev, `Seçilən Tezlik: ${freq}`]);
      } else if (action === 'ok') {
        setFlipperIsRunning(true);
        setFlipperDolphinState('scanning');
        setFlipperLog([`Skan edilir: ${flipperSelectedFrequency}...`, 'Siqnal axtarılır...']);

        // Run progress animation
        let prog = 0;
        const interval = setInterval(() => {
          prog += 10;
          setFlipperActionProgress(prog);
          if (prog >= 100) {
            clearInterval(interval);
            setFlipperIsRunning(false);
            setFlipperDolphinState('happy');
            const fakeCode = `KEYFOB_CLONE_${Math.floor(Math.random() * 900000 + 100000)}`;
            setFlipperClonedCode(fakeCode);
            setFlipperLog([
              'Skan TAMAMLANDI!',
              '----------------',
              `Tezlik: ${flipperSelectedFrequency}`,
              `Tapılan Kod: ${fakeCode}`,
              'Saxlamaq üçün OK sıxın.'
            ]);
            addLog(`[Flipper Zero] ${flipperSelectedFrequency} tezliyində açar kopyalandı! Kod: ${fakeCode}`, 'success');
          }
        }, 150);
      }
      return;
    }

    if (flipperScreen === 'nfc') {
      if (action === 'ok') {
        setFlipperIsRunning(true);
        setFlipperDolphinState('scanning');
        setFlipperLog(['NFC RFID Skaneri aktivdir...', 'Kart/Teq yaxınlaşdırın...', 'Yoxlanılır (13.56MHz)...']);

        let prog = 0;
        const interval = setInterval(() => {
          prog += 20;
          setFlipperActionProgress(prog);
          if (prog >= 100) {
            clearInterval(interval);
            setFlipperIsRunning(false);
            setFlipperDolphinState('happy');
            const uid = `0F ${Math.floor(Math.random() * 89 + 10)} ${Math.floor(Math.random() * 89 + 10)} CF`;
            setFlipperLog([
              'KART OXUNDU!',
              '================',
              'Protokol: MIFARE Classic',
              `UID: ${uid}`,
              'Kart kopyalandı. Hazırdır.'
            ]);
            addLog(`[Flipper Zero] RFID/NFC kart kopyalandı. UID: ${uid}`, 'success');
          }
        }, 200);
      }
      return;
    }

    if (flipperScreen === 'badusb') {
      if (action === 'ok') {
        setFlipperIsRunning(true);
        setFlipperDolphinState('coding');
        setFlipperLog(['BadUSB Payload başladılır...', 'Klaviatura emulyasiyası...', 'Skript: keystroke_inject.dd']);

        let prog = 0;
        const interval = setInterval(() => {
          prog += 10;
          setFlipperActionProgress(prog);
          if (prog === 30) {
            setFlipperLog(prev => [...prev, 'Terminal açılır (GUI + R)...']);
          } else if (prog === 60) {
            setFlipperLog(prev => [...prev, 'Kod yazılır: echo "Hacked by Jozef"']);
          } else if (prog === 90) {
            setFlipperLog(prev => [...prev, 'Səlahiyyətlər yüksəldilir...']);
          }

          if (prog >= 100) {
            clearInterval(interval);
            setFlipperIsRunning(false);
            setFlipperDolphinState('happy');
            setFlipperLog([
              'Skript İcra Edildi!',
              '===================',
              'Payload: Jozef CyberMind',
              'Status: UĞURLU',
              'Şəbəkə qovşağına sızıldı.'
            ]);
            addLog('[Flipper Zero] BadUSB payload hədəf kompüterdə icra edildi: admin səlahiyyəti alındı.', 'success');
          }
        }, 250);
      }
      return;
    }

    if (flipperScreen === 'infrared') {
      if (action === 'ok') {
        setFlipperIsRunning(true);
        setFlipperLog(['İnfraqırmızı siqnal göndərilir...', 'Tezlik: 38kHz NEC protokolu', 'Güc: Maksimum']);
        triggerAudio(880, 'sine', 0.3);

        setTimeout(() => {
          setFlipperIsRunning(false);
          setFlipperLog([
            'Siqnal Emisiyası Uğurlu',
            '====================',
            'Hədəf: Virtual TV / Gate',
            'Nəticə: Signal Sent OK'
          ]);
          addLog('[Flipper Zero] İnfraqırmızı pult emulyasiyası ilə siqnal göndərildi (Gate/TV OFF).', 'info');
        }, 800);
      }
    }
  };

  // --- ATTACK WIZARD 1: WIFI PASSWORD DECODER ---
  const startWifiCracking = () => {
    if (wifiStatus === 'handshake' || wifiStatus === 'cracking') return;

    setWifiStatus('handshake');
    setWifiProgress(10);
    setWifiLogs(['[WiFi Lab] Monitor rejimində başlatma...', `Hədəf SSID: ${wifiTarget}`, 'Kanallar daranır...']);
    triggerAudio(450, 'sawtooth', 0.1);

    setTimeout(() => {
      setWifiProgress(35);
      setWifiLogs(prev => [...prev, 'Hədəf şəbəkədən WPA2 Handshake ələ keçirildi!', 'Arayış: Deautentifikasiya hücumu uğurlu.']);
      triggerAudio(550, 'sawtooth', 0.1);

      setTimeout(() => {
        setWifiStatus('cracking');
        setWifiLogs(prev => [...prev, 'Sözlük hücumu başladıldı: rockyou.txt...', 'Saniyədə 850 şifrə sınanır...']);

        let crackProg = 35;
        const interval = setInterval(() => {
          crackProg += 5;
          setWifiProgress(crackProg);
          
          const fakePasses = ['12345678', 'baku2015', 'azerbaycan', 'password', 'jozef123', 'cybermind99'];
          const tryingPass = fakePasses[Math.floor(Math.random() * fakePasses.length)];
          setWifiLogs(prev => [...prev, `Daxil edilir: ${tryingPass} -> Uğursuz`]);

          if (crackProg >= 100) {
            clearInterval(interval);
            setWifiStatus('cracked');
            const passResult = wifiTarget === 'Baku_SOC_HQ_Secure' ? 'JozefCyberMind2026!' : 'Baku_Wifi_Qonaq_123';
            setWifiCrackedPass(passResult);
            setWifiLogs(prev => [
              ...prev,
              '=======================================',
              'ŞİFRƏ UĞURLA TAPILDI!',
              `Şəbəkə: ${wifiTarget}`,
              `Təhlükəsizlik: WPA2-PSK [AES]`,
              `Dekod olunmuş Şifrə: ${passResult}`,
              '======================================='
            ]);
            addLog(`[WiFi Crack] ${wifiTarget} şəbəkə şifrəsi tapıldı: ${passResult}`, 'success');
            triggerAudio(880, 'sine', 0.3);
          }
        }, 200);

      }, 1500);

    }, 1500);
  };

  // --- ATTACK WIZARD 2: IP TRACER & WHOIS CONFIG ---
  const runIpTracer = () => {
    setIpTraceDetails(prev => ({ ...prev, status: 'tracing' }));
    addLog(`[IP Tracer] ${ipInput} ünvanı üçün kəşfiyyat aparılır...`, 'info');
    triggerAudio(400, 'sine', 0.1);

    setTimeout(() => {
      const isLocal = ipInput.startsWith('192.168');
      const hopsList = isLocal 
        ? ['192.168.1.1 (Sizin Router)', '192.168.100.1 (ISP Gateway)', 'Yerli Loopback']
        : [`10.0.0.1 (Milli Gateway)`, `213.172.91.1 (Delta Telecom)`, `81.17.88.1 (AzTelekom)`, `${ipInput} (Target)`];

      const portsList = isLocal ? [80, 443] : [21, 22, 80, 443, 3389, 4840];

      setIpTraceDetails({
        status: 'ready',
        isp: isLocal ? 'Yerli Ev Şəbəkəsi' : 'Delta Telecom Azerbaijan',
        city: 'Bakı',
        country: 'Azərbaycan',
        lat: 40.4093,
        lng: 49.8671,
        hops: hopsList,
        ports: portsList
      });

      addLog(`[IP Tracer] WHOIS və Port skan tamamlandı. Tapılan açıq portlar: ${portsList.join(', ')}`, 'success');
      triggerAudio(600, 'sine', 0.2);
    }, 1500);
  };

  // --- ATTACK WIZARD 3: DDOS FLODD TOGGLE ---
  const toggleDdosFlood = () => {
    if (ddosStatus === 'flooding') {
      setDdosStatus('idle');
      addLog(`[DDoS Attack] DDoS hücumu dayandırıldı. Trafik normala dönür.`, 'info');
      triggerAudio(300, 'sawtooth', 0.2);
    } else {
      setDdosStatus('flooding');
      addLog(`[DDoS Attack] DDoS hücumu hədəfə başladıldı: ${ddosTarget} (${ddosType})`, 'warning');
      triggerAudio(120, 'sawtooth', 0.4);
    }
  };

  // --- ATTACK WIZARD 4: HASH DECRYPTOR ---
  const decryptHash = () => {
    setHashStatus('dumping');
    setHashProgress(10);
    triggerAudio(450, 'sine', 0.08);

    setTimeout(() => {
      setHashStatus('cracking');
      setHashProgress(45);
      
      let prog = 45;
      const interval = setInterval(() => {
        prog += 15;
        setHashProgress(prog);
        if (prog >= 100) {
          clearInterval(interval);
          setHashStatus('success');
          const decrypted = hashInput === 'cbf5214811b707d31a810c326e0b2f15' ? 'password123' : `jozef_admin_${Math.floor(Math.random() * 900 + 100)}`;
          setHashResult(decrypted);
          addLog(`[Hash Crack] MD5 hash dekod edildi. Nəticə: ${decrypted}`, 'success');
          triggerAudio(880, 'sine', 0.2);
        }
      }, 200);

    }, 1200);
  };

  // --- ADMIN PORTAL LOGIN / LOGOUT ---
  const handleAdminLogin = (e: FormEvent) => {
    e.preventDefault();
    // Safe mock login for developer aesthetic bypass. Users can enter username "admin" and password "admin"
    if (adminUsername.toLowerCase() === 'admin' && adminPassword.toLowerCase() === 'admin') {
      setIsAdminLoggedIn(true);
      setAdminError(null);
      addLog('Yüksək imtiyazlı administrator konsoluna giriş edildi!', 'success');
      triggerAudio(880, 'sine', 0.25);
    } else {
      setAdminError('Daxil edilən istifadəçi adı və ya şifrə yanlışdır! (İpucu: admin / admin)');
      triggerAudio(150, 'sawtooth', 0.4);
    }
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    setAdminUsername('');
    setAdminPassword('');
    addLog('Administrator panelindən çıxış edildi.', 'info');
    triggerAudio(400, 'triangle', 0.1);
  };

  // Interactive admin terminal command processor
  const handleTerminalSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!terminalInputValue.trim()) return;

    const cmd = terminalInputValue.trim().toLowerCase();
    const newOutputs = [...adminTerminalOutputs, `root@jozef-cybermind:~# ${terminalInputValue}`];

    if (cmd === 'help') {
      newOutputs.push(
        'Mövcud Komandalar:',
        '  help      - Kömək menyusunu göstərir',
        '  clear     - Terminalı təmizləyir',
        '  whoami    - Cari istifadəçi səlahiyyəti',
        '  nodes     - Azərbaycan SOC düyümlərinin siyahısı',
        '  nmap      - Hədəf portların skan simulyasiyası',
        '  exploit   - Təhlükəsiz sınaq exploitini işə salır',
        '  ddos      - DDoS statusunu yoxlayır',
        '  creds     - Harvested (sızdırılmış) şifrələri oxuyur'
      );
      triggerAudio(600, 'sine', 0.05);
    } else if (cmd === 'clear') {
      setAdminTerminalOutputs([]);
      setTerminalInputValue('');
      return;
    } else if (cmd === 'whoami') {
      newOutputs.push('Səlahiyyətli İstifadəçi: root (Jozef Cyber Mind Security)');
    } else if (cmd === 'nodes') {
      nodes.forEach(node => {
        newOutputs.push(` -> [${node.id}] ${node.name} | IP: ${node.ip} | Qalxan: ${node.shield}%`);
      });
    } else if (cmd === 'nmap') {
      newOutputs.push(
        'Nmap skan başladıldı (IP: 194.135.152.12)...',
        'Port 21/tcp  OPEN  ftp',
        'Port 22/tcp  OPEN  ssh (OpenSSH 8.4p1)',
        'Port 80/tcp  OPEN  http (nginx 1.18.0)',
        'Port 443/tcp OPEN  https (SSL Cert Valid)',
        'Skan tamamlandı: 1 IP ünvanı aktivdir.'
      );
    } else if (cmd === 'exploit') {
      newOutputs.push(
        'Exploit yüklənir [CVE-2026-6180] Buffer Overflow...',
        'Hədəf yaddaş bloku doldurulur (Payload size: 1024 bytes)...',
        'Nəticə: SƏLAHIYYƏT ALINDI. Shell yaradıldı: /bin/bash -i'
      );
      addLog('Admin Konsolu vasitəsilə test exploiti uğurla sınaqdan keçirildi!', 'warning');
      triggerAudio(900, 'sawtooth', 0.2);
    } else if (cmd === 'ddos') {
      newOutputs.push(
        `DDoS Server Statusu: ${ddosStatus === 'flooding' ? 'HÜCUM REJİMİNDƏ' : 'HAZIR / GÖZLƏMƏDƏ'}`,
        `Cari PPS: ${ddosPPS.toLocaleString()} paket/saniyə`,
        `Aktiv Botların Sayı: ~12,500 unikal zombi`
      );
    } else if (cmd === 'creds') {
      newOutputs.push('Yaddaşda olan sızdırılmış sınaq şifrələri:');
      harvestedCreds.forEach(c => {
        newOutputs.push(` -> User: ${c.user} | E-poçt: ${c.email} | Şifrə: ${c.passRaw} | Metod: ${c.origin}`);
      });
    } else {
      newOutputs.push(`XƏTA: "${cmd}" komandası tapılmadı. Mövcud komandalar üçün "help" yazın.`);
      triggerAudio(150, 'sawtooth', 0.1);
    }

    setAdminTerminalOutputs(newOutputs);
    setTerminalInputValue('');
  };

  return (
    <div className="min-h-screen bg-[#060913] text-slate-100 flex flex-col font-mono selection:bg-orange-500/30 selection:text-orange-400">
      
      {/* --- FLOATING MATRIX CANVAS (HACKER ATMOSPHERE) --- */}
      {showMatrix && (
        <div className="absolute top-0 left-0 right-0 h-[120px] pointer-events-none z-0 overflow-hidden opacity-30">
          <canvas ref={matrixCanvasRef} className="w-full h-full" />
        </div>
      )}

      {/* --- HEADER BLOCK --- */}
      <header className="relative border-b border-emerald-500/20 bg-slate-950/80 backdrop-blur-md px-4 py-4 z-10 shadow-lg">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-4">
          
          {/* Logo & Jozef Signature */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 animate-pulse">
              <Shield className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-widest text-emerald-400">
                  JOZEF CYBER MIND SECURITY
                </h1>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-orange-500/10 text-orange-400 border border-orange-500/20">
                  DEVELOPER / HACKING LAB
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Təhlükəsiz Sınaq Simulyatoru &amp; Kiber Müdafiə Tədris Platforması
              </p>
            </div>
          </div>

          {/* Controls, Sound & Clock */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {/* Live Clock */}
            <div className="bg-slate-900 border border-slate-800 rounded px-3 py-1 text-center hidden sm:block">
              <span className="text-orange-500 text-xs font-bold font-mono tracking-widest block">{currentTime}</span>
              <span className="text-[9px] text-slate-500 block">{currentDate}</span>
            </div>

            {/* Matrix rain toggle */}
            <button
              onClick={() => setShowMatrix(!showMatrix)}
              className={`px-2.5 py-1.5 rounded text-[10px] font-bold border transition-all ${
                showMatrix 
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                  : 'bg-slate-900 border-slate-800 text-slate-500'
              }`}
              title="Matrix Kod Yağışını Aktivləşdir/Deaktivləşdir"
            >
              MATRIX FON
            </button>

            {/* Mute Toggle */}
            <button
              onClick={toggleMute}
              className={`p-2 rounded border transition-all ${
                isMuted 
                  ? 'bg-slate-900 border-slate-800 text-slate-500' 
                  : 'bg-orange-500/10 border-orange-500/30 text-orange-400 hover:bg-orange-500/20'
              }`}
              title={isMuted ? 'Səsi Aktiv Et' : 'Səsi Söndür'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {/* Info modal trigger */}
            <button
              onClick={() => setShowAboutModal(true)}
              className="p-2 rounded border border-slate-800 bg-slate-900/60 hover:bg-slate-900 text-slate-400 hover:text-slate-200 transition-all"
            >
              <Info className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* --- MAIN NAVIGATION --- */}
        <div className="max-w-7xl mx-auto mt-4 pt-4 border-t border-slate-900 flex flex-wrap gap-1.5 justify-center md:justify-start">
          <button
            onClick={() => { setActiveTab('soc'); triggerAudio(440, 'sine', 0.05); }}
            className={`px-3 py-1.5 rounded text-xs font-bold transition-all flex items-center gap-1.5 border ${
              activeTab === 'soc' 
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                : 'bg-slate-900/40 border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Globe className="w-3.5 h-3.5" /> 🛰️ CYBER SOC HUB
          </button>
          
          <button
            onClick={() => { setActiveTab('flipper'); triggerAudio(520, 'sine', 0.05); }}
            className={`px-3 py-1.5 rounded text-xs font-bold transition-all flex items-center gap-1.5 border ${
              activeTab === 'flipper' 
                ? 'bg-orange-500/10 border-orange-500/30 text-orange-400' 
                : 'bg-slate-900/40 border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5 animate-bounce-slow" /> 🐬 FLIPPER ZERO LAB
          </button>

          <button
            onClick={() => { setActiveTab('attack'); triggerAudio(580, 'sine', 0.05); }}
            className={`px-3 py-1.5 rounded text-xs font-bold transition-all flex items-center gap-1.5 border ${
              activeTab === 'attack' 
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-400' 
                : 'bg-slate-900/40 border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" /> 🔥 ATTACK &amp; TOOLS
          </button>

          <button
            onClick={() => { setActiveTab('admin'); triggerAudio(650, 'sine', 0.05); }}
            className={`px-3 py-1.5 rounded text-xs font-bold transition-all flex items-center gap-1.5 border ${
              activeTab === 'admin' 
                ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' 
                : 'bg-slate-900/40 border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Lock className="w-3.5 h-3.5" /> 🔐 ADMIN CONSOLE {isAdminLoggedIn && '🔓'}
          </button>
        </div>
      </header>

      {/* --- WORKSPACES MAIN AREA --- */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 space-y-6 z-10">

        {/* ==========================================
            TAB 1: CYBER SOC HUB (Milli Monitorinq)
           ========================================== */}
        {activeTab === 'soc' && (
          <div className="space-y-6">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* SOC Nodes Panel */}
              <section className="lg:col-span-5 flex flex-col bg-slate-950/60 border border-emerald-500/10 rounded-xl p-5 shadow-xl backdrop-blur-sm">
                <div className="flex items-center justify-between mb-4 border-b border-slate-900 pb-3">
                  <div className="flex items-center gap-2">
                    <Globe className="text-emerald-400 w-5 h-5" />
                    <h2 className="text-sm font-bold text-slate-100 uppercase tracking-widest">Azərbaycan SOC Düyümləri</h2>
                  </div>
                  <span className="text-[9px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                    CANLI (LIVE)
                  </span>
                </div>

                <p className="text-xs text-slate-400 mb-4">
                  Dövlət və infrastruktur qovşaqlarının simulyasiya edilmiş təhlükəsizlik statusu. Üzərinə klikləyərək analiz aparın.
                </p>

                {/* Nodes rendering */}
                <div className="space-y-2.5 flex-1 overflow-y-auto max-h-[380px] pr-1 scrollbar">
                  {nodes.map(node => {
                    const isSelected = selectedNode?.id === node.id;
                    let statusLabel = 'Müdafiəli';
                    let statusColorClass = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';

                    if (node.status === 'risk') {
                      statusLabel = 'Təhlükədə';
                      statusColorClass = 'text-rose-400 bg-rose-500/10 border-rose-500/20 animate-pulse';
                    } else if (node.status === 'active') {
                      statusLabel = 'Aktiv';
                      statusColorClass = 'text-amber-400 bg-amber-500/10 border-amber-500/20';
                    }

                    return (
                      <div
                        key={node.id}
                        onClick={() => {
                          setSelectedNode(node);
                          triggerAudio(480, 'sine', 0.05);
                        }}
                        className={`p-3 rounded-lg border cursor-pointer transition-all ${
                          isSelected 
                            ? 'bg-slate-900 border-emerald-500/40 shadow-inner' 
                            : 'bg-slate-950/40 border-slate-900 hover:border-slate-800'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-xs text-white truncate max-w-[200px]">{node.name}</span>
                          <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded border uppercase ${statusColorClass}`}>
                            {statusLabel}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-[11px] text-slate-500 font-mono">
                          <span>IP: {node.ip}</span>
                          <span className="text-slate-300">Zireh: <strong className="text-slate-100">{node.shield}%</strong></span>
                        </div>
                        
                        {/* Power bar */}
                        <div className="w-full h-1 bg-slate-900 rounded-full mt-2 overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-700 ${
                              node.shield > 80 ? 'bg-emerald-500' : node.shield > 55 ? 'bg-amber-500' : 'bg-rose-500'
                            }`}
                            style={{ width: `${node.shield}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Node details */}
                {selectedNode && (
                  <div className="mt-4 p-3 bg-slate-900/60 border border-slate-800 rounded-lg">
                    <span className="text-[9px] font-mono font-bold text-orange-400 block mb-1">SINAQ ANALİZİ:</span>
                    <h3 className="text-xs font-bold text-white mb-1">{selectedNode.name}</h3>
                    <p className="text-[11px] text-slate-400 leading-relaxed mb-2">{selectedNode.description}</p>
                    <div className="border-t border-slate-800 pt-2 flex justify-between text-[10px] font-mono text-slate-500">
                      <span>Son Hadisə:</span>
                      <span className="text-emerald-400">{selectedNode.lastEvent}</span>
                    </div>
                  </div>
                )}
              </section>

              {/* Central Logs Terminal */}
              <section className="lg:col-span-7 flex flex-col bg-slate-950/60 border border-emerald-500/10 rounded-xl p-5 shadow-xl backdrop-blur-sm h-[480px] lg:h-auto">
                <div className="flex items-center justify-between mb-4 border-b border-slate-900 pb-3">
                  <div className="flex items-center gap-2">
                    <TerminalIcon className="text-emerald-400 w-5 h-5 animate-pulse" />
                    <h2 className="text-sm font-bold text-slate-100 uppercase tracking-widest">SOC Telemetriya və Log Axını</h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setLogsPaused(!logsPaused)}
                      className={`px-2 py-0.5 rounded text-[10px] font-mono border transition-all ${
                        logsPaused 
                          ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' 
                          : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      {logsPaused ? 'PAUSED' : 'LIVE'}
                    </button>
                    <button
                      onClick={() => { setLogs([]); triggerAudio(300, 'sine', 0.1); }}
                      className="p-1 rounded bg-slate-900 border border-slate-800 text-slate-500 hover:text-red-400 transition-all"
                      title="Clear terminal"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex-1 bg-slate-950 border border-slate-900 rounded-lg p-3 overflow-y-auto font-mono text-[11px] space-y-1 scrollbar">
                  {logs.map(log => {
                    let logColor = 'text-slate-300';
                    let mark = '[*]';

                    if (log.type === 'error') {
                      logColor = 'text-rose-400';
                      mark = '[!]';
                    } else if (log.type === 'warning') {
                      logColor = 'text-amber-400';
                      mark = '[!]';
                    } else if (log.type === 'success') {
                      logColor = 'text-emerald-400';
                      mark = '[✔]';
                    }

                    return (
                      <div key={log.id} className="leading-normal hover:bg-slate-900/40 px-1 py-0.5 rounded">
                        <span className="text-slate-600 mr-2">[{log.timestamp}]</span>
                        <span className={`${logColor} font-bold mr-1.5`}>{mark}</span>
                        <span className={logColor}>{log.message}</span>
                      </div>
                    );
                  })}
                  <div ref={terminalEndRef} />
                </div>

                <div className="mt-3 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                  <span>Delta Telecom milliy internet loopback qoşuludur.</span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Saniyəlik loq axını
                  </span>
                </div>
              </section>

            </div>

            {/* Quick Defense settings */}
            <section className="bg-slate-950/60 border border-emerald-500/10 rounded-xl p-5 shadow-xl">
              <div className="flex items-center gap-2 mb-4 border-b border-slate-900 pb-3">
                <Sliders className="text-emerald-400 w-5 h-5" />
                <h2 className="text-sm font-bold text-slate-100 uppercase tracking-widest">Sürətli Təhlükəsizlik Divarı Parametrləri</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Scrubbing */}
                <div className="p-3.5 bg-slate-900/40 border border-slate-800 rounded-lg flex items-start justify-between gap-3">
                  <div className="space-y-0.5">
                    <h3 className="text-xs font-bold text-white">DDoS Təmizləmə (Scrubbing)</h3>
                    <p className="text-[10px] text-slate-500 leading-relaxed">Hücum zamanı zərərli bot paketlərini süzərək serverləri ayaqda saxlayır.</p>
                  </div>
                  <button
                    onClick={() => handleDefenseToggle('ddosScrubbing')}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                      defense.ddosScrubbing ? 'bg-emerald-500' : 'bg-slate-800'
                    }`}
                  >
                    <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-slate-950 shadow transition duration-200 ease-in-out ${
                      defense.ddosScrubbing ? 'translate-x-4' : 'translate-x-0'
                    }`} />
                  </button>
                </div>

                {/* GeoIP */}
                <div className="p-3.5 bg-slate-900/40 border border-slate-800 rounded-lg flex items-start justify-between gap-3">
                  <div className="space-y-0.5">
                    <h3 className="text-xs font-bold text-white">Regional Geo-IP Qadağası</h3>
                    <p className="text-[10px] text-slate-500 leading-relaxed">Azərbaycan xaricindən gələn şübhəli kənar sorğuları dərhal rədd edir.</p>
                  </div>
                  <button
                    onClick={() => handleDefenseToggle('geoIPBlocking')}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                      defense.geoIPBlocking ? 'bg-emerald-500' : 'bg-slate-800'
                    }`}
                  >
                    <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-slate-950 shadow transition duration-200 ease-in-out ${
                      defense.geoIPBlocking ? 'translate-x-4' : 'translate-x-0'
                    }`} />
                  </button>
                </div>

                {/* DPI */}
                <div className="p-3.5 bg-slate-900/40 border border-slate-800 rounded-lg flex items-start justify-between gap-3">
                  <div className="space-y-0.5">
                    <h3 className="text-xs font-bold text-white">Deep Packet Inspection (DPI)</h3>
                    <p className="text-[10px] text-slate-500 leading-relaxed">Paket daxilindəki məlumatları analiz edib SQL inyeksiyalarını aşkarlayır.</p>
                  </div>
                  <button
                    onClick={() => handleDefenseToggle('deepPacketInspection')}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                      defense.deepPacketInspection ? 'bg-emerald-500' : 'bg-slate-800'
                    }`}
                  >
                    <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-slate-950 shadow transition duration-200 ease-in-out ${
                      defense.deepPacketInspection ? 'translate-x-4' : 'translate-x-0'
                    }`} />
                  </button>
                </div>

              </div>
            </section>

          </div>
        )}

        {/* ==========================================
            TAB 2: FLIPPER ZERO LAB (Məsafədən Hücum & Radio)
           ========================================== */}
        {activeTab === 'flipper' && (
          <div className="space-y-6">
            
            <div className="bg-slate-950/60 border border-orange-500/20 rounded-xl p-5 shadow-xl">
              <div className="flex items-center gap-2 mb-2 border-b border-slate-900 pb-3">
                <Smartphone className="text-orange-500 w-5 h-5 animate-pulse" />
                <h2 className="text-sm font-bold text-white uppercase tracking-widest">Flipper Zero Interaktiv Laboratoriyası</h2>
              </div>
              <p className="text-xs text-slate-400 max-w-3xl leading-relaxed">
                Bu bölmədə <strong>by Jozef Cyber Mind Security</strong> tərəfindən dizayn edilmiş Flipper Zero handheld kiber cihazı ilə radio dalğaların skan edilməsi, RFID kartların kopyalanması və BadUSB virtual klaviatura skriptlərinin hədəf sistemə yeridilməsini simulyasiya edə bilərsiniz.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center justify-center">
              
              {/* Left Column: Device Mockup */}
              <div className="lg:col-span-6 flex justify-center">
                
                {/* Physical Flipper Shell */}
                <div className="w-[340px] h-[210px] bg-slate-850 rounded-[28px] border-4 border-slate-700 shadow-2xl relative p-4 flex flex-col justify-between select-none">
                  
                  {/* Silicone protective case design style */}
                  <div className="absolute inset-0 border-2 border-orange-500 rounded-[24px] pointer-events-none opacity-80" />
                  
                  {/* Outer design markings */}
                  <div className="absolute top-2 left-6 text-[8px] font-bold text-slate-500 tracking-wider">
                    FLIPPER ZERO BY JOZEF
                  </div>
                  <div className="absolute top-2 right-6 flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                    {/* Led indicator */}
                    <span className={`w-1.5 h-1.5 rounded-full transition-all ${flipperIsRunning ? 'bg-red-500 animate-ping' : 'bg-green-500'}`} />
                  </div>

                  {/* High fidelity retro Screen Panel */}
                  <div className="h-[105px] w-full bg-[#f97316]/90 rounded-lg border-2 border-slate-950 p-2 text-slate-950 font-mono text-[10px] flex flex-col justify-between shadow-inner">
                    
                    {/* Screen content */}
                    {flipperScreen === 'dolphin' && (
                      <div className="flex-1 flex flex-col justify-between">
                        <div className="flex justify-between border-b border-slate-950/20 pb-0.5 text-[9px] font-bold">
                          <span>🐬 JOZEF DOLPHIN</span>
                          <span>LVL 42</span>
                        </div>
                        <div className="flex items-center gap-3 my-1">
                          {/* Pixel art style dolphin rendering */}
                          <div className="text-base">🐬</div>
                          <div className="space-y-0.5 text-[8px]">
                            <p className="font-bold">"Salamatlıqdı qardaş?"</p>
                            <p>Kiber keşikdəyəm.</p>
                            <p className="text-slate-900/60">OK düyməsini sıxın.</p>
                          </div>
                        </div>
                        <div className="text-[8px] flex justify-between bg-slate-950 text-orange-400 px-1 py-0.2 rounded font-bold">
                          <span>TEZLİK: 433MHz</span>
                          <span>BAT: 100%</span>
                        </div>
                      </div>
                    )}

                    {flipperScreen === 'main' && (
                      <div className="flex-1 flex flex-col justify-between">
                        <div className="border-b border-slate-950/20 pb-0.5 text-[8px] font-bold flex justify-between">
                          <span>ƏSAS MENYU</span>
                          <span>{flipperMenuIndex + 1}/{flipperMenuItems.length}</span>
                        </div>
                        <div className="my-1 space-y-0.5 text-[9px]">
                          {flipperMenuItems.map((item, i) => (
                            <div key={item.id} className={`px-1 rounded flex justify-between ${flipperMenuIndex === i ? 'bg-slate-950 text-[#f97316]' : ''}`}>
                              <span>{item.label}</span>
                              {flipperMenuIndex === i && <span>◄</span>}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {flipperScreen === 'subghz' && (
                      <div className="flex-1 flex flex-col justify-between">
                        <div className="border-b border-slate-950/20 pb-0.5 text-[8px] font-bold flex justify-between">
                          <span>SUB-GHz RADIO</span>
                          <span>OK - Skan</span>
                        </div>
                        <div className="my-1 text-[9px] space-y-1">
                          <p className="font-bold">Tezlik: {flipperSelectedFrequency}</p>
                          <p className="text-[8px] text-slate-900/70">◄ Seçmək üçün Sol/Sağ ►</p>
                          {flipperActionProgress > 0 && (
                            <div className="w-full h-1.5 bg-slate-900/30 rounded overflow-hidden">
                              <div className="h-full bg-slate-950" style={{ width: `${flipperActionProgress}%` }} />
                            </div>
                          )}
                        </div>
                        <div className="text-[8px] font-bold text-right text-slate-900/60">Sol/Sağ: Dəyiş</div>
                      </div>
                    )}

                    {flipperScreen === 'nfc' && (
                      <div className="flex-1 flex flex-col justify-between">
                        <div className="border-b border-slate-950/20 pb-0.5 text-[8px] font-bold">
                          <span>🎴 RFID/NFC OXUYUCU</span>
                        </div>
                        <div className="my-1 text-[9px] space-y-1">
                          <p>RFID 125kHz və ya NFC 13.56MHz teqləri kopyalamaq üçün düyməni klikləyin.</p>
                          {flipperActionProgress > 0 && (
                            <div className="w-full h-1.5 bg-slate-900/30 rounded overflow-hidden">
                              <div className="h-full bg-slate-950" style={{ width: `${flipperActionProgress}%` }} />
                            </div>
                          )}
                        </div>
                        <p className="text-[8px] text-right font-bold text-slate-900/60">OK: Kartı Skan Et</p>
                      </div>
                    )}

                    {flipperScreen === 'badusb' && (
                      <div className="flex-1 flex flex-col justify-between">
                        <div className="border-b border-slate-950/20 pb-0.5 text-[8px] font-bold">
                          <span>⌨️ BAD-USB PAYLOADS</span>
                        </div>
                        <div className="my-1 text-[9px] space-y-1">
                          <p className="font-bold">Skript: powershell_inject.dd</p>
                          <p className="text-[8px]">Bu sınaq skripti hədəf kompüterdə dərhal qorunan konsol açır.</p>
                          {flipperActionProgress > 0 && (
                            <div className="w-full h-1.5 bg-slate-900/30 rounded overflow-hidden">
                              <div className="h-full bg-slate-950" style={{ width: `${flipperActionProgress}%` }} />
                            </div>
                          )}
                        </div>
                        <p className="text-[8px] text-right font-bold text-slate-900/60">OK: İcra Et</p>
                      </div>
                    )}

                    {flipperScreen === 'infrared' && (
                      <div className="flex-1 flex flex-col justify-between">
                        <div className="border-b border-slate-950/20 pb-0.5 text-[8px] font-bold">
                          <span>🔌 INFRARED REMOTE</span>
                        </div>
                        <div className="my-1 text-[9px]">
                          <p>TV, Qapı və ya xarici sənaye pultlarının siqnal kopyalanması simulyasiyası.</p>
                          <p className="font-bold text-[8px] mt-1">Siqnal: TV_POWER_NEC</p>
                        </div>
                        <p className="text-[8px] text-right font-bold text-slate-900/60">OK: Şüa Göndər</p>
                      </div>
                    )}

                  </div>

                  {/* Physical Buttons Panel */}
                  <div className="flex justify-between items-center px-4 mt-2 h-[60px]">
                    
                    {/* Back Button (Circle left) */}
                    <button
                      onClick={() => handleFlipperKeypad('back')}
                      className="w-8 h-8 rounded-full bg-slate-700 border-2 border-slate-600 hover:bg-slate-600 active:scale-95 flex items-center justify-center text-slate-300 font-bold text-xs"
                      title="Geri"
                    >
                      ↩
                    </button>

                    {/* D-Pad (Up, Down, Left, Right, OK) */}
                    <div className="relative w-24 h-24 flex items-center justify-center">
                      <div className="absolute inset-0 bg-slate-800 rounded-full border-2 border-slate-700" />
                      
                      {/* Navigation buttons inside the circle */}
                      <button
                        onClick={() => handleFlipperKeypad('up')}
                        className="absolute top-0.5 left-1/2 -translate-x-1/2 w-6 h-5 hover:text-orange-500 font-bold text-xs"
                        title="Up"
                      >
                        ▲
                      </button>
                      <button
                        onClick={() => handleFlipperKeypad('down')}
                        className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-6 h-5 hover:text-orange-500 font-bold text-xs"
                        title="Down"
                      >
                        ▼
                      </button>
                      <button
                        onClick={() => handleFlipperKeypad('left')}
                        className="absolute left-0.5 top-1/2 -translate-y-1/2 w-5 h-6 hover:text-orange-500 font-bold text-xs"
                        title="Left"
                      >
                        ◀
                      </button>
                      <button
                        onClick={() => handleFlipperKeypad('right')}
                        className="absolute right-0.5 top-1/2 -translate-y-1/2 w-5 h-6 hover:text-orange-500 font-bold text-xs"
                        title="Right"
                      >
                        ▶
                      </button>
                      
                      {/* OK Button */}
                      <button
                        onClick={() => handleFlipperKeypad('ok')}
                        className="w-7 h-7 rounded-full bg-[#f97316] hover:bg-orange-600 active:scale-90 text-slate-950 font-bold text-[10px] border border-slate-950 z-10 flex items-center justify-center"
                        title="OK"
                      >
                        OK
                      </button>
                    </div>

                  </div>

                </div>

              </div>

              {/* Right Column: Flipper Serial Output logs */}
              <div className="lg:col-span-6 space-y-4">
                
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-3 border-b border-slate-900 pb-2">
                    <TerminalIcon className="text-orange-500 w-4 h-4" />
                    <h3 className="text-xs font-bold text-slate-100 uppercase tracking-widest">Flipper CLI Konsol Çıxışı</h3>
                  </div>

                  <div className="h-[200px] bg-[#05070c] border border-slate-900 rounded p-3 font-mono text-xs text-orange-400 overflow-y-auto space-y-1">
                    <p className="text-slate-600">[~] Serial connection established over COM4...</p>
                    {flipperLog.map((log, i) => (
                      <p key={i} className="leading-relaxed">
                        <span className="text-slate-500">&gt;&gt;</span> {log}
                      </p>
                    ))}
                  </div>

                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => {
                        setFlipperScreen('dolphin');
                        setFlipperDolphinState('happy');
                        setFlipperActionProgress(0);
                        setFlipperLog(['Sistem yenidən yükləndi.', 'Jozef Dolphin v1.4']);
                        triggerAudio(600, 'triangle', 0.1);
                      }}
                      className="px-3 py-1.5 rounded bg-slate-900 border border-slate-800 hover:border-orange-500/40 text-slate-300 hover:text-white text-xs transition-all flex items-center gap-1.5"
                    >
                      <RefreshCw className="w-3.5 h-3.5" /> Flipperi Sıfırla
                    </button>
                  </div>
                </div>

                {/* Educational Alert */}
                <div className="p-4 bg-orange-500/5 border border-orange-500/10 rounded-xl leading-relaxed text-xs">
                  <h4 className="font-bold text-orange-400 mb-1 flex items-center gap-1.5">
                    <Info className="w-4 h-4" /> Flipper Zero Nədir?
                  </h4>
                  <p className="text-slate-400">
                    Flipper Zero kiber təhlükəsizlik mütəxəssisləri üçün hazırlanmış portativ multi-cihazdır. Radio tezliklərini (məs. pult siqnalları), NFC/RFID çiplərini və infraqırmızı şüaları analiz etmək məqsədilə yaradılmışdır. Tətbiqdəki bu emulyator cihazın kiber strukturlara təsir mexanizmini əyani göstərən zərərsiz vizual layihədir.
                  </p>
                </div>

              </div>

            </div>

          </div>
        )}

        {/* ==========================================
            TAB 3: ATTACK & TOOLS (Simulyasiya & Dekod)
           ========================================== */}
        {activeTab === 'attack' && (
          <div className="space-y-6 animate-fadeIn">
            
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              
              {/* DDoS Attack Panel */}
              <section className="bg-slate-950/60 border border-rose-500/20 rounded-xl p-5 shadow-xl">
                <div className="flex items-center justify-between mb-4 border-b border-slate-900 pb-3">
                  <div className="flex items-center gap-2">
                    <Radio className="text-rose-500 w-5 h-5 animate-pulse" />
                    <h2 className="text-sm font-bold text-white uppercase tracking-widest">DDoS Simulyasiya Paneli</h2>
                  </div>
                  <span className="text-[9px] font-bold text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/20">
                    DDoS ATTACKER v2
                  </span>
                </div>

                <p className="text-xs text-slate-400 mb-4">
                  Sınaq məqsədilə hədəf serverin IP ünvanını daxil edib unikal HTTP/UDP botnet paket axınını simulyasiya edin.
                </p>

                <div className="space-y-3.5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 block mb-1">HƏDƏF IP ÜNVANI</label>
                      <input
                        type="text"
                        value={ddosTarget}
                        onChange={(e) => setDdosTarget(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-rose-500"
                        placeholder="Məsələn: 194.135.152.12"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 block mb-1">HÜCUM METODU</label>
                      <select
                        value={ddosType}
                        onChange={(e: any) => setDdosType(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1.5 text-xs text-white focus:outline-none focus:border-rose-500"
                      >
                        <option value="HTTP_FLOOD">HTTP GET Flood (Botnet)</option>
                        <option value="SYN_FLOOD">TCP SYN Overflow</option>
                        <option value="UDP_STORM">UDP Storm (Amplification)</option>
                      </select>
                    </div>
                  </div>

                  {/* Threads Slider */}
                  <div>
                    <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1">
                      <span>İPAZİLƏNƏN THREAD (İŞÇİ POTENSIAL):</span>
                      <span className="text-rose-400">{ddosThreads} Zombi Bot</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="500"
                      value={ddosThreads}
                      onChange={(e) => setDdosThreads(Number(e.target.value))}
                      className="w-full accent-rose-500"
                    />
                  </div>

                  {/* Trigger buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={toggleDdosFlood}
                      className={`flex-1 py-2 rounded text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                        ddosStatus === 'flooding'
                          ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse'
                          : 'bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400'
                      }`}
                    >
                      {ddosStatus === 'flooding' ? (
                        <>
                          <Square className="w-3.5 h-3.5" /> DDoS-U DAYANDIR
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5" /> DDoS HÜCUMU BAŞLAT
                        </>
                      )}
                    </button>
                  </div>

                  {/* DDoS Status Indicators */}
                  {ddosStatus === 'flooding' && (
                    <div className="p-3 bg-[#05070c] border border-rose-500/20 rounded-lg space-y-2">
                      <div className="grid grid-cols-2 gap-2 text-center">
                        <div className="p-2 bg-slate-900 rounded">
                          <span className="text-[9px] text-slate-500 block">PAKET SUTETİ (PPS)</span>
                          <span className="text-rose-400 text-sm font-bold font-mono tracking-widest">
                            {ddosPPS.toLocaleString()}
                          </span>
                        </div>
                        <div className="p-2 bg-slate-900 rounded">
                          <span className="text-[9px] text-slate-500 block">ŞƏBƏKƏ YÜKÜ (BANDWIDTH)</span>
                          <span className="text-rose-400 text-sm font-bold font-mono">
                            {ddosLoad} Gbps
                          </span>
                        </div>
                      </div>

                      {/* Sparkline chart */}
                      <div className="h-10 flex items-end gap-1 px-2 border-b border-slate-900 pt-2">
                        {ddosChartData.map((val, idx) => {
                          const max = Math.max(...ddosChartData) || 1;
                          const heightPercent = Math.min(100, Math.round((val / max) * 100));
                          return (
                            <div
                              key={idx}
                              className="flex-1 bg-rose-500/50 rounded-t hover:bg-rose-500 transition-all"
                              style={{ height: `${Math.max(15, heightPercent)}%` }}
                              title={`${val.toLocaleString()} PPS`}
                            />
                          );
                        })}
                      </div>

                      <div className="flex items-center gap-1.5 text-[9px] text-slate-400 font-mono justify-center">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                        <span>XƏBƏRDARLIQ: Server şəbəkə gecikməsi {ddosLoad > 5 ? '985ms (Overloaded)' : '210ms (Degraded)'}</span>
                      </div>
                    </div>
                  )}

                </div>
              </section>

              {/* WiFi Password Decryptor */}
              <section className="bg-slate-950/60 border border-emerald-500/10 rounded-xl p-5 shadow-xl">
                <div className="flex items-center justify-between mb-4 border-b border-slate-900 pb-3">
                  <div className="flex items-center gap-2">
                    <Wifi className="text-emerald-400 w-5 h-5 animate-pulse" />
                    <h2 className="text-sm font-bold text-white uppercase tracking-widest">WiFi Şifrə Sındırma Simulyatoru</h2>
                  </div>
                  <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                    AIRCRACK-NG SIM
                  </span>
                </div>

                <p className="text-xs text-slate-400 mb-4">
                  WPA2 Handshake ələ keçirmək və fərqli sınaq şifrə siyahıları ilə WiFi şəbəkələrinin şifrə bərpa simulyasiyasını aparın.
                </p>

                <div className="space-y-3.5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 block mb-1">ŞƏBƏKƏ (SSID) SEÇİN</label>
                      <select
                        value={wifiTarget}
                        onChange={(e) => setWifiTarget(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1.5 text-xs text-white focus:outline-none"
                      >
                        <option value="Baku_SOC_HQ_Secure">Baku_SOC_HQ_Secure (WPA2)</option>
                        <option value="Delta_Staff_Free">Delta_Staff_Free (WPA3-Trial)</option>
                        <option value="Hotspot_Guest_Portal">Hotspot_Guest_Portal (Open)</option>
                        <option value="Jozef_CyberMind_Private">Jozef_CyberMind_Private (Enterprise)</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 block mb-1">SINDIRMA ALQORİTMİ</label>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setWifiMethod('dictionary')}
                          className={`flex-1 py-1.5 rounded text-[11px] font-bold border transition-all ${
                            wifiMethod === 'dictionary'
                              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                              : 'bg-slate-900 border-slate-800 text-slate-500'
                          }`}
                        >
                          Sözlük Hücumu
                        </button>
                        <button
                          onClick={() => setWifiMethod('wps')}
                          className={`flex-1 py-1.5 rounded text-[11px] font-bold border transition-all ${
                            wifiMethod === 'wps'
                              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                              : 'bg-slate-900 border-slate-800 text-slate-500'
                          }`}
                        >
                          WPS PIN Bruteforce
                        </button>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={startWifiCracking}
                    disabled={wifiStatus === 'handshake' || wifiStatus === 'cracking'}
                    className="w-full py-2 rounded bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-bold text-xs transition-all disabled:opacity-50"
                  >
                    WPA2 HANDSHAKE &amp; SINDIRMANI BAŞLAT
                  </button>

                  {/* WiFi output logs */}
                  {wifiLogs.length > 0 && (
                    <div className="p-3 bg-[#05070c] border border-slate-900 rounded-lg text-[10px] font-mono space-y-1 max-h-[140px] overflow-y-auto scrollbar">
                      {wifiLogs.map((log, idx) => (
                        <p key={idx} className="text-emerald-400/85">{log}</p>
                      ))}
                    </div>
                  )}

                  {/* Crack Progress bar */}
                  {(wifiStatus === 'handshake' || wifiStatus === 'cracking') && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] font-bold text-slate-500">
                        <span>Cari Metod: {wifiStatus.toUpperCase()}...</span>
                        <span>{wifiProgress}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 transition-all duration-300" style={{ width: `${wifiProgress}%` }} />
                      </div>
                    </div>
                  )}

                  {/* Results */}
                  {wifiStatus === 'cracked' && (
                    <div className="p-3.5 bg-emerald-500/5 border border-emerald-500/20 rounded-lg">
                      <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs mb-1">
                        <CheckCircle2 className="w-4 h-4" /> WiFi Şifrə Tapıldı!
                      </div>
                      <p className="text-xs text-slate-300">
                        Dekod edilmiş şifrə: <strong className="text-white underline font-mono text-sm">{wifiCrackedPass}</strong>
                      </p>
                      <p className="text-[10px] text-slate-500 mt-1.5 leading-relaxed">
                        Tövsiyə: Güclü WiFi şifrələri təyin edin (ən azı 12 simvol, rəqəm, böyük-kiçik hərflər və simvol). WPS funksiyasını router üzərindən dərhal söndürün.
                      </p>
                    </div>
                  )}

                </div>
              </section>

            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              
              {/* IP WHOIS & TRACEROUTE TOOL */}
              <section className="bg-slate-950/60 border border-emerald-500/10 rounded-xl p-5 shadow-xl">
                <div className="flex items-center justify-between mb-4 border-b border-slate-900 pb-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="text-emerald-400 w-5 h-5" />
                    <h2 className="text-sm font-bold text-white uppercase tracking-widest">IPWHOIS &amp; Traceroute Kəşfiyyatı</h2>
                  </div>
                  <span className="text-[9px] font-mono font-bold text-slate-500">PORT SCAN &amp; WHOIS</span>
                </div>

                <div className="space-y-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={ipInput}
                      onChange={(e) => setIpInput(e.target.value)}
                      className="flex-1 bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                      placeholder="IP ünvanı daxil edin..."
                    />
                    <button
                      onClick={runIpTracer}
                      disabled={ipTraceDetails.status === 'tracing'}
                      className="px-4 py-1.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 font-bold text-xs transition-all disabled:opacity-50"
                    >
                      KƏŞF ET
                    </button>
                  </div>

                  {ipTraceDetails.status === 'tracing' && (
                    <div className="text-center py-6 text-xs text-slate-500 font-mono animate-pulse">
                      🔎 WHOIS daxilolmaları oxunur... Şəbəkə marşrutu (Traceroute) təyin edilir...
                    </div>
                  )}

                  {ipTraceDetails.status === 'ready' && (
                    <div className="space-y-3 font-mono text-xs p-3 bg-[#05070c] border border-slate-900 rounded-lg">
                      <div className="grid grid-cols-2 gap-2 text-[11px] border-b border-slate-900 pb-2">
                        <div>
                          <span className="text-slate-500 block">PROVAYDER (ISP):</span>
                          <span className="text-white font-bold">{ipTraceDetails.isp}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">REGION:</span>
                          <span className="text-white font-bold">{ipTraceDetails.city}, {ipTraceDetails.country}</span>
                        </div>
                      </div>

                      {/* Open ports scan result */}
                      <div>
                        <span className="text-slate-500 text-[11px] block mb-1">TAPILAN AÇIQ PORTLAR (PORT SCAN):</span>
                        <div className="flex flex-wrap gap-1.5">
                          {ipTraceDetails.ports.map(port => (
                            <span key={port} className="px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px]">
                              Port {port} ({port === 22 ? 'SSH' : port === 80 ? 'HTTP' : port === 443 ? 'HTTPS' : port === 3389 ? 'RDP' : 'SCADA'})
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Traceroute hops */}
                      <div>
                        <span className="text-slate-500 text-[11px] block mb-1">TRACEROUTE HOPS (ŞƏBƏKƏ ATILMALARI):</span>
                        <div className="space-y-1 text-[10px]">
                          {ipTraceDetails.hops.map((hop, index) => (
                            <div key={index} className="flex items-center gap-1.5">
                              <span className="text-slate-600 font-bold">{index + 1}.</span>
                              <span className="text-slate-400">↳ {hop}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>
                  )}
                </div>
              </section>

              {/* DATA STORAGE & DECRYPTION WORKSPACE */}
              <section className="bg-slate-950/60 border border-emerald-500/10 rounded-xl p-5 shadow-xl">
                <div className="flex items-center justify-between mb-4 border-b border-slate-900 pb-3">
                  <div className="flex items-center gap-2">
                    <Database className="text-emerald-400 w-5 h-5" />
                    <h2 className="text-sm font-bold text-white uppercase tracking-widest">Şifrəli Yaddaş Analizatoru (MD5 / SHA256)</h2>
                  </div>
                  <span className="text-[9px] font-mono font-bold text-slate-500">HASH DECRYPTOR</span>
                </div>

                <p className="text-xs text-slate-400 mb-4">
                  Sızdırılmış verilənlər bazasından əldə edilmiş MD5 və ya SHA-256 şifrə heşlərini dekodlamağı sınaqdan keçirin.
                </p>

                <div className="space-y-3.5">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1">MD5 VƏ YA SHA-256 HASH</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={hashInput}
                        onChange={(e) => setHashInput(e.target.value)}
                        className="flex-1 bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white font-mono focus:outline-none"
                        placeholder="Məs: cbf5214811b707d31a810c326e0b2f15"
                      />
                      <button
                        onClick={decryptHash}
                        disabled={hashStatus === 'dumping' || hashStatus === 'cracking'}
                        className="px-4 py-1.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 font-bold text-xs transition-all"
                      >
                        DEKOD ET
                      </button>
                    </div>
                    <span className="text-[9px] text-slate-500 mt-1 block">İpucu: Siyahıdakı "cbf5214811b707d31a810c326e0b2f15" (password123) şifrəsinə bərabərdir.</span>
                  </div>

                  {/* Hash crack progress */}
                  {(hashStatus === 'dumping' || hashStatus === 'cracking') && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] text-slate-500">
                        <span>MD5 sınaq sözlüyü yoxlanılır ({hashProgress}%)...</span>
                      </div>
                      <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 transition-all duration-300" style={{ width: `${hashProgress}%` }} />
                      </div>
                    </div>
                  )}

                  {hashStatus === 'success' && (
                    <div className="p-3.5 bg-emerald-500/5 border border-emerald-500/20 rounded-lg">
                      <span className="text-emerald-400 font-bold text-xs block mb-1">✔ Dekod Uğurlu!</span>
                      <p className="text-xs text-slate-300">
                        Hash növü: <span className="font-mono text-white">MD5</span>
                      </p>
                      <p className="text-xs text-slate-300">
                        Aşkar edilmiş təmiz şifrə: <strong className="text-white font-mono text-sm underline">{hashResult}</strong>
                      </p>
                    </div>
                  )}

                </div>
              </section>

            </div>

          </div>
        )}

        {/* ==========================================
            TAB 4: ADMIN CONSOLE (Login & Admin Panel)
           ========================================== */}
        {activeTab === 'admin' && (
          <div className="space-y-6">
            
            {/* If administrator is not logged in, render the login panel */}
            {!isAdminLoggedIn ? (
              <div className="max-w-md mx-auto bg-slate-950 border border-emerald-500/20 rounded-xl p-6 shadow-2xl relative my-8">
                
                {/* Tech grid aesthetic behind */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#111827_1px,transparent_1px),linear-gradient(to_bottom,#111827_1px,transparent_1px)] bg-[size:1rem_1rem] opacity-35 rounded-xl pointer-events-none" />

                <div className="text-center mb-6 relative z-10">
                  <div className="w-12 h-12 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 mx-auto mb-3 animate-pulse">
                    <Lock className="w-6 h-6" />
                  </div>
                  <h2 className="text-sm font-bold text-white uppercase tracking-widest">Səlahiyyətli İnzibatçı Girişi</h2>
                  <p className="text-[10px] text-slate-500 mt-1">Yalnız Jozef Cyber Mind Security işçiləri və tədqiqatçılar üçün</p>
                </div>

                <form onSubmit={handleAdminLogin} className="space-y-4 relative z-10 font-mono">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1">İSTİFADƏÇİ ADI</label>
                    <input
                      type="text"
                      required
                      value={adminUsername}
                      onChange={(e) => setAdminUsername(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
                      placeholder="Məs: admin"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1">ŞİFRƏ</label>
                    <input
                      type="password"
                      required
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
                      placeholder="Məs: admin"
                    />
                  </div>

                  {adminError && (
                    <div className="p-2.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[10px] rounded leading-relaxed">
                      ⚠ {adminError}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full py-2 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-400 font-bold text-xs rounded transition-all"
                  >
                    SİSTEMƏ DAXİL OL
                  </button>
                </form>

                <div className="mt-5 p-3 bg-slate-900/60 border border-slate-850 rounded text-[10px] text-slate-400 leading-normal font-mono">
                  ℹ Tədris məqsədli sınaq bypass məlumatı:<br />
                  İstifadəçi adı: <strong className="text-white">admin</strong><br />
                  Şifrə: <strong className="text-white">admin</strong>
                </div>

              </div>
            ) : (
              
              /* Logged In Admin Control Panel Dashboard */
              <div className="space-y-6">
                
                {/* Admin Bar */}
                <div className="bg-slate-950 border border-blue-500/20 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                      <Users className="w-4 h-4" />
                    </div>
                    <div>
                      <h2 className="text-xs font-bold text-white uppercase tracking-widest">Yüksək İnzibati Mərkəz</h2>
                      <p className="text-[10px] text-slate-400">İstifadəçi: <span className="text-blue-400 font-bold">root@jozef-cybermind</span> (Tam İdarəetmə)</p>
                    </div>
                  </div>

                  <button
                    onClick={handleAdminLogout}
                    className="px-3.5 py-1.5 rounded bg-rose-500/10 border border-rose-500/30 text-rose-400 font-bold text-xs transition-all hover:bg-rose-500/20"
                  >
                    SESSİYANI BAĞLA (ÇIXIŞ)
                  </button>
                </div>

                {/* Dashboard Widgets */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  
                  {/* Interactive Shell Terminal */}
                  <div className="lg:col-span-7 flex flex-col bg-[#05070c] border border-blue-500/15 rounded-xl p-5 shadow-2xl h-[420px]">
                    <div className="flex items-center justify-between mb-3 border-b border-slate-900 pb-2">
                      <div className="flex items-center gap-2">
                        <TerminalIcon className="text-blue-400 w-4 h-4 animate-pulse" />
                        <h3 className="text-xs font-bold text-slate-100 uppercase tracking-widest">Səlahiyyətli Linux Terminalı</h3>
                      </div>
                      <span className="text-[9px] font-mono font-bold text-slate-500">ROOT SHELL</span>
                    </div>

                    {/* Shell Console Screen */}
                    <div className="flex-1 overflow-y-auto space-y-1 p-2 bg-[#020408] rounded border border-slate-900 text-xs font-mono text-emerald-400 scrollbar">
                      {adminTerminalOutputs.map((out, idx) => (
                        <p key={idx} className="leading-relaxed whitespace-pre-wrap">{out}</p>
                      ))}
                    </div>

                    {/* Command Input Form */}
                    <form onSubmit={handleTerminalSubmit} className="mt-3 flex gap-2 border-t border-slate-900 pt-3">
                      <span className="text-blue-400 font-bold text-xs self-center">root@jozef-cybermind:~#</span>
                      <input
                        type="text"
                        value={terminalInputValue}
                        onChange={(e) => setTerminalInputValue(e.target.value)}
                        className="flex-1 bg-transparent text-xs text-white border-none focus:outline-none focus:ring-0 font-mono"
                        placeholder="Komanda yazın... (help yazaraq siyahıya baxın)"
                        autoFocus
                      />
                      <button type="submit" className="text-blue-400 hover:text-white transition-colors" title="Send command">
                        <Send className="w-4 h-4" />
                      </button>
                    </form>
                  </div>

                  {/* Harvested sensitive credentials list */}
                  <div className="lg:col-span-5 bg-slate-950 border border-slate-850 rounded-xl p-5 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-4 border-b border-slate-900 pb-2">
                        <div className="flex items-center gap-2">
                          <Database className="text-blue-400 w-4 h-4" />
                          <h3 className="text-xs font-bold text-slate-100 uppercase tracking-widest">Sızdırılmış Şifrələr Verilənlər Bazası</h3>
                        </div>
                        <span className="text-[9px] font-mono text-slate-500">SINAQ LOQLARI</span>
                      </div>

                      <p className="text-[11px] text-slate-400 mb-4 leading-normal">
                        Müxtəlif sınaq ssenarilərində ələ keçirilmiş demo təhlükəsizlik şifrələrinin qeyd mərkəzi.
                      </p>

                      <div className="space-y-3 max-h-[220px] overflow-y-auto scrollbar">
                        {harvestedCreds.map(cred => (
                          <div key={cred.id} className="p-2.5 bg-slate-900/60 border border-slate-850 rounded text-[11px]">
                            <div className="flex justify-between items-center mb-1 font-bold">
                              <span className="text-blue-400">{cred.user}</span>
                              <span className="text-slate-500 text-[10px] bg-slate-950 px-1 py-0.2 rounded">{cred.origin}</span>
                            </div>
                            <div className="text-slate-400 space-y-0.5">
                              <p>E-poçt: <span className="text-slate-200">{cred.email}</span></p>
                              <p>Şifrə: <strong className="text-white underline">{cred.passRaw}</strong></p>
                              <p>Hədəf IP: <span className="text-slate-400">{cred.ip}</span></p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4 p-2.5 bg-blue-500/5 border border-blue-500/10 rounded text-[10px] text-blue-400 leading-relaxed font-mono">
                      💡 Sınaq məlumatlarının şifrələnməməsi (Plaintext) OWASP A02:2021 qaydalarının pozulması nümunəsidir!
                    </div>
                  </div>

                </div>

                {/* Additional Admin knowledge panels (OWASP + Hygiene Tips fully linked) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  
                  {/* OWASP Search reference in Admin */}
                  <div className="bg-slate-950 border border-slate-900 rounded-xl p-5">
                    <div className="flex items-center justify-between mb-4 border-b border-slate-900 pb-2">
                      <div className="flex items-center gap-2">
                        <SearchCode className="text-blue-400 w-4 h-4" />
                        <h3 className="text-xs font-bold text-white uppercase tracking-widest">Inzibatçının OWASP Top 10 Analiz Portalı</h3>
                      </div>
                    </div>
                    
                    <div className="relative mb-3.5">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-500">
                        <Search className="w-4 h-4" />
                      </span>
                      <input
                        type="text"
                        placeholder="Vulnerabilty axtarışı..."
                        value={owaspSearch}
                        onChange={(e) => setOwaspSearch(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg py-1.5 pl-9 pr-4 text-xs text-slate-200 focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      {OWASP_VULNERABILITIES.filter(v => v.title.toLowerCase().includes(owaspSearch.toLowerCase()) || v.code.toLowerCase().includes(owaspSearch.toLowerCase())).slice(0, 3).map(item => (
                        <button
                          key={item.id}
                          onClick={() => { setSelectedOwasp(item); triggerAudio(550, 'sine', 0.05); }}
                          className={`p-2 rounded text-left border text-[11px] font-mono transition-all ${
                            selectedOwasp.id === item.id 
                              ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' 
                              : 'bg-slate-900 border-slate-850 text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          <span className="block font-bold">{item.code}</span>
                          <span className="truncate block">{item.title.split('(')[0]}</span>
                        </button>
                      ))}
                    </div>

                    <div className="mt-3 p-3 bg-slate-900/40 rounded border border-slate-850 text-[11px]">
                      <h4 className="font-bold text-white mb-1">{selectedOwasp.code}: {selectedOwasp.title}</h4>
                      <p className="text-slate-400 leading-normal mb-2">{selectedOwasp.description}</p>
                      <div className="text-[10px] text-orange-400 font-bold mb-1">MÜDAFİƏ ADMİN PLANI:</div>
                      <ul className="space-y-1 text-[10px] text-slate-300">
                        {selectedOwasp.prevention.slice(0, 2).map((p, idx) => (
                          <li key={idx}>• {p}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Hygiene tips in Admin */}
                  <div className="bg-slate-950 border border-slate-900 rounded-xl p-5">
                    <div className="flex items-center justify-between mb-4 border-b border-slate-900 pb-2">
                      <div className="flex items-center gap-2">
                        <BookOpen className="text-blue-400 w-4 h-4" />
                        <h3 className="text-xs font-bold text-white uppercase tracking-widest">Infrastruktur Kiber Gigiyena Təlimatları</h3>
                      </div>
                    </div>

                    <div className="space-y-2.5 max-h-[240px] overflow-y-auto scrollbar">
                      {HYGIENE_TIPS.map(tip => (
                        <div key={tip.id} className="p-3 bg-slate-900/50 border border-slate-850 rounded flex flex-col gap-1 text-[11px]">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-white">{tip.title}</span>
                            <span className="text-[9px] uppercase px-1 rounded bg-slate-950 text-orange-400 font-bold">{tip.category}</span>
                          </div>
                          <p className="text-slate-400">{tip.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

              </div>
            )}

          </div>
        )}

      </main>

      {/* --- FOOTER --- */}
      <footer className="mt-12 border-t border-emerald-500/10 bg-slate-950/80 backdrop-blur-md py-6 px-4 text-center text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p>© 2026 Jozef Cyber Mind Security. Bütün hüquqlar qorunur. Developer Hacking Center.</p>
          <div className="flex items-center gap-3">
            <span className="text-emerald-500/70 font-bold">BY JOZEF HACKING WP SITE</span>
            <span className="text-slate-800">|</span>
            <a
              href="https://owasp.org"
              target="_blank"
              rel="noreferrer"
              className="text-slate-400 hover:text-emerald-400 transition-colors flex items-center gap-1"
            >
              OWASP Top 10 <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </footer>

      {/* --- ABOUT INFO MODAL --- */}
      {showAboutModal && (
        <div className="fixed inset-0 bg-slate-950/90 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-slate-900 border border-emerald-500/20 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative font-mono">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Shield className="text-emerald-400 w-5 h-5 animate-pulse" />
                <h3 className="text-sm font-bold text-white uppercase tracking-widest">Laboratoriya haqqında</h3>
              </div>
              <button
                onClick={() => setShowAboutModal(false)}
                className="text-slate-400 hover:text-slate-200 text-xs p-1 bg-slate-800 hover:bg-slate-700 rounded transition-all"
              >
                BAĞLA
              </button>
            </div>

            <div className="space-y-3 text-xs leading-relaxed text-slate-300">
              <p>
                <strong>Jozef Cyber Mind Security</strong> platforması kiber-təhlükəsizlik sahəsindəki fərdi vərdişləri və mürəkkəb qoruma texnologiyalarını vizual nümayiş etdirmək üçün dizayn edilmiş <strong>100% zərərsiz bir kiber təhsil layihəsidir.</strong>
              </p>
              
              <div className="bg-orange-500/5 border border-orange-500/10 p-3 rounded">
                <p className="font-bold text-orange-400 mb-1">Ciddi Təhlükəsizlik Bəyannaməsi:</p>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Bu veb-sayt daxilində heç bir real haker fəaliyyəti, kiber hücum, şəbəkə skanlaması, istismar (exploit), DDoS və ya WiFi deautentifikasiyası icra olunmur. Simulyasiya edilən bütün siqnallar, loglar və terminal komandaları yalnız təhsil məqsədilə, brauzer səviyyəsində (client-side) canlandırılmış statik məlumat axınlarından ibarətdir.
                </p>
              </div>

              <p className="font-bold text-white">İstifadə Edilən Texnoloji Konseptlər:</p>
              <ul className="list-disc pl-5 space-y-1 text-slate-400">
                <li>Azərbaycan dövlət və özəl şəbəkə qovşaqlarının SOC simulyasiya paneli.</li>
                <li>Flipper Zero interaktiv sub-GHz radio, RFID oxuma, BadUSB skript payload simulyatoru.</li>
                <li>DDoS HTTP GET Flood hücum mərkəzi (canlı PPS və Gbps yüklənmə qrafikləri ilə).</li>
                <li>WPA2 Handshake ələ keçirmə və WiFi şifrə deşifrə simulyasiyası.</li>
                <li>IP WHOIS port skaner kəşfiyyatı və MD5 şifrəli verilənlər bazası bərpa modulu.</li>
                <li>Root hüquqlu sınaq Linux terminal konsolu (help, clear, whoami, nmap, exploit, creds komandaları ilə).</li>
                <li>Web Audio API əsaslı retro səs generatoru.</li>
              </ul>
            </div>

            <div className="border-t border-slate-800 pt-3 flex items-center justify-between text-[10px] text-slate-500">
              <span>Müəllif: by Jozef Cyber Mind Security</span>
              <span>v1.4.0-STABLE</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
