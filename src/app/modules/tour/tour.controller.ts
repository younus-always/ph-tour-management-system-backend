import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { TourService } from "./tour.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";


/*---------------- TOUR TYPE --------------*/
const createTourType = catchAsync(async (req: Request, res: Response) => {
      const result = await TourService.createTourType(req.body);

      sendResponse(res, {
            success: true,
            statusCode: httpStatus.CREATED,
            message: "Tour type created successfully",
            data: result
      })
});
const getAllTourTypes = catchAsync(async (req: Request, res: Response) => {
      const result = await TourService.getAllTourTypes();

      sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "All tour type retrieved successfully",
            data: result.data,
            meta: result.meta
      })
});
const updateTourType = catchAsync(async (req: Request, res: Response) => {
      const { id } = req.params;
      const result = await TourService.updateTourType(id, req.body);

      sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "Tour type updated successfully",
            data: result
      })
});
const deleteTourType = catchAsync(async (req: Request, res: Response) => {
      const { id } = req.params;
      const result = await TourService.deleteTourType(id);

      sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "Tour type deleted successfully",
            data: result
      })
});


/*---------------- TOUR --------------*/
const createTour = catchAsync(async (req: Request, res: Response) => {
      const result = await TourService.createTour(req.body);

      sendResponse(res, {
            success: true,
            statusCode: httpStatus.CREATED,
            message: "Tour Created Successfully",
            data: result
      })
});

const getAllTours = catchAsync(async (req: Request, res: Response) => {
      const query = req.query;
      const result = await TourService.getAllTours(query as Record<string, string>);

      sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "All Tour Retrieved Successfully",
            data: result.data,
            meta: result.meta
      })
});

const updateTour = catchAsync(async (req: Request, res: Response) => {
      const { id } = req.params;
      const result = await TourService.updateTour(id, req.body);

      sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "Tour Updated Successfully",
            data: result
      })
});

const deleteTour = catchAsync(async (req: Request, res: Response) => {
      const { id } = req.params;
      const result = await TourService.deleteTour(id);

      sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "Tour Deleted Successfully",
            data: result
      })
});


export const TourController = {
      createTourType,
      getAllTourTypes,
      updateTourType,
      deleteTourType,
      createTour,
      getAllTours,
      updateTour,
      deleteTour
};