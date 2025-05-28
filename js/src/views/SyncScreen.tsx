// views/SyncScreen.tsx
import { observer } from "mobx-react-lite";
import syncVM from "../viewmodels/SyncViewModel";
import { useEffect } from "react";
import { ActivityIndicator, Text, View } from "react-native";

const SyncScreen = observer(() => {
  useEffect(() => {
    syncVM.startSync();
  }, []);

  return (
    <View>
      {syncVM.isSyncing ? <ActivityIndicator /> : <Text>Sync Complete</Text>}
    </View>
  );
});
