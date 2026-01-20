import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { TransactionType } from "@prisma/client";
import { Type } from "class-transformer";
import { IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from "class-validator";


export class CreateTransactionDto {
  @ApiProperty({
    description: 'Transaction amount',
    example: 150.50,
  })
  @IsNumber()
  @IsPositive()
  amount: number;

  @ApiProperty({
    description: 'Transaction type: INCOME or EXPENSE',
    enum: ['INCOME', 'EXPENSE'],
    example: 'EXPENSE',
  })
  @IsEnum(TransactionType)
  type: TransactionType;

  @ApiProperty({
    description: 'Transaction due date',
    example: '2026-02-15',
  })
  @IsDate()
  @Type(() => Date)
  dueDate: Date;

  @ApiProperty({
    description: 'Category ID associated with the transaction',
    example: 'clx1234567890abcdef',
  })
  @IsString()
  @IsNotEmpty()
  categoryId: string;

  @ApiProperty({
    description: 'Transaction description',
    example: 'Electricity bill',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiPropertyOptional({
    description: 'Payment date (optional)',
    example: '2026-02-10',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  paymentDate?: Date;
}
