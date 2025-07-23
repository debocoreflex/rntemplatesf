// data/repository/SmartStore/SmartStoreContactRepository.ts
import { IRepository } from '../Interfaces';
import { ContactEntity } from '../models/ContactEnitity';

import { getContactsFromSmartStore, saveContact } from '../../services/store/SmartStoreUtils';

export class dbRepo implements IRepository<ContactEntity> {
    async save(item): Promise<void> {
        const entry = {
            ...item,
            attributes: { type: "Contact" },
            __locally_created__: true,
            __locally_updated__: false,
            __locally_deleted__: false,
            __local__: true,
        };
        await saveContact(entry, () => { });
    }
    async getById(id: string): Promise<ContactEntity | null> {
        const contacts = await getContactsFromSmartStore();
        const contact = contacts.find(c => c.id === id);
        return contact || null;
    }

    async create(item: ContactEntity): Promise<void> {

        await saveContact(item, () => { });

    }

    async update(id: string, item: Partial<ContactEntity>): Promise<void> {
        const contacts = await getContactsFromSmartStore();
        const index = contacts.findIndex(c => c.id === id);
        if (index === -1) {
            throw new Error('Contact not found.');
        }
        const updatedContact = { ...contacts[index], ...item };
        contacts[index] = updatedContact;
        // Assuming saveContact can overwrite existing contact
        await saveContact(updatedContact, () => { });
    }

    async delete(id: string): Promise<void> {
        const contacts = await getContactsFromSmartStore();
        const filteredContacts = contacts.filter(c => c.id !== id);
        // Assuming there is a way to overwrite all contacts in the store
        // You may need to implement a saveContacts(contacts: ContactEntity[]) utility
        if (typeof saveContact === 'function' && saveContact.length > 1) {
            // If saveContact can take an array and overwrite
            await saveContact(filteredContacts, () => { });
        } else {
            // Otherwise, remove all and re-add
            // This is a placeholder; you should implement a proper delete utility
            throw new Error('Delete operation not implemented in SmartStoreUtils.');
        }
    }

    async getAll(): Promise<ContactEntity[]> {
        return await getContactsFromSmartStore();
    }

    //     async save(entity: ContactEntity): Promise<void> {
    //          const entry = {
    //       ...entity,
    //       attributes: { type: "Contact" },
    //       __locally_created__: true,
    //       __locally_updated__: false,
    //       __locally_deleted__: false,
    //       __local__: true,
    //     };

    //     //this is becuase of smartstore 
    //     // if db changes entry will work as a data class and it will change respective to DB 
    //    await saveContact(entry,() =>{});
    //     }
}