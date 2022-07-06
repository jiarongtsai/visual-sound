import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import calendar from "dayjs/plugin/calendar";

dayjs.extend(relativeTime);
dayjs.extend(calendar);

export const getReadableTime = (timestamp) => {
  const cur = Math.floor(Date.now() / 1000);
  const base = (cur - timestamp) / 86400;
  if (base < 1) {
    return dayjs.unix(timestamp).fromNow();
  }
  return dayjs.unix(timestamp).calendar();
};

export const getDetailTime = (timestamp) => {
  return dayjs.unix(timestamp).format("MMM D, YYYY h:mm A");
};
