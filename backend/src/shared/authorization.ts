// =============================================================================
// backend/src/shared/authorization.ts
// Resource-level authorization helpers.
// =============================================================================

import { AuthorizationError } from './errors/app-error';
import { prisma } from '../config/database';

export type CaregiverPermission = 'VIEW' | 'MANAGE';

export async function assertCaregiverAccess(
  caregiverId: string,
  ownerId: string,
  permission: CaregiverPermission,
): Promise<void> {
  if (caregiverId === ownerId) return;

  const relation = await prisma.caregiverRelation.findFirst({
    where: {
      userId: ownerId,
      caregiverId,
      isActive: true,
    },
    select: { accessLevel: true },
  });

  if (!relation) {
    throw new AuthorizationError('You do not have access to this user');
  }

  if (permission === 'MANAGE' && relation.accessLevel !== 'MANAGE') {
    throw new AuthorizationError('Caregiver manage permission is required');
  }
}

export async function resolveUserIdByFirebaseUid(firebaseUid: string): Promise<string> {
  const user = await prisma.user.findUnique({
    where: { firebaseUid },
    select: { id: true },
  });

  if (!user) {
    throw new AuthorizationError('Authenticated user profile not found');
  }

  return user.id;
}
