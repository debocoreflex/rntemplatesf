import React, { useEffect, useRef } from 'react';
import {
  Alert,
  View,
  FlatList,
  Keyboard
} from 'react-native';
import { SearchBar } from 'react-native-elements';
import { oauth } from 'react-native-force';
import styles from './Styles';
import NavImgButton from './NavImgButton';
import ContactCell from './ContactCell';
import StoreMgr from '../services/store/StoreMgr';
import { ContactViewModel } from '../viewmodels/ContactViewModel';// ✅ Make sure this path is correct

const SearchScreen = ({ navigation, style }) => {
  const {
    contacts,
    isLoading,
    filter,
    setSearchFilter,
    refreshContacts
  } = ContactViewModel();

  const timeoutID = useRef(null);

  // Setup header buttons
  useEffect(() => {
    navigation.setOptions({
      title: 'Contacts',
      headerRight: () => (
        <View style={styles.navButtonsGroup}>
          <NavImgButton icon='add' onPress={onAdd} />
          <NavImgButton icon='cloud-sync' iconType='material-community' onPress={onSync} />
          <NavImgButton icon='logout' iconType='material-community' onPress={onLogout} />
        </View>
      )
    });
  }, []);

  // Sync and listen for data updates
  useEffect(() => {
    StoreMgr.syncData();           // 🔄 first time sync
    StoreMgr.addStoreChangeListener(refreshContacts);

    return () => {
      StoreMgr.removeStoreChangeListener(refreshContacts);
      if (timeoutID.current) {
        clearTimeout(timeoutID.current);
      }
    };
  }, []);

  const onSearchChange = (text) => {
    const query = text.toLowerCase();
    if (timeoutID.current) clearTimeout(timeoutID.current);

    timeoutID.current = setTimeout(() => {
      setSearchFilter(query);  // ✅ Triggers refresh inside ViewModel
    }, 200); // Debounced input
  };

  const onAdd = () => {
    StoreMgr.addContact(contact => {
      navigation.push('Contact', { contact });
    });
  };

  const onSync = () => {
    StoreMgr.reSyncData();
  };

  const onLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel' },
        { text: 'OK', onPress: () => oauth.logout() },
      ],
      { cancelable: true }
    );
  };

  const extractKey = (item) => `list-${item._soupEntryId}`;

  const renderRow = ({ item }) => (
    <ContactCell onSelect={() => selectContact(item)} contact={item} />
  );

  const selectContact = (contact) => {
    Keyboard.dismiss();
    navigation.push('Contact', { contact });
  };

  return (
    <View style={style}>
      <SearchBar
        lightTheme
        autoCorrect={false}
        onChangeText={onSearchChange}
        showLoading={isLoading}
        value={filter}
        placeholder="Search a contact..."
      />
      <FlatList
        data={contacts}
        keyExtractor={extractKey}
        renderItem={renderRow}
      />
    </View>
  );
};

export default SearchScreen;
