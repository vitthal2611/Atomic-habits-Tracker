import { useState, useEffect, useCallback } from 'react';

const SAMPLE_HABITS = [
  { 
    id: 1, 
    name: 'Drink 8 glasses of water', 
    icon: '💧', 
    identity: 'I am someone who stays hydrated', 
    cue: 'After I wake up', 
    reward: 'I feel refreshed and energized', 
    twoMinuteVersion: 'Fill a glass with water', 
    startDate: '2024-10-01T00:00:00.000Z', 
    frequency: 'daily', 
    daily: [
      { key: 'Tue Oct 01 2024', completed: true, count: 1 },
      { key: 'Wed Oct 02 2024', completed: true, count: 1 },
      { key: 'Thu Oct 03 2024', completed: false, count: 0 },
      { key: 'Fri Oct 04 2024', completed: true, count: 1 },
      { key: 'Sat Oct 05 2024', completed: true, count: 1 },
      { key: 'Sun Oct 06 2024', completed: true, count: 1 },
      { key: 'Mon Oct 07 2024', completed: true, count: 1 },
      { key: 'Tue Oct 08 2024', completed: false, count: 0 },
      { key: 'Wed Oct 09 2024', completed: true, count: 1 },
      { key: 'Thu Oct 10 2024', completed: true, count: 1 },
      { key: 'Fri Oct 11 2024', completed: true, count: 1 },
      { key: 'Sat Oct 12 2024', completed: false, count: 0 },
      { key: 'Sun Oct 13 2024', completed: true, count: 1 },
      { key: 'Mon Oct 14 2024', completed: true, count: 1 },
      { key: 'Tue Oct 15 2024', completed: true, count: 1 },
      { key: 'Wed Oct 16 2024', completed: false, count: 0 },
      { key: 'Thu Oct 17 2024', completed: true, count: 1 },
      { key: 'Fri Oct 18 2024', completed: true, count: 1 },
      { key: 'Sat Oct 19 2024', completed: true, count: 1 },
      { key: 'Sun Oct 20 2024', completed: false, count: 0 },
      { key: 'Mon Oct 21 2024', completed: true, count: 1 },
      { key: 'Tue Oct 22 2024', completed: true, count: 1 },
      { key: 'Wed Oct 23 2024', completed: true, count: 1 },
      { key: 'Thu Oct 24 2024', completed: true, count: 1 },
      { key: 'Fri Oct 25 2024', completed: false, count: 0 },
      { key: 'Sat Oct 26 2024', completed: true, count: 1 },
      { key: 'Sun Oct 27 2024', completed: true, count: 1 },
      { key: 'Mon Oct 28 2024', completed: true, count: 1 },
      { key: 'Tue Oct 29 2024', completed: false, count: 0 },
      { key: 'Wed Oct 30 2024', completed: true, count: 1 },
      { key: 'Thu Oct 31 2024', completed: true, count: 1 }
    ]
  },
  { 
    id: 2, 
    name: 'Morning workout', 
    icon: '🏃', 
    identity: 'I am someone who prioritizes fitness', 
    cue: 'After I have breakfast', 
    reward: 'I feel energized all day', 
    twoMinuteVersion: 'Put on workout clothes', 
    startDate: '2024-10-01T00:00:00.000Z', 
    frequency: 'daily', 
    daily: [
      { key: 'Tue Oct 01 2024', completed: true, count: 1 },
      { key: 'Wed Oct 02 2024', completed: true, count: 1 },
      { key: 'Thu Oct 03 2024', completed: true, count: 1 },
      { key: 'Fri Oct 04 2024', completed: false, count: 0 },
      { key: 'Sat Oct 05 2024', completed: true, count: 1 },
      { key: 'Sun Oct 06 2024', completed: false, count: 0 },
      { key: 'Mon Oct 07 2024', completed: true, count: 1 },
      { key: 'Tue Oct 08 2024', completed: true, count: 1 },
      { key: 'Wed Oct 09 2024', completed: true, count: 1 },
      { key: 'Thu Oct 10 2024', completed: false, count: 0 },
      { key: 'Fri Oct 11 2024', completed: true, count: 1 },
      { key: 'Sat Oct 12 2024', completed: true, count: 1 },
      { key: 'Sun Oct 13 2024', completed: false, count: 0 },
      { key: 'Mon Oct 14 2024', completed: true, count: 1 },
      { key: 'Tue Oct 15 2024', completed: true, count: 1 },
      { key: 'Wed Oct 16 2024', completed: true, count: 1 },
      { key: 'Thu Oct 17 2024', completed: false, count: 0 },
      { key: 'Fri Oct 18 2024', completed: true, count: 1 },
      { key: 'Sat Oct 19 2024', completed: true, count: 1 },
      { key: 'Sun Oct 20 2024', completed: true, count: 1 },
      { key: 'Mon Oct 21 2024', completed: false, count: 0 },
      { key: 'Tue Oct 22 2024', completed: true, count: 1 },
      { key: 'Wed Oct 23 2024', completed: true, count: 1 },
      { key: 'Thu Oct 24 2024', completed: true, count: 1 },
      { key: 'Fri Oct 25 2024', completed: true, count: 1 },
      { key: 'Sat Oct 26 2024', completed: false, count: 0 },
      { key: 'Sun Oct 27 2024', completed: true, count: 1 },
      { key: 'Mon Oct 28 2024', completed: true, count: 1 },
      { key: 'Tue Oct 29 2024', completed: true, count: 1 },
      { key: 'Wed Oct 30 2024', completed: false, count: 0 },
      { key: 'Thu Oct 31 2024', completed: true, count: 1 }
    ]
  },
  { 
    id: 3, 
    name: 'Read for 30 minutes', 
    icon: '📚', 
    identity: 'I am someone who values learning', 
    cue: 'After dinner', 
    reward: 'I expand my knowledge', 
    twoMinuteVersion: 'Open a book', 
    startDate: '2024-10-01T00:00:00.000Z', 
    frequency: 'daily', 
    daily: [
      { key: 'Tue Oct 01 2024', completed: true, count: 1 },
      { key: 'Wed Oct 02 2024', completed: false, count: 0 },
      { key: 'Thu Oct 03 2024', completed: true, count: 1 },
      { key: 'Fri Oct 04 2024', completed: true, count: 1 },
      { key: 'Sat Oct 05 2024', completed: true, count: 1 },
      { key: 'Sun Oct 06 2024', completed: true, count: 1 },
      { key: 'Mon Oct 07 2024', completed: false, count: 0 },
      { key: 'Tue Oct 08 2024', completed: true, count: 1 },
      { key: 'Wed Oct 09 2024', completed: true, count: 1 },
      { key: 'Thu Oct 10 2024', completed: true, count: 1 },
      { key: 'Fri Oct 11 2024', completed: false, count: 0 },
      { key: 'Sat Oct 12 2024', completed: true, count: 1 },
      { key: 'Sun Oct 13 2024', completed: true, count: 1 },
      { key: 'Mon Oct 14 2024', completed: true, count: 1 },
      { key: 'Tue Oct 15 2024', completed: true, count: 1 },
      { key: 'Wed Oct 16 2024', completed: false, count: 0 },
      { key: 'Thu Oct 17 2024', completed: true, count: 1 },
      { key: 'Fri Oct 18 2024', completed: false, count: 0 },
      { key: 'Sat Oct 19 2024', completed: true, count: 1 },
      { key: 'Sun Oct 20 2024', completed: true, count: 1 },
      { key: 'Mon Oct 21 2024', completed: true, count: 1 },
      { key: 'Tue Oct 22 2024', completed: true, count: 1 },
      { key: 'Wed Oct 23 2024', completed: false, count: 0 },
      { key: 'Thu Oct 24 2024', completed: true, count: 1 },
      { key: 'Fri Oct 25 2024', completed: true, count: 1 },
      { key: 'Sat Oct 26 2024', completed: true, count: 1 },
      { key: 'Sun Oct 27 2024', completed: false, count: 0 },
      { key: 'Mon Oct 28 2024', completed: true, count: 1 },
      { key: 'Tue Oct 29 2024', completed: true, count: 1 },
      { key: 'Wed Oct 30 2024', completed: true, count: 1 },
      { key: 'Thu Oct 31 2024', completed: false, count: 0 }
    ]
  },
  { 
    id: 4, 
    name: 'Meditate for 10 minutes', 
    icon: '🧘', 
    identity: 'I am someone who practices mindfulness', 
    cue: 'After I brush my teeth', 
    reward: 'I feel calm and centered', 
    twoMinuteVersion: 'Sit in meditation position', 
    startDate: '2024-10-01T00:00:00.000Z', 
    frequency: 'daily', 
    daily: [
      { key: 'Tue Oct 01 2024', completed: true, count: 1 },
      { key: 'Wed Oct 02 2024', completed: true, count: 1 },
      { key: 'Thu Oct 03 2024', completed: true, count: 1 },
      { key: 'Fri Oct 04 2024', completed: true, count: 1 },
      { key: 'Sat Oct 05 2024', completed: false, count: 0 },
      { key: 'Sun Oct 06 2024', completed: true, count: 1 },
      { key: 'Mon Oct 07 2024', completed: true, count: 1 },
      { key: 'Tue Oct 08 2024', completed: true, count: 1 },
      { key: 'Wed Oct 09 2024', completed: false, count: 0 },
      { key: 'Thu Oct 10 2024', completed: true, count: 1 },
      { key: 'Fri Oct 11 2024', completed: true, count: 1 },
      { key: 'Sat Oct 12 2024', completed: true, count: 1 },
      { key: 'Sun Oct 13 2024', completed: false, count: 0 },
      { key: 'Mon Oct 14 2024', completed: true, count: 1 },
      { key: 'Tue Oct 15 2024', completed: true, count: 1 },
      { key: 'Wed Oct 16 2024', completed: true, count: 1 },
      { key: 'Thu Oct 17 2024', completed: true, count: 1 },
      { key: 'Fri Oct 18 2024', completed: false, count: 0 },
      { key: 'Sat Oct 19 2024', completed: true, count: 1 },
      { key: 'Sun Oct 20 2024', completed: true, count: 1 },
      { key: 'Mon Oct 21 2024', completed: true, count: 1 },
      { key: 'Tue Oct 22 2024', completed: false, count: 0 },
      { key: 'Wed Oct 23 2024', completed: true, count: 1 },
      { key: 'Thu Oct 24 2024', completed: true, count: 1 },
      { key: 'Fri Oct 25 2024', completed: true, count: 1 },
      { key: 'Sat Oct 26 2024', completed: true, count: 1 },
      { key: 'Sun Oct 27 2024', completed: false, count: 0 },
      { key: 'Mon Oct 28 2024', completed: true, count: 1 },
      { key: 'Tue Oct 29 2024', completed: true, count: 1 },
      { key: 'Wed Oct 30 2024', completed: false, count: 0 },
      { key: 'Thu Oct 31 2024', completed: true, count: 1 }
    ]
  },
  { 
    id: 5, 
    name: 'Write in journal', 
    icon: '✍️', 
    identity: 'I am someone who reflects on my growth', 
    cue: 'Before I go to bed', 
    reward: 'I process my thoughts clearly', 
    twoMinuteVersion: 'Open journal and write one sentence', 
    startDate: '2024-10-01T00:00:00.000Z', 
    frequency: 'daily', 
    daily: [
      { key: 'Tue Oct 01 2024', completed: false, count: 0 },
      { key: 'Wed Oct 02 2024', completed: true, count: 1 },
      { key: 'Thu Oct 03 2024', completed: true, count: 1 },
      { key: 'Fri Oct 04 2024', completed: true, count: 1 },
      { key: 'Sat Oct 05 2024', completed: true, count: 1 },
      { key: 'Sun Oct 06 2024', completed: false, count: 0 },
      { key: 'Mon Oct 07 2024', completed: true, count: 1 },
      { key: 'Tue Oct 08 2024', completed: true, count: 1 },
      { key: 'Wed Oct 09 2024', completed: true, count: 1 },
      { key: 'Thu Oct 10 2024', completed: false, count: 0 },
      { key: 'Fri Oct 11 2024', completed: true, count: 1 },
      { key: 'Sat Oct 12 2024', completed: false, count: 0 },
      { key: 'Sun Oct 13 2024', completed: true, count: 1 },
      { key: 'Mon Oct 14 2024', completed: true, count: 1 },
      { key: 'Tue Oct 15 2024', completed: false, count: 0 },
      { key: 'Wed Oct 16 2024', completed: true, count: 1 },
      { key: 'Thu Oct 17 2024', completed: true, count: 1 },
      { key: 'Fri Oct 18 2024', completed: true, count: 1 },
      { key: 'Sat Oct 19 2024', completed: false, count: 0 },
      { key: 'Sun Oct 20 2024', completed: true, count: 1 },
      { key: 'Mon Oct 21 2024', completed: true, count: 1 },
      { key: 'Tue Oct 22 2024', completed: true, count: 1 },
      { key: 'Wed Oct 23 2024', completed: true, count: 1 },
      { key: 'Thu Oct 24 2024', completed: false, count: 0 },
      { key: 'Fri Oct 25 2024', completed: true, count: 1 },
      { key: 'Sat Oct 26 2024', completed: true, count: 1 },
      { key: 'Sun Oct 27 2024', completed: true, count: 1 },
      { key: 'Mon Oct 28 2024', completed: false, count: 0 },
      { key: 'Tue Oct 29 2024', completed: true, count: 1 },
      { key: 'Wed Oct 30 2024', completed: true, count: 1 },
      { key: 'Thu Oct 31 2024', completed: true, count: 1 }
    ]
  },
  { 
    id: 6, 
    name: 'Eat a healthy breakfast', 
    icon: '🥗', 
    identity: 'I am someone who nourishes my body', 
    cue: 'After I wake up and shower', 
    reward: 'I fuel my body with nutrients', 
    twoMinuteVersion: 'Prepare one piece of fruit', 
    startDate: '2024-10-01T00:00:00.000Z', 
    frequency: 'daily', 
    daily: [
      { key: 'Tue Oct 01 2024', completed: true, count: 1 },
      { key: 'Wed Oct 02 2024', completed: true, count: 1 },
      { key: 'Thu Oct 03 2024', completed: false, count: 0 },
      { key: 'Fri Oct 04 2024', completed: true, count: 1 },
      { key: 'Sat Oct 05 2024', completed: true, count: 1 },
      { key: 'Sun Oct 06 2024', completed: true, count: 1 },
      { key: 'Mon Oct 07 2024', completed: false, count: 0 },
      { key: 'Tue Oct 08 2024', completed: true, count: 1 },
      { key: 'Wed Oct 09 2024', completed: true, count: 1 },
      { key: 'Thu Oct 10 2024', completed: true, count: 1 },
      { key: 'Fri Oct 11 2024', completed: true, count: 1 },
      { key: 'Sat Oct 12 2024', completed: true, count: 1 },
      { key: 'Sun Oct 13 2024', completed: false, count: 0 },
      { key: 'Mon Oct 14 2024', completed: true, count: 1 },
      { key: 'Tue Oct 15 2024', completed: false, count: 0 },
      { key: 'Wed Oct 16 2024', completed: true, count: 1 },
      { key: 'Thu Oct 17 2024', completed: true, count: 1 },
      { key: 'Fri Oct 18 2024', completed: true, count: 1 },
      { key: 'Sat Oct 19 2024', completed: true, count: 1 },
      { key: 'Sun Oct 20 2024', completed: true, count: 1 },
      { key: 'Mon Oct 21 2024', completed: false, count: 0 },
      { key: 'Tue Oct 22 2024', completed: true, count: 1 },
      { key: 'Wed Oct 23 2024', completed: true, count: 1 },
      { key: 'Thu Oct 24 2024', completed: false, count: 0 },
      { key: 'Fri Oct 25 2024', completed: true, count: 1 },
      { key: 'Sat Oct 26 2024', completed: true, count: 1 },
      { key: 'Sun Oct 27 2024', completed: true, count: 1 },
      { key: 'Mon Oct 28 2024', completed: true, count: 1 },
      { key: 'Tue Oct 29 2024', completed: false, count: 0 },
      { key: 'Wed Oct 30 2024', completed: true, count: 1 },
      { key: 'Thu Oct 31 2024', completed: true, count: 1 }
    ]
  },
  { 
    id: 7, 
    name: 'Practice gratitude', 
    icon: '🙏', 
    identity: 'I am someone who appreciates life', 
    cue: 'After I have my morning coffee', 
    reward: 'I start my day with positivity', 
    twoMinuteVersion: 'Think of one thing I\'m grateful for', 
    startDate: '2024-10-01T00:00:00.000Z', 
    frequency: 'daily', 
    daily: [
      { key: 'Tue Oct 01 2024', completed: true, count: 1 },
      { key: 'Wed Oct 02 2024', completed: true, count: 1 },
      { key: 'Thu Oct 03 2024', completed: true, count: 1 },
      { key: 'Fri Oct 04 2024', completed: true, count: 1 },
      { key: 'Sat Oct 05 2024', completed: true, count: 1 },
      { key: 'Sun Oct 06 2024', completed: false, count: 0 },
      { key: 'Mon Oct 07 2024', completed: true, count: 1 },
      { key: 'Tue Oct 08 2024', completed: true, count: 1 },
      { key: 'Wed Oct 09 2024', completed: true, count: 1 },
      { key: 'Thu Oct 10 2024', completed: true, count: 1 },
      { key: 'Fri Oct 11 2024', completed: true, count: 1 },
      { key: 'Sat Oct 12 2024', completed: true, count: 1 },
      { key: 'Sun Oct 13 2024', completed: true, count: 1 },
      { key: 'Mon Oct 14 2024', completed: false, count: 0 },
      { key: 'Tue Oct 15 2024', completed: true, count: 1 },
      { key: 'Wed Oct 16 2024', completed: true, count: 1 },
      { key: 'Thu Oct 17 2024', completed: true, count: 1 },
      { key: 'Fri Oct 18 2024', completed: true, count: 1 },
      { key: 'Sat Oct 19 2024', completed: false, count: 0 },
      { key: 'Sun Oct 20 2024', completed: true, count: 1 },
      { key: 'Mon Oct 21 2024', completed: true, count: 1 },
      { key: 'Tue Oct 22 2024', completed: true, count: 1 },
      { key: 'Wed Oct 23 2024', completed: true, count: 1 },
      { key: 'Thu Oct 24 2024', completed: true, count: 1 },
      { key: 'Fri Oct 25 2024', completed: true, count: 1 },
      { key: 'Sat Oct 26 2024', completed: false, count: 0 },
      { key: 'Sun Oct 27 2024', completed: true, count: 1 },
      { key: 'Mon Oct 28 2024', completed: true, count: 1 },
      { key: 'Tue Oct 29 2024', completed: true, count: 1 },
      { key: 'Wed Oct 30 2024', completed: true, count: 1 },
      { key: 'Thu Oct 31 2024', completed: false, count: 0 }
    ]
  },
  { 
    id: 8, 
    name: 'Learn something new', 
    icon: '🎓', 
    identity: 'I am someone who grows continuously', 
    cue: 'After lunch', 
    reward: 'I expand my skills', 
    twoMinuteVersion: 'Watch one educational video', 
    startDate: '2024-10-01T00:00:00.000Z', 
    frequency: 'daily', 
    daily: [
      { key: 'Tue Oct 01 2024', completed: false, count: 0 },
      { key: 'Wed Oct 02 2024', completed: true, count: 1 },
      { key: 'Thu Oct 03 2024', completed: false, count: 0 },
      { key: 'Fri Oct 04 2024', completed: true, count: 1 },
      { key: 'Sat Oct 05 2024', completed: true, count: 1 },
      { key: 'Sun Oct 06 2024', completed: true, count: 1 },
      { key: 'Mon Oct 07 2024', completed: true, count: 1 },
      { key: 'Tue Oct 08 2024', completed: false, count: 0 },
      { key: 'Wed Oct 09 2024', completed: true, count: 1 },
      { key: 'Thu Oct 10 2024', completed: true, count: 1 },
      { key: 'Fri Oct 11 2024', completed: false, count: 0 },
      { key: 'Sat Oct 12 2024', completed: true, count: 1 },
      { key: 'Sun Oct 13 2024', completed: false, count: 0 },
      { key: 'Mon Oct 14 2024', completed: true, count: 1 },
      { key: 'Tue Oct 15 2024', completed: true, count: 1 },
      { key: 'Wed Oct 16 2024', completed: true, count: 1 },
      { key: 'Thu Oct 17 2024', completed: false, count: 0 },
      { key: 'Fri Oct 18 2024', completed: true, count: 1 },
      { key: 'Sat Oct 19 2024', completed: true, count: 1 },
      { key: 'Sun Oct 20 2024', completed: false, count: 0 },
      { key: 'Mon Oct 21 2024', completed: true, count: 1 },
      { key: 'Tue Oct 22 2024', completed: false, count: 0 },
      { key: 'Wed Oct 23 2024', completed: true, count: 1 },
      { key: 'Thu Oct 24 2024', completed: true, count: 1 },
      { key: 'Fri Oct 25 2024', completed: true, count: 1 },
      { key: 'Sat Oct 26 2024', completed: true, count: 1 },
      { key: 'Sun Oct 27 2024', completed: false, count: 0 },
      { key: 'Mon Oct 28 2024', completed: true, count: 1 },
      { key: 'Tue Oct 29 2024', completed: true, count: 1 },
      { key: 'Wed Oct 30 2024', completed: false, count: 0 },
      { key: 'Thu Oct 31 2024', completed: true, count: 1 }
    ]
  },
  { 
    id: 9, 
    name: 'Tidy up workspace', 
    icon: '🧹', 
    identity: 'I am someone who maintains order', 
    cue: 'Before I start work', 
    reward: 'I work in a clean environment', 
    twoMinuteVersion: 'Clear one item from desk', 
    startDate: '2024-10-01T00:00:00.000Z', 
    frequency: 'daily', 
    daily: [
      { key: 'Tue Oct 01 2024', completed: true, count: 1 },
      { key: 'Wed Oct 02 2024', completed: false, count: 0 },
      { key: 'Thu Oct 03 2024', completed: true, count: 1 },
      { key: 'Fri Oct 04 2024', completed: true, count: 1 },
      { key: 'Sat Oct 05 2024', completed: false, count: 0 },
      { key: 'Sun Oct 06 2024', completed: true, count: 1 },
      { key: 'Mon Oct 07 2024', completed: true, count: 1 },
      { key: 'Tue Oct 08 2024', completed: true, count: 1 },
      { key: 'Wed Oct 09 2024', completed: false, count: 0 },
      { key: 'Thu Oct 10 2024', completed: true, count: 1 },
      { key: 'Fri Oct 11 2024', completed: true, count: 1 },
      { key: 'Sat Oct 12 2024', completed: true, count: 1 },
      { key: 'Sun Oct 13 2024', completed: true, count: 1 },
      { key: 'Mon Oct 14 2024', completed: false, count: 0 },
      { key: 'Tue Oct 15 2024', completed: true, count: 1 },
      { key: 'Wed Oct 16 2024', completed: false, count: 0 },
      { key: 'Thu Oct 17 2024', completed: true, count: 1 },
      { key: 'Fri Oct 18 2024', completed: true, count: 1 },
      { key: 'Sat Oct 19 2024', completed: true, count: 1 },
      { key: 'Sun Oct 20 2024', completed: true, count: 1 },
      { key: 'Mon Oct 21 2024', completed: false, count: 0 },
      { key: 'Tue Oct 22 2024', completed: true, count: 1 },
      { key: 'Wed Oct 23 2024', completed: false, count: 0 },
      { key: 'Thu Oct 24 2024', completed: true, count: 1 },
      { key: 'Fri Oct 25 2024', completed: true, count: 1 },
      { key: 'Sat Oct 26 2024', completed: true, count: 1 },
      { key: 'Sun Oct 27 2024', completed: true, count: 1 },
      { key: 'Mon Oct 28 2024', completed: false, count: 0 },
      { key: 'Tue Oct 29 2024', completed: true, count: 1 },
      { key: 'Wed Oct 30 2024', completed: true, count: 1 },
      { key: 'Thu Oct 31 2024', completed: false, count: 0 }
    ]
  },
  { 
    id: 10, 
    name: 'Connect with family', 
    icon: '👨👩👧👦', 
    identity: 'I am someone who values relationships', 
    cue: 'After dinner', 
    reward: 'I strengthen my bonds', 
    twoMinuteVersion: 'Send one message to family', 
    startDate: '2024-10-01T00:00:00.000Z', 
    frequency: 'daily', 
    daily: [
      { key: 'Tue Oct 01 2024', completed: true, count: 1 },
      { key: 'Wed Oct 02 2024', completed: true, count: 1 },
      { key: 'Thu Oct 03 2024', completed: false, count: 0 },
      { key: 'Fri Oct 04 2024', completed: false, count: 0 },
      { key: 'Sat Oct 05 2024', completed: true, count: 1 },
      { key: 'Sun Oct 06 2024', completed: true, count: 1 },
      { key: 'Mon Oct 07 2024', completed: false, count: 0 },
      { key: 'Tue Oct 08 2024', completed: true, count: 1 },
      { key: 'Wed Oct 09 2024', completed: true, count: 1 },
      { key: 'Thu Oct 10 2024', completed: false, count: 0 },
      { key: 'Fri Oct 11 2024', completed: true, count: 1 },
      { key: 'Sat Oct 12 2024', completed: false, count: 0 },
      { key: 'Sun Oct 13 2024', completed: true, count: 1 },
      { key: 'Mon Oct 14 2024', completed: true, count: 1 },
      { key: 'Tue Oct 15 2024', completed: true, count: 1 },
      { key: 'Wed Oct 16 2024', completed: false, count: 0 },
      { key: 'Thu Oct 17 2024', completed: false, count: 0 },
      { key: 'Fri Oct 18 2024', completed: true, count: 1 },
      { key: 'Sat Oct 19 2024', completed: true, count: 1 },
      { key: 'Sun Oct 20 2024', completed: true, count: 1 },
      { key: 'Mon Oct 21 2024', completed: true, count: 1 },
      { key: 'Tue Oct 22 2024', completed: false, count: 0 },
      { key: 'Wed Oct 23 2024', completed: true, count: 1 },
      { key: 'Thu Oct 24 2024', completed: false, count: 0 },
      { key: 'Fri Oct 25 2024', completed: true, count: 1 },
      { key: 'Sat Oct 26 2024', completed: true, count: 1 },
      { key: 'Sun Oct 27 2024', completed: true, count: 1 },
      { key: 'Mon Oct 28 2024', completed: true, count: 1 },
      { key: 'Tue Oct 29 2024', completed: false, count: 0 },
      { key: 'Wed Oct 30 2024', completed: false, count: 0 },
      { key: 'Thu Oct 31 2024', completed: true, count: 1 }
    ]
  }
];

export const useHabits = () => {
  const [habits, setHabits] = useState(() => {
    // Clear old habits and use new sample data
    localStorage.removeItem('habits');
    return SAMPLE_HABITS;
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem('habits', JSON.stringify(habits));
    } catch (error) {
      setError('Failed to save habits');
      console.error('Error saving habits:', error);
    }
  }, [habits]);

  const addHabit = useCallback((habitData) => {
    if (!habitData.name?.trim()) return false;
    
    setLoading(true);
    try {
      const newHabit = {
        id: Date.now(),
        ...habitData,
        frequency: habitData.frequency || 'daily',
        startDate: new Date().toISOString(),
        daily: []
      };
      setHabits(prev => [...prev, newHabit]);
      setError(null);
      return true;
    } catch (error) {
      setError('Failed to add habit');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteHabit = useCallback((id) => {
    setHabits(prev => prev.filter(habit => habit.id !== id));
  }, []);

  const toggleHabit = useCallback((id, date = null) => {
    const targetDate = date ? new Date(date) : new Date();
    const key = habit => {
      if (habit.frequency === 'weekly') {
        const weekStart = new Date(targetDate);
        weekStart.setDate(targetDate.getDate() - targetDate.getDay());
        return `${weekStart.getFullYear()}-W${Math.ceil(weekStart.getDate() / 7)}`;
      } else if (habit.frequency === 'monthly') {
        return `${targetDate.getFullYear()}-${targetDate.getMonth()}`;
      } else if (habit.frequency === 'yearly') {
        return `${targetDate.getFullYear()}`;
      }
      return targetDate.toDateString();
    };
    
    setHabits(prev => prev.map(habit => {
      if (habit.id !== id) return habit;
      
      const entryKey = key(habit);
      const daily = [...habit.daily];
      const index = daily.findIndex(entry => entry.key === entryKey);
      
      if (index >= 0) {
        daily[index].completed = !daily[index].completed;
        daily[index].count = daily[index].completed ? (daily[index].count || 1) : 0;
      } else {
        daily.push({ key: entryKey, completed: true, count: 1 });
      }
      
      return { ...habit, daily };
    }));
  }, []);

  const updateHabitCount = useCallback((id, increment, targetDate = new Date()) => {
    const today = new Date(targetDate);
    
    setHabits(prev => prev.map(habit => {
      if (habit.id !== id) return habit;
      
      const key = (() => {
        if (habit.frequency === 'weekly') {
          const weekStart = new Date(today);
          weekStart.setDate(today.getDate() - today.getDay());
          return `${weekStart.getFullYear()}-W${Math.ceil(weekStart.getDate() / 7)}`;
        } else if (habit.frequency === 'monthly') {
          return `${today.getFullYear()}-${today.getMonth()}`;
        } else if (habit.frequency === 'yearly') {
          return `${today.getFullYear()}`;
        }
        return today.toDateString();
      })();
      
      const daily = [...habit.daily];
      const index = daily.findIndex(entry => entry.key === key);
      
      if (index >= 0) {
        const newCount = Math.max(0, Math.min(50, (daily[index].count || 0) + increment));
        daily[index].count = newCount;
        daily[index].completed = newCount > 0;
      } else if (increment > 0) {
        daily.push({ key, completed: true, count: 1 });
      }
      
      return { ...habit, daily };
    }));
  }, []);

  const getHabitStats = useCallback((habit, currentDate = new Date()) => {
    const today = new Date(currentDate);
    const startDate = new Date(habit.startDate);
    
    if (habit.frequency === 'weekly') {
      const weeksSinceStart = Math.ceil((today - startDate) / (1000 * 60 * 60 * 24 * 7));
      
      let streak = 0;
      for (let i = 0; i <= weeksSinceStart; i++) {
        const checkWeek = new Date(today);
        checkWeek.setDate(today.getDate() - (i * 7));
        const weekStart = new Date(checkWeek);
        weekStart.setDate(checkWeek.getDate() - checkWeek.getDay());
        
        if (weekStart < startDate) break;
        
        const weekKey = `${weekStart.getFullYear()}-W${Math.ceil(weekStart.getDate() / 7)}`;
        const entry = habit.daily.find(entry => entry.key === weekKey);
        
        if (entry && entry.completed) {
          streak++;
        } else {
          break;
        }
      }
      
      const currentWeekStart = new Date(today);
      currentWeekStart.setDate(today.getDate() - today.getDay());
      const currentWeekKey = `${currentWeekStart.getFullYear()}-W${Math.ceil(currentWeekStart.getDate() / 7)}`;
      const currentEntry = habit.daily.find(entry => entry.key === currentWeekKey);
      
      return {
        streak,
        isCompletedToday: currentEntry?.completed || false,
        todayCount: currentEntry?.count || 0,
        daysSinceStart: Math.max(1, weeksSinceStart + 1)
      };
    } else if (habit.frequency === 'monthly') {
      const monthsSinceStart = (today.getFullYear() - startDate.getFullYear()) * 12 + (today.getMonth() - startDate.getMonth());
      
      let streak = 0;
      for (let i = 0; i <= monthsSinceStart; i++) {
        const checkMonth = new Date(today.getFullYear(), today.getMonth() - i, 1);
        if (checkMonth < startDate) break;
        
        const monthKey = `${checkMonth.getFullYear()}-${checkMonth.getMonth()}`;
        const entry = habit.daily.find(entry => entry.key === monthKey);
        
        if (entry && entry.completed) {
          streak++;
        } else {
          break;
        }
      }
      
      const currentMonthKey = `${today.getFullYear()}-${today.getMonth()}`;
      const currentEntry = habit.daily.find(entry => entry.key === currentMonthKey);
      
      return {
        streak,
        isCompletedToday: currentEntry?.completed || false,
        todayCount: currentEntry?.count || 0,
        daysSinceStart: Math.max(1, monthsSinceStart + 1)
      };
    } else if (habit.frequency === 'yearly') {
      const yearsSinceStart = today.getFullYear() - startDate.getFullYear();
      
      let streak = 0;
      for (let i = 0; i <= yearsSinceStart; i++) {
        const checkYear = today.getFullYear() - i;
        if (checkYear < startDate.getFullYear()) break;
        
        const yearKey = `${checkYear}`;
        const entry = habit.daily.find(entry => entry.key === yearKey);
        
        if (entry && entry.completed) {
          streak++;
        } else {
          break;
        }
      }
      
      const currentYearKey = `${today.getFullYear()}`;
      const currentEntry = habit.daily.find(entry => entry.key === currentYearKey);
      
      return {
        streak,
        isCompletedToday: currentEntry?.completed || false,
        todayCount: currentEntry?.count || 0,
        daysSinceStart: Math.max(1, yearsSinceStart + 1)
      };
    }
    
    const daysSinceStart = Math.ceil((today - startDate) / (1000 * 60 * 60 * 24));
    
    let streak = 0;
    for (let i = 0; i <= daysSinceStart; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      
      if (checkDate < startDate) break;
      
      const dateKey = checkDate.toDateString();
      const entry = habit.daily.find(entry => entry.key === dateKey);
      
      if (entry && entry.completed) {
        streak++;
      } else {
        break;
      }
    }
    
    const currentKey = today.toDateString();
    const currentEntry = habit.daily.find(entry => entry.key === currentKey);
    
    return {
      streak,
      isCompletedToday: currentEntry?.completed || false,
      todayCount: currentEntry?.count || 0,
      daysSinceStart: Math.max(1, daysSinceStart)
    };
  }, []);

  const getOverallStats = useCallback(() => {
    const completedHabits = habits.filter(h => getHabitStats(h).isCompletedToday).length;
    
    const totalHabits = habits.length;
    const completedToday = completedHabits;
    const bestStreak = Math.max(...habits.map(h => getHabitStats(h).streak), 0);
    const identityScore = totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0;
    const totalVotes = habits.reduce((sum, h) => sum + h.daily.filter(d => d.completed).length, 0);
    const avgDays = totalHabits > 0 ? Math.round(habits.reduce((sum, h) => {
      return sum + getHabitStats(h).daysSinceStart;
    }, 0) / totalHabits) : 0;

    return { totalHabits, completedToday, bestStreak, identityScore, totalVotes, avgDays };
  }, [habits, getHabitStats]);

  const updateStartDate = useCallback((id, newDate) => {
    setHabits(prev => prev.map(habit => 
      habit.id === id 
        ? { ...habit, startDate: new Date(newDate).toISOString() }
        : habit
    ));
  }, []);

  return {
    habits,
    loading,
    error,
    addHabit,
    deleteHabit,
    toggleHabit,
    updateHabitCount,
    updateStartDate,
    getHabitStats,
    getOverallStats,
    clearError: () => setError(null)
  };
};