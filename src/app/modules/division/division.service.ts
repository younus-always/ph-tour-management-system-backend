import httpStatus from 'http-status-codes';
import AppError from "../../errorHelpers/AppError";
import { IDivision } from "./division.interface";
import { Division } from "./division.model";
import { QueryBuilder } from '../../utils/QueryBuilder';
import { divisionSearchableFields } from './division.constant';
import { deleteImageFromCloudinary } from '../../config/multer.config';

const createDivision = async (payload: Partial<IDivision>) => {
      const existingDivision = await Division.findOne({ name: payload.name });
      if (existingDivision) {
            throw new AppError(httpStatus.CONFLICT, "This name of division already exists.")
      };

      const division = await Division.create(payload);
      return division
};

const getAllDivisions = async (query: Record<string, string>) => {
      const queryBuilder = new QueryBuilder(Division.find(), query);
      const division = queryBuilder
            .search(divisionSearchableFields)
            .filter()
            .sort()
            .fields()
            .pagination();

      const [data, meta] = await Promise.all([
            division.build(),
            queryBuilder.getMeta()
      ]);

      return { data, meta }
};

const getSingleDivision = async (slug: string) => {
      const division = await Division.findOne({ slug });
      if (!division) throw new AppError(httpStatus.NOT_FOUND, "Division Not Found");
      return { data: division }
};

const updateDivision = async (id: string, payload: Partial<IDivision>) => {
      const existingDivision = await Division.findById(id);
      if (!existingDivision) {
            throw new AppError(httpStatus.NOT_FOUND, "Division not found!")
      };
      const duplicateDivision = await Division.findOne({
            name: payload.name,
            _id: { $ne: id }
      });
      if (duplicateDivision) {
            throw new AppError(httpStatus.CONFLICT, "This division is already exists.")
      };

      const updatedDivision = await Division.findByIdAndUpdate(id, payload, { new: true, runValidators: true });

      if (payload.thumbnail && existingDivision.thumbnail) {
            await deleteImageFromCloudinary(existingDivision.thumbnail)
      }
      return updatedDivision;
};

const deleteDivision = async (divisionId: string) => {
      await Division.findByIdAndDelete(divisionId);
      return null
};


export const DivisionService = {
      createDivision,
      getAllDivisions,
      getSingleDivision,
      updateDivision,
      deleteDivision
};