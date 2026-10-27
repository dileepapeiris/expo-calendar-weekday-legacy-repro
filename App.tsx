import * as Calendar from 'expo-calendar/legacy';
import { useEffect, useState } from 'react';
import { Button, ScrollView, StyleSheet, Text, View } from 'react-native';

// Repro for https://github.com/expo/expo/issues/52319 with the legacy API.
// For every documented DayOfTheWeek value (Sunday = 1 ... Saturday = 7) create a weekly
// event, read the rule back, and check which weekday the first occurrence lands on.

const NAMES = ['', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

type Row = { sent: number; got: number | undefined; lands: string; ok: boolean };

async function runCheck(): Promise<Row[]> {
  const { status } = await Calendar.requestCalendarPermissionsAsync();
  if (status !== 'granted') {
    throw new Error('calendar permission not granted');
  }
  const calendar = await Calendar.getDefaultCalendarAsync();
  const rows: Row[] = [];
  for (let sent = 1; sent <= 7; sent++) {
    const start = new Date('2026-11-01T10:00:00'); // a Sunday
    const end = new Date('2026-11-01T11:00:00');
    const id = await Calendar.createEventAsync(calendar.id, {
      title: `test test ${NAMES[sent]}`,
      startDate: start,
      endDate: end,
      recurrenceRule: {
        frequency: Calendar.Frequency.WEEKLY,
        interval: 1,
        daysOfTheWeek: [{ dayOfTheWeek: sent, weekNumber: 0 }],
      },
    });
    const event = await Calendar.getEventAsync(id);
    const got = event.recurrenceRule?.daysOfTheWeek?.[0]?.dayOfTheWeek;
    // The week after the start date (Mon 11/02 .. Sun 11/08) holds exactly one occurrence,
    // on the weekday EventKit really stored. The start date itself (Sun 11/01) is outside it.
    const occurrences = await Calendar.getEventsAsync(
      [calendar.id],
      new Date('2026-11-02T00:00:00'),
      new Date('2026-11-09T00:00:00')
    );
    const mine = occurrences.filter((e) => e.title === `test test ${NAMES[sent]}`);
    const lands = mine
      .map((e) => new Date(e.startDate).toLocaleDateString('en-US', { weekday: 'long' }))
      .join(', ');
    rows.push({ sent, got, lands, ok: got === sent && lands === NAMES[sent] });
  }
}
