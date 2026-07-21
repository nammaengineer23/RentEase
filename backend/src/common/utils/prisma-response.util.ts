import { Prisma } from '@prisma/client';

export function serializePrisma<T>(data: T): T {
  if (data === null || data === undefined) {
    return data;
  }

  // Preserve Date objects
  if (data instanceof Date) {
    return data;
  }

  // Convert Prisma Decimal
  if (data instanceof Prisma.Decimal) {
    return data.toNumber() as T;
  }

  // Arrays
  if (Array.isArray(data)) {
    return data.map((item) => serializePrisma(item)) as T;
  }

  // Objects
  if (typeof data === 'object') {
    const result: any = {};

    for (const key in data) {
      result[key] = serializePrisma((data as any)[key]);
    }

    return result;
  }

  return data;
}