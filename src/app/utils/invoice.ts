import PDFDocument from "pdfkit";
import AppError from "../errorHelpers/AppError";
import moment from "moment";
import { Types } from "mongoose";

export interface IInvoiceData {
      transactionId: string;
      bookingDate: Date;
      userName: string;
      tourTitle: string;
      guestCount: number;
      totalAmount: number;
      paymentId?: Types.ObjectId;
};

export const generatePDF = async (invoiceData: IInvoiceData): Promise<Buffer<ArrayBufferLike>> => {
      try {
            return new Promise((resolve, reject) => {
                  const doc = new PDFDocument({ size: "A4", margin: 50 });
                  const buffer: Uint8Array[] = [];

                  doc.on("data", (chunk) => buffer.push(chunk))
                  doc.on("end", () => resolve(Buffer.concat(buffer)))
                  doc.on("err", (err) => reject(err))

                  // PDF Content
                  doc.fontSize(20).text("Invoice", { align: "center" });
                  doc.moveDown();
                  doc.fontSize(14).text(`Transaction ID: ${invoiceData.transactionId}`);
                  doc.text(`Booking Date: ${moment(invoiceData.bookingDate).format("DD MMM YYYY, hh:mm A")}`);
                  doc.text(`Customer: ${invoiceData.userName}`);
                  doc.moveDown();

                  doc.text(`Tour: ${invoiceData.tourTitle}`);
                  doc.text(`Guests: ${invoiceData.guestCount}`);
                  doc.text(`Total Amount: ${invoiceData.totalAmount.toFixed(2)}`);
                  doc.moveDown();

                  doc.text("Thank you for booking with us!", { align: "center" });
                  doc.end();
            })
      } catch (error: any) {
            console.log(error);
            throw new AppError(401, `Pdf creation error: ${error.message}`)
      }
};