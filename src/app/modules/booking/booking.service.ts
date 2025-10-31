import AppError from "../../errorHelpers/AppError";
import { PAYMENT_STATUS } from "../payment/payment.interface";
import { Payment } from "../payment/payment.model";
import { Tour } from "../tour/tour.model";
import { User } from "../user/user.model";
import { BOOKING_STATUS, IBooking } from "./booking.interface";
import { Booking } from "./booking.model";
import httpStatus from 'http-status-codes';

const getTransactionId = () => {
      return `tran_${Date.now()}_${Math.floor(Math.random() * 1000)}`
};

const createBooking = async (payload: Partial<IBooking>, userId: string) => {
      const transactionId = getTransactionId();

      const user = await User.findById(userId);
      if (!user?.phone || !user.address) {
            throw new AppError(httpStatus.BAD_REQUEST, "Please Update Your Profile to Book a Tour.")
      };

      const tour = await Tour.findById(payload.tour).select("costFrom");
      if (!tour?.costFrom) {
            throw new AppError(httpStatus.NOT_FOUND, "Tour Cost Not Found")
      }

      const amount = Number(tour.costFrom) * Number(payload.guestCount);

      const booking = await Booking.create({
            user: userId,
            status: BOOKING_STATUS.PENDING,
            ...payload
      });

      const payment = await Payment.create({
            booking: booking._id,
            status: PAYMENT_STATUS.UNPAID,
            transactionId,
            amount
      });

      const updatedBooking = await Booking.findByIdAndUpdate(
            booking._id,
            { payment: payment._id },
            { new: true, runValidators: true }
      ).populate("user", "name email phone address")
            .populate("tour", "title description location costFrom")
            .populate("payment");;

      return updatedBooking;
};

const getAllBookings = async () => {
      const bookings = await Booking.find({});

      return { bookings }
};

const getUserBookings = async (id: string) => {
      console.log(id);
};

const getSingleBooking = async (id: string) => {
      console.log(id);
};

const updateBookingStatus = async (id: string) => {
      console.log(id);
};


export const BookingService = {
      createBooking,
      getAllBookings,
      getUserBookings,
      getSingleBooking,
      updateBookingStatus
}