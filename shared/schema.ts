import { pgTable, text, serial, integer, boolean, numeric, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Financial data schemas
export const financialData = pgTable("financial_data", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  dataJson: text("data_json").notNull(), // Store all financial data as JSON
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertFinancialDataSchema = createInsertSchema(financialData).pick({
  userId: true,
  dataJson: true,
});

export type InsertFinancialData = z.infer<typeof insertFinancialDataSchema>;
export type FinancialData = typeof financialData.$inferSelect;

// Industry data schema
export const industryData = pgTable("industry_data", {
  id: serial("id").primaryKey(),
  industryCode: text("industry_code").notNull().unique(), // e.g., 'tech', 'healthcare', etc.
  name: text("name").notNull(),
  dataJson: text("data_json").notNull(), // Store all industry data as JSON
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertIndustryDataSchema = createInsertSchema(industryData).pick({
  industryCode: true,
  name: true,
  dataJson: true,
});

export type InsertIndustryData = z.infer<typeof insertIndustryDataSchema>;
export type IndustryData = typeof industryData.$inferSelect;

// Valuation parameters schema
export const valuationParameters = pgTable("valuation_parameters", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  paramsJson: text("params_json").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertValuationParametersSchema = createInsertSchema(valuationParameters).pick({
  userId: true,
  paramsJson: true,
});

export type InsertValuationParameters = z.infer<typeof insertValuationParametersSchema>;
export type ValuationParameters = typeof valuationParameters.$inferSelect;

// Investment modeling schema
export const investmentModels = pgTable("investment_models", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  modelJson: text("model_json").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertInvestmentModelSchema = createInsertSchema(investmentModels).pick({
  userId: true,
  modelJson: true,
});

export type InsertInvestmentModel = z.infer<typeof insertInvestmentModelSchema>;
export type InvestmentModel = typeof investmentModels.$inferSelect;

// Report configurations schema
export const reportConfigurations = pgTable("report_configurations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  projects: text("projects").notNull(), // Comma-separated list of projects
  reportDay: text("report_day").notNull(),
  reportTime: text("report_time").notNull(),
  reportTitle: text("report_title").notNull(),
  includeSummary: boolean("include_summary").notNull().default(true),
  includeCompleted: boolean("include_completed").notNull().default(true),
  includeProgress: boolean("include_progress").notNull().default(true),
  includeUpcoming: boolean("include_upcoming").notNull().default(true),
  includeBlockers: boolean("include_blockers").notNull().default(true),
  includeMetrics: boolean("include_metrics").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertReportConfigurationSchema = createInsertSchema(reportConfigurations).pick({
  userId: true,
  name: true,
  projects: true,
  reportDay: true,
  reportTime: true,
  reportTitle: true,
  includeSummary: true,
  includeCompleted: true,
  includeProgress: true,
  includeUpcoming: true,
  includeBlockers: true,
  includeMetrics: true,
});

export type InsertReportConfiguration = z.infer<typeof insertReportConfigurationSchema>;
export type ReportConfiguration = typeof reportConfigurations.$inferSelect;
