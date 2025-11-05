import { deleteImageFromCloudinary } from "../../config/multer.config";
import AppError from "../../errorHelpers/AppError";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { tourSearchableFields } from "./tour.constant";
import { ITour, ITourType } from "./tour.interface";
import { Tour, TourType } from "./tour.model";
import httpStatus from "http-status-codes";


/*---------------- TOUR TYPE --------------*/
const createTourType = async (payload: Partial<ITourType>) => {
      const isExistTourType = await TourType.findOne({ name: payload.name });
      if (isExistTourType) {
            throw new AppError(httpStatus.CONFLICT, "Tour Type Already Exist")
      }
      const tourType = await TourType.create(payload);
      return tourType;
};

const getAllTourTypes = async () => {
      const tours = await TourType.find({});
      const total = await TourType.countDocuments();

      return {
            data: tours,
            meta: { total }
      }
};

const updateTourType = async (id: string, payload: Partial<ITourType>) => {
      const tourType = await TourType.findById(id);
      if (!tourType) {
            throw new AppError(httpStatus.NOT_FOUND, "Tour type not found")
      };

      const updatedTourType = await TourType.findByIdAndUpdate(id, payload, {
            new: true,
            runValidators: true
      });
      return updatedTourType;
}
const deleteTourType = async (id: string) => {
      await TourType.findByIdAndDelete(id);
      return null;
};

/*---------------- TOUR --------------*/
const createTour = async (payload: Partial<ITour>) => {
      const isTourExist = await Tour.findOne({ title: payload.title });
      if (isTourExist) {
            throw new AppError(httpStatus.CONFLICT, "This tour title already exists")
      };

      const tour = await Tour.create(payload);
      return tour;
};

const getAllTours = async (query: Record<string, string>) => {
      const queryBuilder = new QueryBuilder(Tour.find(), query);
      const tours = queryBuilder
            .search(tourSearchableFields)
            .filter()
            .sort()
            .fields()
            .pagination();

      const [data, meta] = await Promise.all([
            tours.build(),
            queryBuilder.getMeta()
      ]);

      return { data, meta }
};

const getSingleTour = async (slug: string) => {
      const tour = await Tour.findOne({ slug });
      if (!tour) throw new AppError(httpStatus.NOT_FOUND, "Tour Not Found");
      return { data: tour }
};


const updateTour = async (id: string, payload: Partial<ITour>) => {
      const isTourExist = await Tour.findById(id);
      if (!isTourExist) {
            throw new AppError(httpStatus.NOT_FOUND, "Tour Not Found")
      };

      if (payload.images && payload.images.length && isTourExist.images && isTourExist.images.length) {
            payload.images = [...payload.images, ...isTourExist.images]
      }
      if (payload.deleteImages && payload.deleteImages.length && isTourExist.images && isTourExist.images.length) {
            const restDBImages = isTourExist.images
                  .filter(imageUrl => !payload.deleteImages?.includes(imageUrl));

            const updatedPayloadImages = (payload.images || [])
                  .filter(imageUrl => !payload.deleteImages?.includes(imageUrl))
                  .filter(imageUrl => !restDBImages.includes(imageUrl))

            payload.images = [...restDBImages, ...updatedPayloadImages]
      }

      const updatedTour = await Tour.findByIdAndUpdate(id, payload, {
            new: true,
            runValidators: true
      });

      if (payload.deleteImages && payload.deleteImages.length && isTourExist.images && isTourExist.images.length) {
            await Promise.all(payload.deleteImages.map(url => deleteImageFromCloudinary(url)))
      };
      return updatedTour;
};

const deleteTour = async (id: string) => {
      await Tour.findByIdAndDelete(id);
      return null;
};


export const TourService = {
      createTourType,
      getAllTourTypes,
      updateTourType,
      deleteTourType,
      createTour,
      getAllTours,
      getSingleTour,
      updateTour,
      deleteTour
};