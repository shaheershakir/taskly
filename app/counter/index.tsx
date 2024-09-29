import { useRouter } from "expo-router";
import { Text, View, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { theme } from "../../theme";
import { registerForPushNotificationsAsync } from "../../utils/registerForPushNotificationsAsync";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { useEffect, useState } from "react";
import { intervalToDuration, isBefore } from "date-fns";
import { TimeSegment } from "../../components/TimeSegment";
import { getFromStorage, saveToStorage } from "../../utils/storage";
// import { Duration, intervalToDuration } from "date-fns";

const frequency = 10 * 1000;

const countdownStorageKey = "taskly-coundown";

type PersistedCountdownState = {
  currentNotificationId: string | undefined;
  completedAtTimestamps: number[];
};

type CountdownStatus = {
  isOverDue: boolean;
  distance: ReturnType<typeof intervalToDuration>;
  // distance: Duration
};

export default function CounterScreen() {
  const [coundownstate, setCoundownstate] = useState<PersistedCountdownState>();
  const [status, setStatus] = useState<CountdownStatus>({
    isOverDue: false,
    distance: {},
  });

  const lastCompletedTimestamp = coundownstate?.completedAtTimestamps[0];

  useEffect(() => {
    const init = async () => {
      const value = await getFromStorage(countdownStorageKey);
      setCoundownstate(value);
    };
    init();
  }, []);

  useEffect(() => {
    const intervelId = setInterval(() => {
      const timestamp = lastCompletedTimestamp
        ? lastCompletedTimestamp + frequency
        : Date.now();
      const isOverDue = isBefore(timestamp, Date.now());
      const distance = intervalToDuration(
        isOverDue
          ? { start: timestamp, end: Date.now() }
          : { start: Date.now(), end: timestamp }
      );
      setStatus({ isOverDue, distance });
    }, 1000);
    return () => {
      clearInterval(intervelId);
    };
  }, []);

  const scheduleNotification = async () => {
    let pushNotificationId;
    const result = await registerForPushNotificationsAsync();
    if (result === "granted") {
      pushNotificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: "The thing is due",
        },
        trigger: {
          seconds: frequency / 1000,
        },
      });
    } else {
      if (Device.isDevice) {
        Alert.alert(
          "unable to schedule notification", // eslint-disable-next-line
          "Enable the notification for expo Go in settings"
        );
      }
    }
    if (coundownstate?.currentNotificationId) {
      await Notifications.cancelScheduledNotificationAsync(
        coundownstate.currentNotificationId
      );
    }
    const newCoundownState: PersistedCountdownState = {
      currentNotificationId: pushNotificationId,
      completedAtTimestamps: coundownstate
        ? [Date.now(), ...coundownstate.completedAtTimestamps]
        : [Date.now()],
    };
    setCoundownstate(newCoundownState);
    await saveToStorage(countdownStorageKey, newCoundownState);
  };
  return (
    <View
      style={[
        styles.container,
        status.isOverDue ? styles.containerLate : undefined,
      ]}
    >
      {status.isOverDue ? (
        <Text style={[styles.heading, styles.whiteText]}>Thing overdue by</Text>
      ) : (
        <Text style={styles.heading}>Thing due in...</Text>
      )}
      <View style={styles.row}>
        <TimeSegment
          unit="Days"
          number={status.distance.days ?? 0}
          textStyle={status.isOverDue ? styles.whiteText : undefined}
        />
        <TimeSegment
          unit="Hours"
          number={status.distance.hours ?? 0}
          textStyle={status.isOverDue ? styles.whiteText : undefined}
        />
        <TimeSegment
          unit="Minutes"
          number={status.distance.minutes ?? 0}
          textStyle={status.isOverDue ? styles.whiteText : undefined}
        />
        <TimeSegment
          unit="Seconds"
          number={status.distance.seconds ?? 0}
          textStyle={status.isOverDue ? styles.whiteText : undefined}
        />
      </View>
      <TouchableOpacity
        style={styles.button}
        activeOpacity={0.8}
        onPress={scheduleNotification}
      >
        <Text style={styles.buttonText}>I've Done the Thing!</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  containerLate: {
    backgroundColor: theme.colorRed,
  },
  button: {
    backgroundColor: theme.colorBlack,
    padding: 12,
    borderRadius: 6,
  },
  buttonText: {
    color: theme.colorWhite,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  row: {
    flexDirection: "row",
    marginBottom: 24,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
  },
  whiteText: {
    color: theme.colorWhite,
  },
});
