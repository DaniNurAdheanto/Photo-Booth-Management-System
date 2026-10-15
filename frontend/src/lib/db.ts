import { getDatabaseConnection } from './typeorm/data-source';
import { Booth, PhotoSession, User, Booking, Device, Template } from './typeorm/entities';

/**
 * Convenience helper to access repositories inside Next.js App Router (Server Components / Server Actions)
 */
export async function getRepositories() {
  const connection = await getDatabaseConnection();

  return {
    connection,
    users: connection.getRepository(User),
    booths: connection.getRepository(Booth),
    sessions: connection.getRepository(PhotoSession),
    bookings: connection.getRepository(Booking),
    devices: connection.getRepository(Device),
    templates: connection.getRepository(Template),
  };
}
