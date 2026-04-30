import z from "zod";

export const quickRateSchema = z.object({
  equipment: z.string().min(1, "Equipment is required"),
  criteria: z.string().min(1, "Criteria is required"),
  pickupLocation: z.string().min(1, "Pickup location is required"),
  pickupRadius: z.string().min(1, "Pickup radius is required"),
  deliveryLocation: z.string().min(1, "Delivery location is required"),
  deliveryRadius: z.string().min(1, "Delivery radius is required"),
});