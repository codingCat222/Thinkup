import { z } from "zod";

export const AGE_CATEGORIES = [
  "Ages 2–5 (Playground & Bouncing Castle)",
  "Ages 6–8 (Movies & Games)",
  "Ages 9–12 (Junior Category)",
  "Ages 13–19 (Senior Category)",
] as const;

export const registrationSchema = z.object({
  parentName: z
    .string()
    .min(3, "Parent/Guardian full name must be at least 3 characters")
    .max(100, "Name is too long"),
  parentPhone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .regex(/^(\+?234|0)[789][01]\d{8}$/, "Please enter a valid Nigerian phone number (e.g. 0806 755 7709)"),
  parentEmail: z
    .string()
    .email("Please enter a valid email address"),
  childName: z
    .string()
    .min(2, "Child's name must be at least 2 characters")
    .max(100, "Name is too long"),
  dateOfBirth: z
    .string()
    .min(1, "Date of birth is required"),
  age: z
    .coerce
    .number({ invalid_type_error: "Age must be a number" })
    .min(2, "Participants must be at least 2 years old")
    .max(19, "Participants must be 19 years old or younger"),
  schoolName: z
    .string()
    .min(2, "School name is required")
    .max(120, "School name is too long"),
  ageCategory: z
    .string()
    .min(1, "Please select an age category"),
  projectDescription: z
    .string()
    .min(15, "Please provide at least a brief description of the app idea or project (min 15 characters)")
    .max(2000, "Description is too long (maximum 2,000 characters)"),
  consentGiven: z
    .literal(true, {
      errorMap: () => ({ message: "Parent/guardian consent is required to participate" }),
    }),
  privacyAgreed: z
    .literal(true, {
      errorMap: () => ({ message: "You must agree to the privacy policy" }),
    }),
});

export type RegistrationFormData = z.infer<typeof registrationSchema>;

