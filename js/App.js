/*
 * Copyright (c) 2015-present, salesforce.com, inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification, are permitted provided
 * that the following conditions are met:
 *
 * Redistributions of source code must retain the above copyright notice, this list of conditions and the
 * following disclaimer.
 *
 * Redistributions in binary form must reproduce the above copyright notice, this list of conditions and
 * the following disclaimer in the documentation and/or other materials provided with the distribution.
 *
 * Neither the name of salesforce.com, inc. nor the names of its contributors may be used to endorse or
 * promote products derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED
 * WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A
 * PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
 * ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED
 * TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION)
 * HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 * NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import styles from './src/views/Styles';
import SearchScreen from './src/views/SearchScreen';
import ContactScreen from './src/views/ContactScreen';
import StoreMgr from './src/services/store/StoreMgr';
import { oauth } from 'react-native-force';
import ContactReactiveStore from './src/services/store/ContactReactiveStore';
import DetoxTestScreen from './src/views/DetoxTestScreen';

const Stack = createStackNavigator();


export default function() {

  const isDetox =  true;
// React.useEffect(() => {
//     async function initializeContacts() {
//       await StoreMgr.syncData();            // 🟢 Register soup + sync down
//       ContactReactiveStore.initLoad();      // 🟢 Safe to query now
//     }

//     initializeContacts();
//   }, []);


//   React.useEffect(() => {
//   async function initializeContacts() {
//     await StoreMgr.syncData(); // This internally loads contacts into ContactReactiveStore
//   }

//   initializeContacts();
// }, []);

// React.useEffect(() => {
//   async function initializeContacts() {
//     if (isDetox) {
//       // Fake login: manually set auth info
//        oauth.getAuthCredentials = (success, fail) => {
//         success({
//           accessToken: "00D4x000007shmb!AQIAQAxzB.oNi3gZlgIjt3BC2GlOyKpA4TKzFEHxC3S0ZUr0.MdRpz68I5JBkaA67eCqdkFrJqkrOVeq_ENL7LYOJZ6.fVxo",
//           communityId: null,
//           communityUrl: null,
//           identityUrl: 'https://login.salesforce.com/id/00D4x000007shmbEAA/005KY000000GgWZYA0',
//           instanceUrl: 'https://cfsb2bcommerce-dev-ed.my.salesforce.com',
//           loginUrl: 'https://cfsb2bcommerce-dev-ed.my.salesforce.com/',
//           orgId: '00D4x000007shmbEAA',
//           refreshToken: "5Aep861Bky2w54txC3QBh9VpUxfxxY8AfjLrpoeJvk1YuiW4zdkVS3Y_wbGdtqWlEgpY5s8XH8ACvAntiewUrgU",
//           userAgent: 'SalesforceMobileSDK/13.0.0 android mobile/16 (sdk_gphone64_x86_64) rntemplatesf/1.0(1) ReactNative uid_ae9f3276b0fd8e74 ftr_AI.SY.UA.US SecurityPatch/2025-04-05',
//           userId: '005KY000000GgWZYA0',
//         });

   
//       };
    
      
//     }

//     await StoreMgr.syncData(); // This will trigger contact load
//   }

//   initializeContacts();
// }, []);





    return (
        <NavigationContainer>

          {/* {isDetox ? (
          <Stack.Screen name="DetoxTest" component={DetoxTestScreen} />
        ) : ( */}
            <Stack.Navigator
                initialRouteName="Contacts"
                screenOptions={{
                    headerStyle: styles.navBar,
                    headerTitleStyle: styles.navBarTitleText,
                    tabBarVisible: false
                }}
            >
            <Stack.Screen name="Contacts" component={SearchScreen} />
            <Stack.Screen name="Contact" component={ContactScreen} />
          </Stack.Navigator>
        {/* )} */}
        </NavigationContainer>
    );
}
