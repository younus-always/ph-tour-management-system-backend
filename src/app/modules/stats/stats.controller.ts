import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import httpStatus from "http-status-codes";
import { sendResponse } from "../../utils/sendResponse";
import { StatsService } from "./stats.service";

const getUserStats = catchAsync(async (req: Request, res: Response) => {
      const result = await StatsService.getUserStats();

      sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "User Stats Fetched Successfully",
            data: result
      })
});

const getTourStats = catchAsync(async (req: Request, res: Response) => {
      const result = await StatsService.getTourStats();

      sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "Tour Stats Fetched Successfully",
            data: result
      })
});

const getBookingStats = catchAsync(async (req: Request, res: Response) => {
      const result = await StatsService.getBookingStats();

      sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "Booking Stats Fetched Successfully",
            data: result
      })
});

const getPaymentStats = catchAsync(async (req: Request, res: Response) => {
      const result = await StatsService.getPaymentStats();

      sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "Payment Stats Fetched Successfully",
            data: result
      })
});


export const StatsController = {
      getUserStats,
      getTourStats,
      getBookingStats,
      getPaymentStats
};