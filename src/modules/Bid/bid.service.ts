import httpStatus from "http-status";
import { prisma } from "../../lib/prisma";
import AppError from "../../errors/AppError";
import { TCreateBid, TUpdateBidStatus } from "./bid.interface";
import { BidStatus, RentStatus } from "../../../generated/prisma/enums";

const createBid = async (payload: TCreateBid, driverId: string) => {
  // Check if rent exists and is pending
  const rent = await prisma.rent.findFirst({
    where: {
      id: payload.rentId,
      status: RentStatus.PENDING,
    },
  });

  if (!rent) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Rent not found or is not in pending status",
    );
  }

  // Prevent drivers from bidding on their own rents
  if (rent.userId === driverId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You cannot bid on your own rent request",
    );
  }

  return prisma.bid.create({
    data: {
      ...payload,
      driverId,
      status: BidStatus.PENDING,
    },
    include: {
      driver: {
        select: {
          id: true,
          name: true,
          email: true,
          rating: true,
        },
      },
      rent: {
        select: {
          id: true,
          status: true,
          startingPoint: true,
          destination: true,
        },
      },
    },
  });
};

const getBidsByRent = async (rentId: string) => {
  const rent = await prisma.rent.findUnique({
    where: { id: rentId },
  });

  if (!rent) {
    throw new AppError(httpStatus.NOT_FOUND, "Rent not found");
  }

  return prisma.bid.findMany({
    where: { rentId },
    include: {
      driver: {
        select: {
          id: true,
          name: true,
          email: true,
          rating: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

const getBidById = async (id: string) => {
  const bid = await prisma.bid.findUnique({
    where: { id },
    include: {
      driver: {
        select: {
          id: true,
          name: true,
          email: true,
          rating: true,
        },
      },
      rent: {
        select: {
          id: true,
          status: true,
          startingPoint: true,
          destination: true,
          userId: true,
        },
      },
    },
  });

  if (!bid) {
    throw new AppError(httpStatus.NOT_FOUND, "Bid not found");
  }

  return bid;
};

const acceptBid = async (bidId: string, userId: string) => {
  const bid = await prisma.bid.findUnique({
    where: { id: bidId },
    include: {
      rent: true,
    },
  });

  if (!bid) {
    throw new AppError(httpStatus.NOT_FOUND, "Bid not found");
  }

  // Only the rent owner can accept bids
  if (bid.rent.userId !== userId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You can only accept bids on your own rents",
    );
  }

  // Can't accept if rent is not pending
  if (bid.rent.status !== RentStatus.PENDING) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Can only accept bids on pending rents",
    );
  }

  // Can't accept if bid is not pending
  if (bid.status !== BidStatus.PENDING) {
    throw new AppError(httpStatus.BAD_REQUEST, "Can only accept pending bids");
  }

  // Transaction: accept bid and update rent status, reject other bids
  const result = await prisma.$transaction(async (tx) => {
    // Accept the selected bid
    const acceptedBid = await tx.bid.update({
      where: { id: bidId },
      data: { status: BidStatus.ACCEPTED },
      include: {
        driver: {
          select: {
            id: true,
            name: true,
            email: true,
            rating: true,
          },
        },
      },
    });

    // Update rent status to ongoing
    await tx.rent.update({
      where: { id: bid.rentId },
      data: { status: RentStatus.ONGOING },
    });

    // Reject all other bids for this rent
    await tx.bid.updateMany({
      where: {
        rentId: bid.rentId,
        id: { not: bidId },
      },
      data: { status: BidStatus.REJECTED },
    });

    return acceptedBid;
  });

  return result;
};

const rejectBid = async (bidId: string, userId: string) => {
  const bid = await prisma.bid.findUnique({
    where: { id: bidId },
    include: {
      rent: true,
    },
  });

  if (!bid) {
    throw new AppError(httpStatus.NOT_FOUND, "Bid not found");
  }

  // Only the rent owner can reject bids
  if (bid.rent.userId !== userId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You can only reject bids on your own rents",
    );
  }

  // Can't reject if already accepted or rejected
  if (bid.status !== BidStatus.PENDING) {
    throw new AppError(httpStatus.BAD_REQUEST, "Can only reject pending bids");
  }

  return prisma.bid.update({
    where: { id: bidId },
    data: { status: BidStatus.REJECTED },
    include: {
      driver: {
        select: {
          id: true,
          name: true,
          email: true,
          rating: true,
        },
      },
    },
  });
};

const deleteBid = async (bidId: string, driverId: string) => {
  const bid = await prisma.bid.findUnique({
    where: { id: bidId },
  });

  if (!bid) {
    throw new AppError(httpStatus.NOT_FOUND, "Bid not found");
  }

  // Only the driver who created the bid can delete it
  if (bid.driverId !== driverId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You can only delete your own bids",
    );
  }

  // Can't delete if already accepted
  if (bid.status === BidStatus.ACCEPTED) {
    throw new AppError(httpStatus.BAD_REQUEST, "Cannot delete an accepted bid");
  }

  return prisma.bid.delete({
    where: { id: bidId },
  });
};

export const BidService = {
  createBid,
  getBidsByRent,
  getBidById,
  acceptBid,
  rejectBid,
  deleteBid,
};
