import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { TransactionType } from '@prisma/client';
import { OrderDirection, TransactionOrderField } from '../types';

@Injectable()
export class TransactionService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createTransactionDto: CreateTransactionDto, userId: string) {
    return this.prisma.transaction.create({
      data: {
        ...createTransactionDto,
        userId,
      },
      include: { category: true },
    });
  }

  async findAll(
    userId: string,
    categoryId?: string,
    type?: TransactionType,
    field: TransactionOrderField = TransactionOrderField.DUEDATE,
    order: OrderDirection = OrderDirection.ASC,
  ) {
    return this.prisma.transaction.findMany({
      where: this.buildWhereClauseFilter(userId, categoryId, type),
      orderBy: { [field]: order },
      include: { category: true },
    });
  }

  private buildWhereClauseFilter(
    userId: string,
    categoryId?: string,
    type?: TransactionType,
  ) {
    return {
      userId,
      ...(categoryId && { categoryId }),
      ...(type && { type }),
    };
  }

  async findOne(id: string, userId: string) {
    const transaction = await this.prisma.transaction.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    return transaction;
  }

  async update(
    id: string,
    userId: string,
    updateTransactionDto: UpdateTransactionDto,
  ) {
    const result = await this.prisma.transaction.updateMany({
      where: {
        id,
        userId,
      },
      data: updateTransactionDto,
    });

    if (result.count === 0) {
      throw new NotFoundException('Transaction not found or not authorized');
    }

    return this.findOne(id, userId);
  }

  async remove(id: string, userId: string) {
    const result = await this.prisma.transaction.deleteMany({
      where: {
        id,
        userId,
      },
    });

    if (result.count === 0) {
      throw new NotFoundException('Transaction not found or not authorized');
    }

    return { deleted: true };
  }
}
