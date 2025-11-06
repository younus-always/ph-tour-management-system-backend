import { Booking } from "../booking/booking.model";
import { PAYMENT_STATUS } from "../payment/payment.interface";
import { Payment } from "../payment/payment.model";
import { Tour } from "../tour/tour.model";
import { IsActive } from "../user/user.interface";
import { User } from "../user/user.model";

const now = new Date();
const sevenDaysAgo = new Date(now).setDate(now.getDate() - 7);
const thirtyDaysAgo = new Date(now).setDate(now.getDate() - 30);

const getUserStats = async () => {
      const totalUsersPromise = User.countDocuments();
      const totalActiveUsersPromise = User.countDocuments({ isActive: IsActive.ACTIVE });
      const totalInActiveUsersPromise = User.countDocuments({ isActive: IsActive.INACTIVE });
      const totalBlockedUsersPromise = User.countDocuments({ isActive: IsActive.BLOCKED });
      const newUserInLast7DaysPromise = User.countDocuments({ createdAt: { $gte: sevenDaysAgo } })
      const newUserInLast30DaysPromise = User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } })
      const usersByRolePromise = User.aggregate([
            {
                  $group: {
                        _id: "$role",
                        count: { $sum: 1 }
                  }
            }
      ]);

      const [totalUsers, totalActiveUsers, totalInActiveUsers, totalBlockedUsers, newUserInLast7Days, newUserInLast30Days, usersByRole] = await Promise.all([
            totalUsersPromise,
            totalActiveUsersPromise,
            totalInActiveUsersPromise,
            totalBlockedUsersPromise,
            newUserInLast7DaysPromise,
            newUserInLast30DaysPromise,
            usersByRolePromise
      ]);

      return {
            totalUsers,
            totalActiveUsers,
            totalInActiveUsers,
            totalBlockedUsers,
            newUserInLast7Days,
            newUserInLast30Days,
            usersByRole
      }
};

const getTourStats = async () => {
      const totalToursPromise = Tour.countDocuments();

      const totalTourByTourTypePromise = Tour.aggregate([
            // stage-1: connect tourType model = lookup
            {
                  $lookup: {
                        from: "tourtypes",
                        localField: "tourType",
                        foreignField: "_id",
                        as: "type"
                  }
            },
            // stage-2: unwind the array to object
            {
                  $unwind: "$type"
            },
            // stage-3: grouping tour type
            {
                  $group: {
                        _id: "$type.name",
                        count: { $sum: 1 }
                  }
            }
      ]);

      const totalTourByDivisionPromise = Tour.aggregate([
            // stage-1: connect division model = lookup
            {
                  $lookup: {
                        from: "divisions",
                        localField: "division",
                        foreignField: "_id",
                        as: "division"
                  }
            },
            // stage-2: unwind the array to object
            {
                  $unwind: "$division"
            },
            // stage-3: grouping tour type
            {
                  $group: {
                        _id: "$division.name",
                        count: { $sum: 1 }
                  }
            }
      ]);

      const avgTourCostPromise = Tour.aggregate([
            // stage-1: group the cost from, do sum, and average the sum
            {
                  $group: {
                        _id: null,
                        avgCostFrom: { $avg: "$costFrom" }
                  }
            }
      ]);

      const totalHighestBookedTourPromise = Booking.aggregate([
            // stage-1: group the tour
            {
                  $group: {
                        _id: "$tour",
                        bookingCount: { $sum: 1 }
                  }
            },
            // stage-2: sort the tour
            {
                  $sort: { bookingCount: -1 }
            },
            // stage-3: limit 
            { $limit: 5 },
            // stage-4: lookup
            {
                  $lookup: {
                        from: "tours",
                        let: { tourId: "$_id" },
                        pipeline: [
                              {
                                    $match: {
                                          $expr: { $eq: ["$_id", "$$tourId"] }
                                    }
                              }
                        ],
                        as: "tour"
                  }
            },
            // stage-5: unwind tour the array to object
            { $unwind: "$tour" },
            // stage-6: projection stage
            {
                  $project: {
                        bookingCount: 1,
                        "tour.title": 1,
                        "tour.slug": 1,
                        "tour.description": 1
                  }
            }
      ])

      const [totalTours, totalTourByTourType, totalTourByDivision, avgTourCost, totalHighestBookedTour] = await Promise.all([
            totalToursPromise,
            totalTourByTourTypePromise,
            totalTourByDivisionPromise,
            avgTourCostPromise,
            totalHighestBookedTourPromise
      ]);

      return {
            totalTours,
            totalTourByTourType,
            totalTourByDivision,
            avgTourCost,
            totalHighestBookedTour
      }
};

const getBookingStats = async () => {
      const totalBookingPromise = Booking.countDocuments();
      const bookingsLast7DaysPromise = Booking.countDocuments({ createdAt: { $gte: sevenDaysAgo } });
      const bookingsLast30DaysPromise = Booking.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });
      const totalBookingByUniqueUsersPromise = Booking.distinct("user").then((user: any) => user.length);

      const totalBookingsByStatusPromise = Booking.aggregate([
            {
                  $group: {
                        _id: "$status",
                        count: { $sum: 1 }
                  }
            }
      ]);

      const bookingsPerTourPromise = Booking.aggregate([
            // group stage
            {
                  $group: {
                        _id: "$tour",
                        bookingCount: { $sum: 1 }
                  }
            },
            // sort stage
            {
                  $sort: { bookingCount: -1 }
            },
            // limit stage
            { $limit: 10 },
            // lookup stage
            {
                  $lookup: {
                        from: "tours",
                        localField: "_id",
                        foreignField: "_id",
                        as: "tour"
                  }
            },
            // unwind stage
            { $unwind: "$tour" },
            // projection stage
            {
                  $project: {
                        _id: 1,
                        bookingCount: 1,
                        "tour.title": 1,
                        "tour.slug": 1
                  }
            }
      ]);

      const avgGuestCountPerBookingPromise = Booking.aggregate([
            {
                  $group: {
                        _id: null,
                        avgGuestCount: { $avg: "$guestCount" }
                  }
            }
      ]);

      const [totalBooking, bookingsLast7Days, bookingsLast30Days, totalBookingByUniqueUsers, totalBookingsByStatus, bookingsPerTour, avgGuestCountPerBooking] = await Promise.all([
            totalBookingPromise,
            bookingsLast7DaysPromise,
            bookingsLast30DaysPromise,
            totalBookingByUniqueUsersPromise,
            totalBookingsByStatusPromise,
            bookingsPerTourPromise,
            avgGuestCountPerBookingPromise
      ]);

      return {
            totalBooking,
            bookingsLast7Days,
            bookingsLast30Days,
            totalBookingByUniqueUsers,
            totalBookingsByStatus,
            bookingsPerTour,
            avgGuestCountPerBooking
      }
};

const getPaymentStats = async () => {
      const totalPaymentPromise = Payment.countDocuments();

      const totalPaymentByStatusPromise = Payment.aggregate([
            {
                  $group: {
                        _id: "$status",
                        count: { $sum: 1 }
                  }
            }
      ]);

      const totalRevenuePromise = Payment.aggregate([
            {
                  $match: { status: PAYMENT_STATUS.PAID }
            },
            {
                  $group: {
                        _id: null,
                        totalRevenue: { $sum: "$amount" }
                  }
            },
            {
                  $project: {
                        _id: 0,
                        totalRevenue: { $round: ["$totalRevenue", 2] }
                  }
            }
      ]);

      const avgPaymentAmountPromise = Payment.aggregate([
            {
                  $group: {
                        _id: null,
                        avgPaymentAmount: { $avg: "$amount" }
                  }
            },
            {
                  $project: {
                        _id: 0,
                        avgPaymentAmount: { $round: ["$avgPaymentAmount", 2] }
                  }
            }
      ]);

      const paymentGatewayDataPromise = Payment.aggregate([
            {
                  $group: {
                        _id: { $ifNull: ["$paymentGatewayData.status", "UNKNOWN"] },
                        count: { $sum: 1 }
                  }
            }
      ])

      const [totalPayment, totalPaymentByStatus, totalRevenue, avgPaymentAmount, paymentGatewayData] = await Promise.all([
            totalPaymentPromise,
            totalPaymentByStatusPromise,
            totalRevenuePromise,
            avgPaymentAmountPromise,
            paymentGatewayDataPromise
      ]);

      return {
            totalPayment,
            totalPaymentByStatus,
            totalRevenue,
            avgPaymentAmount,
            paymentGatewayData
      }
};


export const StatsService = {
      getUserStats,
      getTourStats,
      getBookingStats,
      getPaymentStats
};