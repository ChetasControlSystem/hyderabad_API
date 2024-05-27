const httpStatus = require("http-status");
const ExcelJS = require("exceljs");
const fastCsv = require("fast-csv");
const Docx = require("docx");
const puppeteer = require("puppeteer");
const path = require("path");
const ejs = require("ejs");
const fs = require("fs");

const {
  LMDS,
  LMD_POND_LEVEL_OVERVIEW,
  LMD_HR_RIGHT_ADVM,
  LMD_HR_DAM_OVERVIEW_POS,
  LMD_HR_DAM_OVERVIEW_DICH,
  LMD_DAM_OVERVIEW_POS,
  LMD_DAM_OVERVIEW_DICH,
  Permission,
} = require("../models");

const ApiError = require("../utils/ApiError");

const hyderabadImagePath = path.join(__dirname, "../../views/hyderabad.png");
const chetasImagePath = path.join(__dirname, "../../views/chetas.png");

const createSalientFeature = async (userBody) => {
  try {
    return LMDS.create(userBody);
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

const getSalientFeature = async (user) => {
  try {
    const checkPermission = await Permission.findOne({
      name: "lmdSalientFeatures",
    });

    if (
      user.role === "admin" ||
      user.role === "lmdSuperuser" ||
      (checkPermission && checkPermission.roleName.includes(user.role))
    ) {
      const showOneSalientFeature = await LMDS.findOne();
      return showOneSalientFeature;
    } else {
      return "You are not authorized to access this data";
    }
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

const getLastDataLmdDamOverview = async (user) => {
  try {
    const checkPermission = await Permission.findOne({ name: 'lmdDamOverview' });

    if (
      user.role === 'admin' ||
      user.role === 'lmdSuperuser' ||
      (checkPermission && checkPermission.roleName.includes(user.role))
    ) {
      const defaultPondLevelOverview = {
        pondLevel: 0,
        liveCapacity: 0,
        grossStorage: 0,
        fullReservoirLevel: 0,
        contourArea: 0,
        catchmentArea: 0,
        ayacutArea: 0,
        filling: 0,
        instantaneousGateDischarge: 0,
        instantaneousCanalDischarge: 0,
        totalDamDischarge: 0,
        cumulativeDamDischarge: 0,
        inflow1Level: 0,
        inflow2Level: 0,
        inflow3Level: 0,
        inflow1Discharge: 0,
        inflow2Discharge: 0,
        inflow3Discharge: 0,
        damDownstreamLevel: 0,
        damDownstreamDischarge: 0,
        hrrDownstreamLevel: 0,
        hrrDownstreamDischarge: 0,
      };

      const defaultDamOverviewPos = {
        gate1Position: 0,
        gate2Position: 0,
        gate3Position: 0,
        gate4Position: 0,
        gate5Position: 0,
        gate6Position: 0,
        gate7Position: 0,
        gate8Position: 0,
        gate9Position: 0,
        gate10Position: 0,
        gate11Position: 0,
        gate12Position: 0,
        gate13Position: 0,
        gate14Position: 0,
        gate15Position: 0,
        gate16Position: 0,
        gate17Position: 0,
        gate18Position: 0,
        gate19Position: 0,
        gate20Position: 0,
      };

      const defaultDamOverviewDish = {
        gate1Discharge: 0,
        gate2Discharge: 0,
        gate3Discharge: 0,
        gate4Discharge: 0,
        gate5Discharge: 0,
        gate6Discharge: 0,
        gate7Discharge: 0,
        gate8Discharge: 0,
        gate9Discharge: 0,
        gate10Discharge: 0,
        gate11Discharge: 0,
        gate12Discharge: 0,
        gate13Discharge: 0,
        gate14Discharge: 0,
        gate15Discharge: 0,
        gate16Discharge: 0,
        gate17Discharge: 0,
        gate18Discharge: 0,
        gate19Discharge: 0,
        gate20Discharge: 0,
      };

      const defaultHrDamOverviewPos = {
        hrrGate1Position: 0,
        hrrGate2Position: 0,
      };

      const defaultHrDamOverviewDish = {
        hrrGate1Discharge: 0,
        hrrGate2Discharge: 0,
      };

      const getLastDataLmdDamPondLevelOverview = await LMD_POND_LEVEL_OVERVIEW.findOne()
        .select(
          'pondLevel liveCapacity grossStorage fullReservoirLevel contourArea catchmentArea ayacutArea filling instantaneousGateDischarge instantaneousCanalDischarge totalDamDischarge cumulativeDamDischarge inflow1Level inflow2Level inflow3Level inflow1Discharge inflow2Discharge inflow3Discharge damDownstreamLevel damDownstreamDischarge hrrDownstreamLevel hrrDownstreamDischarge'
        )
        .sort({ dateTime: -1 }) || defaultPondLevelOverview;

      const getLastDataLmdDamOverviewPos = await LMD_DAM_OVERVIEW_POS.findOne()
        .select(
          'gate1Position gate2Position gate3Position gate4Position gate5Position gate6Position gate7Position gate8Position gate9Position gate10Position gate11Position gate12Position gate13Position gate14Position gate15Position gate16Position gate17Position gate18Position gate19Position gate20Position'
        )
        .sort({ dateTime: -1 }) || defaultDamOverviewPos;

      const getLastDataLmdDamOverviewDish = await LMD_DAM_OVERVIEW_DICH.findOne()
        .select(
          'gate1Discharge gate2Discharge gate3Discharge gate4Discharge gate5Discharge gate6Discharge gate7Discharge gate8Discharge gate9Discharge gate10Discharge gate11Discharge gate12Discharge gate13Discharge gate14Discharge gate15Discharge gate16Discharge gate17Discharge gate18Discharge gate19Discharge gate20Discharge'
        )
        .sort({ dateTime: -1 }) || defaultDamOverviewDish;

      const getLastDataLmdHrDamOverviewPos = await LMD_HR_DAM_OVERVIEW_POS.findOne()
        .select('hrrGate1Position hrrGate2Position')
        .sort({ dateTime: -1 }) || defaultHrDamOverviewPos;

      const getLastDataLmdHrDamOverviewDish = await LMD_HR_DAM_OVERVIEW_DICH.findOne()
        .select('hrrGate1Discharge hrrGate2Discharge')
        .sort({ dateTime: -1 }) || defaultHrDamOverviewDish;

      return {
        getLastDataLmdHrDamOverviewDish,
        getLastDataLmdHrDamOverviewPos,
        getLastDataLmdDamOverviewDish,
        getLastDataLmdDamOverviewPos,
        getLastDataLmdDamPondLevelOverview,
      };
    } else {
      return 'You are not authorized to access this data';
    }
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};


const getLastDataLmdDamSpareAdvm = async (user) => {
  try {
    const checkPermission = await Permission.findOne({
      name: "lmdDamOverview",
    });

    if (
      user.role === "admin" ||
      user.role === "lmdSuperuser" ||
      (checkPermission && checkPermission.roleName.includes(user.role))
    ) {
      const getLastDataLmdDamSpareAdvm = await LMD_HR_RIGHT_ADVM.findOne().sort(
        { dateTime: -1 }
      );
      return getLastDataLmdDamSpareAdvm;
    } else {
      return "You are not authorized to access this data";
    }
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

const lmdDischargeGateReport = async (
  startDate,
  endDate,
  intervalMinutes,
  currentPage,
  perPage,
  startIndex,
  user,
  res,
  req
) => {
  try {
    const checkPermission = await Permission.findOne({ name: "lmdReport" });

    if (
      user.role === "admin" ||
      user.role === "lmdSuperuser" ||
      (checkPermission && checkPermission.roleName.includes(user.role))
    ) {
      const pipeline = [
        {
          $match: {
            dateTime: {
              $gt: new Date(startDate),
              $lte: new Date(
                new Date(endDate).setDate(new Date(endDate).getDate() + 1)
              ),
            },
          },
        },
        {
          $group: {
            _id: {
              interval: {
                $toDate: {
                  $subtract: [
                    { $toLong: "$dateTime" },
                    {
                      $mod: [
                        { $toLong: "$dateTime" },
                        intervalMinutes * 60 * 1000,
                      ],
                    },
                  ],
                },
              },
            },
            gate1Discharge: { $first: "$gate1Discharge" },
            gate2Discharge: { $first: "$gate2Discharge" },
            gate3Discharge: { $first: "$gate3Discharge" },
            gate4Discharge: { $first: "$gate4Discharge" },
            gate5Discharge: { $first: "$gate5Discharge" },
            gate6Discharge: { $first: "$gate6Discharge" },
            gate7Discharge: { $first: "$gate7Discharge" },
            gate8Discharge: { $first: "$gate8Discharge" },
            gate9Discharge: { $first: "$gate9Discharge" },
            gate10Discharge: { $first: "$gate10Discharge" },
            gate11Discharge: { $first: "$gate11Discharge" },
            gate12Discharge: { $first: "$gate12Discharge" },
            gate13Discharge: { $first: "$gate13Discharge" },
            gate14Discharge: { $first: "$gate14Discharge" },
            gate15Discharge: { $first: "$gate15Discharge" },
            gate16Discharge: { $first: "$gate16Discharge" },
            gate17Discharge: { $first: "$gate17Discharge" },
            gate18Discharge: { $first: "$gate18Discharge" },
            gate19Discharge: { $first: "$gate19Discharge" },
            gate20Discharge: { $first: "$gate20Discharge" },
          },
        },
        {
          $project: {
            _id: 0,
            dateTime: "$_id.interval",
            gate1Discharge: 1,
            gate2Discharge: 1,
            gate3Discharge: 1,
            gate4Discharge: 1,
            gate5Discharge: 1,
            gate6Discharge: 1,
            gate7Discharge: 1,
            gate8Discharge: 1,
            gate9Discharge: 1,
            gate10Discharge: 1,
            gate11Discharge: 1,
            gate12Discharge: 1,
            gate13Discharge: 1,
            gate14Discharge: 1,
            gate15Discharge: 1,
            gate16Discharge: 1,
            gate17Discharge: 1,
            gate18Discharge: 1,
            gate19Discharge: 1,
            gate20Discharge: 1,
          },
        },
        {
          $sort: {
            dateTime: 1,
          },
        },
        {
          $facet: {
            data: [{ $skip: startIndex }, { $limit: perPage }],
            totalCount: [{ $count: "count" }],
          },
        },
      ];

      const lmdDischargeGateReport = await LMD_DAM_OVERVIEW_DICH.aggregate(
        pipeline
      );

      let totalCount = lmdDischargeGateReport[0]?.totalCount[0]?.count;
      const totalPage = Math.ceil(totalCount / perPage);

      return {
        data: lmdDischargeGateReport[0]?.data,
        currentPage,
        perPage,
        totalCount,
        totalPage,
      };
    } else {
      return "You are not authorized to access this data";
    }
  } catch (error) {
    console.error("Error:", error);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

const lmdOpeningGateReport = async (
  startDate,
  endDate,
  intervalMinutes,
  currentPage,
  perPage,
  startIndex,
  user,
  res,
  req
) => {
  try {
    const checkPermission = await Permission.findOne({ name: "lmdReport" });

    if (
      user.role === "admin" ||
      user.role === "lmdSuperuser" ||
      (checkPermission && checkPermission.roleName.includes(user.role))
    ) {
      const pipeline = [
        {
          $match: {
            dateTime: {
              $gt: new Date(startDate),
              $lte: new Date(
                new Date(endDate).setDate(new Date(endDate).getDate() + 1)
              ),
            },
          },
        },
        {
          $group: {
            _id: {
              interval: {
                $toDate: {
                  $subtract: [
                    { $toLong: "$dateTime" },
                    {
                      $mod: [
                        { $toLong: "$dateTime" },
                        intervalMinutes * 60 * 1000,
                      ],
                    },
                  ],
                },
              },
            },
            gate1Position: { $first: "$gate1Position" },
            gate2Position: { $first: "$gate2Position" },
            gate3Position: { $first: "$gate3Position" },
            gate4Position: { $first: "$gate4Position" },
            gate5Position: { $first: "$gate5Position" },
            gate6Position: { $first: "$gate6Position" },
            gate7Position: { $first: "$gate7Position" },
            gate8Position: { $first: "$gate8Position" },
            gate9Position: { $first: "$gate9Position" },
            gate10Position: { $first: "$gate10Position" },
            gate11Position: { $first: "$gate11Position" },
            gate12Position: { $first: "$gate12Position" },
            gate13Position: { $first: "$gate13Position" },
            gate14Position: { $first: "$gate14Position" },
            gate15Position: { $first: "$gate15Position" },
            gate16Position: { $first: "$gate16Position" },
            gate17Position: { $first: "$gate17Position" },
            gate18Position: { $first: "$gate18Position" },
            gate19Position: { $first: "$gate19Position" },
            gate20Position: { $first: "$gate20Position" },
          },
        },
        {
          $project: {
            _id: 0,
            dateTime: "$_id.interval",
            gate1Position: 1,
            gate2Position: 1,
            gate3Position: 1,
            gate4Position: 1,
            gate5Position: 1,
            gate6Position: 1,
            gate7Position: 1,
            gate8Position: 1,
            gate9Position: 1,
            gate10Position: 1,
            gate11Position: 1,
            gate12Position: 1,
            gate13Position: 1,
            gate14Position: 1,
            gate15Position: 1,
            gate16Position: 1,
            gate17Position: 1,
            gate18Position: 1,
            gate19Position: 1,
            gate20Position: 1,
          },
        },
        {
          $sort: {
            dateTime: 1,
          },
        },
        {
          $facet: {
            data: [{ $skip: startIndex }, { $limit: perPage }],
            totalCount: [{ $count: "count" }],
          },
        },
      ];

      const lmdOpeningGateReport = await LMD_DAM_OVERVIEW_POS.aggregate(
        pipeline
      );

      let totalCount = lmdOpeningGateReport[0]?.totalCount[0].count;
      const totalPage = Math.ceil(totalCount / perPage);

      return {
        data: lmdOpeningGateReport[0]?.data,
        currentPage,
        perPage,
        totalCount,
        totalPage,
      };
    } else {
      return "You are not authorized to access this data";
    }
  } catch (error) {
    console.error("Error:", error);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

const lmdPondlevelGateReport = async (
  startDate,
  endDate,
  intervalMinutes,
  currentPage,
  perPage,
  startIndex,
  user,
  res,
  req
) => {
  try {
    const checkPermission = await Permission.findOne({ name: "lmdReport" });

    if (
      user.role === "admin" ||
      user.role === "lmdSuperuser" ||
      (checkPermission && checkPermission.roleName.includes(user.role))
    ) {
      const pipeline = [
        {
          $match: {
            dateTime: {
              $gt: new Date(startDate),
              $lte: new Date(
                new Date(endDate).setDate(new Date(endDate).getDate() + 1)
              ),
            },
          },
        },
        {
          $group: {
            _id: {
              interval: {
                $toDate: {
                  $subtract: [
                    { $toLong: "$dateTime" },
                    {
                      $mod: [
                        { $toLong: "$dateTime" },
                        intervalMinutes * 60 * 1000,
                      ],
                    },
                  ],
                },
              },
            },
            inflow1Level: { $first: "$inflow1Level" },
            inflow2Level: { $first: "$inflow2Level" },
            inflow3Level: { $first: "$inflow3Level" },
            inflow1Discharge: { $first: "$inflow1Discharge" },
            inflow2Discharge: { $first: "$inflow2Discharge" },
            inflow3Discharge: { $first: "$inflow3Discharge" },
            damDownstreamLevel: { $first: "$damDownstreamLevel" },
            damDownstreamDischarge: { $first: "$damDownstreamDischarge" },
            pondLevel: { $first: "$pondLevel" },
          },
        },
        {
          $project: {
            _id: 0,
            dateTime: "$_id.interval",
            inflow1Level: 1,
            inflow2Level: 1,
            inflow3Level: 1,
            inflow1Discharge: 1,
            inflow2Discharge: 1,
            inflow3Discharge: 1,
            damDownstreamLevel: 1,
            damDownstreamDischarge: 1,
            pondLevel: 1,
          },
        },
        {
          $sort: {
            dateTime: 1,
          },
        },
        {
          $facet: {
            data: [{ $skip: startIndex }, { $limit: perPage }],
            totalCount: [{ $count: "count" }],
          },
        },
      ];

      const lmdPondlevelGateReports = await LMD_POND_LEVEL_OVERVIEW.aggregate(
        pipeline
      );

      let totalCount = lmdPondlevelGateReports[0]?.totalCount[0].count;
      const totalPage = Math.ceil(totalCount / perPage);

      return {
        data: lmdPondlevelGateReports[0]?.data,
        currentPage,
        perPage,
        totalCount,
        totalPage,
      };
    } else {
      return "You are not authorized to access this data";
    }
  } catch (error) {
    console.error("Error:", error);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

const lmdGateParameterOverviewReport = async (
  startDate,
  endDate,
  intervalMinutes,
  currentPage,
  perPage,
  startIndex,
  user,
  res,
  req
) => {
  try {
    const checkPermission = await Permission.findOne({ name: "lmdReport" });

    if (
      user.role === "admin" ||
      user.role === "lmdSuperuser" ||
      (checkPermission && checkPermission.roleName.includes(user.role))
    ) {
      const pipeline = [
        {
          $match: {
            dateTime: {
              $gt: new Date(startDate),
              $lte: new Date(
                new Date(endDate).setDate(new Date(endDate).getDate() + 1)
              ),
            },
          },
        },
        {
          $group: {
            _id: {
              interval: {
                $toDate: {
                  $subtract: [
                    { $toLong: "$dateTime" },
                    {
                      $mod: [
                        { $toLong: "$dateTime" },
                        intervalMinutes * 60 * 1000,
                      ],
                    },
                  ],
                },
              },
            },
            pondLevel: { $first: "$pondLevel" },
            liveCapacity: { $first: "$liveCapacity" },
            grossStorage: { $first: "$grossStorage" },
            fullReservoirLevel: { $first: "$fullReservoirLevel" },
            contourArea: { $first: "$contourArea" },
            catchmentArea: { $first: "$catchmentArea" },
            ayacutArea: { $first: "$ayacutArea" },
            filling: { $first: "$filling" },
            instantaneousGateDischarge: {
              $first: "$instantaneousGateDischarge",
            },
            instantaneousCanalDischarge: {
              $first: "$instantaneousCanalDischarge",
            },
            totalDamDischarge: { $first: "$totalDamDischarge" },
            cumulativeDamDischarge: { $first: "$cumulativeDamDischarge" },
          },
        },
        {
          $project: {
            _id: 0,
            dateTime: "$_id.interval",
            pondLevel: 1,
            liveCapacity: 1,
            grossStorage: 1,
            fullReservoirLevel: 1,
            contourArea: 1,
            catchmentArea: 1,
            ayacutArea: 1,
            filling: 1,
            instantaneousGateDischarge: 1,
            instantaneousCanalDischarge: 1,
            totalDamDischarge: 1,
            cumulativeDamDischarge: 1,
          },
        },
        {
          $sort: {
            dateTime: 1,
          },
        },
        {
          $facet: {
            data: [{ $skip: startIndex }, { $limit: perPage }],
            totalCount: [{ $count: "count" }],
          },
        },
      ];

      const lmdGateParameterOverviewReport =
        await LMD_POND_LEVEL_OVERVIEW.aggregate(pipeline);

      let totalCount = lmdGateParameterOverviewReport[0]?.totalCount[0].count;
      const totalPage = Math.ceil(totalCount / perPage);

      return {
        data: lmdGateParameterOverviewReport[0]?.data,
        currentPage,
        perPage,
        totalCount,
        totalPage,
      };
    } else {
      return "You are not authorized to access this data";
    }
  } catch (error) {
    console.error("Error:", error);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

const lmdGateReport = async (
  startDate,
  endDate,
  intervalMinutes,
  currentPage,
  perPage,
  startIndex,
  user,
  res,
  req
) => {
  try {
    const checkPermission = await Permission.findOne({ name: "lmdReport" });

    if (
      user.role === "admin" ||
      user.role === "lmdSuperuser" ||
      (checkPermission && checkPermission.roleName.includes(user.role))
    ) {
      const pipeline = [
        {
          $match: {
            dateTime: {
              $gt: new Date(startDate),
              $lte: new Date(
                new Date(endDate).setDate(new Date(endDate).getDate() + 1)
              ),
            },
          },
        },
        {
          $group: {
            _id: {
              interval: {
                $toDate: {
                  $subtract: [
                    { $toLong: "$dateTime" },
                    {
                      $mod: [
                        { $toLong: "$dateTime" },
                        intervalMinutes * 60 * 1000,
                      ],
                    },
                  ],
                },
              },
            },

            hrrGate1Position: { $first: "$hrrGate1Position" },
            hrrGate2Position: { $first: "$hrrGate2Position" },
          },
        },
        {
          $project: {
            _id: 0,
            dateTime: "$_id.interval",
            hrrGate1Position: 1,
            hrrGate2Position: 1,
          },
        },
        {
          $sort: {
            dateTime: 1,
          },
        },
        {
          $facet: {
            data: [{ $skip: startIndex }, { $limit: perPage }],
            totalCount: [{ $count: "count" }],
          },
        },
      ];

      const pipeline1 = [
        {
          $match: {
            dateTime: {
              $gt: new Date(startDate),
              $lte: new Date(
                new Date(endDate).setDate(new Date(endDate).getDate() + 1)
              ),
            },
          },
        },
        {
          $group: {
            _id: {
              interval: {
                $toDate: {
                  $subtract: [
                    { $toLong: "$dateTime" },
                    {
                      $mod: [
                        { $toLong: "$dateTime" },
                        intervalMinutes * 60 * 1000,
                      ],
                    },
                  ],
                },
              },
            },

            hrrGate1Discharge: { $first: "$hrrGate1Discharge" },
            hrrGate2Discharge: { $first: "$hrrGate2Discharge" },
          },
        },
        {
          $project: {
            _id: 0,
            dateTime: "$_id.interval",
            hrrGate1Discharge: 1,
            hrrGate2Discharge: 1,
          },
        },
        {
          $sort: {
            dateTime: 1,
          },
        },
        {
          $facet: {
            data: [{ $skip: startIndex }, { $limit: perPage }],
            totalCount: [{ $count: "count" }],
          },
        },
      ];

      const lmdGateReportPos = await LMD_HR_DAM_OVERVIEW_POS.aggregate(
        pipeline
      );
      const lmdGateReportDis = await LMD_HR_DAM_OVERVIEW_DICH.aggregate(
        pipeline1
      );

      let posData = lmdGateReportPos[0]?.data || [];
      let disData = lmdGateReportDis[0]?.data || [];

      let minLength = Math.max(posData.length, disData.length);

      // Merge data arrays based on index position
      let mergedData = Array.from({ length: minLength }, (_, index) => ({
        hrrGate1Position: posData[index]?.hrrGate1Position || 0,
        hrrGate2Position: posData[index]?.hrrGate2Position || 0,
        hrrGate1Discharge: disData[index]?.hrrGate1Discharge || 0,
        hrrGate2Discharge: disData[index]?.hrrGate2Discharge || 0,
        totalDischarge:
          disData[index]?.hrrGate1Discharge + disData[index]?.hrrGate2Discharge,
        dateTime: posData[index]?.dateTime || disData[index]?.dateTime || null,
      }));

      let totalCount = lmdGateReportPos[0]?.totalCount[0].count;
      const totalPage = Math.ceil(totalCount / perPage);

      return {
        data: mergedData,
        currentPage,
        perPage,
        totalCount,
        totalPage,
      };
    } else {
      return "You are not authorized to access this data";
    }
  } catch (error) {
    console.error("Error:", error);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

const sevenDayReport = async (user) => {
  try {
    const checkPermission = await Permission.findOne({ name: "lmdReport" });

    if (
      user.role === "admin" ||
      user.role === "lmdSuperuser" ||
      (checkPermission && checkPermission.roleName.includes(user.role))
    ) {
      const currentDate = new Date();
      const sevenDaysAgo = new Date(currentDate);
      sevenDaysAgo.setDate(currentDate.getDate() - 6);

      const pondLevelSevenDayReport = await LMD_POND_LEVEL_OVERVIEW.find({
        dateTime: { $gte: sevenDaysAgo, $lte: currentDate },
      });

      const groupedByDate = {};
      pondLevelSevenDayReport.forEach((entry) => {
        const dateKey = entry.dateTime.toISOString().split("T")[0];
        if (!groupedByDate[dateKey]) {
          groupedByDate[dateKey] = {
            date: dateKey,
            maxPondLevel: entry.pondLevel,
            minPondLevel: entry.pondLevel,
            sumPondLevel: entry.pondLevel,
            count: 1,
            maxInflow1Level: entry.inflow1Level,
            minInflow1Level: entry.inflow1Level,
            sumInflow1Level: entry.inflow1Level,
            maxInflow2Level: entry.inflow2Level,
            minInflow2Level: entry.inflow2Level,
            sumInflow2Level: entry.inflow2Level,
            maxInflow3Level: entry.inflow3Level,
            minInflow3Level: entry.inflow3Level,
            sumInflow3Level: entry.inflow3Level,
          };
        } else {
          groupedByDate[dateKey].maxPondLevel = Math.max(
            groupedByDate[dateKey].maxPondLevel,
            entry.pondLevel
          );
          groupedByDate[dateKey].minPondLevel = Math.min(
            groupedByDate[dateKey].minPondLevel,
            entry.pondLevel
          );
          groupedByDate[dateKey].sumPondLevel += entry.pondLevel;
          groupedByDate[dateKey].count++;

          groupedByDate[dateKey].maxInflow1Level = Math.max(
            groupedByDate[dateKey].maxInflow1Level,
            entry.inflow1Level
          );
          groupedByDate[dateKey].minInflow1Level = Math.min(
            groupedByDate[dateKey].minInflow1Level,
            entry.inflow1Level
          );
          groupedByDate[dateKey].sumInflow1Level += entry.inflow1Level;

          groupedByDate[dateKey].maxInflow2Level = Math.max(
            groupedByDate[dateKey].maxInflow2Level,
            entry.inflow2Level
          );
          groupedByDate[dateKey].minInflow2Level = Math.min(
            groupedByDate[dateKey].minInflow2Level,
            entry.inflow2Level
          );
          groupedByDate[dateKey].sumInflow2Level += entry.inflow2Level;

          groupedByDate[dateKey].maxInflow3Level = Math.max(
            groupedByDate[dateKey].maxInflow3Level,
            entry.inflow3Level
          );
          groupedByDate[dateKey].minInflow3Level = Math.min(
            groupedByDate[dateKey].minInflow3Level,
            entry.inflow3Level
          );
          groupedByDate[dateKey].sumInflow3Level += entry.inflow3Level;
        }
      });

      const result = [];
      const daysInRange = Array.from({ length: 7 }, (_, index) => {
        const date = new Date(sevenDaysAgo);
        date.setDate(sevenDaysAgo.getDate() + index);
        return date.toISOString().split("T")[0];
      });

      daysInRange.forEach((dateKey) => {
        if (groupedByDate[dateKey]) {
          const record = groupedByDate[dateKey];
          const avgPondLevel = record.sumPondLevel / record.count;
          const avgInflow1Level = record.sumInflow1Level / record.count;
          const avgInflow2Level = record.sumInflow2Level / record.count;
          const avgInflow3Level = record.sumInflow3Level / record.count;

          result.push({
            date: record.date,
            maxPondLevel: record.maxPondLevel,
            minPondLevel: record.minPondLevel,
            avgPondLevel: avgPondLevel,
            maxInflow1Level: record.maxInflow1Level,
            minInflow1Level: record.minInflow1Level,
            avgInflow1Level: avgInflow1Level,
            maxInflow2Level: record.maxInflow2Level,
            minInflow2Level: record.minInflow2Level,
            avgInflow2Level: avgInflow2Level,
            maxInflow3Level: record.maxInflow3Level,
            minInflow3Level: record.minInflow3Level,
            avgInflow3Level: avgInflow3Level,
          });
        } else {
          result.push({
            date: dateKey,
            maxPondLevel: "",
            minPondLevel: "",
            avgPondLevel: "",
            maxInflow1Level: "",
            minInflow1Level: "",
            avgInflow1Level: "",
            maxInflow2Level: "",
            minInflow2Level: "",
            avgInflow2Level: "",
            maxInflow3Level: "",
            minInflow3Level: "",
            avgInflow3Level: "",
          });
        }
      });

      return result;
    } else {
      return "You are not authorized to access this data";
    }
  } catch (error) {
    console.error("Error:", error);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

//Report Download

const lmdDischargeGateReportWp = async (
  startDate,
  endDate,
  intervalMinutes,
  exportToExcel,
  user,
  res,
  req
) => {
  try {

    const checkPermission = await Permission.findOne({ name: "lmdReport" });

    if (user?.role === "admin" ||user?.role === "lmdSuperuser" ||(checkPermission && checkPermission.roleName.includes(user?.role)) ) {

    const pipeline1 = [
      {
        $match: {
          dateTime: {
            $gt: new Date(startDate),
            $lte: new Date(
              new Date(endDate).setDate(new Date(endDate).getDate() + 1)
            ),
          },
        },
      },
      {
        $group: {
          _id: {
            interval: {
              $toDate: {
                $subtract: [
                  { $toLong: "$dateTime" },
                  {
                    $mod: [
                      { $toLong: "$dateTime" },
                      intervalMinutes * 60 * 1000,
                    ],
                  },
                ],
              },
            },
          },
          gate1Discharge: { $first: "$gate1Discharge" },
          gate2Discharge: { $first: "$gate2Discharge" },
          gate3Discharge: { $first: "$gate3Discharge" },
          gate4Discharge: { $first: "$gate4Discharge" },
          gate5Discharge: { $first: "$gate5Discharge" },
          gate6Discharge: { $first: "$gate6Discharge" },
          gate7Discharge: { $first: "$gate7Discharge" },
          gate8Discharge: { $first: "$gate8Discharge" },
          gate9Discharge: { $first: "$gate9Discharge" },
          gate10Discharge: { $first: "$gate10Discharge" },
          gate11Discharge: { $first: "$gate11Discharge" },
          gate12Discharge: { $first: "$gate12Discharge" },
          gate13Discharge: { $first: "$gate13Discharge" },
          gate14Discharge: { $first: "$gate14Discharge" },
          gate15Discharge: { $first: "$gate15Discharge" },
          gate16Discharge: { $first: "$gate16Discharge" },
          gate17Discharge: { $first: "$gate17Discharge" },
          gate18Discharge: { $first: "$gate18Discharge" },
          gate19Discharge: { $first: "$gate19Discharge" },
          gate20Discharge: { $first: "$gate20Discharge" },
        },
      },
      {
        $project: {
          _id: 0,
          dateTime: "$_id.interval",
          gate1Discharge: 1,
          gate2Discharge: 1,
          gate3Discharge: 1,
          gate4Discharge: 1,
          gate5Discharge: 1,
          gate6Discharge: 1,
          gate7Discharge: 1,
          gate8Discharge: 1,
          gate9Discharge: 1,
          gate10Discharge: 1,
          gate11Discharge: 1,
          gate12Discharge: 1,
          gate13Discharge: 1,
          gate14Discharge: 1,
          gate15Discharge: 1,
          gate16Discharge: 1,
          gate17Discharge: 1,
          gate18Discharge: 1,
          gate19Discharge: 1,
          gate20Discharge: 1,
        },
      },
      {
        $sort: {
          dateTime: 1,
        },
      },
    ];

    const lmdDischargeGateReport1 = await LMD_DAM_OVERVIEW_DICH.aggregate(
      pipeline1
    );

    if (exportToExcel == 1) {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet(
        "LMD DAM Gate 1 To 20 Discharge Report"
      );

      const addImageToWorksheet = (imagePath, colRange) => {
        const imageId = workbook.addImage({
          filename: imagePath,
          extension: "png",
          dimensions: { height: 100, width: 100 },
        });

        worksheet.addImage(imageId, {
          tl: { col: colRange[0], row: 0 },
          br: { col: colRange[1], row: 8 },
          editAs: "oneCell",
        });
      };

      addImageToWorksheet(hyderabadImagePath, [1, 4]);
      addImageToWorksheet(chetasImagePath, [17.5, 19]);

      if (req.query.selectedGates == null || req.query.selectedGates == 0) {
        const headers = [
          "DateTime",
          ...Array.from({ length: 20 }, (_, i) => `Gate ${i + 1} \n (Cusecs)`),
        ];
        worksheet.addRow([]);

        worksheet.addRow(headers).eachCell((cell) => {
          cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
          };
          cell.alignment = { horizontal: "center" };
        });

        lmdDischargeGateReport1.forEach((row) => {
          const rowData = [
            row.dateTime,
            ...Array.from(
              { length: 20 },
              (_, i) => row[`gate${i + 1}Discharge`]
            ),
          ];
          worksheet.addRow(rowData);
        });
      } else {
        let selectedGatesString = req.query.selectedGates;
        selectedGatesString = selectedGatesString.replace(/\[|\]/g, "");
        const selectedGates = selectedGatesString.split(",").map(Number);

        const headers = [
          "DateTime",
          ...selectedGates.map((gate) => `Gate ${gate} \n (Cusecs)`),
        ];

        worksheet.addRows([[]]);

        worksheet.addRow(headers).eachCell((cell) => {
          cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
          };
          cell.alignment = { horizontal: "center" };
        });

        lmdDischargeGateReport1.forEach((row) => {
          const rowData = [row.dateTime];
          selectedGates.forEach((gate) => {
            const fieldName = "gate" + gate + "Discharge";
            if (row.hasOwnProperty(fieldName)) {
              rowData.push(row[fieldName]);
            } else {
              rowData.push(null);
            }
          });
          worksheet.addRow(rowData);
        });
      }

      const dateTimeColumn = worksheet.getColumn(1);
      dateTimeColumn.width = 20;
      dateTimeColumn.numFmt = "yyyy-mm-dd hh:mm:ss";

      worksheet.mergeCells("A1:U8");
      const mergedCell = worksheet.getCell("A1");

      mergedCell.border = {
        top: { style: "thin", color: { argb: "FF000000" } }, // Top border
        left: { style: "thin", color: { argb: "FF000000" } }, // Left border
        bottom: { style: "thin", color: { argb: "FF000000" } }, // Bottom border
        right: { style: "thin", color: { argb: "FF000000" } }, // Right border
      };

      mergedCell.value = "LMD DAM Gate 1 To 20 Discharge Report";
      mergedCell.alignment = { horizontal: "center", vertical: "middle" };
      mergedCell.font = { bold: true };
      mergedCell.font = { bold: true, size: 15 };
      worksheet.getRow(11).height = 30;

      worksheet.getRow(11).eachCell((cell) => {
        cell.font = { bold: true };
      });

      const borderStyle = {
        style: "thin", // You can change this to 'medium', 'thick', etc. as needed
        color: { argb: "FF000000" },
      };

      worksheet.getColumn("B").eachCell((cell) => {
        cell.border = {
          ...cell.border,
          left: borderStyle,
        };
      });

      [
        "A",
        "B",
        "C",
        "D",
        "E",
        "F",
        "G",
        "H",
        "I",
        "J",
        "K",
        "L",
        "M",
        "N",
        "O",
        "P",
        "Q",
        "R",
        "S",
        "T",
        "U",
      ].forEach((column) => {
        worksheet.getColumn(column).eachCell((cell) => {
          cell.border = {
            ...cell.border,
            right: borderStyle,
          };
        });
      });

      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=LMD_Dam_Gate_1_To_20_Discharge_Report.xlsx"
      );

      await workbook.xlsx.write(res);
    } else if (exportToExcel == 3) {
      try {
        const itemsPerPage = 26; // Number of dates to print per page
        const totalItems = lmdDischargeGateReport1.length; // Total number of dates
        const totalPages = Math.ceil(totalItems / itemsPerPage); // Calculate total pages needed

        const sections = [];
        for (let page = 0; page < totalPages; page++) {
          const startIndex = page * itemsPerPage;
          const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
          const pageData = lmdDischargeGateReport1.slice(startIndex, endIndex);

          sections.push({
            properties: {
              page: {
                margin: { top: 1500, right: 1000, bottom: 1000, left: 100 },
                size: {
                  orientation: Docx.PageOrientation.PORTRAIT,
                  width: 12240,
                  height: 15840,
                },
              },
            },
            children: [
              // Add your images and heading here at the top of every page
              new Docx.Paragraph({
                children: [
                  // Left image
                  new Docx.ImageRun({
                    data: fs.readFileSync(hyderabadImagePath),
                    transformation: {
                      width: 140,
                      height: 105,
                    },
                    floating: {
                      horizontalPosition: {
                        relative: Docx.HorizontalPositionRelativeFrom.PAGE,
                        align: Docx.HorizontalPositionAlign.LEFT,
                      },
                      verticalPosition: {
                        relative: Docx.VerticalPositionRelativeFrom.PAGE,
                        align: Docx.VerticalPositionAlign.TOP,
                      },
                    },
                  }),
                  // Right image
                  new Docx.ImageRun({
                    data: fs.readFileSync(chetasImagePath),
                    transformation: {
                      width: 80,
                      height: 110,
                    },
                    floating: {
                      horizontalPosition: {
                        relative: Docx.HorizontalPositionRelativeFrom.PAGE,
                        align: Docx.HorizontalPositionAlign.RIGHT,
                      },
                      verticalPosition: {
                        relative: Docx.VerticalPositionRelativeFrom.PAGE,
                        align: Docx.VerticalPositionAlign.TOP,
                      },
                    },
                  }),
                ],
              }),

              // Heading
              new Docx.Paragraph({
                text: "LMD Dam Gate 1 to 20 Discharge Report",
                heading: Docx.HeadingLevel.HEADING_1,
                alignment: Docx.AlignmentType.CENTER,
              }),

              // Table
              new Docx.Table({
                width: { size: "109%", type: Docx.WidthType.PERCENTAGE },
                rows: [
                  // Table header
                  new Docx.TableRow({
                    children: [
                      new Docx.TableCell({
                        children: [new Docx.Paragraph("Date Time")],
                        alignment: { horizontal: Docx.AlignmentType.CENTER },
                        // Adjusted width for Date Time column
                      }),
                      // Adjust the width for each gate column
                      
                      ...Array.from(
                        { length: 20 },
                        (_, i) =>
                          new Docx.TableCell({
                            children: [new Docx.Paragraph(`Gate ${i + 1}`)],
                            alignment: {
                              horizontal: Docx.AlignmentType.CENTER,
                            },
                            // Adjusted width for gate columns
                          })
                      ),
                    ],
                  }),

                  // Table rows
                  ...pageData.map((item) => {
                    const formattedDate = new Date(item.dateTime)
                      .toISOString()
                      .replace("T", "   T")
                      .slice(0, -8);
                    return new Docx.TableRow({
                      children: [
                        new Docx.TableCell({
                          children: [new Docx.Paragraph(formattedDate)],
                          alignment: { horizontal: Docx.AlignmentType.CENTER },
                          // Adjusted width for Date Time column
                        }),
                        // Include each gate discharge value
                        ...Array.from(
                          { length: 20 },
                          (_, i) =>
                            new Docx.TableCell({
                              children: [
                                new Docx.Paragraph(
                                  item[`gate${i + 1}Discharge`].toFixed(2)
                                ),
                              ],
                              alignment: {
                                horizontal: Docx.AlignmentType.CENTER,
                              },
                              // Adjusted width for gate columns
                            })
                        ),
                      ],
                    });
                  }),
                ],
              }),
            ],
          });
        }

        const doc = new Docx.Document({ sections: sections });

        // Set response headers
        res.setHeader(
          "Content-Type",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        );
        res.setHeader(
          "Content-Disposition",
          "attachment; filename=LMD_Dam_Gate_1_To_20_Discharge_Report.doc"
        );

        // Stream the Word document to the response
        const buffer = await Docx.Packer.toBuffer(doc);
        res.end(buffer);
      } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Internal Server Error");
      }
    }else {
      res.send(lmdDischargeGateReport1);
    }
  } else {
    return "You are not authorized to access this data";
  }
  } catch (error) {
    console.error("Error:", error);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

const lmdOpeningGateReportWp = async (
  startDate,
  endDate,
  intervalMinutes,
  exportToExcel,
  user,
  res,
  req
) => {
  try {

    const checkPermission = await Permission.findOne({ name: "lmdReport" });

    if (user.role === "admin" || user.role === "lmdSuperuser" || (checkPermission && checkPermission.roleName.includes(user.role)) ) {
    const pipelineWithoutPagination = [
      {
        $match: {
          dateTime: {
            $gt: new Date(startDate),
            $lte: new Date(
              new Date(endDate).setDate(new Date(endDate).getDate() + 1)
            ),
          },
        },
      },
      {
        $group: {
          _id: {
            interval: {
              $toDate: {
                $subtract: [
                  { $toLong: "$dateTime" },
                  {
                    $mod: [
                      { $toLong: "$dateTime" },
                      intervalMinutes * 60 * 1000,
                    ],
                  },
                ],
              },
            },
          },
          gate1Position: { $first: "$gate1Position" },
          gate2Position: { $first: "$gate2Position" },
          gate3Position: { $first: "$gate3Position" },
          gate4Position: { $first: "$gate4Position" },
          gate5Position: { $first: "$gate5Position" },
          gate6Position: { $first: "$gate6Position" },
          gate7Position: { $first: "$gate7Position" },
          gate8Position: { $first: "$gate8Position" },
          gate9Position: { $first: "$gate9Position" },
          gate10Position: { $first: "$gate10Position" },
          gate11Position: { $first: "$gate11Position" },
          gate12Position: { $first: "$gate12Position" },
          gate13Position: { $first: "$gate13Position" },
          gate14Position: { $first: "$gate14Position" },
          gate15Position: { $first: "$gate15Position" },
          gate16Position: { $first: "$gate16Position" },
          gate17Position: { $first: "$gate17Position" },
          gate18Position: { $first: "$gate18Position" },
          gate19Position: { $first: "$gate19Position" },
          gate20Position: { $first: "$gate20Position" },
        },
      },
      {
        $project: {
          _id: 0,
          dateTime: "$_id.interval",
          gate1Position: 1,
          gate2Position: 1,
          gate3Position: 1,
          gate4Position: 1,
          gate5Position: 1,
          gate6Position: 1,
          gate7Position: 1,
          gate8Position: 1,
          gate9Position: 1,
          gate10Position: 1,
          gate11Position: 1,
          gate12Position: 1,
          gate13Position: 1,
          gate14Position: 1,
          gate15Position: 1,
          gate16Position: 1,
          gate17Position: 1,
          gate18Position: 1,
          gate19Position: 1,
          gate20Position: 1,
        },
      },
      {
        $sort: {
          dateTime: 1,
        },
      },
    ];

    const lmdOpeningGateReportWithoutPagination =
      await LMD_DAM_OVERVIEW_POS.aggregate(pipelineWithoutPagination);

    if (exportToExcel == 1) {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet(
        "LMD Dam Gate 1 To 20 Opening Report"
      );

      const addImageToWorksheet = (imagePath, colRange) => {
        const imageId = workbook.addImage({
          filename: imagePath,
          extension: "png",
          dimensions: { height: 100, width: 100 },
        });

        worksheet.addImage(imageId, {
          tl: { col: colRange[0], row: 0 },
          br: { col: colRange[1], row: 8 },
          editAs: "oneCell",
        });
      };

      addImageToWorksheet(hyderabadImagePath, [1, 4]);
      addImageToWorksheet(chetasImagePath, [17.5, 19]);

      if (req.query.selectedGates == null || req.query.selectedGates == 0) {
        const headers = [
          "DateTime",
          ...Array.from({ length: 20 }, (_, i) => `Gate ${i + 1} \n (Feet)`),
        ];
        worksheet.addRow([]);

        worksheet.addRow(headers).eachCell((cell) => {
          cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
          };
          cell.alignment = { horizontal: "center" };
        });

        lmdOpeningGateReportWithoutPagination.forEach((row) => {
          const rowData = [
            row.dateTime,
            ...Array.from(
              { length: 20 },
              (_, i) => row[`gate${i + 1}Position`]
            ),
          ];
          worksheet.addRow(rowData);
        });
      } else {
        let selectedGatesString = req.query.selectedGates;
        selectedGatesString = selectedGatesString.replace(/\[|\]/g, "");
        const selectedGates = selectedGatesString.split(",").map(Number);

        const headers = [
          "DateTime",
          ...selectedGates.map((gate) => `Gate ${gate} \n (Feet)`),
        ];
        worksheet.addRows([[]]);

        worksheet.addRow(headers).eachCell((cell) => {
          cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
          };
          cell.alignment = { horizontal: "center" };
        });

        lmdOpeningGateReportWithoutPagination.forEach((row) => {
          const rowData = [row.dateTime];
          selectedGates.forEach((gate) => {
            const fieldName = "gate" + gate + "Position";
            if (row.hasOwnProperty(fieldName)) {
              rowData.push(row[fieldName]);
            } else {
              rowData.push(null);
            }
          });
          worksheet.addRow(rowData);
        });
      }

      const dateTimeColumn = worksheet.getColumn(1);
      dateTimeColumn.width = 20;
      dateTimeColumn.numFmt = "yyyy-mm-dd hh:mm:ss";

      worksheet.mergeCells("A1:U8");
      const mergedCell = worksheet.getCell("A1");

      mergedCell.border = {
        top: { style: "thin", color: { argb: "FF000000" } }, // Top border
        left: { style: "thin", color: { argb: "FF000000" } }, // Left border
        bottom: { style: "thin", color: { argb: "FF000000" } }, // Bottom border
        right: { style: "thin", color: { argb: "FF000000" } }, // Right border
      };

      mergedCell.value = "LMD Dam Gate 1 To 20 Opening Report";
      mergedCell.alignment = { horizontal: "center", vertical: "middle" };
      mergedCell.font = { bold: true };
      mergedCell.font = { bold: true, size: 15 };
      worksheet.getRow(11).height = 30;

      worksheet.getRow(11).eachCell((cell) => {
        cell.font = { bold: true };
      });

      const borderStyle = {
        style: "thin", // You can change this to 'medium', 'thick', etc. as needed
        color: { argb: "FF000000" },
      };

      worksheet.getColumn("B").eachCell((cell) => {
        cell.border = {
          ...cell.border,
          left: borderStyle,
        };
      });

      [
        "A",
        "B",
        "C",
        "D",
        "E",
        "F",
        "G",
        "H",
        "I",
        "J",
        "K",
        "L",
        "M",
        "N",
        "O",
        "P",
        "Q",
        "R",
        "S",
        "T",
        "U",
      ].forEach((column) => {
        worksheet.getColumn(column).eachCell((cell) => {
          cell.border = {
            ...cell.border,
            right: borderStyle,
          };
        });
      });

      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=LMD_Dam_Gate_1_To_20_Opening_Report.xlsx"
      );

      await workbook.xlsx.write(res);
    } else if (exportToExcel == 3) {
      const itemsPerPage = 26; // Number of dates to print per page
      const totalItems = lmdOpeningGateReportWithoutPagination.length; // Total number of dates
      const totalPages = Math.ceil(totalItems / itemsPerPage); // Calculate total pages needed

      const sections = [];
      for (let page = 0; page < totalPages; page++) {
        const startIndex = page * itemsPerPage;
        const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
        const pageData = lmdOpeningGateReportWithoutPagination.slice(
          startIndex,
          endIndex
        );

        sections.push({
          properties: {
            page: {
              margin: { top: 1500, right: 1000, bottom: 1000, left: 100 },
              size: {
                orientation: Docx.PageOrientation.PORTRAIT,
                width: 12240,
                height: 15840,
              },
            },
          },
          children: [
            // Add your images and heading here at the top of every page
            new Docx.Paragraph({
              children: [
                // Left image
                new Docx.ImageRun({
                  data: fs.readFileSync(hyderabadImagePath),
                  transformation: {
                    width: 140,
                    height: 105,
                  },
                  floating: {
                    horizontalPosition: {
                      relative: Docx.HorizontalPositionRelativeFrom.PAGE,
                      align: Docx.HorizontalPositionAlign.LEFT,
                    },
                    verticalPosition: {
                      relative: Docx.VerticalPositionRelativeFrom.PAGE,
                      align: Docx.VerticalPositionAlign.TOP,
                    },
                  },
                }),
                // Right image
                new Docx.ImageRun({
                  data: fs.readFileSync(chetasImagePath),
                  transformation: {
                    width: 80,
                    height: 110,
                  },
                  floating: {
                    horizontalPosition: {
                      relative: Docx.HorizontalPositionRelativeFrom.PAGE,
                      align: Docx.HorizontalPositionAlign.RIGHT,
                    },
                    verticalPosition: {
                      relative: Docx.VerticalPositionRelativeFrom.PAGE,
                      align: Docx.VerticalPositionAlign.TOP,
                    },
                  },
                }),
              ],
            }),
            // Heading
            new Docx.Paragraph({
              text: "LMD Dam Gate 1 To 20 Opening Report",
              heading: Docx.HeadingLevel.HEADING_1,
              alignment: Docx.AlignmentType.CENTER,
            }),
            // Table
            new Docx.Table({
              width: { size: "109%", type: Docx.WidthType.PERCENTAGE },
              rows: [
                // Table header
                new Docx.TableRow({
                  children: [
                    new Docx.TableCell({
                      children: [new Docx.Paragraph("Date Time")],
                      alignment: { horizontal: Docx.AlignmentType.CENTER },
                      // Adjusted width for Date Time column
                    }),
                    // Adjust the width for each gate column
                    ...Array.from(
                      { length: 20 },
                      (_, i) =>
                        new Docx.TableCell({
                          children: [new Docx.Paragraph(`Gate ${i + 1}`)],
                          alignment: { horizontal: Docx.AlignmentType.CENTER },
                          // Adjusted width for gate columns
                        })
                    ),
                  ],
                }),

                // Table rows
                ...pageData.map((item) => {
                  const formattedDate = new Date(item.dateTime)
                    .toISOString()
                    .replace("T", "   T")
                    .slice(0, -8);
                  return new Docx.TableRow({
                    children: [
                      new Docx.TableCell({
                        children: [new Docx.Paragraph(formattedDate)],
                        alignment: { horizontal: Docx.AlignmentType.CENTER },
                        // Adjusted width for Date Time column
                      }),
                      // Include each gate Opening value
                      ...Array.from(
                        { length: 20 },
                        (_, i) =>
                          new Docx.TableCell({
                            children: [
                              new Docx.Paragraph(
                                item[`gate${i + 1}Position`].toFixed(2)
                              ),
                            ],
                            alignment: {
                              horizontal: Docx.AlignmentType.CENTER,
                            },
                            // Adjusted width for gate columns
                          })
                      ),
                    ],
                  });
                }),
              ],
            }),
          ],
        });
      }

      const doc = new Docx.Document({
        sections: sections,
      });
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      );
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=LMD_Dam_Gate_1_To_20_Opening_Report.doc"
      );

      // Stream the Word document to the response
      const buffer = await Docx.Packer.toBuffer(doc);
      res.end(buffer);
    } else {
      res.send(lmdOpeningGateReportWithoutPagination);
    }
  } else {
    return "You are not authorized to access this data";
  }
  } catch (error) {
    console.error("Error:", error);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

const lmdPondlevelGateReportWp = async (
  startDate,
  endDate,
  intervalMinutes,
  exportToExcel,
  user,
  res,
  req
) => {
  try {

    const checkPermission = await Permission.findOne({ name: "lmdReport" });

    if (user.role === "admin" || user.role === "lmdSuperuser" || (checkPermission && checkPermission.roleName.includes(user.role)) ) {
    
      const pipelineWithoutPagination = [
      {
        $match: {
          dateTime: {
            $gt: new Date(startDate),
            $lte: new Date(
              new Date(endDate).setDate(new Date(endDate).getDate() + 1)
            ),
          },
        },
      },
      {
        $group: {
          _id: {
            interval: {
              $toDate: {
                $subtract: [
                  { $toLong: "$dateTime" },
                  {
                    $mod: [
                      { $toLong: "$dateTime" },
                      intervalMinutes * 60 * 1000,
                    ],
                  },
                ],
              },
            },
          },
          inflow1Level: { $first: "$inflow1Level" },
          inflow2Level: { $first: "$inflow2Level" },
          inflow3Level: { $first: "$inflow3Level" },
          inflow1Discharge: { $first: "$inflow1Discharge" },
          inflow2Discharge: { $first: "$inflow2Discharge" },
          inflow3Discharge: { $first: "$inflow3Discharge" },
          damDownstreamLevel: { $first: "$damDownstreamLevel" },
          damDownstreamDischarge: { $first: "$damDownstreamDischarge" },
          pondLevel: { $first: "$pondLevel" },
        },
      },
      {
        $project: {
          _id: 0,
          dateTime: "$_id.interval",
          inflow1Level: 1,
          inflow2Level: 1,
          inflow3Level: 1,
          inflow1Discharge: 1,
          inflow2Discharge: 1,
          inflow3Discharge: 1,
          damDownstreamLevel: 1,
          damDownstreamDischarge: 1,
          pondLevel: 1,
        },
      },
      {
        $sort: {
          dateTime: 1,
        },
      },
    ];

    const lmdPondlevelGateReportsWithoutPagination =
      await LMD_POND_LEVEL_OVERVIEW.aggregate(pipelineWithoutPagination);

    if (exportToExcel == 1) {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet(
        "LMD Dam Inflow Outflow PondLevel Report"
      );

      const addImageToWorksheet = (imagePath, colRange) => {
        const imageId = workbook.addImage({
          filename: imagePath,
          extension: "png",
          dimensions: { height: 100, width: 100 },
        });

        worksheet.addImage(imageId, {
          tl: { col: colRange[0], row: 0 },
          br: { col: colRange[1], row: 8 },
          editAs: "oneCell",
        });
      };

      addImageToWorksheet(hyderabadImagePath, [1, 2.7]);
      addImageToWorksheet(chetasImagePath, [8.7, 9]);

      const headers = [
        "DateTime",
        "Gagillapur\n Inflow Level\n (Feet)",
        "Gagillapur\n Inflow Discharge\n (Cusecs)",
        "Potour Inflow Level\n (Feet)",
        "Potour Inflow\n Discharge\n (Cusecs)",
        "Chintakunta LEVEL\n (Feet)",
        "Chintakunta DICH\n (Cusecs)",
        "Alugunuru Level\n (Feet)",
        "Alugunuru Discharge\n (Cusecs)",
        "Pond Level\n (Feet)",
      ];
      worksheet.addRow([]);

      worksheet.addRow(headers).eachCell((cell) => {
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
        cell.alignment = { horizontal: "center" };
      });

      lmdPondlevelGateReportsWithoutPagination.forEach((row) => {
        const rowData = [
          row.dateTime,
          row.inflow1Level,
          row.inflow1Discharge,
          row.inflow2Level,
          row.inflow2Discharge,
          row.inflow3Level,
          row.inflow3Discharge,
          row.damDownstreamLevel,
          row.damDownstreamDischarge,
          row.pondLevel,
        ];
        worksheet.addRow(rowData);
      });

      const dateTimeColumn = worksheet.getColumn(1);
      dateTimeColumn.numFmt = "yyyy-mm-dd hh:mm:ss";
      worksheet.getRow(3).height = 20;

      worksheet.columns.forEach((column) => {
        column.width = 20;
      });

      worksheet.mergeCells("A1:J8");
      const mergedCell = worksheet.getCell("A1");

      mergedCell.border = {
        top: { style: "thin", color: { argb: "FF000000" } }, // Top border
        left: { style: "thin", color: { argb: "FF000000" } }, // Left border
        bottom: { style: "thin", color: { argb: "FF000000" } }, // Bottom border
        right: { style: "thin", color: { argb: "FF000000" } }, // Right border
      };

      mergedCell.value = "LMD Dam Inflow Outflow Pond Level Report";
      mergedCell.alignment = { horizontal: "center", vertical: "middle" };
      mergedCell.font = { bold: true };
      mergedCell.font = { bold: true, size: 15 };
      worksheet.getRow(11).height = 30;

      worksheet.getRow(11).eachCell((cell) => {
        cell.font = { bold: true };
      });

      const borderStyle = {
        style: "thin", // You can change this to 'medium', 'thick', etc. as needed
        color: { argb: "FF000000" },
      };

      worksheet.getColumn("B").eachCell((cell) => {
        cell.border = {
          ...cell.border,
          left: borderStyle,
        };
      });

      ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M"].forEach(
        (column) => {
          worksheet.getColumn(column).eachCell((cell) => {
            cell.border = {
              ...cell.border,
              right: borderStyle,
            };
          });
        }
      );

      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=LMD_Dam_Inflow_Outflow_PondLevel_Report.xlsx"
      );

      await workbook.xlsx.write(res);
    }  else if (exportToExcel == 3) {
      const itemsPerPage = 25; // Number of dates to print per page
      const totalItems = lmdPondlevelGateReportsWithoutPagination.length; // Total number of dates
      const totalPages = Math.ceil(totalItems / itemsPerPage); // Calculate total pages needed

      const sections = [];
      for (let page = 0; page < totalPages; page++) {
        const startIndex = page * itemsPerPage;
        const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
        const pageData = lmdPondlevelGateReportsWithoutPagination.slice(
          startIndex,
          endIndex
        );

        sections.push({
          properties: {
            page: {
              margin: { top: 1500, right: 1000, bottom: 1000, left: 100 },
              size: {
                orientation: Docx.PageOrientation.PORTRAIT,
                width: 12240,
                height: 15840,
              },
            },
          },
          children: [
            // Add your images and heading here at the top of every page
            new Docx.Paragraph({
              children: [
                // Left image
                new Docx.ImageRun({
                  data: fs.readFileSync(hyderabadImagePath),
                  transformation: {
                    width: 140,
                    height: 105,
                  },
                  floating: {
                    horizontalPosition: {
                      relative: Docx.HorizontalPositionRelativeFrom.PAGE,
                      align: Docx.HorizontalPositionAlign.LEFT,
                    },
                    verticalPosition: {
                      relative: Docx.VerticalPositionRelativeFrom.PAGE,
                      align: Docx.VerticalPositionAlign.TOP,
                    },
                  },
                }),
                // Right image
                new Docx.ImageRun({
                  data: fs.readFileSync(chetasImagePath),
                  transformation: {
                    width: 80,
                    height: 110,
                  },
                  floating: {
                    horizontalPosition: {
                      relative: Docx.HorizontalPositionRelativeFrom.PAGE,
                      align: Docx.HorizontalPositionAlign.RIGHT,
                    },
                    verticalPosition: {
                      relative: Docx.VerticalPositionRelativeFrom.PAGE,
                      align: Docx.VerticalPositionAlign.TOP,
                    },
                  },
                }),
              ],
            }),
            // Heading
            new Docx.Paragraph({
              text: "LMD Dam Inflow Outflow Pond-Level Report",
              heading: Docx.HeadingLevel.HEADING_1,
              alignment: Docx.AlignmentType.CENTER,
            }),
            // Table
            new Docx.Table({
              width: { size: "109%", type: Docx.WidthType.PERCENTAGE },
              rows: [
                // Table header
                new Docx.TableRow({
                  children: [
                    new Docx.TableCell({
                      children: [new Docx.Paragraph("Date Time")],
                    }),
                    new Docx.TableCell({
                      children: [
                        new Docx.Paragraph("Gagillapur Inflow Level (Feet)"),
                      ],
                    }),
                    new Docx.TableCell({
                      children: [
                        new Docx.Paragraph(
                          "Gagillapur Inflow Discharge (Cusecs)"
                        ),
                      ],
                    }),
                    new Docx.TableCell({
                      children: [
                        new Docx.Paragraph("Potour Inflow Level (Feet)"),
                      ],
                    }),
                    new Docx.TableCell({
                      children: [
                        new Docx.Paragraph("Potour Inflow Discharge (Cusecs)"),
                      ],
                    }),
                    new Docx.TableCell({
                      children: [
                        new Docx.Paragraph("Chintakunta Level (Feet)"),
                      ],
                    }),
                    new Docx.TableCell({
                      children: [
                        new Docx.Paragraph("Chintakunta Discharge (Cusecs)"),
                      ],
                    }),
                    new Docx.TableCell({
                      children: [new Docx.Paragraph("Alugunuru Level (Feet)")],
                    }),
                    new Docx.TableCell({
                      children: [
                        new Docx.Paragraph("Alugunuru Discharge (Cusecs)"),
                      ],
                    }),
                    new Docx.TableCell({
                      children: [new Docx.Paragraph("Pond Level (Feet)")],
                    }),
                  ],
                }),
                // Table rows
                ...pageData.map((item) => {
                  const formattedDate = new Date(item.dateTime)
                    .toISOString()
                    .replace("T", "   T")
                    .slice(0, -8);
                  return new Docx.TableRow({
                    children: [
                      new Docx.TableCell({
                        children: [new Docx.Paragraph(formattedDate)],
                        width: { size: 12, type: Docx.WidthType.PERCENTAGE },
                      }),
                      new Docx.TableCell({
                        children: [
                          new Docx.Paragraph(item.inflow1Level.toFixed(2)),
                        ],
                      }),
                      new Docx.TableCell({
                        children: [
                          new Docx.Paragraph(item.inflow1Discharge.toFixed(2)),
                        ],
                      }),
                      new Docx.TableCell({
                        children: [
                          new Docx.Paragraph(item.inflow2Level.toFixed(2)),
                        ],
                      }),
                      new Docx.TableCell({
                        children: [
                          new Docx.Paragraph(item.inflow2Discharge.toFixed(2)),
                        ],
                      }),
                      new Docx.TableCell({
                        children: [
                          new Docx.Paragraph(item.inflow3Level.toFixed(2)),
                        ],
                      }),
                      new Docx.TableCell({
                        children: [
                          new Docx.Paragraph(item.inflow3Discharge.toFixed(2)),
                        ],
                      }),
                      new Docx.TableCell({
                        children: [
                          new Docx.Paragraph(
                            item.damDownstreamLevel.toFixed(2)
                          ),
                        ],
                      }),
                      new Docx.TableCell({
                        children: [
                          new Docx.Paragraph(
                            item.damDownstreamDischarge.toFixed(2)
                          ),
                        ],
                      }),
                      new Docx.TableCell({
                        children: [
                          new Docx.Paragraph(item.pondLevel.toFixed(2)),
                        ],
                      }),
                    ],
                  });
                }),
              ],
            }),
          ],
        });
      }

      const doc = new Docx.Document({
        sections: sections,
      });
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      );
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=LMD_Dam_Inflow_Outflow_PondLevel_Report.doc"
      );

      // Stream the Word document to the response
      const buffer = await Docx.Packer.toBuffer(doc);
      res.end(buffer);
    } else {
      res.send(lmdPondlevelGateReportsWithoutPagination);
    }
  } else {
    return "You are not authorized to access this data";
  }
  } catch (error) {
    console.error("Error:", error);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

const lmdGateParameterOverviewReportWp = async (
  startDate,
  endDate,
  intervalMinutes,
  exportToExcel,
  user,
  res,
  req
) => {
  try {

    const checkPermission = await Permission.findOne({ name: "lmdReport" });

    if (user.role === "admin" || user.role === "lmdSuperuser" || (checkPermission && checkPermission.roleName.includes(user.role)) ) {

    const pipelineWithoutPagination = [
      {
        $match: {
          dateTime: {
            $gt: new Date(startDate),
            $lte: new Date(
              new Date(endDate).setDate(new Date(endDate).getDate() + 1)
            ),
          },
        },
      },
      {
        $group: {
          _id: {
            interval: {
              $toDate: {
                $subtract: [
                  { $toLong: "$dateTime" },
                  {
                    $mod: [
                      { $toLong: "$dateTime" },
                      intervalMinutes * 60 * 1000,
                    ],
                  },
                ],
              },
            },
          },
          pondLevel: { $first: "$pondLevel" },
          liveCapacity: { $first: "$liveCapacity" },
          grossStorage: { $first: "$grossStorage" },
          fullReservoirLevel: { $first: "$fullReservoirLevel" },
          contourArea: { $first: "$contourArea" },
          catchmentArea: { $first: "$catchmentArea" },
          ayacutArea: { $first: "$ayacutArea" },
          filling: { $first: "$filling" },
          instantaneousGateDischarge: { $first: "$instantaneousGateDischarge" },
          instantaneousCanalDischarge: {
            $first: "$instantaneousCanalDischarge",
          },
          totalDamDischarge: { $first: "$totalDamDischarge" },
          cumulativeDamDischarge: { $first: "$cumulativeDamDischarge" },
        },
      },
      {
        $project: {
          _id: 0,
          dateTime: "$_id.interval",
          pondLevel: 1,
          liveCapacity: 1,
          grossStorage: 1,
          fullReservoirLevel: 1,
          contourArea: 1,
          catchmentArea: 1,
          ayacutArea: 1,
          filling: 1,
          instantaneousGateDischarge: 1,
          instantaneousCanalDischarge: 1,
          totalDamDischarge: 1,
          cumulativeDamDischarge: 1,
        },
      },
      {
        $sort: {
          dateTime: 1,
        },
      },
    ];

    const lmdGateParameterOverviewReportWithoutPagination =
      await LMD_POND_LEVEL_OVERVIEW.aggregate(pipelineWithoutPagination);

    if (exportToExcel == 1) {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet(
        "LMD Dam Paramete Overview Report"
      );

      const addImageToWorksheet = (imagePath, colRange) => {
        const imageId = workbook.addImage({
          filename: imagePath,
          extension: "png",
          dimensions: { height: 100, width: 100 },
        });

        worksheet.addImage(imageId, {
          tl: { col: colRange[0], row: 0 },
          br: { col: colRange[1], row: 8 },
          editAs: "oneCell",
        });
      };

      addImageToWorksheet(hyderabadImagePath, [1, 2.7]);
      addImageToWorksheet(chetasImagePath, [8.8, 9]);

      const headers = [
        "DateTime",
        "Pond Level (Feet)",
        "Live Capacity (MCFT)",
        "Gross Storage (MCFT)",
        "FullReserve Water (Feet)",
        "Contour Area ( M.SqFt.)",
        "Cathment Area (Sq.km)",
        "Ayucut Area (Acres)",
        "Filing Percentage (%)",
        "Inst. Gate Discharge(Cusecs)",
        "Inst. canal Discharge (Cusecs)",
        "Total Dam Discharge (Cusecs)",
        "Cumulative Dam Discharge (Cusecs)",
      ];
      worksheet.addRow([]);

      worksheet.addRow(headers).eachCell((cell) => {
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
        cell.alignment = { horizontal: "center" };
      });

      lmdGateParameterOverviewReportWithoutPagination.forEach((row) => {
        const rowData = [
          row.dateTime,
          row.pondLevel,
          row.liveCapacity,
          row.grossStorage,
          row.fullReservoirLevel,
          row.contourArea,
          row.catchmentArea,
          row.ayacutArea,
          row.filling,
          row.instantaneousGateDischarge,
          row.instantaneousCanalDischarge,
          row.totalDamDischarge,
          row.cumulativeDamDischarge,
        ];
        worksheet.addRow(rowData);
      });

      const dateTimeColumn = worksheet.getColumn(1);
      dateTimeColumn.numFmt = "yyyy-mm-dd hh:mm:ss";
      worksheet.getRow(3).height = 20;

      worksheet.columns.forEach((column) => {
        column.width = 20;
      });

      worksheet.mergeCells("A1:J8");
      const mergedCell = worksheet.getCell("A1");

      mergedCell.border = {
        top: { style: "thin", color: { argb: "FF000000" } }, // Top border
        left: { style: "thin", color: { argb: "FF000000" } }, // Left border
        bottom: { style: "thin", color: { argb: "FF000000" } }, // Bottom border
        right: { style: "thin", color: { argb: "FF000000" } }, // Right border
      };

      mergedCell.value = "LMD Dam Paramete Overview Report";
      mergedCell.alignment = { horizontal: "center", vertical: "middle" };
      mergedCell.font = { bold: true };
      mergedCell.font = { bold: true, size: 15 };
      worksheet.getRow(11).height = 30;

      worksheet.getRow(11).eachCell((cell) => {
        cell.font = { bold: true };
      });

      const borderStyle = {
        style: "thin", // You can change this to 'medium', 'thick', etc. as needed
        color: { argb: "FF000000" },
      };

      worksheet.getColumn("B").eachCell((cell) => {
        cell.border = {
          ...cell.border,
          left: borderStyle,
        };
      });

      ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M"].forEach(
        (column) => {
          worksheet.getColumn(column).eachCell((cell) => {
            cell.border = {
              ...cell.border,
              right: borderStyle,
            };
          });
        }
      );

      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=LMD_Dam_Parameter_Overview_Report.xlsx"
      );

      await workbook.xlsx.write(res);
    }else if (exportToExcel == 3) {
      const logoImagePath = path.join(__dirname, "../../views/hyderabad.png");
      const chetasImagePath = path.join(__dirname, "../../views/chetas.png");

      const itemsPerPage = 25; // Number of dates to print per page
      const totalItems = lmdGateParameterOverviewReportWithoutPagination.length; // Total number of dates
      const totalPages = Math.ceil(totalItems / itemsPerPage); // Calculate total pages needed

      const sections = [];
      for (let page = 0; page < totalPages; page++) {
        const startIndex = page * itemsPerPage;
        const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
        const pageData = lmdGateParameterOverviewReportWithoutPagination.slice(
          startIndex,
          endIndex
        );

        sections.push({
          properties: {
            page: {
              margin: { top: 1500, right: 1000, bottom: 1000, left: 100 },
              size: {
                orientation: Docx.PageOrientation.PORTRAIT,
                width: 12240,
                height: 15840,
              },
            },
          },
          children: [
            // Add your images and heading here at the top of every page
            new Docx.Paragraph({
              children: [
                // Left image
                new Docx.ImageRun({
                  data: fs.readFileSync(logoImagePath),
                  transformation: {
                    width: 140,
                    height: 105,
                  },
                  floating: {
                    horizontalPosition: {
                      relative: Docx.HorizontalPositionRelativeFrom.PAGE,
                      align: Docx.HorizontalPositionAlign.LEFT,
                    },
                    verticalPosition: {
                      relative: Docx.VerticalPositionRelativeFrom.PAGE,
                      align: Docx.VerticalPositionAlign.TOP,
                    },
                  },
                }),
                // Right image
                new Docx.ImageRun({
                  data: fs.readFileSync(chetasImagePath),
                  transformation: {
                    width: 80,
                    height: 110,
                  },
                  floating: {
                    horizontalPosition: {
                      relative: Docx.HorizontalPositionRelativeFrom.PAGE,
                      align: Docx.HorizontalPositionAlign.RIGHT,
                    },
                    verticalPosition: {
                      relative: Docx.VerticalPositionRelativeFrom.PAGE,
                      align: Docx.VerticalPositionAlign.TOP,
                    },
                  },
                }),
              ],
            }),

            // Heading
            new Docx.Paragraph({
              text: "LMD Dam Parameter Overview Report",
              heading: Docx.HeadingLevel.HEADING_1,
              alignment: Docx.AlignmentType.CENTER,
            }),

            // Table
            new Docx.Table({
              width: { size: "109%", type: Docx.WidthType.PERCENTAGE },
              rows: [
                // Table header
                new Docx.TableRow({
                  children: [
                    new Docx.TableCell({
                      children: [new Docx.Paragraph("Date Time")],
                    }),
                    new Docx.TableCell({
                      children: [new Docx.Paragraph("Pond Level (Feet)")],
                    }),
                    new Docx.TableCell({
                      children: [new Docx.Paragraph("Live Capacity (MCFT)")],
                    }),
                    new Docx.TableCell({
                      children: [new Docx.Paragraph("Gross Storage (MCFT)")],
                    }),
                    new Docx.TableCell({
                      children: [
                        new Docx.Paragraph("Full Reserve Water (Feet)"),
                      ],
                    }),
                    new Docx.TableCell({
                      children: [new Docx.Paragraph("Contour Area (M.SqFt)")],
                    }),
                    new Docx.TableCell({
                      children: [new Docx.Paragraph("Cathment Area (Sq.Km)")],
                    }),
                    new Docx.TableCell({
                      children: [new Docx.Paragraph("Ayucut Area (Acres)")],
                    }),
                    new Docx.TableCell({
                      children: [new Docx.Paragraph("Filing Percentage (%)")],
                    }),
                    new Docx.TableCell({
                      children: [
                        new Docx.Paragraph("Inst. Gate Discharge (Cusecs)"),
                      ],
                    }),
                    new Docx.TableCell({
                      children: [
                        new Docx.Paragraph("Inst. canal Discharge (Cusecs)"),
                      ],
                    }),
                    new Docx.TableCell({
                      children: [
                        new Docx.Paragraph("Total Dam Discharge (Cusecs)"),
                      ],
                    }),
                    new Docx.TableCell({
                      children: [
                        new Docx.Paragraph("Cumulative Dam Discharge (Cusecs)"),
                      ],
                    }),
                  ],
                }),

                // Table rows
                ...pageData.map((item) => {
                  const formattedDate = new Date(item.dateTime)
                    .toISOString()
                    .replace("T", "   T")
                    .slice(0, -8);
                  return new Docx.TableRow({
                    children: [
                      new Docx.TableCell({
                        children: [new Docx.Paragraph(formattedDate)],
                        width: { size: 12, type: Docx.WidthType.PERCENTAGE },
                      }),
                      new Docx.TableCell({
                        children: [
                          new Docx.Paragraph(item.pondLevel.toFixed(2)),
                        ],
                      }),
                      new Docx.TableCell({
                        children: [
                          new Docx.Paragraph(item.liveCapacity.toFixed(2)),
                        ],
                      }),
                      new Docx.TableCell({
                        children: [
                          new Docx.Paragraph(item.grossStorage.toFixed(2)),
                        ],
                      }),
                      new Docx.TableCell({
                        children: [
                          new Docx.Paragraph(
                            item.fullReservoirLevel.toFixed(2)
                          ),
                        ],
                      }),
                      new Docx.TableCell({
                        children: [
                          new Docx.Paragraph(item.contourArea.toFixed(2)),
                        ],
                      }),
                      new Docx.TableCell({
                        children: [
                          new Docx.Paragraph(item.catchmentArea.toFixed(2)),
                        ],
                      }),
                      new Docx.TableCell({
                        children: [
                          new Docx.Paragraph(item.ayacutArea.toFixed(2)),
                        ],
                      }),
                      new Docx.TableCell({
                        children: [new Docx.Paragraph(item.filling.toFixed(2))],
                      }),
                      new Docx.TableCell({
                        children: [
                          new Docx.Paragraph(
                            item.instantaneousGateDischarge.toFixed(2)
                          ),
                        ],
                      }),
                      new Docx.TableCell({
                        children: [
                          new Docx.Paragraph(
                            item.instantaneousCanalDischarge.toFixed(2)
                          ),
                        ],
                      }),
                      new Docx.TableCell({
                        children: [
                          new Docx.Paragraph(item.totalDamDischarge.toFixed(2)),
                        ],
                      }),
                      new Docx.TableCell({
                        children: [
                          new Docx.Paragraph(
                            item.cumulativeDamDischarge.toFixed(2)
                          ),
                        ],
                      }),
                    ],
                  });
                }),
              ],
            }),
          ],
        });
      }

      const doc = new Docx.Document({
        sections: sections,
      });
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      );
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=LMD_Dam_Parameter_Overview_Report.doc"
      );

      const buffer = await Docx.Packer.toBuffer(doc);
      res.end(buffer);
    }else {
      res.send(lmdGateParameterOverviewReportWithoutPagination);
    }
  } else {
    return "You are not authorized to access this data";
  }
  } catch (error) {
    console.error("Error:", error);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

const lmdGateReportWp = async (
  startDate,
  endDate,
  intervalMinutes,
  exportToExcel,
  user,
  res,
  req
) => {
  try {

    const checkPermission = await Permission.findOne({ name: "lmdReport" });
    if (user.role === "admin" || user.role === "lmdSuperuser" || (checkPermission && checkPermission.roleName.includes(user.role)) ) {

    const pipelineWithoutPagination = [
      {
        $match: {
          dateTime: {
            $gt: new Date(startDate),
            $lte: new Date(
              new Date(endDate).setDate(new Date(endDate).getDate() + 1)
            ),
          },
        },
      },
      {
        $group: {
          _id: {
            interval: {
              $toDate: {
                $subtract: [
                  { $toLong: "$dateTime" },
                  {
                    $mod: [
                      { $toLong: "$dateTime" },
                      intervalMinutes * 60 * 1000,
                    ],
                  },
                ],
              },
            },
          },

          hrrGate1Position: { $first: "$hrrGate1Position" },
          hrrGate2Position: { $first: "$hrrGate2Position" },
        },
      },
      {
        $project: {
          _id: 0,
          dateTime: "$_id.interval",
          hrrGate1Position: 1,
          hrrGate2Position: 1,
        },
      },
      {
        $sort: {
          dateTime: 1,
        },
      },
    ];

    const pipeline1WithoutPagination = [
      {
        $match: {
          dateTime: {
            $gt: new Date(startDate),
            $lte: new Date(
              new Date(endDate).setDate(new Date(endDate).getDate() + 1)
            ),
          },
        },
      },
      {
        $group: {
          _id: {
            interval: {
              $toDate: {
                $subtract: [
                  { $toLong: "$dateTime" },
                  {
                    $mod: [
                      { $toLong: "$dateTime" },
                      intervalMinutes * 60 * 1000,
                    ],
                  },
                ],
              },
            },
          },

          hrrGate1Discharge: { $first: "$hrrGate1Discharge" },
          hrrGate2Discharge: { $first: "$hrrGate2Discharge" },
        },
      },
      {
        $project: {
          _id: 0,
          dateTime: "$_id.interval",
          hrrGate1Discharge: 1,
          hrrGate2Discharge: 1,
        },
      },
      {
        $sort: {
          dateTime: 1,
        },
      },
    ];

    const lmdGateReportPosWithoutPagination =
      await LMD_HR_DAM_OVERVIEW_POS.aggregate(pipelineWithoutPagination);
    const lmdGateReportDisWithoutPagination =
      await LMD_HR_DAM_OVERVIEW_DICH.aggregate(pipeline1WithoutPagination);
    let posDataWithoutPagination = lmdGateReportPosWithoutPagination || [];
    let disDataWithoutPagination = lmdGateReportDisWithoutPagination || [];
    let minLengthWithoutPagination = Math.max(
      posDataWithoutPagination.length,
      disDataWithoutPagination.length
    );

    // Merge data arrays based on index position
    let mergedDataWithoutPagination = Array.from(
      { length: minLengthWithoutPagination },
      (_, index) => ({
        hrrGate1Position:
          posDataWithoutPagination[index]?.hrrGate1Position || 0,
        hrrGate2Position:
          posDataWithoutPagination[index]?.hrrGate2Position || 0,
        hrrGate1Discharge:
          disDataWithoutPagination[index]?.hrrGate1Discharge || 0,
        hrrGate2Discharge:
          disDataWithoutPagination[index]?.hrrGate2Discharge || 0,
        totalDischarge:
          disDataWithoutPagination[index]?.hrrGate1Discharge +
          disDataWithoutPagination[index]?.hrrGate2Discharge,
        dateTime:
          posDataWithoutPagination[index]?.dateTime ||
          disDataWithoutPagination[index]?.dateTime ||
          null,
      })
    );

    if (exportToExcel == 1) {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("LMD HR Gate Report");

      const addImageToWorksheet = (imagePath, colRange) => {
        const imageId = workbook.addImage({
          filename: imagePath,
          extension: "png",
          dimensions: { height: 100, width: 100 },
        });

        worksheet.addImage(imageId, {
          tl: { col: colRange[0], row: 0 },
          br: { col: colRange[1], row: 8 },
          editAs: "oneCell",
        });
      };

      addImageToWorksheet(hyderabadImagePath, [1, 2]);
      addImageToWorksheet(chetasImagePath, [4.9, 5]);

      const headers = [
        "DateTime",
        "Gate 1 Opening (Feet)",
        "Gate 1 Discharge (C/S)",
        "Gate 2 Opening (Feet)",
        "Gate 2 Discharge (C/S)",
        "Total Discharge (C/S)",
      ];

      worksheet.addRows([[], headers]);
      worksheet.addRow(headers);

      // Apply border to all sides of the cell
      worksheet.addRow(headers).eachCell((cell) => {
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
        cell.alignment = { horizontal: "center" };
      });

      mergedDataWithoutPagination.forEach((row) => {
        const rowData = [
          row.dateTime,
          row.hrrGate1Position,
          row.hrrGate1Discharge,
          row.hrrGate2Position,
          row.hrrGate2Discharge,
          row.totalDischarge,
        ];
        worksheet.addRow(rowData);
      });

      const dateTimeColumn = worksheet.getColumn(1);
      dateTimeColumn.numFmt = "yyyy-mm-dd hh:mm:ss";
      worksheet.getRow(3).height = 20;

      worksheet.columns.forEach((column) => {
        column.width = 25;
      });

      worksheet.mergeCells("A1:F8");
      const mergedCell = worksheet.getCell("A1");

      mergedCell.border = {
        top: { style: "thin", color: { argb: "FF000000" } }, // Top border
        left: { style: "thin", color: { argb: "FF000000" } }, // Left border
        bottom: { style: "thin", color: { argb: "FF000000" } }, // Bottom border
        right: { style: "thin", color: { argb: "FF000000" } }, // Right border
      };

      mergedCell.value = "LMD HR Gate Report";
      mergedCell.alignment = { horizontal: "center", vertical: "middle" };
      mergedCell.font = { bold: true };
      mergedCell.font = { bold: true, size: 15 };
      worksheet.getRow(13).height = 30;

      worksheet.getRow(13).eachCell((cell) => {
        cell.font = { bold: true };
      });

      const borderStyle = {
        style: "thin", // You can change this to 'medium', 'thick', etc. as needed
        color: { argb: "FF000000" },
      };

      // Apply border to the right side of column B
      worksheet.getColumn("B").eachCell((cell) => {
        cell.border = {
          ...cell.border,
          left: borderStyle,
        };
      });

      // Apply border to the left side of column
      ["B", "C", "D", "E", "F"].forEach((column) => {
        worksheet.getColumn(column).eachCell((cell) => {
          cell.border = {
            ...cell.border,
            right: borderStyle,
          };
        });
      });

      const mergedCellA11B12 = worksheet.getCell("A11");
      mergedCellA11B12.alignment = { horizontal: "center", vertical: "middle" };
      mergedCellA11B12.font = { bold: true };
      mergedCellA11B12.value = "Date-Time";
      worksheet.mergeCells("A11:A13");
      applyBorder(mergedCellA11B12);

      const mergedCellB11C12 = worksheet.getCell("B11");
      mergedCellB11C12.alignment = { horizontal: "center", vertical: "middle" };
      mergedCellB11C12.font = { bold: true };
      mergedCellB11C12.value = "Gate 1";
      worksheet.mergeCells("B11:C12");
      applyBorder(mergedCellB11C12);

      const mergedCellD11E12 = worksheet.getCell("D11");
      mergedCellD11E12.alignment = { horizontal: "center", vertical: "middle" };
      mergedCellD11E12.font = { bold: true };
      mergedCellD11E12.value = "Gate 2";
      worksheet.mergeCells("D11:E12");
      applyBorder(mergedCellD11E12);

      const mergedCellF11G12 = worksheet.getCell("F11");
      mergedCellF11G12.alignment = { horizontal: "center", vertical: "middle" };
      mergedCellF11G12.font = { bold: true };
      mergedCellF11G12.value = "Total Discharge (C/S)";
      worksheet.mergeCells("F11:F13");
      applyBorder(mergedCellF11G12);

      function applyBorder(cell) {
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      }

      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=LMD_HR_Gate_Report.xlsx"
      );

      await workbook.xlsx.write(res);
    }else if (exportToExcel == 3) {
      const logoImagePath = path.join(__dirname, "../../views/hyderabad.png");
      const chetasImagePath = path.join(__dirname, "../../views/chetas.png");

      const itemsPerPage = 25;
      const totalItems = mergedDataWithoutPagination.length;
      const totalPages = Math.ceil(totalItems / itemsPerPage);

      const sections = [];
      for (let page = 0; page < totalPages; page++) {
        const startIndex = page * itemsPerPage;
        const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
        const pageData = mergedDataWithoutPagination.slice(
          startIndex,
          endIndex
        );

        sections.push({
          properties: {
            page: {
              margin: { top: 1500, right: 1000, bottom: 1000, left: 100 },
              size: {
                orientation: Docx.PageOrientation.PORTRAIT,
                width: 12240,
                height: 15840,
              },
            },
          },
          children: [
            // Add your images and heading here at the top of every page
            new Docx.Paragraph({
              children: [
                // Left image
                new Docx.ImageRun({
                  data: fs.readFileSync(logoImagePath),
                  transformation: {
                    width: 140,
                    height: 105,
                  },
                  floating: {
                    horizontalPosition: {
                      relative: Docx.HorizontalPositionRelativeFrom.PAGE,
                      align: Docx.HorizontalPositionAlign.LEFT,
                    },
                    verticalPosition: {
                      relative: Docx.VerticalPositionRelativeFrom.PAGE,
                      align: Docx.VerticalPositionAlign.TOP,
                    },
                  },
                }),
                // Right image
                new Docx.ImageRun({
                  data: fs.readFileSync(chetasImagePath),
                  transformation: {
                    width: 80,
                    height: 110,
                  },
                  floating: {
                    horizontalPosition: {
                      relative: Docx.HorizontalPositionRelativeFrom.PAGE,
                      align: Docx.HorizontalPositionAlign.RIGHT,
                    },
                    verticalPosition: {
                      relative: Docx.VerticalPositionRelativeFrom.PAGE,
                      align: Docx.VerticalPositionAlign.TOP,
                    },
                  },
                }),
              ],
            }),

            // Heading
            new Docx.Paragraph({
              text: "LMD HR canal Gate Report",
              heading: Docx.HeadingLevel.HEADING_1,
              alignment: Docx.AlignmentType.CENTER,
            }),

            // Table
            new Docx.Table({
              width: { size: "109%", type: Docx.WidthType.PERCENTAGE },
              rows: [
                // Table header
                new Docx.TableRow({
                  children: [
                    new Docx.TableCell({
                      children: [new Docx.Paragraph("Date Time")],
                    }),
                    new Docx.TableCell({
                      children: [new Docx.Paragraph("Gete 1 Opening (Feet)")],
                    }),
                    new Docx.TableCell({
                      children: [new Docx.Paragraph("Gate 1 Discharge (C/S)")],
                    }),
                    new Docx.TableCell({
                      children: [new Docx.Paragraph("Gete 2 Opening (Feet)")],
                    }),
                    new Docx.TableCell({
                      children: [new Docx.Paragraph("Gate 2 Discharge (C/S)")],
                    }),
                    new Docx.TableCell({
                      children: [new Docx.Paragraph("Total Discharge(C/S)")],
                    }),
                  ],
                }),

                // Table rows
                ...pageData.map((item) => {
                  const formattedDate = new Date(item.dateTime)
                    .toISOString()
                    .replace("T", "   T")
                    .slice(0, -8);
                  return new Docx.TableRow({
                    children: [
                      new Docx.TableCell({
                        children: [new Docx.Paragraph(formattedDate)],
                        width: { size: 12, type: Docx.WidthType.PERCENTAGE },
                      }),
                      new Docx.TableCell({
                        children: [
                          new Docx.Paragraph(item.hrrGate1Position.toFixed(2)),
                        ],
                      }),
                      new Docx.TableCell({
                        children: [
                          new Docx.Paragraph(item.hrrGate1Discharge.toFixed(2)),
                        ],
                      }),
                      new Docx.TableCell({
                        children: [
                          new Docx.Paragraph(item.hrrGate2Position.toFixed(2)),
                        ],
                      }),
                      new Docx.TableCell({
                        children: [
                          new Docx.Paragraph(item.hrrGate2Discharge.toFixed(2)),
                        ],
                      }),
                      new Docx.TableCell({
                        children: [
                          new Docx.Paragraph(item.totalDischarge.toFixed(2)),
                        ],
                      }),
                    ],
                  });
                }),
              ],
            }),
          ],
        });
      }

      const doc = new Docx.Document({
        sections: sections,
      });
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      );
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=LMD_HR_Gat_Report.doc"
      );

      const buffer = await Docx.Packer.toBuffer(doc);
      res.end(buffer);
    } else {
      res.send(mergedDataWithoutPagination);
    }
  } else {
    return "You are not authorized to access this data";
  }
  } catch (error) {
    console.error("Error:", error);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

module.exports = {
  createSalientFeature,
  getSalientFeature,
  getLastDataLmdDamOverview,
  getLastDataLmdDamSpareAdvm,
  lmdDischargeGateReport,
  lmdOpeningGateReport,
  lmdPondlevelGateReport,
  lmdGateParameterOverviewReport,
  lmdGateReport,
  sevenDayReport,

  //Report Download
  lmdDischargeGateReportWp,
  lmdOpeningGateReportWp,
  lmdPondlevelGateReportWp,
  lmdGateParameterOverviewReportWp,
  lmdGateReportWp,
};
