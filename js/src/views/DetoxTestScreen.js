// src/views/DetoxTestScreen.js
import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { smartstore } from 'react-native-force';

export default function DetoxTestScreen() {
  const [status, setStatus] = useState('pending');

  useEffect(() => {
    async function runUpsertTest() {
      try {
        const soupName = 'contacts';
        const contact = {
          Id: `local_${Date.now()}`,
          FirstName: 'Detox',
          LastName: 'Test',
          __local__: true
        };

        const soupExists = await new Promise((resolve) =>
          smartstore.soupExists(false, soupName, resolve)
        );

        if (!soupExists) {
          await new Promise((resolve, reject) =>
            smartstore.registerSoup(
              false,
              soupName,
              [
                { path: 'Id', type: 'string' },
                { path: 'FirstName', type: 'full_text' },
                { path: 'LastName', type: 'full_text' },
                { path: '__local__', type: 'string' }
              ],
              resolve,
              reject
            )
          );
        }

        await new Promise((resolve, reject) =>
          smartstore.upsertSoupEntries(false, soupName, [contact], resolve, reject)
        );

        setStatus('success');
      } catch (err) {
        setStatus('error');
      }
    }

    runUpsertTest();
  }, []);

  return (
    <View testID="DetoxTestRoot">
      <Text testID="UpsertStatus">{status}</Text>
    </View>
  );
}
