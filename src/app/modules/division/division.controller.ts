import httpStatus from 'http-status-codes';
import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { DivisionService } from './division.service';

const createDivision = catchAsync(async (req: Request, res: Response) => {
      const division = await DivisionService.createDivision(req.body)

      sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "Division created successfully.",
            data: division
      })
});

const getAllDivisions = catchAsync(async (req: Request, res: Response) => {
      const query = req.query;
      const result = await DivisionService.getAllDivisions(query as Record<string, string>);

      sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "Division created successfully.",
            data: result.data,
            meta: result.meta
      })
});

const getSingleDivision = catchAsync(async (req: Request, res: Response) => {
      const { slug } = req.params;
      const result = await DivisionService.getSingleDivision(slug);

      sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "Single Division Retrieved Successfully",
            data: result.data
      })
});

const updateDivision = catchAsync(async (req: Request, res: Response) => {
      const { id } = req.params;
      const updatedDivision = await DivisionService.updateDivision(id, req.body);

      sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "Division updated successfully.",
            data: updatedDivision
      })
});

const deleteDivision = catchAsync(async (req: Request, res: Response) => {
      const { id } = req.params;
      const result = await DivisionService.deleteDivision(id);

      sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "Division deleted successfully.",
            data: result
      })
});

export const DivisionController = {
      createDivision,
      getAllDivisions,
      getSingleDivision,
      updateDivision,
      deleteDivision
};