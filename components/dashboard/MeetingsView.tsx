"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Mic, Clock, Users, ChevronDown, CheckCircle2 } from "lucide-react";
import { MEETINGS } from "@/lib/dashboard-data";
import { cn } from "@/lib/utils";

export function MeetingsView() {
  const [openId, setOpenId] = useState<string | null>(MEETINGS[0]?.id ?? null);

  return (
    <div className="px-4 py-8 md:px-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold text-white">Meeting Notes</h1>
        <p className="text-sm text-muted">
          Every call, transcribed, summarized, and linked to the work it affects.
        </p>
      </div>

      <div className="mt-6 space-y-3">
        {MEETINGS.map((meeting) => {
          const isOpen = openId === meeting.id;
          return (
            <div
              key={meeting.id}
              className="overflow-hidden rounded-xl border border-white/[0.07] bg-white/[0.02]"
            >
              <button
                onClick={() => setOpenId(isOpen ? null : meeting.id)}
                className="flex w-full items-center justify-between gap-4 p-5 text-left"
              >
                <div className="flex items-center gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent ring-1 ring-accent/20">
                    <Mic className="h-[18px] w-[18px]" strokeWidth={1.75} />
                  </span>
                  <div>
                    <div className="text-sm font-medium text-white">{meeting.title}</div>
                    <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-2">
                      <span>{meeting.date}</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {meeting.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" /> {meeting.attendees.length} attendees
                      </span>
                    </div>
                  </div>
                </div>
                <ChevronDown
                  className={cn("h-4 w-4 shrink-0 text-muted-2 transition-transform duration-300", isOpen && "rotate-180")}
                />
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="border-t border-white/[0.06] px-5 pb-5 pt-4">
                      <p className="text-sm leading-relaxed text-muted">{meeting.summary}</p>

                      <div className="mt-4 flex flex-wrap gap-2">
                        {meeting.attendees.map((name) => (
                          <span
                            key={name}
                            className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-muted"
                          >
                            {name}
                          </span>
                        ))}
                      </div>

                      <div className="mt-5">
                        <h4 className="text-xs font-medium uppercase tracking-wider text-muted-2">
                          Action items
                        </h4>
                        <ul className="mt-2.5 space-y-2">
                          {meeting.actionItems.map((item) => (
                            <li key={item} className="flex items-start gap-2.5 text-sm text-white/85">
                              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" strokeWidth={1.75} />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
