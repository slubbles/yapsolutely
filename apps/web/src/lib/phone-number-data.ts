import { prisma } from "@/lib/db";

export type PhoneNumberListItem = {
  id: string;
  phoneNumber: string;
  friendlyName: string | null;
  twilioSid: string | null;
  assignedAgentId: string | null;
  assignedAgentName: string | null;
  createdAt: Date;
};

export type PhoneNumberListFilters = {
  query?: string;
  status?: string;
};

function normalizePhoneNumber(value: string) {
  const trimmed = value.trim();

  if (!trimmed) {
    return "";
  }

  if (trimmed.startsWith("+")) {
    return `+${trimmed.slice(1).replace(/\D/g, "")}`;
  }

  return `+${trimmed.replace(/\D/g, "")}`;
}

export async function listPhoneNumbersWithAssignments(
  email: string,
  filters: PhoneNumberListFilters = {},
): Promise<PhoneNumberListItem[]> {
  const query = filters.query?.trim() || "";
  const normalizedStatus = filters.status?.trim().toUpperCase() || "";

  try {
    const items = await prisma.phoneNumber.findMany({
      where: {
        user: {
          email,
        },
        ...(query
          ? {
              OR: [
                {
                  phoneNumber: {
                    contains: query,
                    mode: "insensitive",
                  },
                },
                {
                  friendlyName: {
                    contains: query,
                    mode: "insensitive",
                  },
                },
                {
                  twilioSid: {
                    contains: query,
                    mode: "insensitive",
                  },
                },
                {
                  agent: {
                    name: {
                      contains: query,
                      mode: "insensitive",
                    },
                  },
                },
              ],
            }
          : {}),
        ...(normalizedStatus === "ASSIGNED"
          ? {
              agentId: {
                not: null,
              },
            }
          : normalizedStatus === "UNASSIGNED"
            ? {
                agentId: null,
                friendlyName: {
                  not: null,
                },
              }
            : normalizedStatus === "NEEDS_SETUP"
              ? {
                  agentId: null,
                  friendlyName: null,
                }
              : {}),
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        agent: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return items.map((item) => ({
      id: item.id,
      phoneNumber: item.phoneNumber,
      friendlyName: item.friendlyName,
      twilioSid: item.twilioSid,
      assignedAgentId: item.agent?.id ?? null,
      assignedAgentName: item.agent?.name ?? null,
      createdAt: item.createdAt,
    }));
  } catch {
    return [];
  }
}

export async function resolveAgentByPhoneNumber(phoneNumber: string) {
  const normalizedPhoneNumber = normalizePhoneNumber(phoneNumber);

  if (!normalizedPhoneNumber) {
    return null;
  }

  try {
    return await prisma.phoneNumber.findFirst({
      where: {
        phoneNumber: normalizedPhoneNumber,
      },
      include: {
        agent: true,
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });
  } catch {
    return null;
  }
}

export { normalizePhoneNumber };