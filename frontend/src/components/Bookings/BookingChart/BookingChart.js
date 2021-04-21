import React from "react";

import { Bar } from "react-chartjs";

const BOOKING_BUCKETS = {
  Cheap: {
    min: 0,
    max: 100,
  },
  Normal: {
    min: 100,
    max: 200,
  },
  Expensive: {
    min: 200,
    max: 10000000,
  },
};

const bookingChart = (props) => {
  const chartData = { labels: [], datasets: [] };
  let values = [];
  for (const bucket in BOOKING_BUCKETS) {
    const filteredBookingsCount = props.bookings.reduce((prev, current) => {
      if (
        current.event.price > BOOKING_BUCKETS[bucket].min &&
        current.event.price < BOOKING_BUCKETS[bucket].max
      ) {
        return prev + 1;
      } else {
        return prev;
      }
    }, 0);
    // output[bucket] = filteredBookingsCount;
    values.push(filteredBookingsCount);
    chartData.labels.push(bucket);
    chartData.datasets.push({
      fillColor: "rgba(220, 220, 220, 0.5)",
      strokeColor: "rgba(220, 220, 220, 0.8)",
      highlightFill: "rgba(220, 220, 220, 0.75)",
      highlightStroke: "rgba(220, 220, 220, 1)",
      data: values,
    });
    values = [...values];
    values[values.length - 1] = 0;
  }

  return (
    <div style={{ textAlign: "center" }}>
      <Bar data={chartData} />
    </div>
  );
};

export default bookingChart;
