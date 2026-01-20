import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { FirebaseLoginDto } from './dto/firebase-login.dto';
import { Public } from 'src/decorators/public.decorator';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { AuthUser } from './types/auth-user.type';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('firebase')
  @ApiOperation({ summary: 'Login with Firebase ID Token' })
  @ApiBody({ type: FirebaseLoginDto })
  @ApiResponse({ status: 201, description: 'Login successful, returns JWT token' })
  @ApiResponse({ status: 401, description: 'Invalid Firebase token' })
  @Public()
  firebaseLogin(@Body() body: FirebaseLoginDto) {
    return this.authService.loginWithFirebase(body.idToken);
  }

  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get authenticated user data' })
  @ApiResponse({ status: 200, description: 'User data retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getProfile(@CurrentUser() user: AuthUser) {
    return user;
  }
}
