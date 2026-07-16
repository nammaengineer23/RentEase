import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class AdminService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  // ==========================
// Get All Users
// ==========================
async getUsers() {
  return this.prisma.user.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    select: {
      id: true,
      fullName: true,
      email: true,
      phone: true,
      role: true,
      createdAt: true,
      properties: {
        select: {
          id: true,
        },
      },
    },
  });
}

// ==========================
// Activate User
// ==========================
async activateUser(id: string) {
  return this.prisma.user.update({
    where: {
      id,
    },
    data: {
      isActive: true,
    },
  });
}

// ==========================
// Deactivate User
// ==========================
async deactivateUser(id: string) {
  return this.prisma.user.update({
    where: {
      id,
    },
    data: {
      isActive: false,
    },
  });
}

// ==========================
// Delete User
// ==========================
async deleteUser(id: string) {
  return this.prisma.user.delete({
    where: {
      id,
    },
  });
}

// ==========================
// Get All Properties
// ==========================
async getProperties() {
  return this.prisma.property.findMany({
    include: {
      owner: {
        select: {
          id: true,
          fullName: true,
          email: true,
        },
      },
      reviews: true,
      favorites: true,
      visits: true,
      images: {
        where: {
          isPrimary: true,
        },
        take: 1,
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}

// ==========================
// Get Property Details
// ==========================
async getProperty(id: string) {
  return this.prisma.property.findUnique({
    where: {
      id,
    },
    include: {
      owner: true,
      amenities: {
        include: {
          amenity: true,
        },
      },
      images: true,
      reviews: {
        include: {
          user: true,
        },
      },
      favorites: {
        include: {
          user: true,
        },
      },
      visits: {
        include: {
          tenant: true,
        },
      },
    },
  });
}

// ==========================
// Hide Property
// ==========================
async hideProperty(id: string) {
  return this.prisma.property.update({
    where: {
      id,
    },
    data: {
      isAvailable: false,
    },
  });
}

// ==========================
// Unhide Property
// ==========================
async unhideProperty(id: string) {
  return this.prisma.property.update({
    where: {
      id,
    },
    data: {
      isAvailable: true,
    },
  });
}

// ==========================
// Delete Property
// ==========================
async deleteProperty(id: string) {
  return this.prisma.property.delete({
    where: {
      id,
    },
  });
}

// ==========================
// Get User Details
// ==========================
async getUser(id: string) {
  return this.prisma.user.findUnique({
    where: {
      id,
    },
    include: {
      properties: true,
      reviews: true,
      favorites: true,
      visits: true,
    },
  });
}

  async getDashboard() {
    const [
      users,
      properties,
      reviews,
      favorites,
      visits,
    ] = await Promise.all([
      this.prisma.user.findMany(),
      this.prisma.property.findMany(),
      this.prisma.review.findMany(),
      this.prisma.favorite.findMany(),
      this.prisma.propertyVisit.findMany(),
    ]);

    

    const totalUsers = users.length;

    const totalOwners = users.filter(
      (u) => u.role === 'OWNER',
    ).length;

    const totalAdmins = users.filter(
      (u) => u.role === 'ADMIN',
    ).length;

    const totalProperties = properties.length;

    const activeProperties = properties.filter(
      (p) => p.isAvailable,
    ).length;

    const rentedProperties =
      totalProperties - activeProperties;

    const pendingVisits = visits.filter(
      (v) => v.status === 'PENDING',
    ).length;

    const approvedVisits = visits.filter(
      (v) => v.status === 'APPROVED',
    ).length;

    const completedVisits = visits.filter(
      (v) => v.status === 'COMPLETED',
    ).length;

    return {
      users: {
        totalUsers,
        totalOwners,
        totalAdmins,
      },

      properties: {
        totalProperties,
        activeProperties,
        rentedProperties,
      },

      engagement: {
        totalReviews: reviews.length,
        totalFavorites: favorites.length,
      },

      visits: {
        totalVisits: visits.length,
        pendingVisits,
        approvedVisits,
        completedVisits,
      },
    };
  }
}