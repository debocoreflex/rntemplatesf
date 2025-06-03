import React, { useEffect, useRef } from 'react';
import { Alert, View, FlatList, Keyboard } from 'react-native';
import { SearchBar } from 'react-native-elements';
import { oauth } from 'react-native-force';
import styles from './Styles';
import NavImgButton from './NavImgButton';
import ContactCell from './ContactCell';
import { ContactViewModel } from '../viewmodels/ContactViewModel';

const SearchScreen = ({ navigation, style }) => {
  const {
    contacts,
    filter,
    setSearchFilter,
    addContact,
    deleteContact
  } = ContactViewModel();

  const timeoutID = useRef(null);

  useEffect(() => {
    navigation.setOptions({
      title: 'Contacts',
      headerRight: () => (
        <View style={styles.navButtonsGroup}>
          <NavImgButton icon='add' onPress={onAdd} />
          <NavImgButton icon='cloud-sync' iconType='material-community' onPress={onSync} />
          <NavImgButton icon='logout' iconType='material-community' onPress={onLogout} />
        </View>
      ),
    });
  }, []);

  const onSearchChange = (text) => {
    if (timeoutID.current) clearTimeout(timeoutID.current);
    timeoutID.current = setTimeout(() => {
      setSearchFilter(text.toLowerCase());
    }, 200);
  };

  const onAdd = () => {
    const dummyContact = {
      Id: `local_${Date.now()}`,
      FirstName: 'Acc',
      LastName: 'mukh',
      Title: 'Dev',
      Email: 'john.oe@example.com',
      MobilePhone: '123-456-7866',
      Department: 'DEV',
      attributes: { type: "Contact" },
      __locally_created__: true,
      __locally_updated__: false,
      __locally_deleted__: false,
      __local__: true,
    };

    addContact(dummyContact);
  };

  const onSync = () => {
    // If you want to trigger reSync manually, call your StoreMgr here
    // e.g. StoreMgr.reSyncData();
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

  const extractKey = (item) => {
    const key = item._soupEntryId ?? item.Id;
    if (!key) console.warn('Missing key for item:', item);
    return `list-${key ?? Math.random().toString(36)}`;
  };

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
