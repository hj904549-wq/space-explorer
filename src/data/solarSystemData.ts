export type Language = 'fa' | 'en';
export type CelestialId =
  | 'sun'
  | 'mercury'
  | 'venus'
  | 'earth'
  | 'mars'
  | 'jupiter'
  | 'saturn'
  | 'uranus'
  | 'neptune';

export type ScrollSectionId =
  | 'overview-start'
  | CelestialId
  | 'overview-end';

export interface GasComponent {
  symbol: string;
  name: { fa: string; en: string };
  percentage: number;
  color: string;
}

export interface InternalLayer {
  name: { fa: string; en: string };
  depth: string;
  color: string;
}

export interface MissionInfo {
  name: { fa: string; en: string };
  agency: string;
  year: string;
}

export type MoonId =
  | 'moon'
  | 'phobos'
  | 'deimos'
  | 'io'
  | 'europa'
  | 'ganymede'
  | 'callisto'
  | 'titan'
  | 'enceladus'
  | 'titania'
  | 'oberon'
  | 'triton';

export type MoonTextureType =
  | 'lunar'
  | 'rocky'
  | 'volcanic'
  | 'icy-cracked'
  | 'icy-dark'
  | 'titan'
  | 'enceladus'
  | 'triton';

export interface ReferenceMoonInfo {
  name: { fa: string; en: string };
  diameterKm: string;
  orbitNote: { fa: string; en: string };
}

export interface MoonInfo {
  id: MoonId;
  parentPlanetId: CelestialId;
  name: { fa: string; en: string };
  englishName: string;
  radius: number;
  distance: number;
  speed: number;
  color: string;
  textureType: MoonTextureType;
  diameterKm: number;
  diameterString: { fa: string; en: string };
  orbitalPeriodString: { fa: string; en: string };
  distanceFromPlanetKm: { fa: string; en: string };
  surfaceType: { fa: string; en: string };
  description: { fa: string; en: string };
  funFact: { fa: string; en: string };
}

export interface CelestialBodyData {
  id: CelestialId;
  stationCode: string;
  orderIndex: number;
  category: 'star' | 'terrestrial' | 'gas-giant' | 'ice-giant';
  categoryLabel: { fa: string; en: string };
  name: { fa: string; en: string };
  persianAltName?: string;
  englishName: string;
  badge: { fa: string; en: string };
  subtitle: { fa: string; en: string };
  headline: { fa: string; en: string };
  description: { fa: string; en: string };
  funFact: { fa: string; en: string };
  distinctiveFeature: { fa: string; en: string };
  auString: string;
  auNumeric: number;
  distanceKmString: { fa: string; en: string };
  diameterKm: number;
  diameterString: { fa: string; en: string };
  relativeScaleEarth: number;
  orbitalPeriodDays: number;
  orbitalPeriodString: { fa: string; en: string };
  orbitalYearsString: { fa: string; en: string };
  rotationPeriodString: { fa: string; en: string };
  meanTempC: number;
  tempString: { fa: string; en: string };
  tempContext: { fa: string; en: string };
  gravityMs2: number;
  gravityG: number;
  gravityString: { fa: string; en: string };
  moonsCount: number;
  moonsSummary: { fa: string; en: string };
  pressureKpaString: { fa: string; en: string };
  pressureContext: { fa: string; en: string };
  // 3D Scene visual & orbital parameters
  sceneRadius: number;
  orbitRadius: number;
  orbitSpeed: number; // rad/sec at 1x
  rotationSpeed: number; // rad/sec
  axialTiltDeg: number;
  initialAngle: number; // radians
  accentHex: string;
  atmosphereColor?: string;
  atmosphereOpacity?: number;
  hasRings?: boolean;
  ringInnerRadius?: number;
  ringOuterRadius?: number;
  moons3D: MoonInfo[];
  referenceMoons?: ReferenceMoonInfo[];
  // Camera offset in local view when approaching this body
  cameraDistance: number;
  cameraElevation: number;
  cameraSideOffset: number; // shifts planet left/right in viewport for cinematic composition
  layoutAlignment: 'right' | 'left';
  // Detailed Dossier Data
  atmosphereGases: GasComponent[];
  internalLayers: InternalLayer[];
  missions: MissionInfo[];
  keyMeasurements: Array<{
    label: { fa: string; en: string };
    value: { fa: string; en: string };
    accent?: 'primary' | 'secondary' | 'tertiary' | 'error';
  }>;
}

export const CELESTIAL_BODIES: CelestialBodyData[] = [
  {
    id: 'sun',
    stationCode: 'STATION #00',
    orderIndex: 0,
    category: 'star',
    categoryLabel: { fa: 'ستاره رشته اصلی (G2V)', en: 'G2V Main-Sequence Star' },
    name: { fa: 'خورشید', en: 'The Sun' },
    persianAltName: 'خور / مهر',
    englishName: 'Sun',
    badge: { fa: 'مرکز ثقل گرانشی', en: 'Gravitational Heart' },
    subtitle: { fa: 'STELLAR DOMAIN • G2V', en: 'STELLAR DOMAIN • G2V' },
    headline: {
      fa: 'خورشید (ستاره مادر و کوره همجوشی هسته‌ای)',
      en: 'The Sun — Stellar Furnace of the Solar System',
    },
    description: {
      fa: 'ستاره میزبان و قلب تپنده منظومه ما که بیش از ۹۹.۸۶ درصد از کل ماده موجود در سامانه خورشیدی را درون گرانش عظیم خود جا داده است. این ستاره از پلاسمای داغ هیدروژن و هلیوم ساخته شده و به واسطه واکنش همجوشی هسته‌ای پیوسته در هسته ۱۵ میلیون درجه‌ای خود، منبع اصلی حیات، نور و گرمای تمام سیارات است.',
      en: 'The host star and beating heart of our planetary system, holding 99.86% of the total mass of the Solar System. Forged from superheated hydrogen and helium plasma, continuous nuclear fusion inside its 15-million-degree core powers all light, heat, and life across the planets.',
    },
    funFact: {
      fa: 'در هر ثانیه حدود ۶۰۰ میلیون تن هیدروژن در هسته خورشید به هلیوم تبدیل می‌شود و تاج خورشیدی (Corona) هنگام کسوف کامل تا میلیون‌ها کیلومتر در فضا می‌درخشد.',
      en: 'Every second, the Sun fuses roughly 600 million tons of hydrogen into helium, generating solar winds that sculpt the heliosphere out to 120 AU.',
    },
    distinctiveFeature: {
      fa: 'تاج خورشیدی (Corona) و زبانه‌های غول‌پیکر پلاسمایی و مغناطیسی',
      en: 'Coronal mass ejections, magnetic prominence loops, and boiling convection cells',
    },
    auString: '0.00 AU',
    auNumeric: 0,
    distanceKmString: { fa: '۰ کیلومتر (مرکز منظومه)', en: '0 km (System Center)' },
    diameterKm: 1392700,
    diameterString: { fa: '۱,۳۹۲,۷۰۰ km', en: '1,392,700 km' },
    relativeScaleEarth: 109.2,
    orbitalPeriodDays: 0,
    orbitalPeriodString: { fa: 'مرکز مدار (۲۳۰ میلیون سال دور کهکشان)', en: '230M yrs (Galactic Orbit)' },
    orbitalYearsString: { fa: 'مرکز سامانه', en: 'System Center' },
    rotationPeriodString: { fa: '۲۵ روز (در استوا)', en: '25.4 Earth Days (Equator)' },
    meanTempC: 5500,
    tempString: { fa: '۵,۵۰۰ °C (سطح) / ۱۵M °C (هسته)', en: '5,500 °C (Surface) / 15M °C (Core)' },
    tempContext: { fa: 'پلاسمای گدازان همجوشی', en: 'Thermonuclear Plasma' },
    gravityMs2: 274.0,
    gravityG: 27.94,
    gravityString: { fa: '274.0 m/s² (27.9 g)', en: '274.0 m/s² (27.9 g)' },
    moonsCount: 0,
    moonsSummary: { fa: '۸ سیاره و بیش از ۲۰۰ قمر در مدار آن', en: '8 Planets & 200+ Moons in Orbit' },
    pressureKpaString: { fa: '> ۲۵ میلیارد bar (هسته)', en: '> 250 Billion bar (Core)' },
    pressureContext: { fa: 'فشار همجوشی گرماهسته‌ای', en: 'Thermonuclear Core Pressure' },
    sceneRadius: 7.2,
    orbitRadius: 0,
    orbitSpeed: 0,
    rotationSpeed: 0.14,
    axialTiltDeg: 7.25,
    initialAngle: 0,
    accentHex: '#f8c270',
    atmosphereColor: '#ff9d2e',
    atmosphereOpacity: 0.45,
    moons3D: [],
    cameraDistance: 18.5,
    cameraElevation: 3.2,
    cameraSideOffset: -6.5,
    layoutAlignment: 'right',
    atmosphereGases: [
      { symbol: 'H₂', name: { fa: 'هیدروژن', en: 'Hydrogen' }, percentage: 73.4, color: '#f8c270' },
      { symbol: 'He', name: { fa: 'هلیوم', en: 'Helium' }, percentage: 25.0, color: '#65d9ff' },
      { symbol: 'O/C/Fe', name: { fa: 'عناصر سنگین‌تر', en: 'Heavy Elements' }, percentage: 1.6, color: '#b2c5ff' },
    ],
    internalLayers: [
      { name: { fa: 'تاج و فام‌سپهر (Corona & Chromosphere)', en: 'Corona & Chromosphere' }, depth: 'اتمسفر بیرونی', color: '#f8c270' },
      { name: { fa: 'شیدسپهر و منطقه همرفتی (Photosphere)', en: 'Convective Zone & Photosphere' }, depth: '۲۰۰,۰۰۰ km', color: '#ff9d2e' },
      { name: { fa: 'منطقه تابشی و هسته همجوشی (Core)', en: 'Radiative Zone & Fusion Core' }, depth: 'شعاع ۱۷۵,۰۰۰ km', color: '#ffffff' },
    ],
    missions: [
      { name: { fa: 'کاوشگر خورشیدی پارکر (Parker Solar Probe)', en: 'Parker Solar Probe' }, agency: 'NASA', year: '2018' },
      { name: { fa: 'مدارگرد خورشیدی (Solar Orbiter)', en: 'Solar Orbiter' }, agency: 'ESA / NASA', year: '2020' },
      { name: { fa: 'رصدخانه پویایی‌شناسی خورشیدی (SDO)', en: 'Solar Dynamics Observatory' }, agency: 'NASA', year: '2010' },
    ],
    keyMeasurements: [
      { label: { fa: 'دمای هسته', en: 'Core Temp' }, value: { fa: '۱۵,۰۰۰,۰۰۰ °C', en: '15,000,000 °C' }, accent: 'tertiary' },
      { label: { fa: 'دمای سطح', en: 'Surface Temp' }, value: { fa: '۵,۵۰۰ °C', en: '5,500 °C' }, accent: 'tertiary' },
      { label: { fa: 'سهم از کل جرم', en: 'System Mass Share' }, value: { fa: '۹۹.۸۶ ٪', en: '99.86%' }, accent: 'primary' },
      { label: { fa: 'فاصله تا زمین', en: 'Distance to Earth' }, value: { fa: '۱۴۹.۶M km', en: '149.6M km' } },
    ],
  },
  {
    id: 'mercury',
    stationCode: 'STATION #01',
    orderIndex: 1,
    category: 'terrestrial',
    categoryLabel: { fa: 'سیاره درونی سنگی (زمین‌سان)', en: 'Inner Terrestrial Planet' },
    name: { fa: 'تیر (عطارد)', en: 'Mercury' },
    persianAltName: 'عطارد',
    englishName: 'Mercury',
    badge: { fa: 'نزدیک‌ترین سیاره', en: 'Closest to Sun' },
    subtitle: { fa: 'INNER ROCKY • SATELLITE-LESS', en: 'INNER ROCKY • SATELLITE-LESS' },
    headline: {
      fa: 'تیر / عطارد (تندپای گودال‌گون در همسایگی خورشید)',
      en: 'Mercury — The Sun-Scorched Cratered Messenger',
    },
    description: {
      fa: 'کوچک‌ترین سیاره منظومه شمسی و نزدیک‌ترین همسایه به خورشید. به دلیل نبود اتمسفر پایدار برای حفظ گرما، دچار شدیدترین نوسانات دمایی در منظومه می‌شود؛ روزهایی سوزاننده تا ۴۳۰ درجه و شب‌هایی فوق‌العاده منجمد تا منفی ۱۸۰ درجه سانتی‌گراد.',
      en: 'The smallest planet in the Solar System and closest neighbor to the Sun. Lacking a substantial atmosphere to retain heat, Mercury experiences the most extreme temperature swings of any planet—from blistering +430°C days to -180°C nights.',
    },
    funFact: {
      fa: 'طبق قانون دوم کپلر، تیر به دلیل نزدیکی به خورشید با سرعت شگفت‌انگیز ۴۷ کیلومتر بر ثانیه حرکت می‌کند و سال آن تنها ۸۸ روز زمینی است!',
      en: 'Following Kepler’s laws, Mercury hurtles around the Sun at 47 km/s—completing an entire year in just 88 Earth days.',
    },
    distinctiveFeature: {
      fa: 'سریع‌ترین گردش مداری به دور خورشید (۴۷ کیلومتر بر ثانیه) و هسته آهنی بسیار بزرگ',
      en: 'Fastest orbital velocity (47 km/s) and an oversized metallic iron core',
    },
    auString: '0.39 AU',
    auNumeric: 0.39,
    distanceKmString: { fa: '۵۷.۹ میلیون کیلومتر', en: '57.9M km' },
    diameterKm: 4879,
    diameterString: { fa: '۴,۸۷۹ km', en: '4,879 km' },
    relativeScaleEarth: 0.38,
    orbitalPeriodDays: 88,
    orbitalPeriodString: { fa: '۸۸ روز زمینی', en: '88 Earth Days' },
    orbitalYearsString: { fa: '0.24 سال زمینی', en: '0.24 Earth Years' },
    rotationPeriodString: { fa: '۵۸.۶ روز زمینی', en: '58.6 Earth Days' },
    meanTempC: 167,
    tempString: { fa: '-180 تا +430 °C', en: '-180 to +430 °C' },
    tempContext: { fa: 'میانگین +167 °C (نوسان شدید)', en: 'Mean +167 °C (Extreme Swing)' },
    gravityMs2: 3.7,
    gravityG: 0.38,
    gravityString: { fa: '3.70 m/s² (0.38 g)', en: '3.70 m/s² (0.38 g)' },
    moonsCount: 0,
    moonsSummary: { fa: '۰ قمر (فاقد قمر طبیعی)', en: '0 Natural Moons' },
    pressureKpaString: { fa: '~ 0 kPa (اگزوسفر ناچیز)', en: '~ 0 kPa (Trace Exosphere)' },
    pressureContext: { fa: 'عملاً خلأ فضایی', en: 'Near-Vacuum Exosphere' },
    sceneRadius: 1.15,
    orbitRadius: 16,
    orbitSpeed: 0.32,
    rotationSpeed: 0.08,
    axialTiltDeg: 0.03,
    initialAngle: 0.8,
    accentHex: '#94a3b8',
    moons3D: [],
    cameraDistance: 4.2,
    cameraElevation: 1.0,
    cameraSideOffset: 1.5,
    layoutAlignment: 'left',
    atmosphereGases: [
      { symbol: 'O₂', name: { fa: 'اکسیژن رقیق', en: 'Atomic Oxygen' }, percentage: 42, color: '#65d9ff' },
      { symbol: 'Na', name: { fa: 'بخار سدیم', en: 'Sodium' }, percentage: 29, color: '#f8c270' },
      { symbol: 'H₂/He', name: { fa: 'هیدروژن و هلیوم', en: 'Hydrogen & Helium' }, percentage: 29, color: '#879398' },
    ],
    internalLayers: [
      { name: { fa: 'پوسته سیلیکاتی دهانه‌دار (Crust)', en: 'Cratered Silicate Crust' }, depth: 'عمق ۳۵ km', color: '#879398' },
      { name: { fa: 'گوشته سنگی نازک (Mantle)', en: 'Silicate Mantle' }, depth: 'عمق ۴۰۰ km', color: '#64748b' },
      { name: { fa: 'هسته عظیم آهنی (Giant Iron Core)', en: 'Massive Iron Core (85% radius)' }, depth: 'شعاع ۲,۰۲۰ km', color: '#f8c270' },
    ],
    missions: [
      { name: { fa: 'فضاپیمای مسنجر (MESSENGER)', en: 'MESSENGER Orbiter' }, agency: 'NASA', year: '2011' },
      { name: { fa: 'ماموریت مشترک بپی‌کلمبو (BepiColombo)', en: 'BepiColombo Mission' }, agency: 'ESA / JAXA', year: '2018' },
    ],
    keyMeasurements: [
      { label: { fa: 'فاصله از خورشید', en: 'Distance to Sun' }, value: { fa: '57.9M km (0.39 AU)', en: '57.9M km (0.39 AU)' }, accent: 'primary' },
      { label: { fa: 'دوره چرخش مداری', en: 'Orbital Period' }, value: { fa: '۸۸ روز زمینی', en: '88 Earth Days' } },
      { label: { fa: 'دامنه دما', en: 'Temp Range' }, value: { fa: '-180 تا +430°C', en: '-180 to +430°C' }, accent: 'error' },
      { label: { fa: 'تعداد قمر', en: 'Moons' }, value: { fa: '۰ قمر', en: '0 Moons' } },
    ],
  },
  {
    id: 'venus',
    stationCode: 'STATION #02',
    orderIndex: 2,
    category: 'terrestrial',
    categoryLabel: { fa: 'سیاره درونی سنگی (زمین‌سان)', en: 'Inner Terrestrial Planet' },
    name: { fa: 'ناهید (زهره)', en: 'Venus' },
    persianAltName: 'زهره',
    englishName: 'Venus',
    badge: { fa: 'داغ‌ترین سیاره', en: 'Hottest Planet' },
    subtitle: { fa: 'INNER ROCKY • GREENHOUSE INFERNO', en: 'INNER ROCKY • GREENHOUSE INFERNO' },
    headline: {
      fa: 'ناهید / زهره (جهنم گلخانه‌ای زیر ابرهای اسیدی)',
      en: 'Venus — The Runaway Greenhouse Inferno',
    },
    description: {
      fa: 'خواهر دوقلوی زمین از دید اندازه و جرم، اما جهنمی سوزان از گازهای گلخانه‌ای. جو بسیار متراکم دی‌اکسید کربن (۹۶.۵٪) به همراه ابرهایی از قطرات اسید سولفوریک، گرمای خورشید را به دام انداخته و دمای سطح را به ۴۶۵ درجه سانتی‌گراد رسانده است. زهره در جهتی وارونه (ساعتگرد) به دور خود می‌چرخد.',
      en: 'Earth’s twin in size and mass, yet a scorching greenhouse inferno. Its crushing atmosphere of 96.5% carbon dioxide and sulfuric acid clouds traps solar radiation, raising surface temperatures to 465°C. Venus also rotates backwards (retrograde) clockwise.',
    },
    funFact: {
      fa: 'در سیاره ناهید یک شبانه‌روز (۲۴۳ روز زمینی) طولانی‌تر از یک سال کامل آن (۲۲۵ روز زمینی) است و خورشید در آن از مغرب طلوع می‌کند!',
      en: 'A single day on Venus (243 Earth days) lasts longer than its entire year (225 Earth days), and the Sun rises in the west!',
    },
    distinctiveFeature: {
      fa: 'اثر گلخانه‌ای لجام‌گسیخته و حرکت وضعی معکوس (ساعتگرد)',
      en: 'Extreme runaway greenhouse effect & retrograde clockwise rotation',
    },
    auString: '0.72 AU',
    auNumeric: 0.72,
    distanceKmString: { fa: '۱۰۸.۲ میلیون کیلومتر', en: '108.2M km' },
    diameterKm: 12104,
    diameterString: { fa: '۱۲,۱۰۴ km', en: '12,104 km' },
    relativeScaleEarth: 0.95,
    orbitalPeriodDays: 225,
    orbitalPeriodString: { fa: '۲۲۵ روز زمینی', en: '225 Earth Days' },
    orbitalYearsString: { fa: '0.62 سال زمینی', en: '0.62 Earth Years' },
    rotationPeriodString: { fa: '۲۴۳ روز (ساعتگرد/معکوس)', en: '243 Days (Retrograde)' },
    meanTempC: 465,
    tempString: { fa: '+465 °C', en: '+465 °C' },
    tempContext: { fa: 'داغ‌ترین سیاره منظومه', en: 'Hottest Planetary Surface' },
    gravityMs2: 8.87,
    gravityG: 0.9,
    gravityString: { fa: '8.87 m/s² (0.90 g)', en: '8.87 m/s² (0.90 g)' },
    moonsCount: 0,
    moonsSummary: { fa: '۰ قمر (فاقد قمر طبیعی)', en: '0 Natural Moons' },
    pressureKpaString: { fa: '9,200 kPa (92 bar)', en: '9,200 kPa (92 bar)' },
    pressureContext: { fa: '۹۲ برابر فشار جو زمین', en: '92x Earth Sea-Level Pressure' },
    sceneRadius: 1.75,
    orbitRadius: 24,
    orbitSpeed: 0.24,
    rotationSpeed: -0.05, // retrograde
    axialTiltDeg: 177.3,
    initialAngle: 2.3,
    accentHex: '#f3bd6b',
    atmosphereColor: '#ffca7a',
    atmosphereOpacity: 0.35,
    moons3D: [],
    cameraDistance: 6.0,
    cameraElevation: 1.4,
    cameraSideOffset: -2.2,
    layoutAlignment: 'right',
    atmosphereGases: [
      { symbol: 'CO₂', name: { fa: 'دی‌اکسید کربن', en: 'Carbon Dioxide' }, percentage: 96.5, color: '#f3bd6b' },
      { symbol: 'N₂', name: { fa: 'نیتروژن', en: 'Nitrogen' }, percentage: 3.5, color: '#b2c5ff' },
    ],
    internalLayers: [
      { name: { fa: 'پوسته بازالتی آتشفشانی (Crust)', en: 'Volcanic Basalt Crust' }, depth: 'عمق ۵۰ km', color: '#f3bd6b' },
      { name: { fa: 'گوشته سیلیکاتی داغ (Mantle)', en: 'Rocky Silicate Mantle' }, depth: 'عمق ۳,۰۰۰ km', color: '#d97706' },
      { name: { fa: 'هسته آهنی-نیکلی (Iron Core)', en: 'Metallic Iron-Nickel Core' }, depth: 'شعاع ۳,۰۰۰ km', color: '#ffb4ab' },
    ],
    missions: [
      { name: { fa: 'مدارگرد راداری ماژلان (Magellan)', en: 'Magellan Radar Orbiter' }, agency: 'NASA', year: '1989' },
      { name: { fa: 'مدارگرد آکاتسوکی (Akatsuki)', en: 'Akatsuki Climate Orbiter' }, agency: 'JAXA', year: '2015' },
    ],
    keyMeasurements: [
      { label: { fa: 'دمای سطح میانگین', en: 'Mean Surface Temp' }, value: { fa: '۴۶۵ °C', en: '465 °C' }, accent: 'error' },
      { label: { fa: 'فشار اتمسفر', en: 'Atmospheric Pressure' }, value: { fa: '۹۲ برابر زمین', en: '92x Earth (92 bar)' }, accent: 'tertiary' },
      { label: { fa: 'جهت چرخش وضعی', en: 'Rotation Direction' }, value: { fa: 'معکوس (ساعتگرد)', en: 'Retrograde (CW)' }, accent: 'secondary' },
      { label: { fa: 'مدار به دور خورشید', en: 'Orbital Period' }, value: { fa: '۲۲۵ روز', en: '225 Days' } },
    ],
  },
  {
    id: 'earth',
    stationCode: 'STATION #03',
    orderIndex: 3,
    category: 'terrestrial',
    categoryLabel: { fa: 'سیاره درونی سنگی (زیست‌کره)', en: 'Inner Terrestrial Biosphere' },
    name: { fa: 'زمین', en: 'Earth' },
    persianAltName: 'پهنه آبی',
    englishName: 'Earth',
    badge: { fa: 'گهواره حیات', en: 'Cradle of Life' },
    subtitle: { fa: 'THE BLUE MARBLE • HABITABLE ZONE', en: 'THE BLUE MARBLE • HABITABLE ZONE' },
    headline: {
      fa: 'زمین (نگین آبی زیست‌کره در کمربند طلایی حیات)',
      en: 'Earth — The Living Blue Marble in the Goldilocks Zone',
    },
    description: {
      fa: 'تنها مأمن شناخته‌شده دارای حیات در پهنه کیهان. قرارگیری دقیق در کمربند حیات (فاصله ۱ واحد نجومی از خورشید)، وجود اقیانوس‌های نیلگون از آب مایع (۷۱٪ سطح)، جو غنی از نیتروژن و اکسیژن، لایه محافظ ازن و میدان مغناطیسی قدرتمند، شرایط زیستی بی‌همتایی را پدید آورده‌اند.',
      en: 'The only known harbor of life in the cosmos. Positioned inside the solar habitable zone at exactly 1.00 AU, Earth combines liquid water oceans covering 71% of its surface, a breathable nitrogen-oxygen atmosphere, and a protective magnetosphere.',
    },
    funFact: {
      fa: 'انحراف ۲۳.۵ درجه‌ای محور چرخش زمین نسبت به مدار حرکت انتقالی آن، عامل اصلی پیدایش چهار فصل سال و تنوع اقلیمی سیاره ماست.',
      en: 'Earth’s 23.5° axial tilt relative to its orbital plane drives the four seasons and regulates global climate cycles.',
    },
    distinctiveFeature: {
      fa: 'آب مایع پایدار، زیست‌کره فعال، تکتونیک صفحه‌ای و قمر بزرگ ماه',
      en: 'Liquid oceans, active plate tectonics, biosphere, and stabilizing Moon',
    },
    auString: '1.00 AU',
    auNumeric: 1.0,
    distanceKmString: { fa: '۱۴۹.۶ میلیون کیلومتر (1.00 AU)', en: '149.6M km (1.00 AU)' },
    diameterKm: 12742,
    diameterString: { fa: '۱۲,۷۴۲ km', en: '12,742 km' },
    relativeScaleEarth: 1.0,
    orbitalPeriodDays: 365.25,
    orbitalPeriodString: { fa: '۳۶۵.۲۵ روز', en: '365.25 Days' },
    orbitalYearsString: { fa: '1.00 سال زمینی', en: '1.00 Earth Year' },
    rotationPeriodString: { fa: '۲۳ ساعت و ۵۶ دقیقه', en: '23h 56m 4s' },
    meanTempC: 15,
    tempString: { fa: '+15 °C', en: '+15 °C' },
    tempContext: { fa: 'پایدار برای آب مایع', en: 'Ideal for Liquid Water' },
    gravityMs2: 9.8,
    gravityG: 1.0,
    gravityString: { fa: '9.80 m/s² (1.00 g)', en: '9.80 m/s² (1.00 g)' },
    moonsCount: 1,
    moonsSummary: { fa: '۱ قمر (ماه / Luna)', en: '1 Moon (Luna)' },
    pressureKpaString: { fa: '101.3 kPa (1.00 bar)', en: '101.3 kPa (1.00 bar)' },
    pressureContext: { fa: 'استاندارد سطح دریا', en: 'Standard Habitable Pressure' },
    sceneRadius: 1.9,
    orbitRadius: 34,
    orbitSpeed: 0.18,
    rotationSpeed: 0.42,
    axialTiltDeg: 23.44,
    initialAngle: 0.35,
    accentHex: '#65d9ff',
    atmosphereColor: '#38bdf8',
    atmosphereOpacity: 0.32,
    moons3D: [
      {
        id: 'moon',
        parentPlanetId: 'earth',
        name: { fa: 'ماه (Luna)', en: 'The Moon (Luna)' },
        englishName: 'Moon',
        radius: 0.44,
        distance: 4.1,
        speed: 0.95,
        color: '#cbd5e1',
        textureType: 'lunar',
        diameterKm: 3474,
        diameterString: { fa: '۳,۴۷۴ km (۲۷٪ قطر زمین)', en: '3,474 km (27% of Earth)' },
        orbitalPeriodString: { fa: '۲۷.۳ روز زمینی (قفل گرانشی)', en: '27.3 Earth Days (Tidally Locked)' },
        distanceFromPlanetKm: { fa: '۳۸۴,۴۰۰ کیلومتر', en: '384,400 km' },
        surfaceType: { fa: 'پوسته سیلیکاتی، دریاوارهای بازالتی تیره و دهانه‌های برخوردی', en: 'Anorthositic highlands & dark basaltic maria' },
        description: {
          fa: 'تنها قمر طبیعی زمین و پنجمین قمر بزرگ منظومه شمسی. گرانش ماه عامل اصلی جزر و مد اقیانوس‌های زمین و پایدارسازی انحراف محوری ۲۳.۵ درجه‌ای سیاره ماست.',
          en: 'Earth’s sole natural satellite and the fifth-largest moon in the Solar System. Its gravitational pull drives ocean tides and stabilizes Earth’s 23.5° axial tilt.',
        },
        funFact: {
          fa: 'به دلیل «قفل گرانشی» (برابری دوره چرخش وضعی و انتقالی در ۲۷.۳ روز)، همواره تنها یک سمت ماه از روی زمین دیده می‌شود.',
          en: 'Because the Moon is tidally locked to Earth, its rotational period matches its 27.3-day orbit, keeping the same hemisphere facing us.',
        },
      },
    ],
    cameraDistance: 6.2,
    cameraElevation: 1.3,
    cameraSideOffset: 2.3,
    layoutAlignment: 'left',
    atmosphereGases: [
      { symbol: 'N₂', name: { fa: 'نیتروژن', en: 'Nitrogen' }, percentage: 78.0, color: '#65d9ff' },
      { symbol: 'O₂', name: { fa: 'اکسیژن', en: 'Oxygen' }, percentage: 21.0, color: '#f8c270' },
      { symbol: 'Ar/CO₂', name: { fa: 'آرگون و دی‌اکسید کربن', en: 'Argon, CO₂ & Vapor' }, percentage: 1.0, color: '#b2c5ff' },
    ],
    internalLayers: [
      { name: { fa: 'پوسته قاره‌ای و اقیانوسی (Crust)', en: 'Continental & Oceanic Crust' }, depth: '۵ تا ۷۰ km', color: '#65d9ff' },
      { name: { fa: 'گوشته سیلیکاتی (Upper & Lower Mantle)', en: 'Silicate Mantle' }, depth: 'عمق ۲,۸۹۰ km', color: '#f8c270' },
      { name: { fa: 'هسته بیرونی مایع و درونی جامد (Core)', en: 'Liquid Outer & Solid Inner Core' }, depth: 'شعاع ۳,۴۸۰ km', color: '#ffb4ab' },
    ],
    missions: [
      { name: { fa: 'ایستگاه فضایی بین‌المللی (ISS)', en: 'International Space Station' }, agency: 'Global', year: '1998' },
      { name: { fa: 'ماهواره سنتینل کوپرنیک (Sentinel)', en: 'Copernicus Sentinel Fleet' }, agency: 'ESA', year: '2014' },
    ],
    keyMeasurements: [
      { label: { fa: 'دوره گردش انتقالی', en: 'Orbital Period' }, value: { fa: '۳۶۵.۲۵ روز', en: '365.25 Days' }, accent: 'primary' },
      { label: { fa: 'پوشش آب سطحی', en: 'Ocean Coverage' }, value: { fa: '۷۱ ٪', en: '71%' }, accent: 'primary' },
      { label: { fa: 'قمر طبیعی', en: 'Natural Moon' }, value: { fa: '۱ (ماه / Moon)', en: '1 (Luna / Moon)' } },
      { label: { fa: 'گرانش مبنا', en: 'Surface Gravity' }, value: { fa: '1.00 g (9.8 m/s²)', en: '1.00 g (9.8 m/s²)' }, accent: 'secondary' },
    ],
  },
  {
    id: 'mars',
    stationCode: 'STATION #04',
    orderIndex: 4,
    category: 'terrestrial',
    categoryLabel: { fa: 'سیاره درونی سنگی (سیاره سرخ)', en: 'Inner Terrestrial Planet' },
    name: { fa: 'بهرام (مریخ)', en: 'Mars' },
    persianAltName: 'مریخ',
    englishName: 'Mars',
    badge: { fa: 'سیاره سرخ', en: 'The Red Planet' },
    subtitle: { fa: 'INNER ROCKY • THE RED FRONTIER', en: 'INNER ROCKY • THE RED FRONTIER' },
    headline: {
      fa: 'بهرام / مریخ (مرز سرخ کاوش‌های رباتیک و قله المپوس)',
      en: 'Mars — The Iron-Oxide Frontier & Olympus Mons',
    },
    description: {
      fa: 'سرزمین اکسید آهن (زنگ آهن) و پایگاه اصلی کاوش‌های رباتیک بشر. مریخ میزبان کوه المپوس (بلندترین آتشفشان منظومه شمسی با ارتفاع نزدیک به ۲۲ کیلومتر، سه‌برابر اورست) و دره عظیم مارینر است. شواهد زمین‌شناختی نشان می‌دهند در گذشته باستانی آب مایع در سطح آن جاری بوده است.',
      en: 'Blanketed in rust-red iron oxide dust and home to humanity’s robotic rovers. Mars boasts Olympus Mons—the tallest volcano in the Solar System at 21.9 km (triple Mount Everest)—and ancient riverbeds carved by liquid water billions of years ago.',
    },
    funFact: {
      fa: 'مریخ دو قمر کوچک و سیب‌زمینی‌شکل به نام‌های «فوبوس» و «دیموس» دارد که در واقع سیارک‌های به دام افتاده در گرانش بهرام هستند.',
      en: 'Mars is orbited by two captured asteroid moons—Phobos and Deimos—and experiences planet-wide dust storms.',
    },
    distinctiveFeature: {
      fa: 'کوه آتشفشانی المپوس (۲۱.۹ کیلومتر) و کلاهک‌های یخی قطبی از آب و یخ خشک',
      en: 'Olympus Mons (21.9 km shield volcano), Valles Marineris canyon & polar ice caps',
    },
    auString: '1.52 AU',
    auNumeric: 1.52,
    distanceKmString: { fa: '۲۲۷.۹ میلیون کیلومتر (1.52 AU)', en: '227.9M km (1.52 AU)' },
    diameterKm: 6779,
    diameterString: { fa: '۶,۷۷۹ km', en: '6,779 km' },
    relativeScaleEarth: 0.53,
    orbitalPeriodDays: 687,
    orbitalPeriodString: { fa: '۶۸۷ روز زمینی', en: '687 Earth Days' },
    orbitalYearsString: { fa: '1.88 سال زمینی', en: '1.88 Earth Years' },
    rotationPeriodString: { fa: '۲۴ ساعت و ۳۷ دقیقه', en: '24h 37m' },
    meanTempC: -62,
    tempString: { fa: '-62 °C', en: '-62 °C' },
    tempContext: { fa: 'بیابان منجمد سرخ', en: 'Frigid Polar & Desert World' },
    gravityMs2: 3.71,
    gravityG: 0.38,
    gravityString: { fa: '3.71 m/s² (0.38 g)', en: '3.71 m/s² (0.38 g)' },
    moonsCount: 2,
    moonsSummary: { fa: '۲ قمر (فوبوس و دیموس)', en: '2 Moons (Phobos & Deimos)' },
    pressureKpaString: { fa: '0.6 kPa (0.006 bar)', en: '0.6 kPa (0.006 bar)' },
    pressureContext: { fa: 'بسیار رقیق (< ۱٪ زمین)', en: 'Thin CO₂ (<1% of Earth)' },
    sceneRadius: 1.45,
    orbitRadius: 45,
    orbitSpeed: 0.14,
    rotationSpeed: 0.39,
    axialTiltDeg: 25.19,
    initialAngle: 3.8,
    accentHex: '#ffb4ab',
    atmosphereColor: '#f87171',
    atmosphereOpacity: 0.2,
    moons3D: [
      {
        id: 'phobos',
        parentPlanetId: 'mars',
        name: { fa: 'فوبوس (Phobos)', en: 'Phobos' },
        englishName: 'Phobos',
        radius: 0.24,
        distance: 2.7,
        speed: 1.55,
        color: '#a8a29e',
        textureType: 'rocky',
        diameterKm: 22.2,
        diameterString: { fa: '۲۲.۲ km (نامنظم)', en: '22.2 km (Irregular)' },
        orbitalPeriodString: { fa: '۷ ساعت و ۳۹ دقیقه', en: '7h 39m (Faster than Mars day)' },
        distanceFromPlanetKm: { fa: '۹,۳۷۶ کیلومتر (بسیار نزدیک)', en: '9,376 km' },
        surfaceType: { fa: 'سنگ‌های کربناتی تیره و دهانه بزرگ استیکنی', en: 'Carbonaceous chondrite regolith & Stickney crater' },
        description: {
          fa: 'بزرگ‌تر و نزدیک‌ترین قمر از دو قمر مریخ که تنها ۶۰۰۰ کیلومتر بالاتر از سطح بهرام گردش می‌کند و هر روز سه بار در آسمان مریخ طلوع و غروب می‌نماید.',
          en: 'The larger and inner moon of Mars, skimming just 6,000 km above the Martian surface and completing three orbits every Martian day.',
        },
        funFact: {
          fa: 'فوبوس در هر قرن حدود ۱.۸ متر به مریخ نزدیک‌تر می‌شود و تا ۵۰ میلیون سال آینده متلاشی شده و حلقه‌ای به دور مریخ تشکیل خواهد داد.',
          en: 'Phobos spirals inward by 1.8 meters per century and will eventually break apart into a planetary ring around Mars.',
        },
      },
      {
        id: 'deimos',
        parentPlanetId: 'mars',
        name: { fa: 'دیموس (Deimos)', en: 'Deimos' },
        englishName: 'Deimos',
        radius: 0.19,
        distance: 3.7,
        speed: 1.05,
        color: '#d6d3d1',
        textureType: 'rocky',
        diameterKm: 12.6,
        diameterString: { fa: '۱۲.۶ km (سیارک‌گون)', en: '12.6 km (Captured Asteroid)' },
        orbitalPeriodString: { fa: '۳۰ ساعت و ۱۸ دقیقه', en: '30h 18m' },
        distanceFromPlanetKm: { fa: '۲۳,۴۶۰ کیلومتر', en: '23,460 km' },
        surfaceType: { fa: 'سنگپوش نرم و غبارآلود کمربند سیارک‌ها', en: 'Smooth regolith-blanketed carbonaceous rock' },
        description: {
          fa: 'قمر کوچک‌تر و بیرونی مریخ که احتمالاً سیارکی از کمربند اصلی بوده و در دام گرانش بهرام افتاده است.',
          en: 'The smaller, outer moon of Mars, featuring a smoother cratered surface blanketed in fine regolith dust.',
        },
        funFact: {
          fa: 'گرانش دیموس به قدری ضعیف است که اگر روی سطح آن بپرید، می‌توانید با سرعت دوومیدانی از جاذبه آن فرار کنید!',
          en: 'Deimos has an escape velocity of just 20 km/h—a strong human jump could launch you into orbit.',
        },
      },
    ],
    cameraDistance: 5.0,
    cameraElevation: 1.1,
    cameraSideOffset: -1.8,
    layoutAlignment: 'right',
    atmosphereGases: [
      { symbol: 'CO₂', name: { fa: 'دی‌اکسید کربن', en: 'Carbon Dioxide' }, percentage: 95.3, color: '#ffb4ab' },
      { symbol: 'N₂', name: { fa: 'نیتروژن', en: 'Nitrogen' }, percentage: 2.6, color: '#b2c5ff' },
      { symbol: 'Ar', name: { fa: 'آرگون و اکسیژن', en: 'Argon & Trace O₂' }, percentage: 2.1, color: '#f8c270' },
    ],
    internalLayers: [
      { name: { fa: 'پوسته سطحی بازالتی اکسید آهن (Crust)', en: 'Iron-Oxide Basalt Crust' }, depth: 'عمق ۵۰ km', color: '#ffb4ab' },
      { name: { fa: 'گوشته سیلیکاتی غنی از آهن (Mantle)', en: 'Silicate Mantle' }, depth: 'عمق ۱,۸۰۰ km', color: '#fb923c' },
      { name: { fa: 'هسته متراکم آهن-گوگرد (Core)', en: 'Iron-Nickel-Sulfur Core' }, depth: 'شعاع ۱,۸۳۰ km', color: '#f8c270' },
    ],
    missions: [
      { name: { fa: 'مریخ‌نورد استقامت (Perseverance)', en: 'Perseverance Rover' }, agency: 'NASA', year: '2021' },
      { name: { fa: 'مریخ‌نورد کنجکاوی (Curiosity)', en: 'Curiosity Rover' }, agency: 'NASA', year: '2012' },
      { name: { fa: 'مدارگرد امید (Hope Probe)', en: 'Emirates Mars Mission' }, agency: 'UAESA', year: '2021' },
    ],
    keyMeasurements: [
      { label: { fa: 'کوه المپوس', en: 'Olympus Mons' }, value: { fa: '۲۱.۹ km ارتفاع', en: '21.9 km High' }, accent: 'error' },
      { label: { fa: 'مدار دور خورشید', en: 'Orbital Period' }, value: { fa: '۶۸۷ روز زمینی', en: '687 Earth Days' } },
      { label: { fa: 'اقمار طبیعی', en: 'Natural Moons' }, value: { fa: '۲ (فوبوس و دیموس)', en: '2 (Phobos & Deimos)' }, accent: 'primary' },
      { label: { fa: 'گرانش سطحی', en: 'Surface Gravity' }, value: { fa: '0.38 g (38% زمین)', en: '0.38 g (3.71 m/s²)' }, accent: 'secondary' },
    ],
  },
  {
    id: 'jupiter',
    stationCode: 'STATION #05',
    orderIndex: 5,
    category: 'gas-giant',
    categoryLabel: { fa: 'غول گازی بیرونی (مشتری‌سان)', en: 'Outer Jovian Gas Giant' },
    name: { fa: 'برجیس (مشتری)', en: 'Jupiter' },
    persianAltName: 'مشتری',
    englishName: 'Jupiter',
    badge: { fa: 'بزرگ‌ترین سیاره', en: 'King of Giants' },
    subtitle: { fa: 'GAS GIANT • KING OF PLANETS', en: 'GAS GIANT • KING OF PLANETS' },
    headline: {
      fa: 'برجیس / مشتری (پادشاه غول‌های گازی و طوفان لکه سرخ بزرگ)',
      en: 'Jupiter — Sovereign Gas Giant & The Great Red Spot',
    },
    description: {
      fa: 'غول گازی عظیم که جرم آن ۲.۵ برابر مجموع تمام سیارات دیگر منظومه شمسی است. مشتری با چرخش وضعی پرشتاب خود (تنها ۹ ساعت و ۵۵ دقیقه برای یک شبانه‌روز کامل)، سریع‌ترین چرخش را در میان سیارات دارد. لکه سرخ بزرگ، طوفانی بیضوی و بزرگ‌تر از زمین است که بیش از ۳۰۰ سال خروشیده است.',
      en: 'A colossal gas giant holding 2.5 times the combined mass of all other planets. Rotating in just 9 hours 55 minutes, Jupiter’s rapid spin whips ammonia clouds into vivid bands and fuels the Great Red Spot—an anticyclonic storm larger than Earth raging for over 300 years.',
    },
    funFact: {
      fa: 'مشتری مانند یک سپر گرانشی عظیم برای زمین عمل می‌کند و بسیاری از دنباله‌دارها و سیارک‌های خطرناک را به سوی خود منحرف یا جذب می‌نماید.',
      en: 'Jupiter acts as Earth’s gravitational shield, deflecting or capturing long-period comets and rogue asteroids.',
    },
    distinctiveFeature: {
      fa: 'طوفان لکه سرخ بزرگ و ۴ قمر گالیله‌ای (گانیمد، اروپا، آیو، کالیستو)',
      en: 'Great Red Spot storm & the 4 Galilean moons (Io, Europa, Ganymede, Callisto)',
    },
    auString: '5.20 AU',
    auNumeric: 5.2,
    distanceKmString: { fa: '۷۷۸.۵ میلیون کیلومتر (5.20 AU)', en: '778.5M km (5.20 AU)' },
    diameterKm: 139820,
    diameterString: { fa: '۱۳۹,۸۲۰ km', en: '139,820 km' },
    relativeScaleEarth: 10.97,
    orbitalPeriodDays: 4333,
    orbitalPeriodString: { fa: '۴,۳۳۳ روز (۱۱.۸۶ سال)', en: '4,333 Days (11.86 yrs)' },
    orbitalYearsString: { fa: '11.86 سال زمینی', en: '11.86 Earth Years' },
    rotationPeriodString: { fa: '۹ ساعت و ۵۵ دقیقه (سریع‌ترین)', en: '9h 55m (Fastest Spin)' },
    meanTempC: -110,
    tempString: { fa: '-110 °C', en: '-110 °C' },
    tempContext: { fa: 'دمای فوقانی ابرها', en: 'Upper Cloud Deck Temp' },
    gravityMs2: 24.79,
    gravityG: 2.53,
    gravityString: { fa: '24.79 m/s² (2.53 g)', en: '24.79 m/s² (2.53 g)' },
    moonsCount: 95,
    moonsSummary: { fa: '۹۵ قمر (۴ قمر بزرگ گالیله‌ای)', en: '95 Moons (4 Galilean Giants)' },
    pressureKpaString: { fa: '> 200,000 kPa', en: '> 200,000 kPa (Deep Gas)' },
    pressureContext: { fa: 'فشار شدید در اعماق هیدروژن فلزی', en: 'Crushing Metallic Hydrogen Deep Interior' },
    sceneRadius: 4.1,
    orbitRadius: 64,
    orbitSpeed: 0.085,
    rotationSpeed: 0.85,
    axialTiltDeg: 3.13,
    initialAngle: 1.5,
    accentHex: '#b2c5ff',
    atmosphereColor: '#fed7aa',
    atmosphereOpacity: 0.22,
    moons3D: [
      {
        id: 'io',
        parentPlanetId: 'jupiter',
        name: { fa: 'آیو (Io)', en: 'Io' },
        englishName: 'Io',
        radius: 0.3,
        distance: 5.7,
        speed: 1.75,
        color: '#facc15',
        textureType: 'volcanic',
        diameterKm: 3643,
        diameterString: { fa: '۳,۶۴۳ km', en: '3,643 km' },
        orbitalPeriodString: { fa: '۱.۷۷ روز زمینی', en: '1.77 Earth Days' },
        distanceFromPlanetKm: { fa: '۴۲۱,۷۰۰ کیلومتر', en: '421,700 km' },
        surfaceType: { fa: 'بیش از ۴۰۰ آتشفشان فعال و دشت‌های گوگرد مذاب', en: 'Over 400 active volcanoes & sulfur-silicate plains' },
        description: {
          fa: 'نزدیک‌ترین قمر از چهار قمر گالیله‌ای مشتری و فعال‌ترین جرم آتشفشانی در کل منظومه شمسی. کشندهای گرانشی شدید مشتری درون آیو را ذوب می‌کند.',
          en: 'The innermost Galilean moon of Jupiter and the most volcanically active world in the Solar System, heated by intense tidal flexing.',
        },
        funFact: {
          fa: 'فوران‌های آتشفشانی گوگرد در آیو تا ارتفاع ۵۰۰ کیلومتری در فضا پرتاب می‌شوند!',
          en: 'Volcanic plumes on Io blast sulfur dioxide umbrella clouds up to 500 km into space.',
        },
      },
      {
        id: 'europa',
        parentPlanetId: 'jupiter',
        name: { fa: 'اروپا (Europa)', en: 'Europa' },
        englishName: 'Europa',
        radius: 0.27,
        distance: 6.9,
        speed: 1.35,
        color: '#e0f2fe',
        textureType: 'icy-cracked',
        diameterKm: 3122,
        diameterString: { fa: '۳,۱۲۲ km', en: '3,122 km' },
        orbitalPeriodString: { fa: '۳.۵۵ روز زمینی', en: '3.55 Earth Days' },
        distanceFromPlanetKm: { fa: '۶۷۰,۹۰۰ کیلومتر', en: '670,900 km' },
        surfaceType: { fa: 'پوسته یخ‌آب صیقلی با خطوط شکاف‌دار و اقیانوس زیرسطحی', en: 'Smooth fractured water-ice shell over global ocean' },
        description: {
          fa: 'قمر یخی مشتری که در زیر پوسته منجمد و ترک‌خورده خود، اقیانوسی عظیم از آب مایع شور (با حجمی دو برابر کل آب‌های زمین) پنهان کرده است.',
          en: 'Beneath Europa’s crisscrossed water-ice crust lies a global saltwater ocean holding twice the liquid water of all Earth’s oceans combined.',
        },
        funFact: {
          fa: 'اروپا یکی از امیدبخش‌ترین مکان‌ها در منظومه شمسی برای جستجوی حیات میکروبی فرازمینی است (هدف ماموریت Europa Clipper).',
          en: 'Europa’s subsurface ocean is a prime astrobiological target in the search for life beyond Earth.',
        },
      },
      {
        id: 'ganymede',
        parentPlanetId: 'jupiter',
        name: { fa: 'گانیمد (Ganymede)', en: 'Ganymede' },
        englishName: 'Ganymede',
        radius: 0.38,
        distance: 8.2,
        speed: 0.98,
        color: '#cbd5e1',
        textureType: 'icy-dark',
        diameterKm: 5268,
        diameterString: { fa: '۵,۲۶۸ km (بزرگ‌ترین قمر منظومه)', en: '5,268 km (Largest Moon in System)' },
        orbitalPeriodString: { fa: '۷.۱۵ روز زمینی', en: '7.15 Earth Days' },
        distanceFromPlanetKm: { fa: '۱,۰۷۰,۴۰۰ کیلومتر', en: '1,070,400 km' },
        surfaceType: { fa: 'پوسته یخی شیاردار، سنگ‌های سیلیکاتی و میدان مغناطیسی مستقل', en: 'Grooved water-ice & silicate rock with magnetosphere' },
        description: {
          fa: 'بزرگ‌ترین قمر در کل منظومه شمسی که قطر آن حتی از سیاره تیر (عطارد) نیز بیشتر است و تنها قمری است که میدان مغناطیسی مستقل دارد.',
          en: 'The largest moon in the Solar System—bigger than planet Mercury—and the only known moon with its own internally generated magnetic field.',
        },
        funFact: {
          fa: 'اگر گانیمد به جای گردش به دور مشتری، مستقیماً به دور خورشید می‌گشت، به عنوان یک سیاره کامل طبقه‌بندی می‌شد!',
          en: 'Ganymede is 8% wider than Mercury and possesses its own auroral belts.',
        },
      },
      {
        id: 'callisto',
        parentPlanetId: 'jupiter',
        name: { fa: 'کالیستو (Callisto)', en: 'Callisto' },
        englishName: 'Callisto',
        radius: 0.34,
        distance: 9.5,
        speed: 0.72,
        color: '#94a3b8',
        textureType: 'icy-dark',
        diameterKm: 4821,
        diameterString: { fa: '۴,۸۲۱ km (سومین قمر بزرگ)', en: '4,821 km (3rd Largest Moon)' },
        orbitalPeriodString: { fa: '۱۶.۶۹ روز زمینی', en: '16.69 Earth Days' },
        distanceFromPlanetKm: { fa: '۱,۸۸۲,۷۰۰ کیلومتر', en: '1,882,700 km' },
        surfaceType: { fa: 'کهن‌ترین و پرچاله‌ترین سطح یخی-سنگی در منظومه شمسی', en: 'Ancient, heavily cratered ice-rock lithosphere' },
        description: {
          fa: 'چهارمین و دورترین قمر گالیله‌ای مشتری که سطح آن رکورددار تراکم دهانه‌های برخوردی باستانی در منظومه شمسی است.',
          en: 'The outermost Galilean moon, preserving the oldest and most densely cratered surface in the Solar System.',
        },
        funFact: {
          fa: 'به دلیل فاصله زیاد از کمربند تابشی مرگبار مشتری، کالیستو امن‌ترین مکان برای احداث پایگاه انسانی آینده در مدار مشتری است.',
          en: 'Orbiting outside Jupiter’s intense radiation belt, Callisto is considered the safest site for future human exploration of the Jovian system.',
        },
      },
    ],
    referenceMoons: [
      { name: { fa: 'آملثیا (Amalthea)', en: 'Amalthea' }, diameterKm: '167 km', orbitNote: { fa: 'قمر درونی سرخ‌رنگ (مدار ۱۸۱ هزار km)', en: 'Inner irregular red moon (181,400 km)' } },
      { name: { fa: 'هیمالیا (Himalia)', en: 'Himalia' }, diameterKm: '140 km', orbitNote: { fa: 'بزرگ‌ترین قمر نامنظم بیرونی مشتری', en: 'Largest outer irregular prograde moon' } },
      { name: { fa: 'تبه (Thebe)', en: 'Thebe' }, diameterKm: '98 km', orbitNote: { fa: 'تامین‌کننده غبار حلقه‌های کم‌نور مشتری', en: 'Inner moon feeding Gossamer ring dust' } },
      { name: { fa: 'متیس (Metis)', en: 'Metis' }, diameterKm: '43 km', orbitNote: { fa: 'نزدیک‌ترین قمر درونی مشتری (۱۲۸ هزار km)', en: 'Innermost moon inside main ring' } },
    ],
    cameraDistance: 12.2,
    cameraElevation: 2.6,
    cameraSideOffset: 4.4,
    layoutAlignment: 'left',
    atmosphereGases: [
      { symbol: 'H₂', name: { fa: 'هیدروژن مولکولی', en: 'Molecular Hydrogen' }, percentage: 89.8, color: '#b2c5ff' },
      { symbol: 'He', name: { fa: 'هلیوم', en: 'Helium' }, percentage: 10.2, color: '#f8c270' },
    ],
    internalLayers: [
      { name: { fa: 'جو ابری آمونیاک و هیدروژن (Cloud Layer)', en: 'Ammonia & Hydrogen Cloud Bands' }, depth: '۱,۰۰۰ km', color: '#f8c270' },
      { name: { fa: 'اقیانوس هیدروژن فلزی مایع (Metallic H₂)', en: 'Liquid Metallic Hydrogen' }, depth: 'عمق ۴۰,۰۰۰ km', color: '#b2c5ff' },
      { name: { fa: 'هسته سنگی-فلزی فشرده (Dense Core)', en: 'Dense Rocky/Metallic Core' }, depth: 'مرکز سیاره', color: '#65d9ff' },
    ],
    missions: [
      { name: { fa: 'مدارگرد قطبی جونو (Juno)', en: 'Juno Polar Orbiter' }, agency: 'NASA', year: '2016' },
      { name: { fa: 'کاوشگر اقمار یخی مشتری (JUICE)', en: 'JUICE Icy Moons Explorer' }, agency: 'ESA', year: '2023' },
      { name: { fa: 'اروپا کلیپر (Europa Clipper)', en: 'Europa Clipper' }, agency: 'NASA', year: '2024' },
    ],
    keyMeasurements: [
      { label: { fa: 'تعداد اقمار تایید شده', en: 'Confirmed Moons' }, value: { fa: '۹۵ قمر', en: '95 Moons' }, accent: 'secondary' },
      { label: { fa: 'طول شبانه‌روز', en: 'Day Length' }, value: { fa: '۹.۹ ساعت', en: '9.9 Hours' }, accent: 'primary' },
      { label: { fa: 'طوفان لکه سرخ', en: 'Great Red Spot' }, value: { fa: '> ۳۰۰ سال قدمت', en: '> 300 Years Active' }, accent: 'error' },
      { label: { fa: 'سپر محافظتی زمین', en: 'Orbital Role' }, value: { fa: 'جاذب دنباله‌دارها', en: 'Comet Shield' }, accent: 'tertiary' },
    ],
  },
  {
    id: 'saturn',
    stationCode: 'STATION #06',
    orderIndex: 6,
    category: 'gas-giant',
    categoryLabel: { fa: 'غول گازی بیرونی (سلطان حلقه‌ها)', en: 'Outer Ringed Gas Giant' },
    name: { fa: 'کیوان (زحل)', en: 'Saturn' },
    persianAltName: 'زحل',
    englishName: 'Saturn',
    badge: { fa: 'سلطان حلقه‌ها', en: 'Ringed Majesty' },
    subtitle: { fa: 'GAS GIANT • RINGED MAJESTY', en: 'GAS GIANT • RINGED MAJESTY' },
    headline: {
      fa: 'کیوان / زحل (جواهر حلقه‌دار منظومه و رکورددار قمرها)',
      en: 'Saturn — Crown Jewel of the Solar System & Icy Rings',
    },
    description: {
      fa: 'تماشایی‌ترین منظره در آسمان شب؛ غول گازی طلایی‌رنگی که با کمربندی خیره‌کننده به وسعت ۲۸۲ هزار کیلومتر از میلیاردها قطعه یخ خالص و غبار کیهانی احاطه شده است. چگالی میانگین زحل (۰.۶۹ گرم بر سانتی‌متر مکعب) از آب هم کمتر است!',
      en: 'The crown jewel of the cosmos, encircled by a dazzling 282,000-km ring system composed of billions of pure water-ice particles. Saturn’s mean density (0.687 g/cm³) is lower than liquid water, and it hosts 146 known moons led by Titan.',
    },
    funFact: {
      fa: 'قمر بزرگ زحل به نام «تیتان»، تنها قمر دارای اتمسفر غلیظ در منظومه شمسی است و رودخانه‌ها و دریاچه‌هایی از متان و اتان مایع در سطح آن جریان دارند!',
      en: 'Saturn’s largest moon, Titan, possesses a dense nitrogen atmosphere and liquid methane rivers, lakes, and rain.',
    },
    distinctiveFeature: {
      fa: 'سامانه حلقه‌های یخی درخشان، چگالی کمتر از آب و ۱۴۶ قمر ثبت‌شده',
      en: 'Spectacular concentric ice rings, density lower than water & north polar hexagon',
    },
    auString: '9.58 AU',
    auNumeric: 9.58,
    distanceKmString: { fa: '۱.۴۳ میلیارد کیلومتر (9.58 AU)', en: '1.43B km (9.58 AU)' },
    diameterKm: 116460,
    diameterString: { fa: '۱۱۶,۴۶۰ km', en: '116,460 km' },
    relativeScaleEarth: 9.14,
    orbitalPeriodDays: 10759,
    orbitalPeriodString: { fa: '۱۰,۷۵۹ روز (۲۹.۴ سال)', en: '10,759 Days (29.4 yrs)' },
    orbitalYearsString: { fa: '29.45 سال زمینی', en: '29.45 Earth Years' },
    rotationPeriodString: { fa: '۱۰ ساعت و ۳۳ دقیقه', en: '10h 33m' },
    meanTempC: -140,
    tempString: { fa: '-140 °C', en: '-140 °C' },
    tempContext: { fa: 'ابرهای آمونیاک منجمد', en: 'Frozen Ammonia Cloud Tops' },
    gravityMs2: 10.44,
    gravityG: 1.06,
    gravityString: { fa: '10.44 m/s² (1.06 g)', en: '10.44 m/s² (1.06 g)' },
    moonsCount: 146,
    moonsSummary: { fa: '۱۴۶ قمر (رکورددار منظومه — تیتان، انسلادوس)', en: '146 Moons (Most in System — Titan, Enceladus)' },
    pressureKpaString: { fa: '> 100,000 kPa', en: '> 100,000 kPa' },
    pressureContext: { fa: 'فشار عمیق گازی', en: 'Deep Gas Envelope' },
    sceneRadius: 3.4,
    orbitRadius: 84,
    orbitSpeed: 0.06,
    rotationSpeed: 0.72,
    axialTiltDeg: 26.73,
    initialAngle: 4.7,
    accentHex: '#ffddb0',
    atmosphereColor: '#fde68a',
    atmosphereOpacity: 0.2,
    hasRings: true,
    ringInnerRadius: 4.3,
    ringOuterRadius: 8.2,
    moons3D: [
      {
        id: 'enceladus',
        parentPlanetId: 'saturn',
        name: { fa: 'انسلادوس (Enceladus)', en: 'Enceladus' },
        englishName: 'Enceladus',
        radius: 0.22,
        distance: 5.4,
        speed: 1.55,
        color: '#f8fafc',
        textureType: 'enceladus',
        diameterKm: 504,
        diameterString: { fa: '۵۰۴ km', en: '504 km' },
        orbitalPeriodString: { fa: '۱.۳۷ روز زمینی', en: '1.37 Earth Days' },
        distanceFromPlanetKm: { fa: '۲۳۸,۰۰۰ کیلومتر', en: '238,000 km' },
        surfaceType: { fa: 'سفیدترین و بازتابنده‌ترین یخ منظومه با آب‌فشان‌های قطب جنوب', en: 'Ultra-bright fresh water ice & south polar cryogeysers' },
        description: {
          fa: 'قمر یخی درخشان زحل که از شکاف‌های قطب جنوب خود («خطوط ببری»)، فواره‌های عظیمی از بخار آب و مولکول‌های آلی به فضا پرتاب می‌کند.',
          en: 'A brilliant ice moon whose south polar "Tiger Stripes" vent towering plumes of water vapor, ice grains, and organic compounds from a warm subsurface ocean.',
        },
        funFact: {
          fa: 'ذرات یخ پرتاب‌شده از آب‌فشان‌های انسلادوس، حلقه بیرونی E در اطراف سیاره زحل را می‌سازند!',
          en: 'Geysers erupting from Enceladus continuously supply the icy particles that form Saturn’s outer E Ring.',
        },
      },
      {
        id: 'titan',
        parentPlanetId: 'saturn',
        name: { fa: 'تیتان (Titan)', en: 'Titan' },
        englishName: 'Titan',
        radius: 0.39,
        distance: 9.4,
        speed: 0.85,
        color: '#fbbf24',
        textureType: 'titan',
        diameterKm: 5149,
        diameterString: { fa: '۵,۱۴۹ km (دومین قمر بزرگ)', en: '5,149 km (2nd Largest Moon)' },
        orbitalPeriodString: { fa: '۱۵.۹۵ روز زمینی', en: '15.95 Earth Days' },
        distanceFromPlanetKm: { fa: '۱,۲۲۱,۸۷۰ کیلومتر', en: '1,221,870 km' },
        surfaceType: { fa: 'جو غلیظ نیتروژنی نارنجی و دریاچه‌های متان و اتان مایع', en: 'Dense golden nitrogen haze & liquid hydrocarbon lakes' },
        description: {
          fa: 'بزرگ‌ترین قمر زحل و تنها قمر دارای اتمسفر ضخیم (۱.۵ برابر فشار جو زمین) در منظومه شمسی. تیتان بزرگ‌تر از سیاره عطارد است.',
          en: 'Saturn’s largest moon—bigger than planet Mercury—and the only moon in the Solar System shrouded in a thick nitrogen-rich atmosphere with liquid methane rain and seas.',
        },
        funFact: {
          fa: 'در سال ۲۰۰۵ کاوشگر اروپایی «هویگنس» روی سطح تیتان فرود آمد که دورترین فرود تاریخ بشر بر روی یک جرم کیهانی است.',
          en: 'In 2005, the Huygens probe landed on Titan’s hydrocarbon plains—humanity’s farthest touchdown on another world.',
        },
      },
    ],
    referenceMoons: [
      { name: { fa: 'ریا (Rhea)', en: 'Rhea' }, diameterKm: '1,527 km', orbitNote: { fa: 'دومین قمر بزرگ زحل، بدنه یخی کهن', en: 'Second-largest moon of Saturn (527,000 km)' } },
      { name: { fa: 'یاپتوس (Iapetus)', en: 'Iapetus' }, diameterKm: '1,469 km', orbitNote: { fa: 'قمر دورنگ (یک نیمکره سیاه و یک نیمکره سفید)', en: 'Two-toned walnut moon with equatorial ridge' } },
      { name: { fa: 'دیونه (Dione)', en: 'Dione' }, diameterKm: '1,123 km', orbitNote: { fa: 'صخره‌های یخی درخشان و مدار هم‌زمان', en: 'Dense icy moon with bright wispy cliffs' } },
      { name: { fa: 'تتیس (Tethys)', en: 'Tethys' }, diameterKm: '1,062 km', orbitNote: { fa: 'دارای دره عظیم ایتاکا و دهانه اودیسه', en: 'Pure water-ice body with Odysseus crater' } },
      { name: { fa: 'میماس (Mimas)', en: 'Mimas' }, diameterKm: '396 km', orbitNote: { fa: 'دهانه بزرگ هرشل (ظاهر شبیه ستاره مرگ)', en: 'Home to giant Herschel impact crater' } },
    ],
    cameraDistance: 13.8,
    cameraElevation: 3.8,
    cameraSideOffset: -4.8,
    layoutAlignment: 'right',
    atmosphereGases: [
      { symbol: 'H₂', name: { fa: 'هیدروژن', en: 'Hydrogen' }, percentage: 96.3, color: '#ffddb0' },
      { symbol: 'He', name: { fa: 'هلیوم', en: 'Helium' }, percentage: 3.25, color: '#65d9ff' },
      { symbol: 'CH₄', name: { fa: 'متان و آمونیاک', en: 'Methane & Ammonia' }, percentage: 0.45, color: '#b2c5ff' },
    ],
    internalLayers: [
      { name: { fa: 'سامانه حلقه‌های یخی (A, B, C Rings)', en: 'Concentric Water-Ice Rings' }, depth: 'وسعت ۲۸۲,۰۰۰ km', color: '#ffddb0' },
      { name: { fa: 'لایه هیدروژن مایع و هلیوم (Liquid H₂)', en: 'Liquid Hydrogen & Helium Layer' }, depth: 'عمق ۳۰,۰۰۰ km', color: '#f8c270' },
      { name: { fa: 'هسته سنگی-یخی متراکم (Rocky Core)', en: 'Dense Rocky & Metallic Core' }, depth: 'شعاع ۱۲,۰۰۰ km', color: '#65d9ff' },
    ],
    missions: [
      { name: { fa: 'مدارگرد کاسینی-هویگنس (Cassini)', en: 'Cassini-Huygens Mission' }, agency: 'NASA / ESA', year: '2004' },
      { name: { fa: 'پهپاد هسته‌ای دراگون‌فلای به تیتان', en: 'Dragonfly Titan Rotorcraft' }, agency: 'NASA', year: '2028' },
    ],
    keyMeasurements: [
      { label: { fa: 'اقمار ثبت شده', en: 'Confirmed Moons' }, value: { fa: '۱۴۶ قمر (رکورددار)', en: '146 Moons (#1)' }, accent: 'tertiary' },
      { label: { fa: 'چگالی میانگین', en: 'Mean Density' }, value: { fa: '0.687 g/cm³ (< آب)', en: '0.687 g/cm³ (< Water)' }, accent: 'primary' },
      { label: { fa: 'گستره حلقه‌ها', en: 'Ring Span' }, value: { fa: '۲۸۲,۰۰۰ km', en: '282,000 km' } },
      { label: { fa: 'مدار دور خورشید', en: 'Orbital Period' }, value: { fa: '۲۹.۴ سال زمینی', en: '29.4 Earth Years' }, accent: 'secondary' },
    ],
  },
  {
    id: 'uranus',
    stationCode: 'STATION #07',
    orderIndex: 7,
    category: 'ice-giant',
    categoryLabel: { fa: 'غول یخی بیرونی', en: 'Outer Ice Giant' },
    name: { fa: 'اورانوس', en: 'Uranus' },
    englishName: 'Uranus',
    badge: { fa: 'انحراف محوری عجیب', en: 'The Tilted Ice Giant' },
    subtitle: { fa: 'ICE GIANT • 98° AXIAL TILT', en: 'ICE GIANT • 98° AXIAL TILT' },
    headline: {
      fa: 'اورانوس (غول یخی فیروزه‌ای که بر پهلو به دور خورشید می‌غلتد)',
      en: 'Uranus — The Cyan Ice Giant Rolling on Its Side',
    },
    description: {
      fa: 'غول یخی رازآلود با انحراف محوری شگفت‌انگیز ۹۷.۷۷ درجه که گویی بر روی پهلو در مدار خود غلت می‌خورد! این انحراف نامتعارف موجب پدید آمدن فصل‌هایی به درازای ۲۱ سال زمینی می‌شود. گاز متان موجود در جو فوقانی، نور قرمز خورشید را جذب کرده و رنگ فیروزه‌ای آرامی به آن بخشیده است.',
      en: 'An enigmatic ice giant knocked onto its side with a 97.77° axial tilt, causing it to roll around the Sun and experience 21-year-long seasons. Upper atmospheric methane absorbs red wavelengths, bathing Uranus in a serene cyan-turquoise glow.',
    },
    funFact: {
      fa: 'اورانوس با حداقل دمای اتمسفری منفی ۲۲۴.۲ درجه سانتی‌گراد، سردترین جو سیاره‌ای را در کل منظومه شمسی دارد.',
      en: 'Reaching -224.2°C, Uranus holds the record for the coldest planetary atmosphere in the Solar System.',
    },
    distinctiveFeature: {
      fa: 'انحراف محوری ۹۸ درجه‌ای، ۱۳ حلقه عمودی تیره و سردترین اتمسفر سیاره‌ای',
      en: '97.77° sideways axial tilt, vertical faint ring system & coldest atmosphere',
    },
    auString: '19.22 AU',
    auNumeric: 19.22,
    distanceKmString: { fa: '۲.۸۷ میلیارد کیلومتر (19.22 AU)', en: '2.87B km (19.22 AU)' },
    diameterKm: 50724,
    diameterString: { fa: '۵۰,۷۲۴ km', en: '50,724 km' },
    relativeScaleEarth: 3.98,
    orbitalPeriodDays: 30687,
    orbitalPeriodString: { fa: '۳۰,۶۸۷ روز (۸۴ سال)', en: '30,687 Days (84 yrs)' },
    orbitalYearsString: { fa: '84.0 سال زمینی', en: '84.0 Earth Years' },
    rotationPeriodString: { fa: '۱۷ ساعت و ۱۴ دقیقه (معکوس)', en: '17h 14m (Retrograde)' },
    meanTempC: -195,
    tempString: { fa: '-195 °C (حداقل -224°C)', en: '-195 °C (Min -224°C)' },
    tempContext: { fa: 'سردترین جو منظومه', en: 'Coldest Planetary Atmosphere' },
    gravityMs2: 8.69,
    gravityG: 0.89,
    gravityString: { fa: '8.69 m/s² (0.89 g)', en: '8.69 m/s² (0.89 g)' },
    moonsCount: 28,
    moonsSummary: { fa: '۲۸ قمر (تیتانیا، اوبرون، میراندا)', en: '28 Moons (Titania, Oberon, Miranda)' },
    pressureKpaString: { fa: '> 10,000 kPa', en: '> 10,000 kPa' },
    pressureContext: { fa: 'گوشته یخی آب، آمونیاک و متان', en: 'Supercritical Icy Fluid Mantle' },
    sceneRadius: 2.5,
    orbitRadius: 104,
    orbitSpeed: 0.042,
    rotationSpeed: -0.5,
    axialTiltDeg: 97.77,
    initialAngle: 5.5,
    accentHex: '#b7eaff',
    atmosphereColor: '#67e8f9',
    atmosphereOpacity: 0.28,
    hasRings: true,
    ringInnerRadius: 3.1,
    ringOuterRadius: 4.1,
    moons3D: [
      {
        id: 'titania',
        parentPlanetId: 'uranus',
        name: { fa: 'تیتانیا (Titania)', en: 'Titania' },
        englishName: 'Titania',
        radius: 0.25,
        distance: 4.7,
        speed: 1.15,
        color: '#bae6fd',
        textureType: 'icy-cracked',
        diameterKm: 1578,
        diameterString: { fa: '۱,۵۷۸ km (بزرگ‌ترین قمر اورانوس)', en: '1,578 km (Largest Uranian Moon)' },
        orbitalPeriodString: { fa: '۸.۷۱ روز زمینی', en: '8.71 Earth Days' },
        distanceFromPlanetKm: { fa: '۴۳۵,۹۱۰ کیلومتر', en: '435,910 km' },
        surfaceType: { fa: 'مخلوط مساوی یخ‌آب و سنگ با دره‌های گسلی عظیم', en: 'Equal parts water ice and silicate rock with fault canyons' },
        description: {
          fa: 'بزرگ‌ترین قمر اورانوس و هشتمین قمر بزرگ منظومه شمسی که سطح آن با دره‌های گسلی عظیمی همچون مسینا چاسما بریده شده است.',
          en: 'The largest moon of Uranus, scarred by giant fault valleys up to 1,500 km long formed as its interior froze and expanded.',
        },
        funFact: {
          fa: 'نام تمام ۲۸ قمر اورانوس برگرفته از شخصیت‌های نمایشنامه‌های ویلیام شکسپیر و الکساندر پوپ است!',
          en: 'Unlike other planets named after mythology, Uranian moons are named after characters from Shakespeare and Alexander Pope.',
        },
      },
      {
        id: 'oberon',
        parentPlanetId: 'uranus',
        name: { fa: 'اوبرون (Oberon)', en: 'Oberon' },
        englishName: 'Oberon',
        radius: 0.23,
        distance: 5.8,
        speed: 0.85,
        color: '#93c5fd',
        textureType: 'icy-dark',
        diameterKm: 1523,
        diameterString: { fa: '۱,۵۲۳ km (دومین قمر بزرگ اورانوس)', en: '1,523 km (2nd Largest Uranian Moon)' },
        orbitalPeriodString: { fa: '۱۳.۴۶ روز زمینی', en: '13.46 Earth Days' },
        distanceFromPlanetKm: { fa: '۵۸۳,۵۲۰ کیلومتر', en: '583,520 km' },
        surfaceType: { fa: 'پوسته یخی تیره و کهن با قله‌های ۱۱ کیلومتری', en: 'Heavily cratered dark ice crust with 11-km mountain peaks' },
        description: {
          fa: 'دورترین و دومین قمر بزرگ از پنج قمر اصلی اورانوس که دارای سطحی تیره، باستانی و مملو از دهانه‌های برخوردی است.',
          en: 'The outermost and second-largest major moon of Uranus, composed of roughly half water ice and half rocky material.',
        },
        funFact: {
          fa: 'در کف دهانه‌های برخوردی اوبرون، مواد تیره‌رنگی دیده می‌شود که احتمالاً حاصل فوران آب‌های غنی از کربن از درون قمر است.',
          en: 'Voyager 2 imaged a mountain peak rising 11 km above Oberon’s limb—taller than Mount Everest.',
        },
      },
    ],
    referenceMoons: [
      { name: { fa: 'آریل (Ariel)', en: 'Ariel' }, diameterKm: '1,158 km', orbitNote: { fa: 'درخشان‌ترین و جوان‌ترین سطح در میان اقمار اورانوس', en: 'Brightest and youngest surface among Uranian moons' } },
      { name: { fa: 'آمبریل (Umbriel)', en: 'Umbriel' }, diameterKm: '1,169 km', orbitNote: { fa: 'تیره‌ترین قمر بزرگ اورانوس با حلقه نورانی ووندا', en: 'Darkest major moon with mysterious bright Wunda ring' } },
      { name: { fa: 'میراندا (Miranda)', en: 'Miranda' }, diameterKm: '471 km', orbitNote: { fa: 'دارای بلندترین پرتگاه یخی منظومه (ورونا روپس ۲۰ km)', en: 'Features Verona Rupes—a 20-km-high ice cliff' } },
    ],
    cameraDistance: 8.2,
    cameraElevation: 1.8,
    cameraSideOffset: 3.0,
    layoutAlignment: 'left',
    atmosphereGases: [
      { symbol: 'H₂', name: { fa: 'هیدروژن', en: 'Hydrogen' }, percentage: 82.5, color: '#b7eaff' },
      { symbol: 'He', name: { fa: 'هلیوم', en: 'Helium' }, percentage: 15.2, color: '#b2c5ff' },
      { symbol: 'CH₄', name: { fa: 'متان (عامل رنگ فیروزه‌ای)', en: 'Methane' }, percentage: 2.3, color: '#65d9ff' },
    ],
    internalLayers: [
      { name: { fa: 'جو هیدروژن، هلیوم و متان (Atmosphere)', en: 'Hydrogen-Helium-Methane Atmosphere' }, depth: '۵,۰۰۰ km', color: '#b7eaff' },
      { name: { fa: 'گوشته یخی پرفشار (آب، آمونیاک، متان)', en: 'Icy Mantle (Water, Ammonia, Methane)' }, depth: 'عمق ۱۵,۰۰۰ km', color: '#38bdf8' },
      { name: { fa: 'هسته سنگی-سیلیکاتی (Silicate Core)', en: 'Compact Silicate-Iron Core' }, depth: 'مرکز سیاره', color: '#879398' },
    ],
    missions: [
      { name: { fa: 'کاوشگر وویجر ۲ (Voyager 2)', en: 'Voyager 2 Flyby' }, agency: 'NASA', year: '1986' },
      { name: { fa: 'تلسکوپ فضایی جیمز وب (JWST Rings)', en: 'JWST Infrared Ring Imaging' }, agency: 'NASA / ESA', year: '2023' },
    ],
    keyMeasurements: [
      { label: { fa: 'انحراف محور چرخش', en: 'Axial Tilt' }, value: { fa: '۹۷.۷۷ درجه', en: '97.77° (Sideways)' }, accent: 'primary' },
      { label: { fa: 'حداقل دمای اتمسفر', en: 'Min Temp' }, value: { fa: '-۲۲۴.۲ °C', en: '-224.2 °C' }, accent: 'primary' },
      { label: { fa: 'تعداد اقمار', en: 'Known Moons' }, value: { fa: '۲۸ قمر', en: '28 Moons' } },
      { label: { fa: 'مدار دور خورشید', en: 'Orbital Period' }, value: { fa: '۸۴ سال زمینی', en: '84 Earth Years' }, accent: 'secondary' },
    ],
  },
  {
    id: 'neptune',
    stationCode: 'STATION #08',
    orderIndex: 8,
    category: 'ice-giant',
    categoryLabel: { fa: 'غول یخی بیرونی (مرز منظومه)', en: 'Outer Ice Giant' },
    name: { fa: 'نپتون', en: 'Neptune' },
    englishName: 'Neptune',
    badge: { fa: 'آخرین سیاره رسمی', en: 'The Supersonic Edge' },
    subtitle: { fa: 'ICE GIANT • SUPERSONIC WINDS', en: 'ICE GIANT • SUPERSONIC WINDS' },
    headline: {
      fa: 'نپتون (نگهبان لاجوردی کرانه‌های منظومه و بادهای فراصوت)',
      en: 'Neptune — Deep Cerulean Sentinel of the Outer Rim',
    },
    description: {
      fa: 'دورافتاده‌ترین سیاره رسمی از خورشید که در فاصله‌ای نزدیک به ۴.۵ میلیارد کیلومتر (۳۰ واحد نجومی) غوطه‌ور است. این غول یخی خاستگاه بادهای فراصوت دهشتناکی با سرعت بیش از ۲,۱۰۰ کیلومتر بر ساعت است؛ شدیدترین تندبادهایی که تاکنون در منظومه شمسی ثبت شده‌اند.',
      en: 'The farthest official planet from the Sun, orbiting at 30.05 AU (4.5 billion km) in deep twilight. Neptune’s dynamic azure atmosphere drives supersonic methane winds exceeding 2,100 km/h—the fastest sustained winds anywhere in the Solar System.',
    },
    funFact: {
      fa: 'نپتون نخستین سیاره‌ای بود که قبل از دیده شدن با تلسکوپ، مکان آن صرفاً با محاسبات ریاضی و اختلال گرانشی مدار اورانوس پیش‌بینی شد!',
      en: 'Neptune was the first planet discovered through mathematical prediction before ever being seen through a telescope.',
    },
    distinctiveFeature: {
      fa: 'بادهای فراصوت ۲۱۰۰ کیلومتر بر ساعت و قمر یخ‌فشانی «تریتون»',
      en: 'Supersonic 2,100 km/h winds & retrograde cryovolcanic moon Triton',
    },
    auString: '30.05 AU',
    auNumeric: 30.05,
    distanceKmString: { fa: '۴.۵۰ میلیارد کیلومتر (30.05 AU)', en: '4.50B km (30.05 AU)' },
    diameterKm: 49244,
    diameterString: { fa: '۴۹,۲۴۴ km', en: '49,244 km' },
    relativeScaleEarth: 3.86,
    orbitalPeriodDays: 60190,
    orbitalPeriodString: { fa: '۶۰,۱۹۰ روز (۱۶۴.۸ سال)', en: '60,190 Days (164.8 yrs)' },
    orbitalYearsString: { fa: '164.8 سال زمینی', en: '164.8 Earth Years' },
    rotationPeriodString: { fa: '۱۶ ساعت و ۶ دقیقه', en: '16h 06m' },
    meanTempC: -200,
    tempString: { fa: '-200 °C', en: '-200 °C' },
    tempContext: { fa: 'مرز کمربند کویپر', en: 'Deep Twilight Ice Giant' },
    gravityMs2: 11.15,
    gravityG: 1.14,
    gravityString: { fa: '11.15 m/s² (1.14 g)', en: '11.15 m/s² (1.14 g)' },
    moonsCount: 16,
    moonsSummary: { fa: '۱۶ قمر (تریتون با مدار پس‌رونده)', en: '16 Moons (Triton in Retrograde Orbit)' },
    pressureKpaString: { fa: '> 10,000 kPa', en: '> 10,000 kPa' },
    pressureContext: { fa: 'اقیانوس فوق‌بحرانی یخ و الماس بارانی', en: 'High-Pressure Diamond-Rain Mantle' },
    sceneRadius: 2.4,
    orbitRadius: 122,
    orbitSpeed: 0.03,
    rotationSpeed: 0.55,
    axialTiltDeg: 28.32,
    initialAngle: 2.9,
    accentHex: '#60a5fa',
    atmosphereColor: '#3b82f6',
    atmosphereOpacity: 0.32,
    moons3D: [
      {
        id: 'triton',
        parentPlanetId: 'neptune',
        name: { fa: 'تریتون (Triton)', en: 'Triton' },
        englishName: 'Triton',
        radius: 0.29,
        distance: 4.8,
        speed: -1.25,
        color: '#dbeafe',
        textureType: 'triton',
        diameterKm: 2707,
        diameterString: { fa: '۲,۷۰۷ km (بزرگ‌ترین قمر نپتون)', en: '2,707 km (Largest Neptunian Moon)' },
        orbitalPeriodString: { fa: '۵.۸۸ روز (مدار پس‌رونده/معکوس)', en: '5.88 Days (Retrograde Orbit)' },
        distanceFromPlanetKm: { fa: '۳۵۴,۷۵۹ کیلومتر', en: '354,759 km' },
        surfaceType: { fa: 'یخ نیتروژن منجمد، عوارض طالبی‌شکل و یخ‌فشان‌های فعال', en: 'Frozen nitrogen crust, cantaloupe terrain & cryogeysers' },
        description: {
          fa: 'بزرگ‌ترین قمر نپتون و تنها قمر بزرگ در منظومه شمسی که در جهتی خلاف چرخش سیاره مادر خود («مدار پس‌رونده») حرکت می‌کند.',
          en: 'Neptune’s largest moon and the only large moon in the Solar System with a retrograde orbit—evidence it was captured from the Kuiper Belt.',
        },
        funFact: {
          fa: 'تریتون با دمای سطحی منفی ۲۳۵ درجه یکی از سردترین اجرام منظومه است، اما یخ‌فشان‌های فعال نیتروژن مایع دارد!',
          en: 'At -235°C, Triton erupts dark nitrogen gas plumes 8 km high into its thin atmosphere.',
        },
      },
    ],
    referenceMoons: [
      { name: { fa: 'پروتئوس (Proteus)', en: 'Proteus' }, diameterKm: '420 km', orbitNote: { fa: 'دومین قمر بزرگ نپتون با شکل چندوجهی تیره', en: 'Second-largest Neptunian moon, box-like polyhedron' } },
      { name: { fa: 'نرئید (Nereid)', en: 'Nereid' }, diameterKm: '340 km', orbitNote: { fa: 'دارای کشیده‌ترین مدار بیضوی در میان اقمار منظومه', en: 'Highly eccentric orbit (1.4M to 9.6M km)' } },
      { name: { fa: 'لاریسا (Larissa)', en: 'Larissa' }, diameterKm: '194 km', orbitNote: { fa: 'قمر درونی نزدیک به حلقه‌های کمانی نپتون', en: 'Inner cratered moon near Neptune’s ring arcs' } },
    ],
    cameraDistance: 8.0,
    cameraElevation: 1.7,
    cameraSideOffset: -2.9,
    layoutAlignment: 'right',
    atmosphereGases: [
      { symbol: 'H₂', name: { fa: 'هیدروژن', en: 'Hydrogen' }, percentage: 80.0, color: '#60a5fa' },
      { symbol: 'He', name: { fa: 'هلیوم', en: 'Helium' }, percentage: 19.0, color: '#b2c5ff' },
      { symbol: 'CH₄', name: { fa: 'متان (رنگ آبی لاجوردی)', en: 'Methane' }, percentage: 1.5, color: '#65d9ff' },
    ],
    internalLayers: [
      { name: { fa: 'جو فوقانی ابرهای متان (Upper Clouds)', en: 'High-Altitude Methane Cirrus Clouds' }, depth: '۴,۰۰۰ km', color: '#60a5fa' },
      { name: { fa: 'گوشته یخی داغ و متراکم (Icy Mantle)', en: 'Water-Ammonia-Methane Icy Mantle' }, depth: 'عمق ۱۷,۰۰۰ km', color: '#1d4292' },
      { name: { fa: 'هسته سنگی و آهنی (Rocky Core)', en: 'Rocky Silicate-Nickel Core' }, depth: 'مرکز سیاره', color: '#65d9ff' },
    ],
    missions: [
      { name: { fa: 'پرواز کناری وویجر ۲ (Voyager 2)', en: 'Voyager 2 Encounter' }, agency: 'NASA', year: '1989' },
      { name: { fa: 'رصد فروسرخ جیمز وب (JWST)', en: 'JWST Near-Infrared Observation' }, agency: 'NASA / ESA', year: '2022' },
    ],
    keyMeasurements: [
      { label: { fa: 'حداکثر سرعت باد', en: 'Peak Wind Speed' }, value: { fa: '+۲,۱۰۰ km/h', en: '+2,100 km/h' }, accent: 'primary' },
      { label: { fa: 'فاصله از خورشید', en: 'Distance to Sun' }, value: { fa: '۴.۵ میلیارد km', en: '4.5 Billion km' }, accent: 'secondary' },
      { label: { fa: 'دوره گردش مداری', en: 'Orbital Period' }, value: { fa: '۱۶۴.۸ سال زمینی', en: '164.8 Earth Years' } },
      { label: { fa: 'اقمار تایید شده', en: 'Confirmed Moons' }, value: { fa: '۱۶ قمر (تریتون)', en: '16 Moons (Triton)' }, accent: 'tertiary' },
    ],
  },
];

export const SCROLL_SECTIONS: ScrollSectionId[] = [
  'overview-start',
  'sun',
  'mercury',
  'venus',
  'earth',
  'mars',
  'jupiter',
  'saturn',
  'uranus',
  'neptune',
  'overview-end',
];

export interface CurriculumModule {
  id: string;
  number: string;
  title: { fa: string; en: string };
  subtitle: { fa: string; en: string };
  badge: string;
  summary: { fa: string; en: string };
  examTip: { fa: string; en: string };
  metrics: Array<{ label: { fa: string; en: string }; value: string; color: string }>;
}

export const CURRICULUM_MODULES: CurriculumModule[] = [
  {
    id: 'nebula',
    number: '01',
    title: { fa: 'منظومه شمسی چیست؟ و نحوه پیدایش آن', en: 'Origin of the Solar System (Solar Nebula)' },
    subtitle: { fa: 'فرضیه سحابی خورشیدی، تراکم ابر گاز و غبار در ۴.۶ میلیارد سال پیش', en: 'Gravitational collapse of the primordial molecular cloud 4.6 billion years ago' },
    badge: '4.6 Gyr Ago',
    summary: {
      fa: 'منظومه شمسی مجموعه‌ای متشکل از یک ستاره مرکزی به نام خورشید و کلیه اجرام در مدار گرانشی آن (شامل ۸ سیاره، سیارات کوتوله، اقمار، سیارک‌ها، شهاب‌وارها و دنباله‌دارها) است. بر اساس نظریه سحابی خورشیدی، این سامانه حدود ۴.۶ میلیارد سال پیش بر اثر فروریزش گرانشی یک ابر مولکولی عظیم از گاز هیدروژن و غبار کیهانی شکل گرفت.',
      en: 'The Solar System consists of our central star, the Sun, and all gravitationally bound objects orbiting it: 8 planets, dwarf planets, moons, asteroids, and comets. It formed 4.6 billion years ago from the gravitational collapse of a rotating giant molecular cloud.',
    },
    examTip: {
      fa: 'اکثر جرم سحابی اولیه (حدود ۹۹.۸۶٪) در مرکز متراکم شده و خورشید را تشکیل داد. دیسک پیش‌سیاره‌ای اطراف، با افزایش سرعت دوران خود به دور مرکز، سیارات سنگی درونی و غول‌های گازی بیرونی را پدید آورد.',
      en: '99.86% of the primordial nebula’s mass collapsed into the central protosun, while the flattened protoplanetary disk accreted into the planets.',
    },
    metrics: [
      { label: { fa: 'سن تخمینی', en: 'Estimated Age' }, value: '4.6×10⁹ YR', color: 'text-[#65d9ff]' },
      { label: { fa: 'سهم جرم خورشید', en: 'Solar Mass Share' }, value: '99.86%', color: 'text-[#f8c270]' },
      { label: { fa: 'شعاع هلیوپاز', en: 'Heliopause Radius' }, value: '~120 AU', color: 'text-[#b2c5ff]' },
    ],
  },
  {
    id: 'fusion',
    number: '02',
    title: { fa: 'خورشید و فرآیند تولید انرژی همجوشی', en: 'The Sun & Thermonuclear Fusion' },
    subtitle: { fa: 'واکنش همجوشی هسته‌ای هیدروژن به هلیوم، لایه‌های خورشید و بادهای خورشیدی', en: 'Proton-proton chain fusion of hydrogen into helium & solar wind magnetosphere interaction' },
    badge: '4H → He + Energy',
    summary: {
      fa: 'خورشید تنها ستاره منظومه ماست که انرژی عظیم خود را از طریق فرایند همجوشی هسته‌ای (Nuclear Fusion) در هسته با دمای تقریبی ۱۵ میلیون درجه سانتی‌گراد تامین می‌کند. در این واکنش، هسته‌های هیدروژن با یکدیگر پیوند خورده و به هلیوم تبدیل می‌شوند و کسری جرم طبق رابطه E=mc² به نور و گرما تبدیل می‌گردد.',
      en: 'The Sun generates energy via nuclear fusion in its 15-million-°C core. Hydrogen nuclei fuse into helium, converting mass directly into gamma-ray photons and thermal energy via E=mc².',
    },
    examTip: {
      fa: 'برخورد ذرات پرانرژی باد خورشیدی با میدان مغناطیسی زمین در نزدیکی قطب‌ها موجب برانگیختگی گازهای جو و پیدایش شفق قطبی (Aurora) می‌شود.',
      en: 'Charged particles from the solar wind are funneled by Earth’s magnetosphere toward the poles, exciting upper atmospheric gases to create auroras.',
    },
    metrics: [
      { label: { fa: 'واکنش هسته', en: 'Core Reaction' }, value: '4 ¹H → ⁴He', color: 'text-[#f8c270]' },
      { label: { fa: 'آزادسازی انرژی', en: 'Energy Yield' }, value: '26.7 MeV', color: 'text-[#65d9ff]' },
      { label: { fa: 'زمان رسیدن نور به زمین', en: 'Light Travel to Earth' }, value: '8m 20s', color: 'text-[#b2c5ff]' },
    ],
  },
  {
    id: 'terrestrial-jovian',
    number: '03',
    title: { fa: 'سیارات درونی در برابر سیارات بیرونی', en: 'Terrestrial vs. Jovian Planets' },
    subtitle: { fa: 'مقایسه جنس، چگالی میانگین، تعداد قمرها، حلقه‌ها و کمربند سیارک‌ها', en: 'Comparing rocky inner planets and outer gas/ice giants across the asteroid belt' },
    badge: '4 Rocky / 4 Giant',
    summary: {
      fa: 'کمربند اصلی سیارک‌ها (بین بهرام و مشتری) مرز حائل بین دو دسته بزرگ سیاره‌ای است: سیارات درونی (تیر، ناهید، زمین، بهرام) با سطح جامد سنگی، چگالی بالا و قمرهای اندک؛ و سیارات بیرونی (مشتری، کیوان، اورانوس، نپتون) با حجم عظیم گازی، چگالی کم، حلقه‌ها و قمرهای پرشمار.',
      en: 'The main asteroid belt between Mars and Jupiter divides the four dense, rocky terrestrial worlds from the four massive, ring-bearing gas and ice giants.',
    },
    examTip: {
      fa: 'زحل (کیوان) با چگالی ۰.۶۹ گرم بر سانتی‌متر مکعب کمترین چگالی (کمتر از آب) و زمین با ۵.۵۱ گرم بر سانتی‌متر مکعب بیشترین چگالی را در منظومه دارند.',
      en: 'Saturn has the lowest mean density (0.687 g/cm³, less than water), whereas Earth has the highest mean density (5.51 g/cm³) of any planet.',
    },
    metrics: [
      { label: { fa: 'چگالی سنگی‌ها', en: 'Terrestrial Density' }, value: '3.9–5.5 g/cm³', color: 'text-[#65d9ff]' },
      { label: { fa: 'چگالی گازی‌ها', en: 'Jovian Density' }, value: '0.7–1.6 g/cm³', color: 'text-[#b2c5ff]' },
      { label: { fa: 'مرز جداسازی', en: 'Dividing Boundary' }, value: '2.2–3.2 AU', color: 'text-[#f8c270]' },
    ],
  },
  {
    id: 'rotation-revolution',
    number: '04',
    title: { fa: 'حرکت وضعی و انتقالی سیارات', en: 'Planetary Rotation vs. Revolution' },
    subtitle: { fa: 'پیدایش شبانه‌روز، تقویم سالیانه، انحراف محور و پیدایش فصول', en: 'Sidereal day length, orbital year, axial tilt, and seasonal mechanics' },
    badge: '23.5° Tilt',
    summary: {
      fa: 'چرخش هر سیاره حول محور فرضی خودش «حرکت وضعی» (عامل پیدایش شبانه‌روز) و گردش سیاره در مدار بیضوی به دور خورشید «حرکت انتقالی» (عامل پیدایش سال) نامیده می‌شود. جهت استاندارد هر دو حرکت پادساعت‌گرد (مغرب به مشرق) است به جز حرکت وضعی ناهید و اورانوس.',
      en: 'Rotation around a planet’s axis creates day and night, while revolution around the Sun defines its year. All planets orbit counterclockwise, and all except Venus and Uranus rotate counterclockwise.',
    },
    examTip: {
      fa: 'علت پیدایش فصول در زمین تغییر فاصله تا خورشید نیست، بلکه انحراف ۲۳.۵ درجه‌ای محور وضعی زمین و تغییر زاویه تابش خورشید در طول حرکت انتقالی است.',
      en: 'Seasons on Earth are caused by its 23.5° axial tilt changing sunlight incidence angles during its orbit—not by distance variations from the Sun.',
    },
    metrics: [
      { label: { fa: 'شبانه‌روز نجومی زمین', en: 'Earth Sidereal Day' }, value: '23h 56m', color: 'text-[#65d9ff]' },
      { label: { fa: 'سریع‌ترین چرخش وضعی', en: 'Fastest Rotation' }, value: 'Jupiter (9h 55m)', color: 'text-[#b2c5ff]' },
      { label: { fa: 'کندترین چرخش وضعی', en: 'Slowest Rotation' }, value: 'Venus (243d)', color: 'text-[#f8c270]' },
    ],
  },
  {
    id: 'kepler-newton',
    number: '05',
    title: { fa: 'قوانین مداری کپلر و گرانش نیوتون', en: 'Kepler’s Laws & Newtonian Gravity' },
    subtitle: { fa: 'مدارهای بیضوی، مساحت‌های مساوی، رابطه فاصله تا خورشید و دوره تناوب', en: 'Elliptical orbits, equal areas in equal times, and harmonic orbital period scaling' },
    badge: 'T² ∝ a³',
    summary: {
      fa: 'قانون اول کپلر بیان می‌کند مدار سیارات بیضی است و خورشید در یکی از کانون‌هاست. قانون دوم نشان می‌دهد سیاره در نزدیک‌ترین نقطه به خورشید (حضیض) بیشترین سرعت مداری را دارد. قانون سوم (T² ∝ a³) اثبات می‌کند هرچه سیاره از خورشید دورتر باشد سال طولانی‌تری دارد.',
      en: 'Kepler’s Three Laws establish that planets move in ellipses with the Sun at one focus, sweep equal areas in equal times (moving fastest at perihelion), and obey T² ∝ a³.',
    },
    examTip: {
      fa: 'در امتحانات نهایی به یاد داشته باشید: تیر (عطارد) بیشترین سرعت مداری (۴۷ km/s) و نپتون کمترین سرعت مداری (۵.۴ km/s) را به دور خورشید دارند.',
      en: 'Mercury has the highest orbital speed (47 km/s) while Neptune has the slowest (5.4 km/s) due to solar gravitational falloff.',
    },
    metrics: [
      { label: { fa: 'قانون سوم کپلر', en: 'Kepler 3rd Law' }, value: 'T² / a³ = 1', color: 'text-[#65d9ff]' },
      { label: { fa: 'ثابت گرانش', en: 'Gravity Formula' }, value: 'F = Gm₁m₂/r²', color: 'text-[#b2c5ff]' },
      { label: { fa: 'واحد نجومی', en: 'Astronomical Unit' }, value: '1 AU ≈ 150M km', color: 'text-[#f8c270]' },
    ],
  },
  {
    id: 'small-bodies',
    number: '06',
    title: { fa: 'اجرام کوچک: سیارک‌ها، شهاب‌ها و دنباله‌دارها', en: 'Small Bodies: Asteroids, Meteors & Comets' },
    subtitle: { fa: 'تفاوت دقیق شهاب‌وار، شهاب و شهاب‌سنگ؛ کمربند کویپر و ابر اورت', en: 'Distinguishing meteoroids, meteors, and meteorites; Kuiper Belt & Oort Cloud comets' },
    badge: 'Kuiper & Oort',
    summary: {
      fa: 'قطعه سنگ سرگردان در فضا «شهاب‌وار» (Meteoroid)، خط نورانی حاصل از سوختن آن در جو زمین «شهاب» (Meteor) و سنگ رسیده به سطح زمین «شهاب‌سنگ» (Meteorite) نام دارد. دنباله‌دارها گلوله‌های برفی غبارآلودی هستند که با نزدیک شدن به خورشید، دم آن‌ها همواره در جهت خلاف خورشید شکل می‌گیرد.',
      en: 'A rock in space is a meteoroid; the glowing streak in Earth’s atmosphere is a meteor; a fragment reaching the ground is a meteorite. Comets develop ion and dust tails always pointing away from the Sun.',
    },
    examTip: {
      fa: 'دم دنباله‌دار به دلیل فشار تابشی و بادهای خورشیدی همواره پشت به خورشید (دور از خورشید) قرار دارد، نه لزوماً خلاف جهت حرکت دنباله‌دار!',
      en: 'Solar wind and radiation pressure always push a comet’s tail directly away from the Sun, regardless of the comet’s direction of travel.',
    },
    metrics: [
      { label: { fa: 'کمربند سیارک‌ها', en: 'Asteroid Belt' }, value: 'Mars – Jupiter', color: 'text-[#f8c270]' },
      { label: { fa: 'کمربند کویپر', en: 'Kuiper Belt' }, value: '30 – 50 AU', color: 'text-[#65d9ff]' },
      { label: { fa: 'بزرگ‌ترین سیارک/کوتوله', en: 'Largest Asteroid Body' }, value: 'Ceres (940 km)', color: 'text-[#b2c5ff]' },
    ],
  },
  {
    id: 'dwarf-planets',
    number: '07',
    title: { fa: 'سیارات کوتوله و شرایط سه‌گانه IAU', en: 'Dwarf Planets & The 2006 IAU Resolution' },
    subtitle: { fa: 'چرا پلوتو دیگر سیاره اصلی نیست؟ معرفی سرس، پلوتو، اریس، هائومیا و ماکی‌ماکی', en: 'Why Pluto was reclassified and the three criteria for planetary status' },
    badge: 'IAU 2006',
    summary: {
      fa: 'طبق مصوبه ۲۰۰۶ اتحادیه بین‌المللی اخترشناسی (IAU)، سیاره اصلی باید: ۱) دور خورشید بگردد، ۲) جرم کافی برای شکل کروی داشته باشد، و ۳) مدار خود را از اجرام دیگر پاکسازی کرده باشد. پلوتو شرط سوم را نداشت و در رده «سیارات کوتوله» قرار گرفت.',
      en: 'Under the 2006 IAU definition, a planet must orbit the Sun, achieve hydrostatic spherical equilibrium, and clear its orbital neighborhood. Pluto shares the Kuiper Belt and was reclassified as a dwarf planet.',
    },
    examTip: {
      fa: '«سرس» (Ceres) تنها سیاره کوتوله‌ای است که در کمربند اصلی سیارک‌ها (بین مریخ و مشتری) قرار دارد؛ پلوتو و اریس در ورای مدار نپتون هستند.',
      en: 'Ceres is the only dwarf planet located inside the inner main asteroid belt; Pluto, Eris, Haumea, and Makemake orbit beyond Neptune.',
    },
    metrics: [
      { label: { fa: 'سیارات کوتوله رسمی', en: 'Recognized Dwarf Planets' }, value: '5 Bodies', color: 'text-[#65d9ff]' },
      { label: { fa: 'قمر بزرگ پلوتو', en: 'Pluto’s Largest Moon' }, value: 'Charon', color: 'text-[#b2c5ff]' },
      { label: { fa: 'فاصله پلوتو', en: 'Pluto Mean Orbit' }, value: '39.5 AU', color: 'text-[#f8c270]' },
    ],
  },
  {
    id: 'habitable-zone',
    number: '08',
    title: { fa: 'کمربند حیات و شرایط شکل‌گیری زیست', en: 'The Habitable (Goldilocks) Zone' },
    subtitle: { fa: 'فاصله زیست‌پذیر، آب مایع، اتمسفر محافظ و میدان مغناطیسی سپر زمین', en: 'Liquid water stability, atmospheric shielding, and planetary magnetospheres' },
    badge: '0.95–1.4 AU',
    summary: {
      fa: 'کمربند حیات (گلدی‌لاکس) محدوده‌ای در اطراف ستاره است که دمای سطح سیاره امکان وجود دائمی «آب به حالت مایع» را فراهم می‌سازد. زمین دقیقاً در قلب این ناحیه قرار دارد و با کمک لایه ازن (جذب فرابنفش) و میدان مغناطیسی (دفع باد خورشیدی) از حیات محافظت می‌کند.',
      en: 'The Goldilocks Zone is the orbital band around a star where temperatures allow liquid surface water to persist. Earth sits securely within this zone at 1.00 AU.',
    },
    examTip: {
      fa: 'وجود آب مایع، اتمسفر مناسب (اکسیژن و لایه ازن)، دمای متعادل و میدان مغناطیسی چهار رکن اصلی زیست‌پذیری زمین در علوم پایه نهم هستند.',
      en: 'Liquid water, protective atmosphere with ozone, moderate temperature, and a global magnetic field are the four pillars of Earth’s habitability.',
    },
    metrics: [
      { label: { fa: 'محدوده کمربند خورشید', en: 'Solar Habitable Zone' }, value: '0.95–1.4 AU', color: 'text-[#65d9ff]' },
      { label: { fa: 'فشار نقطه سه‌گانه آب', en: 'Water Triple Point' }, value: '0.006 bar', color: 'text-[#b2c5ff]' },
      { label: { fa: 'جذب UV توسط ازن', en: 'Ozone UV Shielding' }, value: '97–99%', color: 'text-[#f8c270]' },
    ],
  },
];

export interface FlashcardData {
  id: string;
  code: string;
  question: { fa: string; en: string };
  answer: { fa: string; en: string };
  accent: string;
}

export const FLASHCARDS: FlashcardData[] = [
  {
    id: 'fc-1',
    code: 'QUESTION // 01',
    question: {
      fa: 'چرا شهاب‌سنگ‌ها هنگام عبور از جو زمین داغ و نورانی می‌شوند؟',
      en: 'Why do meteoroids heat up and glow brightly when entering Earth’s atmosphere?',
    },
    answer: {
      fa: 'اصطکاک و تراکم شدید هوا در برابر حرکت فراصوت شهاب‌وار (با سرعت ۱۰ تا ۷۰ کیلومتر بر ثانیه) موجب گرمایش شدید و سوختن سطح سنگ و ایجاد پدیده «شهاب» می‌شود.',
      en: 'Extreme atmospheric ram pressure and friction at hypersonic speeds (11–72 km/s) superheat and vaporize the rock’s surface, creating a glowing meteor.',
    },
    accent: '#65d9ff',
  },
  {
    id: 'fc-2',
    code: 'QUESTION // 02',
    question: {
      fa: 'کدام سیاره منظومه شمسی کوتاه‌ترین سال و کدام یک کوتاه‌ترین شبانه‌روز را دارد؟',
      en: 'Which planet has the shortest year, and which has the shortest day?',
    },
    answer: {
      fa: 'سیاره «تیر (عطارد)» با ۸۸ روز زمینی کوتاه‌ترین سال (حرکت انتقالی) و سیاره «مشتری (برجیس)» با ۹ ساعت و ۵۵ دقیقه کوتاه‌ترین شبانه‌روز (حرکت وضعی) را دارند.',
      en: 'Mercury has the shortest year (88 Earth days), while giant Jupiter has the shortest day (rotating once every 9 hours 55 minutes).',
    },
    accent: '#b2c5ff',
  },
  {
    id: 'fc-3',
    code: 'QUESTION // 03',
    question: {
      fa: 'سوخت اصلی واکنش‌های خورشیدی چیست و به چه عنصری تبدیل می‌شود؟',
      en: 'What is the primary nuclear fuel of the Sun and what element does it produce?',
    },
    answer: {
      fa: 'گاز «هیدروژن» (H) سوخت اصلی است که در هسته ۱۵ میلیون درجه‌ای خورشید طی واکنش همجوشی هسته‌ای به «هلیوم» (He) تبدیل شده و انرژی تابشی آزاد می‌کند.',
      en: 'Hydrogen nuclei fuse inside the 15-million-°C solar core to form Helium, releasing gamma photons and neutrinos.',
    },
    accent: '#f8c270',
  },
  {
    id: 'fc-4',
    code: 'QUESTION // 04',
    question: {
      fa: 'جهت دم گاز و غبار دنباله‌دارها در فضا چگونه تعیین می‌شود؟',
      en: 'What determines the direction of a comet’s gas and dust tails?',
    },
    answer: {
      fa: 'فشار تابشی نور خورشید و ذرات باد خورشیدی همواره دم دنباله‌دار را در جهتی «پشت به خورشید» (دور از خورشید) می‌رانند.',
      en: 'Solar wind and radiation pressure always blow a comet’s tail directly away from the Sun, regardless of orbital travel direction.',
    },
    accent: '#65d9ff',
  },
];

export interface QuizQuestion {
  id: number;
  code: string;
  category: { fa: string; en: string };
  topicTag: { fa: string; en: string };
  targetPlanetId: CelestialId;
  question: { fa: string; en: string };
  options: Array<{
    letter: string;
    title: { fa: string; en: string };
    subtitle: { fa: string; en: string };
    auBadge: string;
    isCorrect: boolean;
  }>;
  explanation: { fa: string; en: string };
  telemetryReadout: { fa: string; en: string };
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    code: 'ASTRO-9-Q01',
    category: { fa: 'سیارات درونی (Terrestrial)', en: 'Terrestrial Planets' },
    topicTag: { fa: 'اثر گلخانه‌ای شدید', en: 'Runaway Greenhouse' },
    targetPlanetId: 'venus',
    question: {
      fa: 'کدام سیاره منظومه شمسی به دلیل اثر شدید گلخانه‌ای ناشی از جو غلیظ دی‌اکسید کربن، حتی از عطارد نیز داغ‌تر است؟',
      en: 'Which planet experiences an extreme runaway greenhouse effect from its dense CO₂ atmosphere, making it hotter than Mercury?',
    },
    options: [
      { letter: 'A', title: { fa: 'تیر (عطارد)', en: 'Mercury' }, subtitle: { fa: 'بدون جو پایدار', en: 'No stable atmosphere' }, auBadge: '0.39 AU', isCorrect: false },
      { letter: 'B', title: { fa: 'ناهید (زهره)', en: 'Venus' }, subtitle: { fa: '۹۶.۵٪ دی‌اکسید کربن', en: '96.5% CO₂ atmosphere' }, auBadge: '0.72 AU', isCorrect: true },
      { letter: 'C', title: { fa: 'بهرام (مریخ)', en: 'Mars' }, subtitle: { fa: 'جو رقیق کربن‌دی‌اکسید', en: 'Thin CO₂ atmosphere' }, auBadge: '1.52 AU', isCorrect: false },
      { letter: 'D', title: { fa: 'مشتری (برجیس)', en: 'Jupiter' }, subtitle: { fa: 'غول گازی هیدروژنی', en: 'Hydrogen gas giant' }, auBadge: '5.20 AU', isCorrect: false },
    ],
    explanation: {
      fa: 'با وجود اینکه عطارد به خورشید نزدیک‌تر است، زهره دارای جوی بسیار چگال از دی‌اکسید کربن (۹۶.۵٪) و ابرهای اسید سولفوریک است که گرمای خورشید را به دام انداخته و دمای سطح آن را به ۴۶۵ درجه سانتی‌گراد می‌رساند.',
      en: 'Even though Mercury is closer to the Sun, Venus’s crushing 92-bar CO₂ atmosphere traps infrared heat, raising surface temperatures to 465°C.',
    },
    telemetryReadout: { fa: 'سطح فشار: ۹۲ اتمسفر • دمای میانگین: ۴۶۵°C • ترکیب جو: ۹۶.۵٪ CO₂', en: 'Pressure: 92 bar • Mean Temp: 465°C • Atmosphere: 96.5% CO₂' },
  },
  {
    id: 2,
    code: 'ASTRO-9-Q02',
    category: { fa: 'مکانیک مداری (Kepler)', en: 'Orbital Mechanics' },
    topicTag: { fa: 'سرعت حرکت وضعی', en: 'Rotational Dynamics' },
    targetPlanetId: 'jupiter',
    question: {
      fa: 'کدام سیاره منظومه شمسی سریع‌ترین حرکت وضعی (کوتاه‌ترین شبانه‌روز، حدود ۱۰ ساعت) را دارد؟',
      en: 'Which planet in the Solar System has the fastest axial rotation (shortest day at ~9 hours 55 minutes)?',
    },
    options: [
      { letter: 'A', title: { fa: 'زمین (Earth)', en: 'Earth' }, subtitle: { fa: '۲۳ ساعت و ۵۶ دقیقه', en: '23h 56m rotation' }, auBadge: '1.00 AU', isCorrect: false },
      { letter: 'B', title: { fa: 'تیر (Mercury)', en: 'Mercury' }, subtitle: { fa: '۵۸.۶ روز زمینی', en: '58.6 Earth days' }, auBadge: '0.39 AU', isCorrect: false },
      { letter: 'C', title: { fa: 'مشتری (Jupiter)', en: 'Jupiter' }, subtitle: { fa: '۹ ساعت و ۵۵ دقیقه', en: '9h 55m rapid spin' }, auBadge: '5.20 AU', isCorrect: true },
      { letter: 'D', title: { fa: 'نپتون (Neptune)', en: 'Neptune' }, subtitle: { fa: '۱۶ ساعت و ۶ دقیقه', en: '16h 06m rotation' }, auBadge: '30.05 AU', isCorrect: false },
    ],
    explanation: {
      fa: 'مشتری با وجود اینکه بزرگ‌ترین سیاره منظومه شمسی است، هر ۹ ساعت و ۵۵ دقیقه یک بار به دور محور خود می‌چرخد که باعث ایجاد نوارهای ابری موازی و طوفان لکه سرخ بزرگ شده است.',
      en: 'Despite being the largest planet, Jupiter completes a full rotation in just 9 hours 55 minutes, flattening its poles and driving powerful zonal jet streams.',
    },
    telemetryReadout: { fa: 'دوره چرخش وضعی: ۹h ۵۵m • جرم: ۳۱۸ برابر زمین • قمرها: ۹۵', en: 'Rotation: 9h 55m • Mass: 318x Earth • Moons: 95' },
  },
  {
    id: 3,
    code: 'ASTRO-9-Q03',
    category: { fa: 'غول‌های گازی (Gas Giants)', en: 'Jovian Giants' },
    topicTag: { fa: 'چگالی سیاره‌ای', en: 'Planetary Density' },
    targetPlanetId: 'saturn',
    question: {
      fa: 'چگالی میانگین کدام سیاره از آب (۱ گرم بر سانتی‌متر مکعب) کمتر است به طوری که روی آب شناور می‌ماند؟',
      en: 'Which planet has a mean density lower than liquid water (0.687 g/cm³), meaning it would float in a giant ocean?',
    },
    options: [
      { letter: 'A', title: { fa: 'کیوان / زحل (Saturn)', en: 'Saturn' }, subtitle: { fa: 'چگالی 0.687 g/cm³', en: 'Density 0.687 g/cm³' }, auBadge: '9.58 AU', isCorrect: true },
      { letter: 'B', title: { fa: 'اورانوس (Uranus)', en: 'Uranus' }, subtitle: { fa: 'چگالی 1.27 g/cm³', en: 'Density 1.27 g/cm³' }, auBadge: '19.22 AU', isCorrect: false },
      { letter: 'C', title: { fa: 'بهرام / مریخ (Mars)', en: 'Mars' }, subtitle: { fa: 'چگالی 3.93 g/cm³', en: 'Density 3.93 g/cm³' }, auBadge: '1.52 AU', isCorrect: false },
      { letter: 'D', title: { fa: 'زمین (Earth)', en: 'Earth' }, subtitle: { fa: 'چگالی 5.51 g/cm³', en: 'Density 5.51 g/cm³' }, auBadge: '1.00 AU', isCorrect: false },
    ],
    explanation: {
      fa: 'کیوان (زحل) عمدتاً از گازهای سبک هیدروژن و هلیوم تشکیل شده و چگالی میانگین آن تنها ۰.۶۸۷ گرم بر سانتی‌متر مکعب (کمتر از آب) است.',
      en: 'Composed predominantly of hydrogen and helium gas, Saturn’s average density is 0.687 g/cm³—less than water’s 1.00 g/cm³.',
    },
    telemetryReadout: { fa: 'چگالی زحل: 0.687 g/cm³ • گستره حلقه‌ها: ۲۸۲,۰۰۰ km • اقمار: ۱۴۶', en: 'Density: 0.687 g/cm³ • Ring Span: 282,000 km • Moons: 146' },
  },
  {
    id: 4,
    code: 'ASTRO-9-Q04',
    category: { fa: 'غول‌های یخی (Ice Giants)', en: 'Ice Giants' },
    topicTag: { fa: 'انحراف محوری', en: 'Axial Obliquity' },
    targetPlanetId: 'uranus',
    question: {
      fa: 'کدام سیاره دارای انحراف محوری حدود ۹۸ درجه است و گویی به پهلو در مدار خود به دور خورشید می‌غلتد؟',
      en: 'Which planet has an extreme axial tilt of ~98 degrees, causing it to roll on its side around the Sun?',
    },
    options: [
      { letter: 'A', title: { fa: 'نپتون (Neptune)', en: 'Neptune' }, subtitle: { fa: 'انحراف ۲۸.۳ درجه', en: '28.3° axial tilt' }, auBadge: '30.05 AU', isCorrect: false },
      { letter: 'B', title: { fa: 'اورانوس (Uranus)', en: 'Uranus' }, subtitle: { fa: 'انحراف ۹۷.۷۷ درجه', en: '97.77° sideways tilt' }, auBadge: '19.22 AU', isCorrect: true },
      { letter: 'C', title: { fa: 'زحل (Saturn)', en: 'Saturn' }, subtitle: { fa: 'انحراف ۲۶.۷ درجه', en: '26.7° axial tilt' }, auBadge: '9.58 AU', isCorrect: false },
      { letter: 'D', title: { fa: 'عطارد (Mercury)', en: 'Mercury' }, subtitle: { fa: 'انحراف ۰.۰۳ درجه', en: '0.03° axial tilt' }, auBadge: '0.39 AU', isCorrect: false },
    ],
    explanation: {
      fa: 'اورانوس احتمالاً در اثر برخوردی عظیم در ابتدای پیدایش منظومه شمسی دچار انحراف محوری ۹۷.۷۷ درجه شده و سردترین جو سیاره‌ای (-۲۲۴ درجه) را نیز داراست.',
      en: 'Likely struck by an Earth-sized protoplanet early in its history, Uranus rotates on its side at 97.77° and has the coldest atmosphere (-224°C).',
    },
    telemetryReadout: { fa: 'انحراف محور: ۹۷.۷۷° • کمینه دما: -۲۲۴.۲°C • دوره مداری: ۸۴ سال', en: 'Axial Tilt: 97.77° • Min Temp: -224.2°C • Orbit: 84 Years' },
  },
  {
    id: 5,
    code: 'ASTRO-9-Q05',
    category: { fa: 'فیزیک خورشیدی (Solar Physics)', en: 'Solar Astrophysics' },
    topicTag: { fa: 'همجوشی هسته‌ای', en: 'Nuclear Fusion' },
    targetPlanetId: 'sun',
    question: {
      fa: 'انرژی عظیم نورانی و گرمایی خورشید از چه واکنشی در هسته آن تامین می‌شود؟',
      en: 'What physical process inside the Sun’s core generates its immense radiant and thermal energy?',
    },
    options: [
      { letter: 'A', title: { fa: 'شکافت هسته‌ای اورانیوم', en: 'Nuclear Fission of Uranium' }, subtitle: { fa: 'واکنش راکتورهای اتمی', en: 'Heavy atomic splitting' }, auBadge: '0.00 AU', isCorrect: false },
      { letter: 'B', title: { fa: 'همجوشی هسته‌ای هیدروژن به هلیوم', en: 'Nuclear Fusion of Hydrogen to Helium' }, subtitle: { fa: 'دمای ۱۵ میلیون درجه هسته', en: '15M °C proton-proton fusion' }, auBadge: '0.00 AU', isCorrect: true },
      { letter: 'C', title: { fa: 'احتراق شیمیایی اکسیژن و متان', en: 'Chemical Combustion' }, subtitle: { fa: 'واکنش شیمیایی معمولی', en: 'Molecular oxidation' }, auBadge: '0.00 AU', isCorrect: false },
      { letter: 'D', title: { fa: 'واپاشی رادیواکتیو آهن', en: 'Radioactive Iron Decay' }, subtitle: { fa: 'سنگین‌ترین عنصر پایدار', en: 'Isotopic decay' }, auBadge: '0.00 AU', isCorrect: false },
    ],
    explanation: {
      fa: 'در هسته خورشید به دلیل فشار و دمای ۱۵ میلیون درجه سانتی‌گراد، هسته‌های سبک هیدروژن به هم جوش خورده و به هسته هلیوم و انرژی تابشی تبدیل می‌شوند.',
      en: 'Under extreme temperature (15 million °C) and pressure, hydrogen nuclei fuse into helium nuclei, converting mass defect into energy.',
    },
    telemetryReadout: { fa: 'واکنش: 4 ¹H → ⁴He + 26.7 MeV • سهم جرم منظومه: ۹۹.۸۶٪', en: 'Reaction: 4 ¹H → ⁴He + 26.7 MeV • System Mass: 99.86%' },
  },
  {
    id: 6,
    code: 'ASTRO-9-Q06',
    category: { fa: 'سیارات درونی (Terrestrial)', en: 'Terrestrial Worlds' },
    topicTag: { fa: 'زمین‌شناسی سیاره‌ای', en: 'Planetary Geology' },
    targetPlanetId: 'mars',
    question: {
      fa: 'علت رنگ سرخ سیاره بهرام (مریخ) و نام بلندترین قله آتشفشانی منظومه شمسی در آن چیست؟',
      en: 'What gives Mars its signature red color, and what is the name of its record-breaking volcano?',
    },
    options: [
      { letter: 'A', title: { fa: 'اکسید آهن (زنگ آهن) — قله المپوس', en: 'Iron Oxide — Olympus Mons' }, subtitle: { fa: 'ارتفاع ۲۱.۹ کیلومتر', en: '21.9 km tall shield volcano' }, auBadge: '1.52 AU', isCorrect: true },
      { letter: 'B', title: { fa: 'گاز متان — کوه اورست', en: 'Methane Gas — Mount Everest' }, subtitle: { fa: 'ارتفاع ۸.۸ کیلومتر', en: '8.8 km terrestrial peak' }, auBadge: '1.00 AU', isCorrect: false },
      { letter: 'C', title: { fa: 'اسید سولفوریک — قله ماکسول', en: 'Sulfuric Acid — Maxwell Montes' }, subtitle: { fa: 'کوهستان زهره', en: 'Venusian massif' }, auBadge: '0.72 AU', isCorrect: false },
      { letter: 'D', title: { fa: 'گوگرد مذاب — آتشفشان آیو', en: 'Molten Sulfur — Io Volcano' }, subtitle: { fa: 'قمر مشتری', en: 'Jovian moon' }, auBadge: '5.20 AU', isCorrect: false },
    ],
    explanation: {
      fa: 'فراوانی اکسید آهن (Fe₂O₃) در خاک مریخ سبب رنگ سرخ آن شده و کوه آتشفشانی خاموش «المپوس» با حدود ۲۲ کیلومتر ارتفاع، بلندترین قله منظومه شمسی است.',
      en: 'Iron oxide dust colors the Martian regolith rust-red, while Olympus Mons towers 21.9 km above the datum—three times taller than Everest.',
    },
    telemetryReadout: { fa: 'قله المپوس: ۲۱.۹ km • قمرها: فوبوس و دیموس • گرانش: 0.38g', en: 'Olympus Mons: 21.9 km • Moons: Phobos & Deimos • Gravity: 0.38g' },
  },
];
