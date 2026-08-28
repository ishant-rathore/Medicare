import type { NextFunction, Request, Response } from 'express';

import * as firebase from '../config/firebase';
import { requireAuth } from '../middleware/auth.middleware';
import { ResponseHelper } from '../shared/response.helper';

afterEach(() => {
  jest.restoreAllMocks();
});

describe('Auth Middleware', () => {
  let req: Request;
  let res: Response;
  let next: jest.MockedFunction<NextFunction>;

  beforeEach(() => {
    req = { headers: {} } as Request;
    res = {} as Response;
    next = jest.fn() as jest.MockedFunction<NextFunction>;
  });

  it('returns 401 when authorization header is missing', async () => {
    const unauthorized = jest.spyOn(ResponseHelper, 'unauthorized').mockReturnValue(res);

    await requireAuth(req, res, next);

    expect(unauthorized).toHaveBeenCalledWith(
      res,
      'Authorization header missing or invalid format',
    );
    expect(next).not.toHaveBeenCalled();
  });

  it('returns 401 when authorization format is invalid', async () => {
    req.headers.authorization = 'Basic sometoken';
    const unauthorized = jest.spyOn(ResponseHelper, 'unauthorized').mockReturnValue(res);

    await requireAuth(req, res, next);

    expect(unauthorized).toHaveBeenCalledWith(
      res,
      'Authorization header missing or invalid format',
    );
    expect(next).not.toHaveBeenCalled();
  });

  it('returns 401 when Bearer token is empty', async () => {
    req.headers.authorization = 'Bearer ';
    const unauthorized = jest.spyOn(ResponseHelper, 'unauthorized').mockReturnValue(res);

    await requireAuth(req, res, next);

    expect(unauthorized).toHaveBeenCalledWith(res, 'Bearer token is empty');
    expect(next).not.toHaveBeenCalled();
  });

  it('returns 401 when Firebase token verification fails', async () => {
    req.headers.authorization = 'Bearer invalid_token';
    const unauthorized = jest.spyOn(ResponseHelper, 'unauthorized').mockReturnValue(res);
    const verify = jest.spyOn(firebase, 'verifyFirebaseToken').mockResolvedValue(null);

    await requireAuth(req, res, next);

    expect(verify).toHaveBeenCalledWith('invalid_token');
    expect(unauthorized).toHaveBeenCalledWith(res, 'Token is invalid or expired');
    expect(next).not.toHaveBeenCalled();
  });

  it('attaches verified Firebase identity and calls next', async () => {
    req.headers.authorization = 'Bearer valid_token';
    jest.spyOn(firebase, 'verifyFirebaseToken').mockResolvedValue({
      uid: 'user123',
      email: 'test@example.com',
    } as never);

    await requireAuth(req, res, next);

    expect(req.userId).toBe('user123');
    expect(req.userEmail).toBe('test@example.com');
    expect(req.firebaseUid).toBe('user123');
    expect(next).toHaveBeenCalledWith();
  });
});
