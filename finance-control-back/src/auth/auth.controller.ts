import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

class FirebaseLoginDto {
  idToken: string;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('firebase')
  firebaseLogin(@Body() body: FirebaseLoginDto) {
    return this.authService.loginWithFirebase(body.idToken);
  }
}
