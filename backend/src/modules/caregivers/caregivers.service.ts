// =============================================================================
// backend/src/modules/caregivers/caregivers.service.ts
// Caregiver relationship management and scoped authorization.
// =============================================================================

import { AuthorizationError, NotFoundError } from '../../shared/errors/app-error';
import { prisma } from '../../config/database';

export const CaregiversService = {
  async getOwner(userId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { id: true } });
    if (!user) throw new NotFoundError('User');
    return user;
  },

  async list(userId: string) {
    return prisma.caregiverRelation.findMany({
      where: { userId, isActive: true },
      include: { caregiver: { select: { name: true, email: true, photoUrl: true } } },
      orderBy: { createdAt: 'desc' },
    });
  },

  async add(userId: string, data: {
    caregiverEmail: string;
    accessLevel: 'VIEW_ONLY' | 'MANAGE';
    relationLabel?: string;
    notifyOnMissed: boolean;
    notifyOnTaken: boolean;
    notifyOnLowStock: boolean;
  }) {
    const caregiver = await prisma.user.findUnique({
      where: { email: data.caregiverEmail },
      select: { id: true, isActive: true },
    });
    if (!caregiver) throw new NotFoundError('Caregiver user');
    if (!caregiver.isActive) throw new AuthorizationError('Caregiver account is inactive');
    if (caregiver.id === userId) throw new AuthorizationError('You cannot add yourself as a caregiver');

    return prisma.caregiverRelation.upsert({
      where: { userId_caregiverId: { userId, caregiverId: caregiver.id } },
      create: {
        userId,
        caregiverId: caregiver.id,
        accessLevel: data.accessLevel as never,
        relationLabel: data.relationLabel,
        notifyOnMissed: data.notifyOnMissed,
        notifyOnTaken: data.notifyOnTaken,
        notifyOnLowStock: data.notifyOnLowStock,
        isActive: true,
      },
      update: {
        isActive: true,
        accessLevel: data.accessLevel as never,
        relationLabel: data.relationLabel,
        notifyOnMissed: data.notifyOnMissed,
        notifyOnTaken: data.notifyOnTaken,
        notifyOnLowStock: data.notifyOnLowStock,
        updatedAt: new Date(),
      },
    });
  },

  async revoke(userId: string, relationId: string) {
    const relation = await prisma.caregiverRelation.findFirst({ where: { id: relationId, userId } });
    if (!relation) throw new NotFoundError('Caregiver relation');

    await prisma.caregiverRelation.update({
      where: { id: relationId },
      data: { isActive: false, updatedAt: new Date() },
    });
  },

  async monitoring(caregiverId: string, targetUserId: string) {
    const relation = await prisma.caregiverRelation.findFirst({
      where: { userId: targetUserId, caregiverId, isActive: true },
      select: { accessLevel: true },
    });

    if (!relation) throw new AuthorizationError('You do not have caregiver access to this user');

    const today = new Date();
    const dateValue = today.toISOString().slice(0, 10);
    const startOfDay = new Date(`${dateValue}T00:00:00.000Z`);
    const endOfDay = new Date(`${dateValue}T23:59:59.999Z`);

    const [todayDoses, user] = await Promise.all([
      prisma.doseEvent.findMany({
        where: { userId: targetUserId, scheduledDate: { gte: startOfDay, lte: endOfDay } },
        orderBy: { scheduledTime: 'asc' },
      }),
      prisma.user.findUnique({ where: { id: targetUserId }, select: { name: true, nickname: true, photoUrl: true } }),
    ]);

    return { user, todayDoses, accessLevel: relation.accessLevel };
  },
};
