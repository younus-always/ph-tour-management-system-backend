/* eslint-disable @typescript-eslint/no-explicit-any */
import AppError from "../../errorHelpers/AppError";
import { getTransactionId } from "../../utils/getTransactionId";
import { PAYMENT_STATUS } from "../payment/payment.interface";
import { Payment } from "../payment/payment.model";
import { ISSLCommerz } from "../sslCommerz/sslCommerz.interface";
import { SSLService } from "../sslCommerz/sslCommerz.service";
import { Tour } from "../tour/tour.model";
import { User } from "../user/user.model";
import { BOOKING_STATUS, IBooking } from "./booking.interface";
import { Booking } from "./booking.model";
import httpStatus from 'http-status-codes';


const createBooking = async (payload: Partial<IBooking>, userId: string) => {
      const transactionId = getTransactionId();

      const session = await Booking.startSession();
      session.startTransaction();

      try {
            const user = await User.findById(userId);
            if (!user?.phone || !user.address) {
                  throw new AppError(httpStatus.BAD_REQUEST, "Please Update Your Profile to Book a Tour.")
            };

            const tour = await Tour.findById(payload.tour).select("costFrom");
            if (!tour?.costFrom) {
                  throw new AppError(httpStatus.NOT_FOUND, "Tour Cost Not Found")
            }

            const amount = Number(tour.costFrom) * Number(payload.guestCount);

            const booking = await Booking.create([{
                  user: userId,
                  status: BOOKING_STATUS.PENDING,
                  ...payload
            }], { session });

            const payment = await Payment.create([{
                  booking: booking[0]._id,
                  status: PAYMENT_STATUS.UNPAID,
                  transactionId,
                  amount
            }], { session });

            const updatedBooking = await Booking
                  .findByIdAndUpdate(
                        booking[0]._id,
                        { payment: payment[0]._id },
                        { new: true, runValidators: true, session }
                  ).populate("user", "name email phone address")
                  .populate("tour", "title description location costFrom")
                  .populate("payment");;

            const userName = (updatedBooking?.user as any).name
            const userEmail = (updatedBooking?.user as any).email
            const userPhone = (updatedBooking?.user as any).phone
            const userAddress = (updatedBooking?.user as any).address

            const sslPayload: ISSLCommerz = {
                  name: userName,
                  email: userEmail,
                  phoneNumber: userPhone,
                  address: userAddress,
                  amount: amount,
                  transactionId: transactionId
            }
            const sslPayment = await SSLService.sslPaymentInit(sslPayload)

            await session.commitTransaction();  // transaction
            session.endSession();

            return {
                  paymentURL: sslPayment.GatewayPageURL,
                  booking: updatedBooking
            };
      } catch (error) {
            await session.abortTransaction();  // rollback
            session.endSession();
            throw error;
      }
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