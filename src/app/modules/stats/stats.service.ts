import { Booking } from "../booking/booking.model";
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
            // stage-6: project stage
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

      return {}
};

const getPaymentStats = async () => {

      return {}
};


export const StatsService = {
      getUserStats,
      getTourStats,
      getBookingStats,
      getPaymentStats
};