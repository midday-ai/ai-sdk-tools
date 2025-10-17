import { tool } from "ai";
import { z } from "zod";
import { generateCustomer } from "@/ai/utils/fake-data";

export const getCustomersTool = tool({
  description: `Get a list of customers with optional filtering and sorting`,

  inputSchema: z.object({
    limit: z
      .number()
      .optional()
      .describe("Maximum number of customers to return (default: 10)"),
    sortBy: z
      .enum(["revenue", "name", "created"])
      .optional()
      .describe("Sort customers by revenue, name, or creation date"),
    sortOrder: z
      .enum(["asc", "desc"])
      .optional()
      .describe("Sort order (default: desc for revenue, asc for others)"),
    tags: z
      .array(z.string())
      .optional()
      .describe("Filter by customer tags (e.g., VIP, Enterprise)"),
  }),

  execute: async (params) => {
    const {
      limit = 10,
      sortBy = "revenue",
      sortOrder = sortBy === "revenue" ? "desc" : "asc",
      tags,
    } = params;

    // Generate customers with revenue data
    const customers = Array.from({ length: 50 }, (_, i) => {
      const customer = generateCustomer({ customerId: `CUST-${1000 + i}` });
      // Add revenue based on customer ID hash
      const revenue = Math.abs(
        customer.id.split("").reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0),
      ) * 1000;
      return {
        ...customer,
        totalRevenue: revenue,
      };
    });

    // Filter by tags if provided
    let filteredCustomers = customers;
    if (tags && tags.length > 0) {
      filteredCustomers = customers.filter((customer) =>
        customer.tags.some((customerTag) => tags.includes(customerTag)),
      );
    }

    // Sort customers
    const sortedCustomers = [...filteredCustomers].sort((a, b) => {
      let comparison = 0;

      if (sortBy === "revenue") {
        comparison = a.totalRevenue - b.totalRevenue;
      } else if (sortBy === "name") {
        comparison = a.name.localeCompare(b.name);
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });

    // Limit results
    const limitedCustomers = sortedCustomers.slice(0, limit);

    return {
      customers: limitedCustomers,
      total: filteredCustomers.length,
      returned: limitedCustomers.length,
      sortedBy: sortBy,
      sortOrder,
    };
  },
});

