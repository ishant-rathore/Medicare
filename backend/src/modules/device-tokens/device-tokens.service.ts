// =============================================================================
// backend/src/modules/device-tokens/device-tokens.service.ts
// Device token ownership and lifecycle operations.
// =============================================================================

import { NotFoundError } from '../../shared/errors/app-error';
import { prisma } from '../../config/database';

export const DeviceTokensService = {
  async register(userId: string, token: string, platform: 'android' | 'ios') {
    return prisma.deviceToken.upsert({
      where: { token },
      create: { userId, token, platform, isActive: true },
      update: { userId, platform, isActive: true, updatedAt: new Date() },
    });
  },

  async deactivate(userId: string, token: string): Promise<void> {
    const result = await prisma.deviceToken.updateMany({
      where: { userId, token, isActive: true },
      data: { isActive: false, updatedAt: new Date() },
    });

    if (result.count === 0) throw new NotFoundError('Device token');
  },
};
