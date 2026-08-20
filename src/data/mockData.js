export const teamMembers = [
  {
    id: 'TM001',
    name: 'Budi Santoso',
    position: 'Sales Rep Senior',
    email: 'budi@taco.co.id',
    phone: '+62 812-3456-7890',
    avatar: 'https://ui-avatars.com/api/?name=Budi+Santoso&background=0077ff&color=fff',
    visits: 48,
    avgQualityScore: 1.8,
    streak: 12,
    status: 'active',
    team: 'team_001',
    lastActivity: '2024-01-15T08:30:00',
    coachingNeeded: false,
    performanceTrend: 'up',
  },
  {
    id: 'TM002',
    name: 'Sari Dewi',
    position: 'Sales Rep',
    email: 'sari@taco.co.id',
    phone: '+62 813-4567-8901',
    avatar: 'https://ui-avatars.com/api/?name=Sari+Dewi&background=ec4899&color=fff',
    visits: 42,
    avgQualityScore: 1.9,
    streak: 8,
    status: 'active',
    team: 'team_001',
    lastActivity: '2024-01-15T09:15:00',
    coachingNeeded: false,
    performanceTrend: 'up',
  },
  {
    id: 'TM003',
    name: 'Ahmad Fauzi',
    position: 'Sales Rep',
    email: 'ahmad@taco.co.id',
    phone: '+62 814-5678-9012',
    avatar: 'https://ui-avatars.com/api/?name=Ahmad+Fauzi&background=10b981&color=fff',
    visits: 38,
    avgQualityScore: 1.6,
    streak: 5,
    status: 'active',
    team: 'team_001',
    lastActivity: '2024-01-15T10:00:00',
    coachingNeeded: true,
    performanceTrend: 'stable',
  },
  {
    id: 'TM004',
    name: 'Rina Wati',
    position: 'Sales Rep Junior',
    email: 'rina@taco.co.id',
    phone: '+62 815-6789-0123',
    avatar: 'https://ui-avatars.com/api/?name=Rina+Wati&background=f59e0b&color=fff',
    visits: 35,
    avgQualityScore: 1.4,
    streak: 3,
    status: 'active',
    team: 'team_001',
    lastActivity: '2024-01-15T11:30:00',
    coachingNeeded: true,
    performanceTrend: 'down',
  },
  {
    id: 'TM005',
    name: 'Hendra Pratama',
    position: 'Sales Rep Senior',
    email: 'hendra@taco.co.id',
    phone: '+62 816-7890-1234',
    avatar: 'https://ui-avatars.com/api/?name=Hendra+Pratama&background=8b5cf6&color=fff',
    visits: 45,
    avgQualityScore: 1.7,
    streak: 10,
    status: 'active',
    team: 'team_001',
    lastActivity: '2024-01-15T13:45:00',
    coachingNeeded: false,
    performanceTrend: 'up',
  },
  {
    id: 'TM006',
    name: 'Dewi Anggraini',
    position: 'Sales Rep',
    email: 'dewi@taco.co.id',
    phone: '+62 817-8901-2345',
    avatar: 'https://ui-avatars.com/api/?name=Dewi+Anggraini&background=ef4444&color=fff',
    visits: 40,
    avgQualityScore: 1.5,
    streak: 6,
    status: 'off',
    team: 'team_001',
    lastActivity: '2024-01-14T15:20:00',
    coachingNeeded: true,
    performanceTrend: 'stable',
  },
  {
    id: 'TM007',
    name: 'Fajar Ramadan',
    position: 'Sales Rep Junior',
    email: 'fajar@taco.co.id',
    phone: '+62 818-9012-3456',
    avatar: 'https://ui-avatars.com/api/?name=Fajar+Ramadan&background=14b8a6&color=fff',
    visits: 32,
    avgQualityScore: 1.3,
    streak: 2,
    status: 'active',
    team: 'team_001',
    lastActivity: '2024-01-15T14:10:00',
    coachingNeeded: true,
    performanceTrend: 'down',
  },
  {
    id: 'TM008',
    name: 'Maya Sari',
    position: 'Sales Rep',
    email: 'maya@taco.co.id',
    phone: '+62 819-0123-4567',
    avatar: 'https://ui-avatars.com/api/?name=Maya+Sari&background=f97316&color=fff',
    visits: 44,
    avgQualityScore: 1.8,
    streak: 9,
    status: 'active',
    team: 'team_001',
    lastActivity: '2024-01-15T16:30:00',
    coachingNeeded: false,
    performanceTrend: 'up',
  },
];

export const consistencyLeaderboard = [
  { id: 1, name: 'Budi Santoso', score: 95, change: 'up', rank: 1, prevRank: 2 },
  { id: 2, name: 'Sari Dewi', score: 92, change: 'up', rank: 2, prevRank: 1 },
  { id: 3, name: 'Hendra Pratama', score: 88, change: 'stable', rank: 3, prevRank: 3 },
  { id: 4, name: 'Maya Sari', score: 85, change: 'up', rank: 4, prevRank: 5 },
  { id: 5, name: 'Ahmad Fauzi', score: 82, change: 'stable', rank: 5, prevRank: 4 },
];

export const qualityLeaderboard = [
  { id: 1, name: 'Sari Dewi', score: 1.9, change: 'up', rank: 1, prevRank: 2 },
  { id: 2, name: 'Budi Santoso', score: 1.8, change: 'up', rank: 2, prevRank: 1 },
  { id: 3, name: 'Maya Sari', score: 1.8, change: 'up', rank: 3, prevRank: 3 },
  { id: 4, name: 'Hendra Pratama', score: 1.7, change: 'stable', rank: 4, prevRank: 5 },
  { id: 5, name: 'Ahmad Fauzi', score: 1.6, change: 'stable', rank: 5, prevRank: 4 },
];

export const competitorBrands = [
  { id: 'B001', name: 'Brand A', color: '#0077ff' },
  { id: 'B002', name: 'Brand B', color: '#ec4899' },
  { id: 'B003', name: 'Brand C', color: '#10b981' },
  { id: 'B004', name: 'Brand D', color: '#f59e0b' },
  { id: 'B005', name: 'Brand E', color: '#8b5cf6' },
];

export const priceTrendData = [
  { date: '2024-01-01', brandA: 45000, brandB: 48000, brandC: 42000, brandD: 46000, brandE: 44000 },
  { date: '2024-01-02', brandA: 45500, brandB: 48500, brandC: 42500, brandD: 46500, brandE: 44500 },
  { date: '2024-01-03', brandA: 46000, brandB: 49000, brandC: 43000, brandD: 47000, brandE: 45000 },
  { date: '2024-01-04', brandA: 44500, brandB: 47500, brandC: 41500, brandD: 45500, brandE: 43500 },
  { date: '2024-01-05', brandA: 45000, brandB: 48000, brandC: 42000, brandD: 46000, brandE: 44000 },
  { date: '2024-01-06', brandA: 46500, brandB: 49500, brandC: 43500, brandD: 47500, brandE: 45500 },
  { date: '2024-01-07', brandA: 47000, brandB: 50000, brandC: 44000, brandD: 48000, brandE: 46000 },
  { date: '2024-01-08', brandA: 47500, brandB: 50500, brandC: 44500, brandD: 48500, brandE: 46500 },
  { date: '2024-01-09', brandA: 48000, brandB: 51000, brandC: 45000, brandD: 49000, brandE: 47000 },
  { date: '2024-01-10', brandA: 48500, brandB: 51500, brandC: 45500, brandD: 49500, brandE: 47500 },
  { date: '2024-01-11', brandA: 49000, brandB: 52000, brandC: 46000, brandD: 50000, brandE: 48000 },
  { date: '2024-01-12', brandA: 49500, brandB: 52500, brandC: 46500, brandD: 50500, brandE: 48500 },
  { date: '2024-01-13', brandA: 50000, brandB: 53000, brandC: 47000, brandD: 51000, brandE: 49000 },
  { date: '2024-01-14', brandA: 50500, brandB: 53500, brandC: 47500, brandD: 51500, brandE: 49500 },
  { date: '2024-01-15', brandA: 51000, brandB: 54000, brandC: 48000, brandD: 52000, brandE: 50000 },
];

export const brandActivityData = [
  { week: 'Minggu 1', brandA: 45, brandB: 32, brandC: 28, brandD: 21, brandE: 18 },
  { week: 'Minggu 2', brandA: 48, brandB: 35, brandC: 30, brandD: 24, brandE: 20 },
  { week: 'Minggu 3', brandA: 52, brandB: 38, brandC: 33, brandD: 27, brandE: 23 },
  { week: 'Minggu 4', brandA: 55, brandB: 42, brandC: 36, brandD: 30, brandE: 26 },
];

export const outletTypeBreakdown = [
  { type: 'Modern Retail', count: 125, percentage: 35 },
  { type: 'Warung/Toko', count: 85, percentage: 24 },
  { type: 'Mini Market', count: 75, percentage: 21 },
  { type: 'Supermarket', count: 45, percentage: 13 },
  { type: 'Lainnya', count: 25, percentage: 7 },
];

export const signalReports = [
  {
    id: 'SR001',
    outlet: 'Indomaret Jl. Sudirman',
    date: '2024-01-15',
    brand: 'Brand A',
    signalType: 'Harga Turun',
    details: 'Harga turun 5% dari harga normal',
    region: 'Jakarta Pusat',
    salesName: 'Andi Pratama',
  },
  {
    id: 'SR002',
    outlet: 'Alfamart Jl. Thamrin',
    date: '2024-01-14',
    brand: 'Brand B',
    signalType: 'Promo Bundling',
    details: 'Bundling dengan produk lain, diskon 15%',
    region: 'Jakarta Pusat',
    salesName: 'Bella Putri',
  },
  {
    id: 'SR003',
    outlet: 'Superindo Jl. Gatot Subroto',
    date: '2024-01-13',
    brand: 'Brand C',
    signalType: 'Display Baru',
    details: 'Display khusus di depan kasir',
    region: 'Jakarta Selatan',
    salesName: 'Citra Ayu',
  },
  {
    id: 'SR004',
    outlet: 'Lotte Mart Jl. HR Rasuna Said',
    date: '2024-01-12',
    brand: 'Brand D',
    signalType: 'Harga Naik',
    details: 'Harga naik 8% karena bahan baku',
    region: 'Jakarta Selatan',
    salesName: 'Dedi Kurniawan',
  },
  {
    id: 'SR005',
    outlet: 'Carrefour Jl. Asia Afrika',
    date: '2024-01-11',
    brand: 'Brand E',
    signalType: 'Stok Habis',
    details: 'Stok habis selama 3 hari',
    region: 'Bandung',
    salesName: 'Eka Rahmawati',
  },
  {
    id: 'SR006',
    outlet: 'Transmart Jl. Dago',
    date: '2024-01-10',
    brand: 'Brand A',
    signalType: 'Promo Akhir Tahun',
    details: 'Buy 2 Get 1 Free',
    region: 'Bandung',
    salesName: 'Fajar Nugroho',
  },
  {
    id: 'SR007',
    outlet: 'Hero Supermarket Jl. Pemuda',
    date: '2024-01-09',
    brand: 'Brand B',
    signalType: 'Display Rusak',
    details: 'Display produk rusak, perlu perbaikan',
    region: 'Surabaya',
    salesName: 'Gita Lestari',
  },
  {
    id: 'SR008',
    outlet: 'Foodmart Jl. Raya Darmo',
    date: '2024-01-08',
    brand: 'Brand C',
    signalType: 'Harga Stabil',
    details: 'Harga tetap selama 2 minggu',
    region: 'Surabaya',
    salesName: 'Hendra Wijaya',
  },
];

export const dashboardSummary = {
  totalTeamMembers: 8,
  activeToday: 7,
  avgQualityScore: 1.63,
  totalVisits: 324,
  avgVisitsPerMember: 40.5,
  signalsThisWeek: 24,
  topCompetitor: 'Brand A',
  dominantSignalType: 'Harga Turun',
};

export const periodOptions = [
  { value: 'today', label: 'Hari Ini' },
  { value: 'week', label: 'Minggu Ini' },
  { value: 'month', label: 'Bulan Ini' },
  { value: 'quarter', label: 'Kuartal Ini' },
  { value: 'custom', label: 'Custom Range' },
];

export const statusBadgeColors = {
  active: 'bg-green-100 text-green-800',
  off: 'bg-gray-100 text-gray-800',
  'on-leave': 'bg-yellow-100 text-yellow-800',
  training: 'bg-blue-100 text-blue-800',
};

export const signalTypeColors = {
  'Harga Turun': 'bg-green-100 text-green-800',
  'Harga Naik': 'bg-red-100 text-red-800',
  'Promo Bundling': 'bg-purple-100 text-purple-800',
  'Display Baru': 'bg-blue-100 text-blue-800',
  'Display Rusak': 'bg-orange-100 text-orange-800',
  'Stok Habis': 'bg-gray-100 text-gray-800',
  'Harga Stabil': 'bg-indigo-100 text-indigo-800',
  'Promo Akhir Tahun': 'bg-pink-100 text-pink-800',
};

const PERIODS = ['today', 'week', 'month', 'quarter', 'custom'];

const PERIOD_MULTIPLIERS = {
  today: 0.2,
  week: 1,
  month: 4.3,
  quarter: 13,
  custom: 1,
};

const rotateLeaderboard = (items, shift) => {
  const size = items.length;
  const offset = ((shift % size) + size) % size;
  return items.map((item, index) => {
    const source = items[(index + offset) % size];
    return { ...source, rank: index + 1 };
  });
};

export const getPeriodData = (period) => {
  const safePeriod = PERIODS.includes(period) ? period : 'week';
  const multiplier = PERIOD_MULTIPLIERS[safePeriod];
  const periodIndex = PERIODS.indexOf(safePeriod);
  const offset = (periodIndex * 0.02) % 0.1;

  const scaledTeamMembers = teamMembers.map((member) => ({
    ...member,
    visits: Math.round(member.visits * multiplier),
    streak: Math.max(1, Math.round(member.streak * multiplier * 0.9)),
    avgQualityScore: Math.round((member.avgQualityScore + offset) * 100) / 100,
  }));

  const scaledConsistency = rotateLeaderboard(consistencyLeaderboard, periodIndex).map((item) => ({
    ...item,
    score: Math.min(100, Math.max(10, Math.round(item.score * multiplier * 0.8))),
  }));

  const scaledQuality = rotateLeaderboard(qualityLeaderboard, periodIndex).map((item) => ({
    ...item,
    score: Math.round((item.score + offset) * 100) / 100,
  }));

  const scaledSummary = {
    ...dashboardSummary,
    totalVisits: Math.round(dashboardSummary.totalVisits * multiplier),
    signalsThisWeek: Math.round(dashboardSummary.signalsThisWeek * multiplier),
    avgVisitsPerMember: Math.round(dashboardSummary.avgVisitsPerMember * multiplier * 10) / 10,
    avgQualityScore: Math.round((dashboardSummary.avgQualityScore + offset) * 100) / 100,
  };

  return {
    teamMembers: scaledTeamMembers,
    consistencyLeaderboard: scaledConsistency,
    qualityLeaderboard: scaledQuality,
    summary: scaledSummary,
  };
};
