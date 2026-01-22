import 'dotenv/config';
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  const categorias = [
    { name: 'Transporte' },
    { name: 'Alimentação' },
    { name: 'Lazer' },
    { name: 'Saúde' },
    { name: 'Educação' },
    { name: 'Moradia' },
    { name: 'Vestuário' },
    { name: 'Contas e Serviços' },
    { name: 'Investimentos' },
    { name: 'Outros' }
  ]

  await prisma.category.createMany({
    data: categorias,
    skipDuplicates: true
  })

  console.log('Categorias cadastradas com sucesso!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
