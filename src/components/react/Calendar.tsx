import { Temporal } from "@js-temporal/polyfill";
import "../../assets/styles/calendar.css";
import { useEffect, useState } from "react";

// interface CalendarProps {
//   year?: number;
//   month?: number; // 1-12
//   events?: Record<string, string>;
// }

const weekdays = [
  { full: "Monday", short: "Mon" },
  { full: "Tuesday", short: "Tue" },
  { full: "Wednesday", short: "Wed" },
  { full: "Thursday", short: "Thu" },
  { full: "Friday", short: "Fri" },
  { full: "Saturday", short: "Sat" },
  { full: "Sunday", short: "Sun" },
] as const;

// export default function Calendar({
//   year = Temporal.Now.plainDateISO().year,
//   month = Temporal.Now.plainDateISO().month,
//   events = {},
// }: CalendarProps) 
export default function Calendar(){
  const [events, setEvents] = useState<Record<string, string>>({});
  const year = Temporal.Now.plainDateISO().year;
  const [month, setMonth] = useState(Temporal.Now.plainDateISO().month);

  useEffect(() => {
    fetch("https://events-api.services-a57.workers.dev/events")
    .then(res => res.json())
    .then(data => {
      setEvents(data.events);
      setMonth(data.month);
    });
  }, []);

  const firstDay = Temporal.PlainDate.from({
    year,
    month,
    day: 1,
  });

  const monthName = firstDay.toLocaleString("en", {
    month: "long",
  });

  const cells: (Temporal.PlainDate | null)[] = [];

  // Monday-first calendar
  for (let i = 0; i < firstDay.dayOfWeek - 1; i++) {
    cells.push(null);
  }

  for (let day = 1; day <= firstDay.daysInMonth; day++) {
    cells.push(
      Temporal.PlainDate.from({
        year,
        month,
        day,
      })
    );
  }

  while (cells.length % 7 !== 0) {
    cells.push(null);
  }

  const weeks: (Temporal.PlainDate | null)[][] = [];

  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }

  return (
    <>
      <h2 className="calendar-title">
        {monthName} {year}
      </h2>

      <table className="calendar">
        <thead>
          <tr>
            {weekdays.map((weekday) => (
              <th key={weekday.full}>
                <span className="desktop">{weekday.full}</span>
                <span className="mobile">{weekday.short}</span>
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {weeks.map((week, weekIndex) => (
            <tr key={weekIndex}>
              {week.map((date, dayIndex) => {
                if (!date) {
                  return <td key={dayIndex} className="empty" />;
                }

                const iso = date.toString();
                const event = events[iso];

                if (!event) {
                  return (
                    <td key={iso}>
                      <div className="day-number">{date.day}</div>
                    </td>
                  );
                }

                const popoverId = `event-${iso}`;

                return (
                  <td key={iso}>
                    <div className="day-number">{date.day}</div>

                    {/* Updated to popoverTarget */}
                    <button
                      type="button"
                      className="event-button"
                      popoverTarget={popoverId}
                    >
                      {event}
                    </button>

                    {/* Added onToggle to prevent event bubbling issues */}
                    <div
                      id={popoverId}
                      popover="auto"
                      className="event-popover"
                      onToggle={(e) => e.stopPropagation()}
                    >
                      <h3>{iso}</h3>
                      <p>{event}</p>

                      {/* Updated to popoverTarget & Action */}
                      <button
                        type="button"
                        popoverTarget={popoverId}
                        popoverTargetAction="hide"
                        className="close-button"
                      >
                        Close
                      </button>
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}