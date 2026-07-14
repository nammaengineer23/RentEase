import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class ChatService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  // ==========================
  // Start Conversation
  // ==========================
  async createConversation(
    propertyId: string,
    tenantId: string,
  ) {
    const property =
      await this.prisma.property.findUnique({
        where: {
          id: propertyId,
        },
      });

    if (!property) {
      throw new NotFoundException(
        'Property not found',
      );
    }

    const existing =
      await this.prisma.conversation.findFirst({
        where: {
          propertyId,
          ownerId: property.ownerId,
          tenantId,
        },
      });

    if (existing) {
      return existing;
    }

    return this.prisma.conversation.create({
      data: {
        propertyId,
        ownerId: property.ownerId,
        tenantId,
      },
      include: {
        property: true,
        owner: {
          select: {
            id: true,
            fullName: true,
          },
        },
        tenant: {
          select: {
            id: true,
            fullName: true,
          },
        },
      },
    });
  }

// ==========================
// Conversation List
// ==========================
async listConversations(userId: string) {
  const conversations =
    await this.prisma.conversation.findMany({
      where: {
        OR: [
          {
            ownerId: userId,
          },
          {
            tenantId: userId,
          },
        ],
      },
      include: {
        property: {
          select: {
            id: true,
            title: true,
            city: true,
            locality: true,
          },
        },
        owner: {
          select: {
            id: true,
            fullName: true,
          },
        },
        tenant: {
          select: {
            id: true,
            fullName: true,
          },
        },
        messages: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
          include: {
            sender: {
              select: {
                id: true,
                fullName: true,
              },
            },
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

  return conversations.map((conversation) => {
    const otherUser =
      conversation.ownerId === userId
        ? conversation.tenant
        : conversation.owner;

    return {
      conversationId: conversation.id,

      property: conversation.property,

      otherUser,

      lastMessage:
        conversation.messages.length > 0
          ? conversation.messages[0]
          : null,

      updatedAt: conversation.updatedAt,
    };
  });
}

// ==========================
// Send Message
// ==========================
async sendMessage(
  conversationId: string,
  senderId: string,
  text: string,
) {
  const conversation =
    await this.prisma.conversation.findUnique({
      where: {
        id: conversationId,
      },
    });

  if (!conversation) {
    throw new NotFoundException(
      'Conversation not found',
    );
  }

  if (
    senderId !== conversation.ownerId &&
    senderId !== conversation.tenantId
  ) {
    throw new NotFoundException(
      'You are not part of this conversation',
    );
  }

  return this.prisma.message.create({
    data: {
      conversationId,
      senderId,
      text,
    },
    include: {
      sender: {
        select: {
          id: true,
          fullName: true,
        },
      },
    },
  });
}

// ==========================
// Mark Message as Read
// ==========================
async markAsRead(
  messageId: string,
  userId: string,
) {
  const message =
    await this.prisma.message.findUnique({
      where: {
        id: messageId,
      },
      include: {
        conversation: true,
      },
    });

  if (!message) {
    throw new NotFoundException(
      'Message not found',
    );
  }

  // Sender cannot mark their own message as read
  if (message.senderId === userId) {
    return {
      message: 'Sender cannot mark own message as read',
    };
  }

  // User must belong to the conversation
  if (
    message.conversation.ownerId !== userId &&
    message.conversation.tenantId !== userId
  ) {
    throw new NotFoundException(
      'Conversation not found',
    );
  }

  return this.prisma.message.update({
    where: {
      id: messageId,
    },
    data: {
      isRead: true,
    },
  });
}

// ==========================
// Get Messages
// ==========================
async getMessages(
  conversationId: string,
  userId: string,
) {
  const conversation =
    await this.prisma.conversation.findUnique({
      where: {
        id: conversationId,
      },
    });

  if (!conversation) {
    throw new NotFoundException(
      'Conversation not found',
    );
  }

  if (
    conversation.ownerId !== userId &&
    conversation.tenantId !== userId
  ) {
    throw new NotFoundException(
      'You are not part of this conversation',
    );
  }

  return this.prisma.message.findMany({
    where: {
      conversationId,
    },
    include: {
      sender: {
        select: {
          id: true,
          fullName: true,
        },
      },
    },
    orderBy: {
      createdAt: 'asc',
    },
  });
}

}