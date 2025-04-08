import { eq } from "drizzle-orm";
import { db } from "./db";
import { 
  users, financialData, industryData, valuationParameters, investmentModels, reportConfigurations, 
  type User, type InsertUser, type FinancialData, type InsertFinancialData, type IndustryData,
  type ValuationParameters, type InsertValuationParameters, type InvestmentModel, type InsertInvestmentModel,
  type ReportConfiguration, type InsertReportConfiguration
} from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Financial data methods
  getFinancialDataByUser(userId: number): Promise<FinancialData | undefined>;
  saveFinancialData(data: InsertFinancialData): Promise<FinancialData>;

  // Valuation parameters methods
  getValuationParametersByUser(userId: number): Promise<ValuationParameters | undefined>;
  saveValuationParameters(params: InsertValuationParameters): Promise<ValuationParameters>;

  // Investment model methods
  getInvestmentModelByUser(userId: number): Promise<InvestmentModel | undefined>;
  saveInvestmentModel(model: InsertInvestmentModel): Promise<InvestmentModel>;
  getSavedProjects(): Promise<string[]>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getFinancialDataByUser(userId: number): Promise<FinancialData | undefined> {
    const [data] = await db.select().from(financialData).where(eq(financialData.userId, userId));
    return data || undefined;
  }

  async saveFinancialData(data: InsertFinancialData): Promise<FinancialData> {
    // Try to update existing data first
    const [existingData] = await db.select().from(financialData)
      .where(eq(financialData.userId, data.userId));

    if (existingData) {
      const [updatedData] = await db.update(financialData)
        .set(data)
        .where(eq(financialData.id, existingData.id))
        .returning();
      return updatedData;
    } else {
      const [newData] = await db.insert(financialData)
        .values(data)
        .returning();
      return newData;
    }
  }

  async getValuationParametersByUser(userId: number): Promise<ValuationParameters | undefined> {
    const [params] = await db.select().from(valuationParameters).where(eq(valuationParameters.userId, userId));
    return params || undefined;
  }

  async saveValuationParameters(params: InsertValuationParameters): Promise<ValuationParameters> {
    // Try to update existing parameters first
    const [existingParams] = await db.select().from(valuationParameters)
      .where(eq(valuationParameters.userId, params.userId));

    if (existingParams) {
      const [updatedParams] = await db.update(valuationParameters)
        .set(params)
        .where(eq(valuationParameters.id, existingParams.id))
        .returning();
      return updatedParams;
    } else {
      const [newParams] = await db.insert(valuationParameters)
        .values(params)
        .returning();
      return newParams;
    }
  }

  async getInvestmentModelByUser(userId: number): Promise<InvestmentModel | undefined> {
    const [model] = await db.select().from(investmentModels).where(eq(investmentModels.userId, userId));
    return model || undefined;
  }

  async saveInvestmentModel(model: InsertInvestmentModel): Promise<InvestmentModel> {
    // Try to update existing model first
    const [existingModel] = await db.select().from(investmentModels)
      .where(eq(investmentModels.userId, model.userId));

    if (existingModel) {
      const [updatedModel] = await db.update(investmentModels)
        .set(model)
        .where(eq(investmentModels.id, existingModel.id))
        .returning();
      return updatedModel;
    } else {
      const [newModel] = await db.insert(investmentModels)
        .values(model)
        .returning();
      return newModel;
    }
  }

  async getSavedProjects(): Promise<string[]> {
    const projects = await db.select().from(financialData);
    return projects.map(p => p.name || 'Untitled Project');
  }
}

export const storage = new DatabaseStorage();