import { ReactiveStoreFactory } from "./ReactiveStoreFactory";
const ContactReactiveStore = ReactiveStoreFactory({
  soupName: 'contacts',
  filterKeys: ['FirstName', 'LastName']
});

export default ContactReactiveStore;
