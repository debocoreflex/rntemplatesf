import React, { useState, useEffect } from 'react';
import {
    Platform,
    ScrollView,
    View,
} from 'react-native';

import styles from './Styles';
import NavImgButton from './NavImgButton';
import Field from './Field';
import storeMgr from '../services/store/StoreMgr';
import { Button } from 'react-native-elements';
import { detoxEnabled } from '../utils/detoxUtills';
import { deleteDetoxContacts, saveDetoxContact } from '../services/detoxstore/DetoxStoreUtils';

const ContactScreen = ({ navigation, route, style }) => {
    const [contact, setContact] = useState(route.params.contact || {});

    useEffect(() => {
        let deleteUndeleteIconName = 'delete';
        if (contact.__locally_deleted__) {
            deleteUndeleteIconName = 'delete-restore';
        }

        navigation.setOptions({
            title: 'Contact',
            headerLeft: () => (
                <NavImgButton
                    icon='arrow-back'
                    color='white'
                    onPress={onBack}
                />
            ),
            headerRight: () => (
                <View style={styles.navButtonsGroup}>
                    <NavImgButton
                        icon={deleteUndeleteIconName}
                        iconType='material-community'
                        onPress={onDeleteUndeleteContact}
                    />
                </View>
            )
        });
    }, [contact, navigation]);

    const onBack = () => {
        if (contact.__locally_created__ && !contact.__locally_modified__) {
            // Nothing typed in - delete
            if (detoxEnabled()) {
                deleteDetoxContacts(contact, () => navigation.pop());
            } else {
                storeMgr.deleteContact(contact, () => navigation.pop());
            }
        } else {
            navigation.pop();
        }
    };

    const onSave = () => {
        const updatedContact = {
            ...contact,
            __last_error__: null,
            __locally_updated__: true,
            __local__: true
        };
        setContact(updatedContact);
        if (detoxEnabled()) {
            saveDetoxContact(updatedContact, () => navigation.pop());
        } else {
            // Save the contact using store manager
            storeMgr.saveContact(updatedContact, () => navigation.pop());
        }
    }

    const onChange = (fieldKey, fieldValue) => {
        setContact(prevContact => ({
            ...prevContact,
            [fieldKey]: fieldValue
        }));
    };

    const onDeleteUndeleteContact = () => {
        const updatedContact = {
            ...contact,
            __locally_deleted__: !contact.__locally_deleted__,
        };
        updatedContact.__local__ = updatedContact.__locally_deleted__ || updatedContact.__locally_updated__ || updatedContact.__locally_created__;
        setContact(updatedContact);
        if (detoxEnabled()) {
            saveDetoxContact(updatedContact, () => navigation.pop());
        } else {
            storeMgr.saveContact(updatedContact, () => navigation.pop());
        }

    };

    const renderErrorIfAny = () => {
        let errorMessage = null;
        const lastError = contact.__last_error__;
        if (lastError) {
            try {
                if (Platform.OS === 'ios') {
                    errorMessage = JSON.parse(lastError)[0].message;
                } else {
                    errorMessage = JSON.parse(lastError).body[0].message;
                }
            } catch (e) {
                console.log("Failed to extract message from error: " + lastError);
            }
        }

        if (!errorMessage) return null;

        return (
            <View style={{ marginTop: 10 }}>
                <Button
                    icon={{ name: 'error', size: 15, color: 'white' }}
                    title={errorMessage}
                    buttonStyle={{ backgroundColor: 'red' }}
                />
            </View>
        );
    };

    const renderSaveButton = () => (
        <View style={{ marginTop: 10 }}>
            <Button
                backgroundColor='blue'
                containerStyle={{ alignItems: 'stretch' }}
                icon={{ name: 'save' }}
                title='Save'
                onPress={onSave}
            />
        </View>
    );

    return (
        <ScrollView>
            <View style={style}>
                {renderErrorIfAny()}
                <Field
                    fieldLabel="First name"
                    fieldValue={contact.FirstName}
                    onChange={text => onChange("FirstName", text)}
                />
                <Field
                    fieldLabel="Last name"
                    fieldValue={contact.LastName}
                    onChange={text => onChange("LastName", text)}
                />
                <Field
                    fieldLabel="Title"
                    fieldValue={contact.Title}
                    onChange={text => onChange("Title", text)}
                />
                <Field
                    fieldLabel="Mobile phone"
                    fieldValue={contact.MobilePhone}
                    onChange={text => onChange("MobilePhone", text)}
                />
                <Field
                    fieldLabel="Email address"
                    fieldValue={contact.Email}
                    onChange={text => onChange("Email", text)}
                />
                <Field
                    fieldLabel="Department"
                    fieldValue={contact.Department}
                    onChange={text => onChange("Department", text)}
                />
                {renderSaveButton()}
            </View>
        </ScrollView>
    );
};

export default ContactScreen;
