import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { FirebaseLoginDto } from './dto/firebase-login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('firebase')
  @ApiOperation({ summary: 'Login com Firebase ID Token' })
  @ApiBody({ type: FirebaseLoginDto })
  firebaseLogin(@Body() body: FirebaseLoginDto) {
    return this.authService.loginWithFirebase(body.idToken);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Dados do usuário autenticado' })
  getProfile() {
    return { ok: true };
  }
}
