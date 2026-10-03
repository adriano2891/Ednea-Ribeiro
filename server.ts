import express from 'express';
import type { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Persistent database file
const DATA_DIR = path.resolve(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

interface Service {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number | null;
  durationMinutes: number;
  active: boolean;
  notes?: string;
}

interface Booking {
  id: string;
  reference: string;
  serviceId: string;
  serviceName: string;
  clientName: string;
  clientPhone: string;
  locationType?: 'salon' | 'home';
  clientAddress?: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  durationMinutes: number;
  notes?: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';
  createdAt: string;
  updatedAt: string;
}

interface BlockedSlot {
  id: string;
  date: string;
  timeStart: string;
  timeEnd: string;
  reason: string;
}

interface Settings {
  adminPin: string;
  salonInfo: {
    name: string;
    owner: string;
    address: string;
    phone: string;
    whatsapp: string;
    instagram: string;
    timezone: string;
  };
  workingHours: {
    [day: string]: { open: string; close: string; active: boolean };
  };
  lunchBreak: {
    start: string;
    end: string;
    enabled: boolean;
  };
  slotIntervalMinutes: number;
  daysOff: string[];
  blockedSlots: BlockedSlot[];
  promoInfo: {
    enabled: boolean;
    title: string;
    price: number;
    description: string;
    conditions: string;
    confirmedByProfessional: boolean;
  };
}

interface DBData {
  services: Service[];
  bookings: Booking[];
  settings: Settings;
}

// Initial verified data based strictly on Ednea Ribeiro's profile without hallucinating unconfirmed data
const initialData: DBData = {
  services: [
    {
      id: 'manicure',
      name: 'Manicure',
      category: 'Unhas',
      description: 'Cuidado completo, tratamento das cutículas, limagem e esmaltação cuidada.',
      price: null, // "Não invente preços... a definir pela profissional"
      durationMinutes: 45,
      active: true,
      notes: 'Valor sob consulta ou definido no atendimento.'
    },
    {
      id: 'pedicure',
      name: 'Pedicure',
      category: 'Pés',
      description: 'Higienização, remoção de asperezas, corte técnico e embelezamento dos pés.',
      price: null,
      durationMinutes: 50,
      active: true,
      notes: 'Valor sob consulta ou definido no atendimento.'
    },
    {
      id: 'unhas-gel',
      name: 'Unhas de Gel',
      category: 'Unhas',
      description: 'Aplicação, extensão ou manutenção de gel com alta durabilidade e acabamento refinado.',
      price: null,
      durationMinutes: 90,
      active: true,
      notes: 'Valor sob consulta ou definido no atendimento.'
    },
    {
      id: 'sobrancelhas',
      name: 'Sobrancelhas',
      category: 'Rosto',
      description: 'Design e definição precisa adaptada à harmonia natural do seu rosto.',
      price: null,
      durationMinutes: 30,
      active: true,
      notes: 'Valor sob consulta ou definido no atendimento.'
    },
    {
      id: 'depilacao-brasileira',
      name: 'Depilação Brasileira',
      category: 'Corpo',
      description: 'Técnica cuidada com cera de alta qualidade, garantindo conforto e suavidade na pele.',
      price: null,
      durationMinutes: 45,
      active: true,
      notes: 'Valor sob consulta ou definido no atendimento.'
    }
  ],
  bookings: [
    // Pre-populate with a couple of real-world demo slots for upcoming dates so calendar is lively
    {
      id: 'seed-1',
      reference: 'ER-4091',
      serviceId: 'unhas-gel',
      serviceName: 'Unhas de Gel',
      clientName: 'Carla Moreira',
      clientPhone: '912 345 678',
      date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      time: '10:00',
      durationMinutes: 90,
      notes: 'Manutenção de gel tom rosa clássico',
      status: 'confirmed',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'seed-2',
      reference: 'ER-4092',
      serviceId: 'pedicure',
      serviceName: 'Pedicure',
      clientName: 'Sofia Andrade',
      clientPhone: '931 876 543',
      date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      time: '14:30',
      durationMinutes: 50,
      notes: 'Primeira visita no espaço da Costa Cabral',
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ],
  settings: {
    adminPin: 'ednea2026',
    salonInfo: {
      name: 'Ednea Ribeiro (Neia Ribeiro)',
      owner: 'Ednea Ribeiro',
      address: 'Rua de Costa Cabral, 416, Porto',
      phone: '914 231 627',
      whatsapp: '351914231627',
      instagram: 'https://www.instagram.com/neiaribeiroesteticista_pt',
      timezone: 'Europe/Lisbon'
    },
    workingHours: {
      'segunda': { open: '09:00', close: '19:00', active: true },
      'terca': { open: '09:00', close: '19:00', active: true },
      'quarta': { open: '09:00', close: '19:00', active: true },
      'quinta': { open: '09:00', close: '19:00', active: true },
      'sexta': { open: '09:00', close: '19:00', active: true },
      'sabado': { open: '09:00', close: '18:00', active: true },
      'domingo': { open: '09:00', close: '18:00', active: false }
    },
    lunchBreak: {
      start: '13:00',
      end: '14:00',
      enabled: true
    },
    slotIntervalMinutes: 30,
    daysOff: [],
    blockedSlots: [],
    promoInfo: {
      enabled: false, // Omit promotion by default until Ednea confirms conditions
      title: 'Campanha Especial de Estética',
      price: 35,
      description: 'Promoção a aguardar confirmação de condições pela profissional.',
      conditions: 'Sob validação presencial no espaço.',
      confirmedByProfessional: false
    }
  }
};

// Ensure data directory and file exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function loadDB(): DBData {
  try {
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
      return initialData;
    }
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading db.json, falling back to initial data:', err);
    return initialData;
  }
}

function saveDB(data: DBData): void {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving db.json:', err);
  }
}

// In-memory reference with persistent write-through
let db = loadDB();

// SSE (Server-Sent Events) clients for real-time admin sync
interface SSEClient {
  id: number;
  res: Response;
}
let sseClients: SSEClient[] = [];
let nextClientId = 1;

function broadcastSSE(type: string, payload: any) {
  const message = `event: ${type}\ndata: ${JSON.stringify(payload)}\n\n`;
  sseClients.forEach((client) => {
    try {
      client.res.write(message);
    } catch {
      // client disconnected
    }
  });
}

// Convert HH:MM to minutes since midnight
function timeToMinutes(t: string): number {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}

// Convert minutes to HH:MM
function minutesToTime(m: number): string {
  const h = Math.floor(m / 60);
  const min = m % 60;
  return `${String(h).padStart(2, '0')}:${String(min).padStart(2, '0')}`;
}

// Get day key in Portuguese
function getDayKey(dateStr: string): string {
  // Use Europe/Lisbon to determine the day of week
  const date = new Date(dateStr + 'T12:00:00Z');
  const day = date.getUTCDay();
  const map = ['domingo', 'segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado'];
  return map[day];
}

// Calculate open slots for a specific date and duration
function computeAvailableSlots(dateStr: string, durationMinutes: number): { time: string; available: boolean; reason?: string }[] {
  const dayKey = getDayKey(dateStr);
  const daySchedule = db.settings.workingHours[dayKey];

  if (!daySchedule || !daySchedule.active) {
    return [];
  }

  if (db.settings.daysOff.includes(dateStr)) {
    return [];
  }

  const openMin = timeToMinutes(daySchedule.open);
  const closeMin = timeToMinutes(daySchedule.close);
  const interval = db.settings.slotIntervalMinutes || 30;

  // Active bookings for that date (status !== 'cancelled')
  const activeBookings = db.bookings.filter(
    (b) => b.date === dateStr && (b.status === 'confirmed' || b.status === 'pending')
  );

  // Blocked slots for that date
  const blockedOnDate = db.settings.blockedSlots.filter((b) => b.date === dateStr);

  const slots: { time: string; available: boolean; reason?: string }[] = [];

  for (let m = openMin; m + durationMinutes <= closeMin; m += interval) {
    const slotStart = m;
    const slotEnd = m + durationMinutes;
    const timeStr = minutesToTime(m);

    // Check lunch break
    let overlapsLunch = false;
    if (db.settings.lunchBreak && db.settings.lunchBreak.enabled) {
      const lunchStart = timeToMinutes(db.settings.lunchBreak.start);
      const lunchEnd = timeToMinutes(db.settings.lunchBreak.end);
      if (Math.max(slotStart, lunchStart) < Math.min(slotEnd, lunchEnd)) {
        overlapsLunch = true;
      }
    }

    if (overlapsLunch) {
      continue;
    }

    // Check blocked slots
    const overlapsBlocked = blockedOnDate.some((blk) => {
      const blkStart = timeToMinutes(blk.timeStart);
      const blkEnd = timeToMinutes(blk.timeEnd);
      return Math.max(slotStart, blkStart) < Math.min(slotEnd, blkEnd);
    });

    if (overlapsBlocked) {
      continue;
    }

    // Check existing active bookings
    const overlapsBooking = activeBookings.some((b) => {
      const bStart = timeToMinutes(b.time);
      const bEnd = bStart + b.durationMinutes;
      return Math.max(slotStart, bStart) < Math.min(slotEnd, bEnd);
    });

    if (!overlapsBooking) {
      slots.push({
        time: timeStr,
        available: true
      });
    }
  }

  return slots;
}

// ================= API ROUTES =================

// 1. Public Info & Services
app.get('/api/services', (_req: Request, res: Response) => {
  res.json({
    services: db.services.filter((s) => s.active),
    salon: db.settings.salonInfo,
    promo: db.settings.promoInfo
  });
});

// 2. Public Availability calculation (strict Europe/Lisbon, real-time checked)
app.get('/api/availability', (req: Request, res: Response) => {
  const { date, serviceId } = req.query;
  if (!date || typeof date !== 'string') {
    return res.status(400).json({ error: 'Data obrigatória (formato AAAA-MM-DD).' });
  }

  const service = db.services.find((s) => s.id === serviceId);
  const duration = service ? service.durationMinutes : 45;

  const slots = computeAvailableSlots(date, duration);
  res.json({
    date,
    serviceId,
    durationMinutes: duration,
    timezone: 'Europe/Lisbon',
    slots
  });
});

// 3. Create Booking (Public booking request with atomic conflict check)
app.post('/api/bookings', (req: Request, res: Response) => {
  const { serviceId, date, time, clientName, clientPhone, notes, locationType, clientAddress } = req.body;

  if (!serviceId || !date || !time || !clientName || !clientPhone) {
    return res.status(400).json({ error: 'Por favor preencha todos os campos obrigatórios.' });
  }

  const cleanName = String(clientName).trim();
  const cleanPhone = String(clientPhone).trim();

  if (cleanName.length < 2) {
    return res.status(400).json({ error: 'Por favor insira um nome válido.' });
  }

  if (cleanPhone.length < 9) {
    return res.status(400).json({ error: 'Por favor insira um número de telemóvel válido.' });
  }

  const service = db.services.find((s) => s.id === serviceId);
  if (!service) {
    return res.status(404).json({ error: 'Serviço não encontrado.' });
  }

  // ATOMIC CHECK: Verify if the slot is still open
  const availableSlots = computeAvailableSlots(date, service.durationMinutes);
  const isAvailable = availableSlots.some((s) => s.time === time);

  if (!isAvailable) {
    return res.status(409).json({
      error: 'O horário selecionado já não se encontra disponível. Por favor selecione outro horário.'
    });
  }

  const randomRef = 'ER-' + Math.floor(1000 + Math.random() * 9000);
  const newBooking: Booking = {
    id: 'bk_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
    reference: randomRef,
    serviceId: service.id,
    serviceName: service.name,
    clientName: cleanName,
    clientPhone: cleanPhone,
    locationType: locationType === 'home' ? 'home' : 'salon',
    clientAddress: clientAddress ? String(clientAddress).trim() : '',
    date,
    time,
    durationMinutes: service.durationMinutes,
    notes: notes ? String(notes).trim() : '',
    status: 'pending', // "A aguardar confirmação"
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  db.bookings.unshift(newBooking);
  saveDB(db);

  // Broadcast real-time update to admin clients
  broadcastSSE('new_booking', newBooking);

  res.status(201).json({
    success: true,
    message: 'Pedido de agendamento submetido com sucesso. Encontra-se a aguardar confirmação.',
    booking: newBooking
  });
});

// 4. Client check booking status by reference
app.get('/api/bookings/ref/:reference', (req: Request, res: Response) => {
  const ref = req.params.reference.toUpperCase();
  const booking = db.bookings.find((b) => b.reference.toUpperCase() === ref);
  if (!booking) {
    return res.status(404).json({ error: 'Agendamento não encontrado.' });
  }
  res.json({ booking });
});

// 5. Admin Authentication Check
app.post('/api/admin/login', (req: Request, res: Response) => {
  const { pin } = req.body;
  if (!pin || pin !== db.settings.adminPin) {
    return res.status(401).json({ error: 'Código de acesso incorreto.' });
  }
  res.json({ success: true, token: 'session_' + Buffer.from(pin + '_' + Date.now()).toString('base64') });
});

// Admin Middleware for protected routes
function requireAdmin(req: Request, res: Response, next: () => void) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer session_')) {
    return res.status(401).json({ error: 'Não autorizado. Inicie sessão no painel.' });
  }
  next();
}

// 6. Admin Overview / Dashboard
app.get('/api/admin/overview', requireAdmin, (_req: Request, res: Response) => {
  const todayStr = new Date().toISOString().split('T')[0];
  const todayBookings = db.bookings.filter((b) => b.date === todayStr);
  const pendingBookings = db.bookings.filter((b) => b.status === 'pending');
  const confirmedToday = todayBookings.filter((b) => b.status === 'confirmed');

  res.json({
    todayCount: todayBookings.length,
    pendingCount: pendingBookings.length,
    confirmedTodayCount: confirmedToday.length,
    totalBookings: db.bookings.length,
    todayBookings,
    pendingBookings: pendingBookings.slice(0, 5)
  });
});

// 7. Admin Get All Bookings with filtering
app.get('/api/admin/bookings', requireAdmin, (req: Request, res: Response) => {
  let list = [...db.bookings];
  const { date, status, search } = req.query;

  if (date && typeof date === 'string') {
    list = list.filter((b) => b.date === date);
  }

  if (status && typeof status === 'string' && status !== 'all') {
    list = list.filter((b) => b.status === status);
  }

  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    list = list.filter(
      (b) =>
        b.clientName.toLowerCase().includes(q) ||
        b.clientPhone.toLowerCase().includes(q) ||
        b.reference.toLowerCase().includes(q) ||
        b.serviceName.toLowerCase().includes(q)
    );
  }

  res.json({ bookings: list });
});

// 8. Admin Update Booking Status or Reschedule
app.patch('/api/admin/bookings/:id', requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const booking = db.bookings.find((b) => b.id === id);

  if (!booking) {
    return res.status(404).json({ error: 'Agendamento não encontrado.' });
  }

  const { status, date, time, notes } = req.body;

  if (status) {
    const validStatuses = ['pending', 'confirmed', 'completed', 'cancelled', 'no_show'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Estado inválido.' });
    }
    booking.status = status;
  }

  if (date && time && (date !== booking.date || time !== booking.time)) {
    // Check conflicts
    const service = db.services.find((s) => s.id === booking.serviceId);
    const duration = service ? service.durationMinutes : booking.durationMinutes;
    // Exclude current booking when checking
    const conflict = db.bookings.some((other) => {
      if (other.id === booking.id || other.status === 'cancelled') return false;
      if (other.date !== date) return false;
      const b1Start = timeToMinutes(time);
      const b1End = b1Start + duration;
      const b2Start = timeToMinutes(other.time);
      const b2End = b2Start + other.durationMinutes;
      return Math.max(b1Start, b2Start) < Math.min(b1End, b2End);
    });

    if (conflict) {
      return res.status(409).json({ error: 'Conflito de horário! Já existe um agendamento nesse horário.' });
    }

    booking.date = date;
    booking.time = time;
  }

  if (notes !== undefined) {
    booking.notes = notes;
  }

  booking.updatedAt = new Date().toISOString();
  saveDB(db);

  broadcastSSE('booking_updated', booking);
  res.json({ success: true, booking });
});

// 9. Admin Manual Booking Creation
app.post('/api/admin/bookings', requireAdmin, (req: Request, res: Response) => {
  const { serviceId, clientName, clientPhone, date, time, notes, status, locationType, clientAddress } = req.body;

  if (!serviceId || !clientName || !clientPhone || !date || !time) {
    return res.status(400).json({ error: 'Campos obrigatórios em falta.' });
  }

  const service = db.services.find((s) => s.id === serviceId);
  if (!service) {
    return res.status(404).json({ error: 'Serviço não encontrado.' });
  }

  const randomRef = 'ER-M' + Math.floor(1000 + Math.random() * 9000);
  const newBooking: Booking = {
    id: 'bk_man_' + Date.now(),
    reference: randomRef,
    serviceId: service.id,
    serviceName: service.name,
    clientName: clientName.trim(),
    clientPhone: clientPhone.trim(),
    locationType: locationType === 'home' ? 'home' : 'salon',
    clientAddress: clientAddress ? String(clientAddress).trim() : '',
    date,
    time,
    durationMinutes: service.durationMinutes,
    notes: notes || '',
    status: status || 'confirmed',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  db.bookings.unshift(newBooking);
  saveDB(db);

  broadcastSSE('new_booking', newBooking);
  res.status(201).json({ success: true, booking: newBooking });
});

// 10. Admin Settings Management
app.get('/api/admin/settings', requireAdmin, (_req: Request, res: Response) => {
  res.json({
    settings: db.settings,
    services: db.services
  });
});

app.put('/api/admin/settings', requireAdmin, (req: Request, res: Response) => {
  const { workingHours, lunchBreak, daysOff, blockedSlots, promoInfo, services, adminPin } = req.body;

  if (workingHours) db.settings.workingHours = workingHours;
  if (lunchBreak) db.settings.lunchBreak = lunchBreak;
  if (daysOff) db.settings.daysOff = daysOff;
  if (blockedSlots) db.settings.blockedSlots = blockedSlots;
  if (promoInfo) db.settings.promoInfo = promoInfo;
  if (services && Array.isArray(services)) db.services = services;
  if (adminPin && adminPin.trim().length >= 4) db.settings.adminPin = adminPin.trim();

  saveDB(db);
  broadcastSSE('settings_updated', { settings: db.settings, services: db.services });

  res.json({ success: true, settings: db.settings, services: db.services });
});

// 11. Real-time SSE Stream for Admin
app.get('/api/events', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders?.();

  const clientId = nextClientId++;
  const client: SSEClient = { id: clientId, res };
  sseClients.push(client);

  // Send initial ping
  res.write(`event: connected\ndata: ${JSON.stringify({ clientId, timestamp: Date.now() })}\n\n`);

  req.on('close', () => {
    sseClients = sseClients.filter((c) => c.id !== clientId);
  });
});

// Start Express server and connect Vite
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    // Serve static files in production
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    // Development mode with Vite middleware
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: process.env.DISABLE_HMR !== 'true' },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
