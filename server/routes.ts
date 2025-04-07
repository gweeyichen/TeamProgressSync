import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  financialData, insertFinancialDataSchema,
  valuationParameters, insertValuationParametersSchema,
  investmentModels, insertInvestmentModelSchema
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // User routes
  app.post('/api/users', async (req, res) => {
    try {
      const user = await storage.createUser(req.body);
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ error: 'Invalid user data' });
    }
  });

  // Financial data routes
  app.get('/api/financial-data/:userId', async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const data = await storage.getFinancialDataByUser(userId);
      if (!data) {
        return res.status(404).json({ error: 'Financial data not found' });
      }
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve financial data' });
    }
  });

  app.post('/api/financial-data', async (req, res) => {
    try {
      const validateData = insertFinancialDataSchema.safeParse(req.body);
      
      if (!validateData.success) {
        return res.status(400).json({ error: 'Invalid financial data', details: validateData.error });
      }
      
      const data = await storage.saveFinancialData(validateData.data);
      res.status(201).json(data);
    } catch (error) {
      res.status(500).json({ error: 'Failed to save financial data' });
    }
  });

  // Valuation parameters routes
  app.get('/api/valuation-parameters/:userId', async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const params = await storage.getValuationParametersByUser(userId);
      if (!params) {
        return res.status(404).json({ error: 'Valuation parameters not found' });
      }
      res.json(params);
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve valuation parameters' });
    }
  });

  app.post('/api/valuation-parameters', async (req, res) => {
    try {
      const validateParams = insertValuationParametersSchema.safeParse(req.body);
      
      if (!validateParams.success) {
        return res.status(400).json({ error: 'Invalid valuation parameters', details: validateParams.error });
      }
      
      const params = await storage.saveValuationParameters(validateParams.data);
      res.status(201).json(params);
    } catch (error) {
      res.status(500).json({ error: 'Failed to save valuation parameters' });
    }
  });

  // Investment model routes
  app.get('/api/investment-models/:userId', async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const model = await storage.getInvestmentModelByUser(userId);
      if (!model) {
        return res.status(404).json({ error: 'Investment model not found' });
      }
      res.json(model);
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve investment model' });
    }
  });

  app.post('/api/investment-models', async (req, res) => {
    try {
      const validateModel = insertInvestmentModelSchema.safeParse(req.body);
      
      if (!validateModel.success) {
        return res.status(400).json({ error: 'Invalid investment model', details: validateModel.error });
      }
      
      const model = await storage.saveInvestmentModel(validateModel.data);
      res.status(201).json(model);
    } catch (error) {
      res.status(500).json({ error: 'Failed to save investment model' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
