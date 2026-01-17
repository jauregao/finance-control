import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { FirebaseAdminService } from '../firebase/firebase-admin.service';
import type { FirebaseDecodedToken } from './types/firebase-decoded-token.type';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly firebaseAdmin: FirebaseAdminService,
    private readonly jwtService: JwtService,
  ) {}

  async loginWithFirebase(idToken: string) {
    let decoded: FirebaseDecodedToken | null = null;

    try {
      decoded = await this.firebaseAdmin.auth.verifyIdToken(idToken);
    } catch {
      throw new UnauthorizedException('Invalid Firebase token');
    }

    const { uid, email, name } = decoded;

    let user = await this.prisma.user.findFirst({
      where: { email: email },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email: email,
          name: name,
          provider: 'firebase',
          providerAccountId: uid,
        },
      });
    }

    const payload = { sub: user.id, email: user.email };
    const accessToken = await this.jwtService.signAsync(payload);

    return {
      userId: user.id,
      email: user.email,
      accessToken,
    };
  }
}
