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
      const result = await DivisionService.getAllDivisions();

      sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "Division created successfully.",
            data: result.data,
            meta: result.meta
      })
});

const updateDivision = catchAsync(async (req: Request, res: Response) => {
      const { id } = req.params;
      const body = req.body;
      const updatedDivision = await DivisionService.updateDivision(id, body);

      sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "Division updated successfully.",
            data: updatedDivision
      })
});

const deleteDivision = catchAsync(async (req: Request, res: Response) => {
      const { id } = req.params;
      await DivisionService.deleteDivision(id);

      sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "Division deleted successfully.",
            data: null
      })
});

export const DivisionController = {
      createDivision,
      getAllDivisions,
      updateDivision,
      deleteDivision
};