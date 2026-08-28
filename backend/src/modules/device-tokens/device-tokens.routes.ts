// =============================================================================
// backend/src/modules/device-tokens/device-tokens.routes.ts
// FCM device token management
// =============================================================================

import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';

import { requireAuth } from '../../middleware/auth.middleware';
import { ResponseHelper } from '../../shared/response.helper';
import { DeviceTokensService } from './device-tokens.service';

const router = Router();

const registerTokenSchema = z.object({
  token: z.string().trim().min(100).max(4096),
  platform: z.enum(['android', 'ios']).default('android'),
}).strict();

const deactivateTokenSchema = z.object({ token: z.string().trim().min(100).max(4096) }).strict();

router.use(requireAuth);

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token, platform } = registerTokenSchema.parse(req.body);
    await DeviceTokensService.register(req.userId!, token, platform);
    ResponseHelper.ok(res, null, 'Device token registered');
  } catch (error) {
    next(error);
  }
});

router.delete('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token } = deactivateTokenSchema.parse(req.body);
    await DeviceTokensService.deactivate(req.userId!, token);
    ResponseHelper.noContent(res);
  } catch (error) {
    next(error);
  }
});

export default router;
