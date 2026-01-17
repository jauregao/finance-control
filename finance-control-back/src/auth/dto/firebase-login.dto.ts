import { ApiProperty } from '@nestjs/swagger';

export class FirebaseLoginDto {
  @ApiProperty({
    description: 'Firebase ID token retornado pelo cliente',
  })
  idToken: string;
}
