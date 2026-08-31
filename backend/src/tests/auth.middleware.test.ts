<<<<<<< HEAD
import { requireAuth } from '../middleware/auth.middleware';
import { AppError } from '../shared/errors/app-error';
import { getAuth } from 'firebase-admin/auth';

jest.mock('firebase-admin/auth', () => ({
  getAuth: jest.fn()
}));

describe('Auth Middleware', () => {
  let req: any;
  let res: any;
  let next: NextFunction;

  beforeEach(() => {
    req = {
      headers: {}
    };
    res = {};
    next = jest.fn();
    jest.clearAllMocks();
  });

  it('should throw AppError if no authorization header is provided', async () => {
    await requireAuth(req as Request, res as Response, next);
    
    expect(next).toHaveBeenCalledWith(expect.any(AppError));
    const error = (next as jest.Mock).mock.calls[0][0];
    expect(error.statusCode).toBe(401);
    expect(error.message).toBe('No authorization token was found');
  });

  it('should throw AppError if authorization format is invalid', async () => {
    req.headers = { authorization: 'Basic sometoken' };
    
    await requireAuth(req as Request, res as Response, next);
    
    expect(next).toHaveBeenCalledWith(expect.any(AppError));
    const error = (next as jest.Mock).mock.calls[0][0];
    expect(error.statusCode).toBe(401);
    expect(error.message).toBe('Invalid authorization format');
  });

  it('should attach user info to request and call next if token is valid', async () => {
    req.headers = { authorization: 'Bearer valid_token' };
    
    const mockVerifyIdToken = jest.fn().mockResolvedValue({
      uid: 'user123',
      email: 'test@example.com',
      role: 'DRIVER' // Testing if roles map correctly
    });
    
    (getAuth as jest.Mock).mockReturnValue({
      verifyIdToken: mockVerifyIdToken
    });

    await requireAuth(req as Request, res as Response, next);

    expect(mockVerifyIdToken).toHaveBeenCalledWith('valid_token');
    expect(req.user).toBeDefined();
    expect(req.user?.id).toBe('user123');
    expect(next).toHaveBeenCalledWith(); // Called without error
  });

  it('should throw AppError if token verification fails', async () => {
    req.headers = { authorization: 'Bearer invalid_token' };
    
    const mockVerifyIdToken = jest.fn().mockRejectedValue(new Error('Token expired'));
    
    (getAuth as jest.Mock).mockReturnValue({
      verifyIdToken: mockVerifyIdToken
    });

    await requireAuth(req as Request, res as Response, next);

    expect(next).toHaveBeenCalledWith(expect.any(AppError));
    const error = (next as jest.Mock).mock.calls[0][0];
    expect(error.statusCode).toBe(401);
    expect(error.message).toBe('Invalid or expired token');
=======
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
>>>>>>> f50a1494eb319d5be954309fd1b2724ae249fbba
  });
});
