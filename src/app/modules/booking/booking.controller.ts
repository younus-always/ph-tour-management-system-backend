import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { BookingService } from "./booking.service";
import { JwtPayload } from "jsonwebtoken";

const createBooking = catchAsync(async (req: Request, res: Response) => {
      const decodedToken = req.user as JwtPayload;
      const result = await BookingService.createBooking(req.body, decodedToken.userId);

      sendResponse(res, {
            statusCode: httpStatus.CREATED,
            success: true,
            message: "Booking Created Successfully",
            data: result
      })
});

const getAllBookings = catchAsync(async (req: Request, res: Response) => {
      const result = await BookingService.getAllBookings();

      sendResponse(res, {
            statusCode: httpStatus.CREATED,
            success: true,
            message: "All Booking Retrieved Successfully",
            data: result
      })
});

const getUserBookings = catchAsync(async (req: Request, res: Response) => {
      const { id } = req.params;
      const result = await BookingService.getUserBookings(id);

      sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "My Booking Retrieved Successfully",
            data: result
      })
});

const getSingleBooking = catchAsync(async (req: Request, res: Response) => {
      const { bookingId } = req.params;
      const result = await BookingService.getSingleBooking(bookingId);

      sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Single Booking Retrieved Successfully",
            data: result
      })
});

const updateBookingStatus = catchAsync(async (req: Request, res: Response) => {
      const { bookingId } = req.params;
      const result = await BookingService.updateBookingStatus(bookingId);

      sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Booking Status Updated Successfully",
            data: result
      })
});


export const BookingController = {
      createBooking,
      getAllBookings,
      getUserBookings,
      getSingleBooking,
      updateBookingStatus
};