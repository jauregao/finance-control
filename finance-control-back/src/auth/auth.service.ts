import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { FirebaseAdminService } from '../firebase/firebase-admin.service';
import { PrismaService } from '../prisma/prisma.service';
import type { AuthUserData, FirebaseDecodedToken, LoginResponse } from '../types';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly firebaseAdmin: FirebaseAdminService,
    private readonly jwtService: JwtService,
  ) {}

  async loginWithFirebase(idToken: string): Promise<LoginResponse> {
    const decoded = await this.verifyFirebaseToken(idToken);
    const user = await this.findOrCreateUser(decoded);
    const accessToken = await this.generateAccessToken(user);

    return {
      userId: user.id,
      email: user.email,
      accessToken,
    };
  }

  private async verifyFirebaseToken(idToken: string): Promise<FirebaseDecodedToken> {
    try {
      return await this.firebaseAdmin.auth.verifyIdToken(idToken);
    } catch {
      throw new UnauthorizedException('Invalid Firebase token');
    }
  }

  private async findOrCreateUser(decoded: FirebaseDecodedToken): Promise<AuthUserData> {
    const existingUser = await this.prisma.user.findFirst({
      where: { email: decoded.email },
      select: { id: true, email: true },
    });

    if (existingUser) {
      return existingUser;
    }

    return this.prisma.user.create({
      data: {
        email: decoded.email,
        name: decoded.name,
        provider: 'firebase',
        providerAccountId: decoded.uid,
      },
      select: { id: true, email: true },
    });
  }

  private async generateAccessToken(user: AuthUserData): Promise<string> {
    const payload = { sub: user.id, email: user.email };
    return this.jwtService.signAsync(payload);
  }
}
