export interface Service {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number | null;
  durationMinutes: number;
  active: boolean;
  notes?: string;
}

export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';

export interface Booking {
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
  status: BookingStatus;
  createdAt: string;
  updatedAt: string;
}

export interface BlockedSlot {
  id: string;
  date: string;
  timeStart: string;
  timeEnd: string;
  reason: string;
}

export interface Settings {
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

export interface AvailableSlot {
  time: string;
  available: boolean;
  reason?: string;
}
