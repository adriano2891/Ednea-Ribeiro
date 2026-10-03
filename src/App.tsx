import { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ServicesSection from './components/ServicesSection';
import GallerySection from './components/GallerySection';
import AboutSection from './components/AboutSection';
import FAQSection from './components/FAQSection';
import LocationSection from './components/LocationSection';
import Footer from './components/Footer';
import BookingModal from './components/BookingModal';
import BookingTrackerModal from './components/BookingTrackerModal';
import PrivacyModal from './components/PrivacyModal';
import MobileBottomBar from './components/MobileBottomBar';
import AdminPanel from './components/AdminPanel';
import type { Service, Settings, Booking } from './types';

export default function App() {
  const [services, setServices] = useState<Service[]>([]);
  const [promoInfo, setPromoInfo] = useState<Settings['promoInfo'] | undefined>(undefined);
  const [loadingServices, setLoadingServices] = useState<boolean>(true);

  // Modals state
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedServiceForBooking, setSelectedServiceForBooking] = useState<Service | null>(null);
  const [trackerModalOpen, setTrackerModalOpen] = useState(false);
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);
  const [adminModalOpen, setAdminModalOpen] = useState(false);

  // Load public services and salon info from API
  const loadServices = async () => {
    try {
      const res = await fetch('/api/services');
      if (res.ok) {
        const data = await res.json();
        setServices(data.services || []);
        setPromoInfo(data.promo);
      }
    } catch (err) {
      console.error('Error loading services:', err);
    } finally {
      setLoadingServices(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const handleOpenBooking = (service?: Service) => {
    setSelectedServiceForBooking(service || null);
    setBookingModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F6] text-[#2B2527] font-sans flex flex-col selection:bg-[#F3D7DE] selection:text-[#8C334D]">
      {/* Top Header */}
      <Header
        onOpenBooking={() => handleOpenBooking()}
        onOpenAdmin={() => setAdminModalOpen(true)}
        onOpenTracker={() => setTrackerModalOpen(true)}
      />

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <Hero onOpenBooking={() => handleOpenBooking()} />

        {/* Services Section */}
        <ServicesSection
          services={services}
          promoInfo={promoInfo}
          onSelectService={(service) => handleOpenBooking(service)}
        />

        {/* Gallery Section */}
        <GallerySection />

        {/* About Section */}
        <AboutSection onOpenBooking={() => handleOpenBooking()} />

        {/* FAQ Section */}
        <FAQSection />

        {/* Location & Contact Section */}
        <LocationSection onOpenBooking={() => handleOpenBooking()} />
      </main>

      {/* Footer */}
      <Footer
        onOpenBooking={() => handleOpenBooking()}
        onOpenAdmin={() => setAdminModalOpen(true)}
        onOpenPrivacy={() => setPrivacyModalOpen(true)}
        onOpenTracker={() => setTrackerModalOpen(true)}
      />

      {/* Mobile Floating Quick Action Bar */}
      <MobileBottomBar onOpenBooking={() => handleOpenBooking()} />

      {/* Booking Modal */}
      <BookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        services={services}
        initialService={selectedServiceForBooking}
        onBookingCreated={() => {
          // Trigger any needed updates
        }}
      />

      {/* Booking Tracker Modal */}
      <BookingTrackerModal
        isOpen={trackerModalOpen}
        onClose={() => setTrackerModalOpen(false)}
      />

      {/* Privacy & RGPD Modal */}
      <PrivacyModal
        isOpen={privacyModalOpen}
        onClose={() => setPrivacyModalOpen(false)}
      />

      {/* Admin Panel Modal */}
      <AdminPanel
        isOpen={adminModalOpen}
        onClose={() => setAdminModalOpen(false)}
        onBookingChanged={() => {
          loadServices();
        }}
      />
    </div>
  );
}
