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
}
