import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import {
  isWeeklyProtectionReminder,
  WEEKLY_PROTECTION_REMINDER_ID,
  WEEKLY_PROTECTION_REMINDER_KIND,
} from '@/domain/notifications';

const reminderChannelId = 'protection-reminders';

export type LocalNotificationState = {
  enabled: boolean;
  permission: 'GRANTED' | 'DENIED' | 'UNDETERMINED';
};

function permissionState(permission: Notifications.NotificationPermissionsStatus): LocalNotificationState['permission'] {
  if (permission.granted) return 'GRANTED';
  return permission.status === 'undetermined' ? 'UNDETERMINED' : 'DENIED';
}

async function matchingReminderIds() {
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  return scheduled.filter((request) => isWeeklyProtectionReminder(request)).map((request) => request.identifier);
}

async function cancelExistingReminder() {
  const identifiers = await matchingReminderIds();
  await Promise.all(identifiers.map((identifier) => Notifications.cancelScheduledNotificationAsync(identifier)));
}

async function configureAndroidChannel() {
  if (Platform.OS !== 'android') return;
  await Notifications.setNotificationChannelAsync(reminderChannelId, {
    name: 'Koruma hatırlatıcıları',
    description: 'Kullanıcının açtığı haftalık yerel koruma kontrolü hatırlatıcıları.',
    importance: Notifications.AndroidImportance.DEFAULT,
    sound: null,
    enableVibrate: false,
    showBadge: false,
  });
}

export function configureNotificationPresentation() {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });
}

export async function getLocalNotificationState(): Promise<LocalNotificationState> {
  const [permission, identifiers] = await Promise.all([
    Notifications.getPermissionsAsync(),
    matchingReminderIds(),
  ]);
  return { enabled: permission.granted && identifiers.length > 0, permission: permissionState(permission) };
}

export async function enableWeeklyProtectionReminder(): Promise<LocalNotificationState> {
  await configureAndroidChannel();
  let permission = await Notifications.getPermissionsAsync();
  if (!permission.granted && permission.canAskAgain) {
    permission = await Notifications.requestPermissionsAsync({
      ios: { allowAlert: true, allowBadge: false, allowSound: false },
    });
  }
  if (!permission.granted) return { enabled: false, permission: permissionState(permission) };

  await cancelExistingReminder();
  await Notifications.scheduleNotificationAsync({
    identifier: WEEKLY_PROTECTION_REMINDER_ID,
    content: {
      title: 'n0scam koruma kontrolü',
      body: 'Koruma modüllerini gözden geçirin ve şüpheli içerikleri açmadan önce analiz edin.',
      data: { kind: WEEKLY_PROTECTION_REMINDER_KIND },
      sound: false,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
      weekday: 2,
      hour: 10,
      minute: 0,
      channelId: Platform.OS === 'android' ? reminderChannelId : undefined,
    },
  });
  return { enabled: true, permission: 'GRANTED' };
}

export async function disableWeeklyProtectionReminder(): Promise<LocalNotificationState> {
  await cancelExistingReminder();
  const permission = await Notifications.getPermissionsAsync();
  return { enabled: false, permission: permissionState(permission) };
}

export function subscribeToProtectionReminderPress(onPress: () => void) {
  const handle = (response: Notifications.NotificationResponse | null) => {
    if (!response || !isWeeklyProtectionReminder(response.notification.request)) return;
    Notifications.clearLastNotificationResponse();
    onPress();
  };
  handle(Notifications.getLastNotificationResponse());
  const subscription = Notifications.addNotificationResponseReceivedListener(handle);
  return () => subscription.remove();
}
