/* eslint-disable @typescript-eslint/no-explicit-any */
import { uploadBufferToCloudinary } from "../../config/multer.config";
import AppError from "../../errorHelpers/AppError";
import { generatePDF, IInvoiceData } from "../../utils/invoice";
import { sendEmail } from "../../utils/sendEmail";
import { BOOKING_STATUS } from "../booking/booking.interface";
import { Booking } from "../booking/booking.model";
import { ISSLCommerz } from "../sslCommerz/sslCommerz.interface";
import { SSLService } from "../sslCommerz/sslCommerz.service";
import { ITour } from "../tour/tour.interface";
import { IUser } from "../user/user.interface";
import { PAYMENT_STATUS } from "./payment.interface";
import { Payment } from "./payment.model";


const initPayment = async (bookingId: string) => {
      const payment = await Payment.findOne({ booking: bookingId });

      if (!payment) {
            throw new AppError(404, "Payment Not Found. You have not booked this tour.")
      };

      const booking = await Booking.findById(payment.booking);

      const userName = (booking?.user as any).name
      const userEmail = (booking?.user as any).email
      const userPhone = (booking?.user as any).phone
      const userAddress = (booking?.user as any).address

      const sslPayload: ISSLCommerz = {
            name: userName,
            email: userEmail,
            phoneNumber: userPhone,
            address: userAddress,
            amount: payment.amount,
            transactionId: payment.transactionId
      }
      const sslPayment = await SSLService.sslPaymentInit(sslPayload)

      return {
            paymentURL: sslPayment.GatewayPageURL
      }
};

const successPayment = async (query: Record<string, string>) => {
      const session = await Booking.startSession();
      session.startTransaction();

      try {
            const updatedPayment = await Payment.findOneAndUpdate({ transactionId: query.transactionId }, {
                  status: PAYMENT_STATUS.PAID
            }, { session });

            const updatedBooking = await Booking
                  .findByIdAndUpdate(
                        updatedPayment?.booking,
                        { status: BOOKING_STATUS.COMPLETE },
                        { new: true, runValidators: true, session }
                  ).populate("tour", "title")
                  .populate("user", "name email");

            if (!updatedBooking) {
                  throw new AppError(404, "Booking Not Found")
            }
            if (!updatedPayment) {
                  throw new AppError(404, "Payment Not Found")
            }

            const invoiceData: IInvoiceData = {
                  bookingDate: updatedBooking.createdAt as Date,
                  guestCount: updatedBooking.guestCount,
                  totalAmount: updatedPayment.amount,
                  tourTitle: (updatedBooking.tour as unknown as ITour).title,
                  transactionId: updatedPayment.transactionId,
                  userName: (updatedBooking.user as unknown as IUser).name,
                  paymentId: updatedPayment._id,
            };
            // generate payment invoice pdf
            const pdfBuffer = await generatePDF(invoiceData);
            // upload pdf to cloudinary
            const cloudinaryResult = await uploadBufferToCloudinary(pdfBuffer, "invoice");

            if (!cloudinaryResult) {
                  throw new AppError(401, "Error uploading pdf.")
            }
            // update payment invoiceUrl
            await Payment.findOneAndUpdate(updatedPayment._id,
                  { invoiceUrl: cloudinaryResult.secure_url },
                  { runValidators: true, session })

            await sendEmail({
                  to: (updatedBooking.user as unknown as IUser).email,
                  subject: "Your Booking Invoice",
                  templateName: "invoice",
                  templateData: invoiceData,
                  attachments: [
                        {
                              filename: "invoice.pdf",
                              content: pdfBuffer,
                              contentType: "application/pdf"
                        }
                  ]
            });

            await session.commitTransaction();  // transaction
            session.endSession();

            return { success: true, message: "Payment Completed Successfully" };
      } catch (error) {
            await session.abortTransaction();  // rollback
            session.endSession();
            throw error;
      }
};


const failPayment = async (query: Record<string, string>) => {
      const session = await Booking.startSession();
      session.startTransaction();

      try {
            const updatedPayment = await Payment.findOneAndUpdate({ transactionId: query.transactionId }, {
                  status: PAYMENT_STATUS.FAILED
            }, { session });

            await Booking
                  .findByIdAndUpdate(
                        updatedPayment?.booking,
                        { status: BOOKING_STATUS.FAILED },
                        { runValidators: true, session }
                  )

            await session.commitTransaction();  // transaction
            session.endSession();

            return { success: false, message: "Payment Failed" };
      } catch (error) {
            await session.abortTransaction();  // rollback
            session.endSession();
            throw error;
      }
};

const cancelPayment = async (query: Record<string, string>) => {
      const session = await Booking.startSession();
      session.startTransaction();

      try {
            const updatedPayment = await Payment.findOneAndUpdate({ transactionId: query.transactionId }, {
                  status: PAYMENT_STATUS.CANCELED
            }, { session });

            await Booking
                  .findByIdAndUpdate(
                        updatedPayment?.booking,
                        { status: BOOKING_STATUS.CANCEL },
                        { runValidators: true, session }
                  )
            await session.commitTransaction();  // transaction
            session.endSession();

            return { success: false, message: "Payment Cancelled" };
      } catch (error) {
            await session.abortTransaction();  // rollback
            session.endSession();
            throw error;
      }
};

const getInvoiceDownloadUrl = async (paymentId: string) => {
      const payment = await Payment.findById(paymentId).select("invoiceUrl");

      if (!payment) {
            throw new AppError(404, "Payment not found")
      }

      if (!payment.invoiceUrl) {
            throw new AppError(404, "No invoice found")
      }

      return payment;
};


export const PaymentService = {
      initPayment,
      successPayment,
      failPayment,
      cancelPayment,
      getInvoiceDownloadUrl
};