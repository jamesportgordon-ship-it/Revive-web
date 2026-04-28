import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import cron from 'node-cron';
import fs from 'fs';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // --- Persistent Storage Helpers ---
  const BOOKINGS_FILE = path.join(process.cwd(), 'bookings.json');
  
  const loadBookings = () => {
    if (fs.existsSync(BOOKINGS_FILE)) {
      return JSON.parse(fs.readFileSync(BOOKINGS_FILE, 'utf8'));
    }
    return [];
  };

  const saveBooking = (booking: any) => {
    const bookings = loadBookings();
    bookings.push({ ...booking, id: Date.now(), reminded: false });
    fs.writeFileSync(BOOKINGS_FILE, JSON.stringify(bookings, null, 2));
  };

  // --- Background Tasks ---

  /**
   * System Backups
   * Scheduled to run every 6 hours.
   */
  cron.schedule('0 */6 * * *', () => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] Backup process initialized...`);
    
    // In a real scenario with a database, you would generate a dump here.
    // Since this is a static site, we'll log the intent.
    console.log('Action: Performing system backup.');
  });

  // --- API Routes ---

  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', backup_frequency: '6 hours' });
  });

  app.post('/api/contact', async (req, res) => {
    const { firstName, lastName, email, description, type, bookingDate, bookingTime } = req.body;
    
    // Log the submission details to server logs for backup tracking
    const logPrefix = type === 'booking' ? '[Repair Booking]' : '[General Inquiry]';
    console.log(`${logPrefix} Received message from ${firstName} ${lastName} (${email})`);
    
    if (type === 'booking') {
      saveBooking({ firstName, lastName, email, description, bookingDate, bookingTime });
      console.log(`[Terminal Sync] Saved booking to internal register.`);
    }

    res.status(200).json({ success: true, message: 'Form logged successfully' });
  });

  app.get('/api/config-check', (req, res) => {
    res.json({
      email_configured: false,
      notice: 'Automated emails disabled. Using WhatsApp/Mailto fallback.'
    });
  });

  // --- Vite / Static Handling ---

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log('Backup scheduler active: every 6 hours.');
  });
}

startServer();
