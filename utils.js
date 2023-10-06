const fs = require("fs").promises;
const path = require("path");

const { rejects } = require("assert");

exports.getAdjustedTimeStamp = function () {
  return new Promise(async (resolve, reject) => {
    try {
      const latestTimestamp = await getLatestTimestamp();
      const existingDuration = await getAdjustment();
      const adjustedTimeStamp = latestTimestamp + existingDuration;
      resolve(adjustedTimeStamp);
    } catch (err) {
      reject(err);
    }
  });
};

exports.getLatestTimestamp = function () {
  return new Promise(async (resolve, reject) => {
    try {
      const filePath = path.join(__dirname, "timestamps.txt");
      const data = await fs.readFile(filePath, "utf-8");
      const timestamps = data.trim().split("\n");
      const latestTimestamp = timestamps[timestamps.length - 1];
      console.log("getting timestamp");
      console.log(latestTimestamp);
      resolve(latestTimestamp);
    } catch (err) {
      reject(err);
    }
  });
};

exports.getAdjustment = function () {
  return new Promise(async (resolve, reject) => {
    try {
      const filePath = path.join(__dirname, "accumulatedDuration.txt");
      const data = await fs.readFile(filePath, "utf-8");
      const timestamps = data.trim().split("\n");
      const latestTimestamp = timestamps[timestamps.length - 1];
      resolve(latestTimestamp);
    } catch (err) {
      reject(err);
    }
  });
};

exports.clearFile = function (filePath) {
  return new Promise(async (resolve, reject) => {
    console.log("clearing files");
    fs.writeFile(filePath, "", (err) => {
      if (err) {
        console.error("Error deleting lines in the file:", err);
        reject(err);
      } else {
        console.log("All lines deleted successfully.");
        resolve(filePath);
      }
    });
  });
};
