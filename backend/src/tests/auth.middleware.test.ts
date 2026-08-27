import { Request, Response, NextFunction } from 'express';
import { requireAuth } from '../middleware/auth.middleware';
import { AppError } from '../utils/app-error';
import { getAuth } from 'firebase-admin/auth';

jest.mock('firebase-admin/auth', () => ({
  getAuth: jest.fn()
}));

describe('Auth Middleware', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
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
  });
});
