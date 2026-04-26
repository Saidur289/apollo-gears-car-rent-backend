import httpStatus from "http-status";
import { prisma } from "../../lib/prisma";
import AppError from "../../errors/AppError";
import { TRentQuery, TCreateRent, TUpdateRent } from "./rent.interface";
import { AuthenticatedRequest } from "../../middlewares/auth";

const createRent = async (payload: TCreateRent, userId: string) => {
  // Check if car exists and is not deleted
  const car = await prisma.car.findFirst({
    where: {
      id: payload.carId,
      isDeleted: false,
    },
  });

  if (!car) {
    throw new AppError(httpStatus.NOT_FOUND, "Car not found");
  }

  return prisma.rent.create({
    data: {
      ...payload,
      userId,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      car: {
        select: {
          id: true,
          name: true,
          brand: true,
          model: true,
        },
      },
    },
  });
};

const getRents = async (query: TRentQuery, userId: string) => {
  const page = query.page ?? 1;
  const limit = query.limit ?? 10;
  const offset = (page - 1) * limit;

  const where: Record<string, unknown> = {
    userId, // Only show rents for the authenticated user
  };

  if (query.status) {
    Object.assign(where, { status: query.status });
  }

  const sortBy = query.sortBy ?? "createdAt";
  const sortOrder = query.sortOrder ?? "desc";

  const [rents, total] = await Promise.all([
    prisma.rent.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        car: {
          select: {
            id: true,
            name: true,
            brand: true,
            model: true,
          },
        },
        bids: {
          select: {
            id: true,
            amount: true,
            status: true,
            driverLocation: true,
            driver: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: { [sortBy]: sortOrder },
      skip: offset,
      take: limit,
    }),
    prisma.rent.count({ where }),
  ]);

  return {
    data: rents,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const getRentById = async (id: string, userId: string) => {
  const rent = await prisma.rent.findFirst({
    where: {
      id,
      userId, // Only allow access to own rents
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      car: {
        select: {
          id: true,
          name: true,
          brand: true,
          model: true,
        },
      },
      bids: {
        select: {
          id: true,
          amount: true,
          status: true,
          driverLocation: true,
          driver: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
    },
  });

  if (!rent) {
    throw new AppError(httpStatus.NOT_FOUND, "Rent not found");
  }

  return rent;
};

const updateRent = async (id: string, payload: TUpdateRent, userId: string) => {
  const existingRent = await prisma.rent.findFirst({
    where: { id, userId },
  });

  if (!existingRent) {
    throw new AppError(httpStatus.NOT_FOUND, "Rent not found");
  }

  return prisma.rent.update({
    where: { id },
    data: payload,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      car: {
        select: {
          id: true,
          name: true,
          brand: true,
          model: true,
        },
      },
    },
  });
};

const deleteRent = async (id: string, userId: string) => {
  const existingRent = await prisma.rent.findFirst({
    where: { id, userId },
  });

  if (!existingRent) {
    throw new AppError(httpStatus.NOT_FOUND, "Rent not found");
  }

  return prisma.rent.delete({
    where: { id },
  });
};

export const RentService = {
  createRent,
  getRents,
  getRentById,
  updateRent,
  deleteRent,
};
