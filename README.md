# expo-calendar: `dayOfTheWeek` is stored one weekday late on iOS (legacy API)

Reproduction for https://github.com/expo/expo/issues/52319 with the legacy `expo-calendar/legacy`
functions. The class-based twin of this repo is
https://github.com/dileepapeiris/expo-calendar-weekday-class-repro.

Versions: Expo SDK 58, `expo-calendar` 58.0.6, React Native 0.88, iOS 26.5 simulator (iPhone 17).

## Run

```sh
npm install
npx expo run:ios      # development build, iOS simulator
```

Grant calendar access when asked. The check runs on launch, the **test test** button runs it again.

## What the app does

For every value of the documented `DayOfTheWeek` enum (`Sunday = 1` … `Saturday = 7`) it

1. calls `createEventAsync` with a weekly `recurrenceRule` whose `daysOfTheWeek` is that value,
   starting on Sunday 11/01/26,
2. reads the event back with `getEventAsync` and prints `daysOfTheWeek[0].dayOfTheWeek`,
3. lists the following week (Mon 11/02 … Sun 11/08) with `getEventsAsync` and prints the weekday the
   single occurrence lands on,
4. deletes the event again.

