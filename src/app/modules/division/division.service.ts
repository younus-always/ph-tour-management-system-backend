import httpStatus from 'http-status-codes';
import AppError from "../../errorHelpers/AppError";
import { IDivision } from "./division.interface";
import { Division } from "./division.model";

const createDivision = async (payload: Partial<IDivision>) => {

      const division = await Division.create(payload);
      return division
};

const getAllDivisions = async () => {
      const divisions = await Division.find();
      const totalDivision = await Division.countDocuments();

      return {
            data: divisions,
            meta: {
                  total: totalDivision
            }
      }
};

const updateDivision = async (id: string, payload: Partial<IDivision>) => {
      const existingDivision = await Division.findById(id);
      if (existingDivision) {
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
      return updatedDivision;
};

const deleteDivision = async (divisionId: string) => {
      await Division.findByIdAndDelete(divisionId);
      return true
};


export const DivisionService = {
      createDivision,
      getAllDivisions,
      updateDivision,
      deleteDivision
};