import { NetworkNode, OwaspVulnerability, HygieneTip, SimulationStep } from './types';

export const INITIAL_NETWORK_NODES: NetworkNode[] = [
  {
    id: 'node-gov',
    name: 'Dövlət İnteqrasiya Portalı (.gov.az)',
    ip: '194.135.152.12',
    status: 'defended',
    shield: 92,
    description: 'Dövlət orqanları arası məlumat mübadiləsi mərkəzi şəbəkə qovşağı.',
    lastEvent: 'Müdafiə sistemi aktivdir. IPS loqları təmizdir.'
  },
  {
    id: 'node-fin',
    name: 'Maliyyə İnformasiya Portalı',
    ip: '81.17.88.4',
    status: 'defended',
    shield: 88,
    description: 'Banklararası transaksiyalar və milli ödəniş sistemlərinin kiber-keşikçisi.',
    lastEvent: 'SSL/TLS sertifikat yoxlanışı uğurla keçdi.'
  },
  {
    id: 'node-energy',
    name: 'Enerji İdarəetmə Şəbəkəsi (SCADA)',
    ip: '213.172.91.44',
    status: 'risk',
    shield: 58,
    description: 'Regional elektrik paylayıcı stansiyaların monitorinqi və telemetriya serveri.',
    lastEvent: 'Naməlum IP tərəfindən port skan sorğuları aşkarlanıb!'
  },
  {
    id: 'node-cloud',
    name: 'Dövlət Bulud Xidməti (G-Cloud)',
    ip: '195.162.4.150',
    status: 'defended',
    shield: 96,
    description: 'Virtual serverlər və milli verilənlər bazasının saxlandığı təhlükəsiz bulud strukturu.',
    lastEvent: 'Gündəlik kiber gigiyena və bütövlük auditi tamamlandı.'
  },
  {
    id: 'node-health',
    name: 'Tibb İnformasiya Şəbəkəsi',
    ip: '85.117.112.18',
    status: 'active',
    shield: 70,
    description: 'Vətəndaşların elektron tibb kartları və xəstəxana daxili daxilolma sistemi.',
    lastEvent: 'Yeni istifadəçi girişi təsdiqləndi.'
  },
  {
    id: 'node-edu',
    name: 'Təhsil Portalı (edu.gov.az)',
    ip: '217.64.17.5',
    status: 'active',
    shield: 75,
    description: 'Tələbə qeydiyyatı, elektron jurnal və imtahan nəticələrinin paylanma nodu.',
    lastEvent: 'Şəbəkə yükü normal səviyyədədir.'
  },
  {
    id: 'node-local',
    name: 'Şəxsi SOC Qovşağı (Yerli Node)',
    ip: '192.168.1.1',
    status: 'defended',
    shield: 100,
    description: 'Yerli kiber müdafiə simulyatorunun əsas idarəetmə və firewall qovşağı.',
    lastEvent: 'Sistem stabil işləyir. Bütün təhlükəsizlik divarları aktivdir.'
  }
];

export const OWASP_VULNERABILITIES: OwaspVulnerability[] = [
  {
    id: 'owasp-1',
    code: 'A01:2021',
    title: 'Sınmış Giriş Nəzarəti (Broken Access Control)',
    description: 'İstifadəçilərin icazəsi olmayan resurslara, səhifələrə və ya funksiyalara daxil ola bilməsi zəifliyidir. Bu, imtiyazların artırılmasına və məlumat sızmasına yol açır.',
    prevention: [
      'İcazələri standart olaraq rədd et (Default Deny) prinsipinə uyğun qurun.',
      'Giriş nəzarəti mexanizmlərini hər bir sorğu üçün server tərəfində ciddi şəkildə yoxlayın.',
      'İstifadəçi tərəfindən göndərilən identifikatorların (ID, param) başqa istifadəçiyə aid olub-olmadığını yoxlayın (IDOR-un qarşısını alın).',
      'API sorğularında istifadə olunan JWT və ya sessiya tokenlərini hər addımda doğrulayın.'
    ]
  },
  {
    id: 'owasp-2',
    code: 'A02:2021',
    title: 'Kriptoqrafik Xətalar (Cryptographic Failures)',
    description: 'Həssas verilənlərin (şifrələr, şəxsiyyət vəsiqələri, kredit kartları) tranzit və ya saxlanma zamanı zəif şifrələnməsi və ya ümumiyyətlə şifrələnməməsidir.',
    prevention: [
      'Tranzitdə olan bütün məlumatları şifrələyin (gözlənilən HTTPS və ən azı TLS 1.3 protokolu).',
      'Köhnəlmiş və zəif alqoritmlərdən (MD5, SHA1, DES) imtina edin; Argon2, bcrypt və ya PBKDF2 istifadə edin.',
      'Şifrələmə açarlarını təhlükəsiz saxlama vasitələrində (KMS, Key Vault) mühafizə edin.',
      'Məlumatların saxlanma müddətini minimuma endirin və lazımsız fərdi məlumatları silin.'
    ]
  },
  {
    id: 'owasp-3',
    code: 'A03:2021',
    title: 'İnyeksiya (Injection - SQL, NoSQL, OS Command)',
    description: 'İstifadəçi tərəfindən daxil edilən və təmizlənməmiş məlumatların verilənlər bazası və ya əməliyyat sistemi tərəfindən birbaşa icra edilə bilən əmr kimi başa düşülməsidir.',
    prevention: [
      'Həmişə Parameterized Queries (Hazırlanmış Sorğular) və ya ORM kitabxanalarından istifadə edin.',
      'Daxil olan bütün məlumatları ağ siyahı (allowlist) üsulu ilə doğrulayın və təmizləyin.',
      'Xüsusi simvolları və dırnaq işarələrini mütləq zərərsizləşdirin (escaping).',
      'Bazada işləyən sorğu istifadəçilərinin imtiyazlarını yalnız lazım olan əməliyyatlarla məhdudlaşdırın (Least Privilege).'
    ]
  },
  {
    id: 'owasp-4',
    code: 'A04:2021',
    title: 'Etibarsız Dizayn (Insecure Design)',
    description: 'Kodlaşdırma başlanmazdan əvvəl təhlükəsizlik risklərinin düzgün qiymətləndirilməməsi və proqramın memarlıq səviyyəsində zəif dizayn edilməsidir.',
    prevention: [
      'Proqramın ilkin mərhələsində Təhdid Modelləşdirilməsi (Threat Modeling) həyata keçirin.',
      'İnkişaf komandasının təhlükəsiz dizayn şablonlarından (Design Patterns) istifadə etməsini təmin edin.',
      'Hər bir modul üçün uğursuzluq hallarının təhlükəsiz şəkildə idarə olunmasını (Fail Securely) təmin edin.',
      'Sistem resurslarının həddindən artıq istehlakını məhdudlaşdırın.'
    ]
  },
  {
    id: 'owasp-5',
    code: 'A05:2021',
    title: 'Təhlükəsizlik Səhv Ayarlamaları (Security Misconfiguration)',
    description: 'Sistemlərin istehsalçı tərəfindən verilən standart şifrələrlə işləməsi, lazımsız portların açıq qalması və ya xətalar zamanı daxili sistem məlumatlarının istifadəçiyə görünməsidir.',
    prevention: [
      'Sistemdəki bütün standart şifrələri, istifadəçi adlarını və gizli açarları mütləq dəyişdirin.',
      'İstehsalat (production) mühitində bütün lazımsız xidmətləri, portları, sınaq səhifələrini söndürün.',
      'Hata mesajlarını (stack trace) istifadəçiyə göstərməyin, daxili qorunan jurnallarda qeyd edin.',
      'HTTP təhlükəsizlik başlıqlarını (HSTS, CSP, X-Frame-Options) düzgün konfiqurasiya edin.'
    ]
  },
  {
    id: 'owasp-6',
    code: 'A06:2021',
    title: 'Həssas və Köhnəlmiş Komponentlər (Vulnerable & Outdated Components)',
    description: 'Zəifliyi olduğu bilinən köhnə versiyalı kitabxanalardan (NPM, NuGet), kənar xidmətlərdən və ya əməliyyat sistemlərindən istifadə edilməsidir.',
    prevention: [
      'İstifadə olunan bütün asılılıqları (dependencies) və kitabxanaları inventarlaşdırın.',
      'Mütəmadi olaraq avtomatlaşdırılmış alətlərlə (məsələn, `npm audit`, Snyk, OWASP Dependency-Check) zəiflikləri yoxlayın.',
      'Kitabxanaların yalnız etibarlı və rəsmi mənbələrdən endirildiyinə əmin olun.',
      'Köhnəlmiş və artıq dəstəklənməyən kitabxanaları dərhal müasir alternativlərlə əvəzləyin.'
    ]
  },
  {
    id: 'owasp-7',
    code: 'A07:2021',
    title: 'İdentifikasiya və Autentifikasiya Xətaları (Identification Failure)',
    description: 'Şifrə bərpa, giriş sessiyaları və istifadəçi identifikasiyasının zəif qorunması səbəbindən hücumçuların başqa istifadəçi hesablarını asanlıqla ələ keçirməsidir.',
    prevention: [
      'Çoxfaktorlu Autentifikasiyanı (MFA) mütləq tətbiq edin və məcburi edin.',
      'Zəif şifrələrin təyin edilməsini qadağan edin (şifrə uzunluğu ən azı 12 simvol, rəqəm, böyük-kiçik hərf və xüsusi simvol).',
      'Giriş cəhdlərini məhdudlaşdırın (rate limiting) və brute-force hücumlarının qarşısını alın.',
      'Sessiya identifikatorlarını (Session ID) yalnız təhlükəsiz, HTTPOnly və SameSite kuki fayllarında saxlayın.'
    ]
  },
  {
    id: 'owasp-8',
    code: 'A08:2021',
    title: 'Proqram və Məlumat Bütövlüyü Xətaları (Software & Data Integrity Failures)',
    description: 'Kod yeniləmələrinin, tətbiq boru xətlərinin (CI/CD) və ya deserializasiya edilən obyektlərin etibarlılığının rəqəmsal imzalar vasitəsilə yoxlanılmaması zəifliyidir.',
    prevention: [
      'Proqram yeniləmələrinin və paketlərin yalnız rəqəmsal imzalanmış və təsdiqlənmiş mənbələrdən gəldiyini yoxlayın.',
      'Zərərli kod injeksiyasının qarşısını almaq üçün etibarsız mənbələrdən gələn obyektlərin deserializasiyasını qadağan edin.',
      'CI/CD boru kəmərlərində kod bütövlüyünü təmin edən təhlükəsizlik yoxlamaları (SCA/SAST) tətbiq edin.',
      'Kritik məlumat ötürmələrində imza və nəzarət cəmindən (checksum - SHA256) istifadə edin.'
    ]
  },
  {
    id: 'owasp-9',
    code: 'A09:2021',
    title: 'Təhlükəsizlik Loqlaşdırılması və Monitorinq Xətaları (Logging & Monitoring Failures)',
    description: 'Sistemdə baş verən şübhəli və ya uğursuz cəhdlərin qeydə alınmaması və ya monitorinqin aparılmaması səbəbindən kiber hücumların aylar boyu gizli qalmasıdır.',
    prevention: [
      'Uğursuz giriş cəhdlərini, səlahiyyət dəyişikliklərini və bütün kritik inzibati əməliyyatları mütləq loqlayın.',
      'Loq qeydlərinin hücumçular tərəfindən silinməməsi üçün onları şifrəli və mərkəzi SIEM sistemində saxlayın.',
      'Sistemdə anomaliyalar baş verdikdə (məsələn, saniyədə 100 uğursuz giriş) inzibatçılara dərhal sms və ya e-poçt xəbərdarlıqları göndərin.',
      'Hücum zamanı hadisələrin ardıcıllığını araşdırmaq üçün logların zaman damğalarını (timestamp) sinxronlaşdırın.'
    ]
  },
  {
    id: 'owasp-10',
    code: 'A10:2021',
    title: 'Server Tərəfli Sorğu Saxtakarlığı (Server-Side Request Forgery - SSRF)',
    description: 'Kiber hücumçunun serveri öz adından daxili qorunan şəbəkə resurslarına, API-lərə və ya kənar veb-saytlara istənilməyən zərərli sorğular göndərməyə məcbur etməsidir.',
    prevention: [
      'Server tərəfindən müraciət edilə bilən ünvanları ciddi ağ siyahı (allowlist) ilə məhdudlaşdırın.',
      'İstifadəçi tərəfindən daxil edilən və birbaşa qəbul edilən kənar URL-lərin qarşısını alın.',
      'Serverin yerli şəbəkə resurslarına (localhost, 127.0.0.1 və ya daxili IP-lər) sorğu göndərməsini bloklayın.',
      'Şəbəkə səviyyəsində tətbiq serveri ilə digər daxili xidmətlər arasındakı trafiki firewall ilə izolyasiya edin.'
    ]
  }
];

export const HYGIENE_TIPS: HygieneTip[] = [
  {
    id: 'tip-1',
    title: 'Çoxfaktorlu Autentifikasiyanı (MFA) Aktiv Edin',
    category: 'şifrə',
    description: 'Hesablarınızın yalnız şifrə ilə qorunması kifayət deyil. Şifrəniz ələ keçsə belə, ikinci bir doğrulama faktoru (məsələn, SMS və ya Google Authenticator kodu) hesabınızı kiber oğrulardan tam mühafizə edəcək.',
    action: 'Gündəlik istifadə etdiyiniz sosial şəbəkə, e-poçt və bank hesablarınızın parametrlərinə daxil olaraq "İkiaddımlı Doğrulama" (2FA/MFA) bölməsini aktivləşdirin.',
    bookmarked: false
  },
  {
    id: 'tip-2',
    title: 'Açıq və İctimai Wi-Fi Şəbəkələrində Ehtiyatlı Olun',
    category: 'şəbəkə',
    description: 'Kafelər, restoranlar və ya hava limanlarında təqdim olunan şifrəsiz Wi-Fi şəbəkələri "Man-in-the-Middle" (Ortadakı adam) hücumlarına çox açıqdır. Hücumçular ötürdüyünüz şifrələri və şəxsi məlumatları asanlıqla izləyə bilər.',
    action: 'İctimai yerlərdə heç vaxt bank hesablarınıza daxil olmayın. Əgər şəbəkədən istifadə mütləqdirsə, telefonunuzun mobil internetini paylaşın və ya etibarlı, şifrələnmiş VPN xidmətindən istifadə edin.',
    bookmarked: false
  },
  {
    id: 'tip-3',
    title: 'Sistem və Tətbiqləri Daim Yeniləyin',
    category: 'cihaz',
    description: 'Proqram və əməliyyat sistemi istehsalçıları mütəmadi olaraq aşkar edilmiş kiber zəiflikləri aradan qaldırmaq üçün təhlükəsizlik yamaları (patches) hazırlayırlar. Yenilənməmiş cihazlar hakerlər üçün asan hədəfdir.',
    action: 'Telefonunuz, kompüteriniz və digər smart cihazlarınızda "Avtomatik Yenilənmə" (Automatic Updates) funksiyasını aktivləşdirin və yeniləmələri yubatmadan quraşdırın.',
    bookmarked: false
  },
  {
    id: 'tip-4',
    title: 'Hər bir Hesab Üçün Unikal Şifrə Təyin Edin',
    category: 'şifrə',
    description: 'Əgər bütün hesablarınız üçün eyni şifrəni istifadə edirsinizsə, hər hansı bir saytın kiber hücuma məruz qalması və şifrənizin sızması bütün digər hesablarınızın (e-poçt, sosial şəbəkələr və s.) eyni vaxtda ələ keçməsinə səbəb olacaq.',
    action: 'Mürəkkəb şifrələri (ən azı 12 simvol, rəqəmlər, böyük-kiçik hərflər və xüsusi simvollar) yadda saxlamaq məcburiyyətində qalmamaq üçün etibarlı Şifrə Menecerindən (Password Manager) istifadə edin.',
    bookmarked: false
  },
  {
    id: 'tip-5',
    title: 'Bilinməyən USB və Xarici Diskləri Taxmayın',
    category: 'cihaz',
    description: 'Yerdə tapılan və ya sizə aid olmayan USB yaddaş kartlarında kompüterinizə qoşulan kimi avtomatik işə düşən (Autorun) gizli kiber casus proqramları və troyanlar yerləşdirilmiş ola bilər.',
    action: 'Tanımadığınız heç bir USB cihazını öz iş və ya şəxsi kompüterinizə qoşmayın. Kompüterinizin parametrlərində xarici media alətlərinin avtomatik işə düşməsini (AutoPlay/Autorun) söndürün.',
    bookmarked: false
  },
  {
    id: 'tip-6',
    title: 'Ev Wi-Fi Router Şifrəsini və Adını Dəyişin',
    category: 'şəbəkə',
    description: 'Evdə quraşdırılan Wi-Fi routerlərin idarəetmə panelinin şifrəsi istehsalçı tərəfindən standart (məs. admin/admin və ya admin/1234) təyin edilir. Hücumçular bu şifrəni taparaq şəbəkənizə daxil ola və bütün internet sınaqlarınızı idarə edə bilərlər.',
    action: 'Brauzerdə routerin idarəetmə panelinə (çox vaxt 192.168.1.1 və ya 192.168.0.1) daxil olaraq standart istifadəçi adını və şifrəsini mürəkkəb bir kombinasiya ilə dəyişdirin.',
    bookmarked: false
  }
];

// Brute force simulation steps
export const BRUTE_FORCE_SIMULATION: SimulationStep[] = [
  { text: 'Simulyasiya başladıldı: Hədəf qovşaq analiz edilir...', type: 'info', delay: 1200, sound: { frequency: 440, type: 'sine', duration: 0.1 } },
  { text: 'Hədəf Server tapıldı: [85.117.112.18] - Port 22 (SSH)', type: 'info', delay: 1000, sound: { frequency: 440, type: 'sine', duration: 0.1 } },
  { text: 'TƏHDİD AŞKARLANDI: Brute-Force şifrə sındırma hücumu başladıldı!', type: 'warning', delay: 1200, sound: { frequency: 220, type: 'sawtooth', duration: 0.2 } },
  { text: 'Sistem yoxlanışı: Saniyədə 120+ giriş cəhdi (Siyahıdan şifrələr sınanır...)', type: 'warning', delay: 1500, sound: { frequency: 260, type: 'sawtooth', duration: 0.15 } },
  { text: 'Cəhdlər: "admin123" -> RƏDD EDİLDİ (Uğursuz)', type: 'error', delay: 800, sound: { frequency: 150, type: 'triangle', duration: 0.1 } },
  { text: 'Cəhdlər: "password" -> RƏDD EDİLDİ (Uğursuz)', type: 'error', delay: 800, sound: { frequency: 150, type: 'triangle', duration: 0.1 } },
  { text: 'Cəhdlər: "123456" -> RƏDD EDİLDİ (Uğursuz)', type: 'error', delay: 800, sound: { frequency: 150, type: 'triangle', duration: 0.1 } },
  { text: 'MÜDAFİƏ AKTİVLƏŞDİRİLDİ: IPS/IDS avtomatik qoruma qaydaları qoşuldu.', type: 'info', delay: 1200, sound: { frequency: 523.25, type: 'sine', duration: 0.15 } },
  { text: 'Müdafiə tərzi: Rate Limiting & Fail2Ban trigger edildi.', type: 'info', delay: 1000, sound: { frequency: 587.33, type: 'sine', duration: 0.1 } },
  { text: 'HÜCUM BLOKLANDI! Hücumçu IP ünvanı 48 saatlıq qara siyahıya salındı.', type: 'success', delay: 1500, sound: { frequency: 659.25, type: 'sine', duration: 0.3 } },
  { text: 'Sistem statusu: Təhlükəsiz. Kiber müdafiə uğurla tamamlandı.', type: 'success', delay: 500, sound: { frequency: 880, type: 'sine', duration: 0.4 } }
];

// Port scan simulation steps
export const PORT_SCAN_SIMULATION: SimulationStep[] = [
  { text: 'Simulyasiya başladıldı: Naməlum məkandan şəbəkə kəşfiyyatı analiz edilir...', type: 'info', delay: 1200, sound: { frequency: 440, type: 'sine', duration: 0.1 } },
  { text: 'Hədəf Server tapıldı: [213.172.91.44] (Enerji Şəbəkəsi)', type: 'info', delay: 1000, sound: { frequency: 440, type: 'sine', duration: 0.1 } },
  { text: 'TƏHDİD AŞKARLANDI: Sinxron Port Skan (TCP SYN Scan) cəhdləri!', type: 'warning', delay: 1200, sound: { frequency: 220, type: 'sawtooth', duration: 0.2 } },
  { text: 'Skaner Port 21 (FTP), Port 22 (SSH), Port 80 (HTTP) yoxlayır...', type: 'warning', delay: 1400, sound: { frequency: 260, type: 'sawtooth', duration: 0.1 } },
  { text: 'Təhlükəli Skan: Port 443 (HTTPS), Port 3389 (RDP) və Port 4840 (OPC UA SCADA) süzgəcdən keçirilir...', type: 'warning', delay: 1500, sound: { frequency: 260, type: 'sawtooth', duration: 0.1 } },
  { text: 'MÜDAFİƏ AKTİVLƏŞDİRİLDİ: Deep Packet Inspection (DPI) və Port Knocking filtri aktivdir.', type: 'info', delay: 1300, sound: { frequency: 523.25, type: 'sine', duration: 0.15 } },
  { text: 'Müdafiə Taktikası: Aldadıcı Portlar (Honeypot) aktivləşdirildi. Trafik tələyə yönləndirilir.', type: 'info', delay: 1200, sound: { frequency: 587.33, type: 'sine', duration: 0.15 } },
  { text: 'Skaner aldadıldı. Bütün həssas portlar "filtered" və ya "closed" olaraq maskalandı.', type: 'success', delay: 1400, sound: { frequency: 659.25, type: 'sine', duration: 0.25 } },
  { text: 'Skan edən IP ünvanı bloklandı və kəşfiyyat cəhdləri zərərsizləşdirildi.', type: 'success', delay: 500, sound: { frequency: 880, type: 'sine', duration: 0.3 } }
];

// DDoS attack simulation steps
export const DDOS_SIMULATION: SimulationStep[] = [
  { text: 'Simulyasiya başladıldı: Şəbəkə daxilolma və trafik həcmi ölçülür...', type: 'info', delay: 1000, sound: { frequency: 440, type: 'sine', duration: 0.1 } },
  { text: 'Hədəf Server tapıldı: [194.135.152.12] (Dövlət İnteqrasiya Portalı)', type: 'info', delay: 1000, sound: { frequency: 440, type: 'sine', duration: 0.1 } },
  { text: 'KRİTİK GƏRGİNLİK: Şəbəkəyə saniyədə 4.5 Milyon paket (4.5M pps) daxil olur!', type: 'error', delay: 1300, sound: { frequency: 180, type: 'sawtooth', duration: 0.3 } },
  { text: 'TƏHDİD AŞKARLANDI: Distributiv Xidmətdən İmtina (DDoS HTTP Flood) hücumu!', type: 'error', delay: 1400, sound: { frequency: 180, type: 'sawtooth', duration: 0.3 } },
  { text: 'Botnet analizi: Çin, Braziliya və Şərqi Avropa mənşəli 12,000+ unikal zombi IP aşkarlanıb.', type: 'warning', delay: 1500, sound: { frequency: 220, type: 'sawtooth', duration: 0.15 } },
  { text: 'MÜDAFİƏ AKTİVLƏŞDİRİLDİ: DDoS Scrubbing Center (Təmizləmə Mərkəzi) işə salındı.', type: 'info', delay: 1200, sound: { frequency: 523.25, type: 'sine', duration: 0.1 } },
  { text: 'Müdafiə üsulu: Geo-IP süzgəci və Anycast marşrutlaşdırma tətbiq olunur.', type: 'info', delay: 1200, sound: { frequency: 587.33, type: 'sine', duration: 0.1 } },
  { text: 'Təmizləmə uğurludur: Zərərli trafik süzüldü (99.8% bot sorğuları kənarlaşdırıldı).', type: 'success', delay: 1500, sound: { frequency: 659.25, type: 'sine', duration: 0.25 } },
  { text: 'Legitim istifadəçi trafiki bərpa edildi. Server gecikməsi normala (15ms) düşdü.', type: 'success', delay: 500, sound: { frequency: 880, type: 'sine', duration: 0.3 } }
];
