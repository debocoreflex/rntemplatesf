import { ReactiveStoreFactory } from "../../common/stores/ReactiveStoreFactory";
const ContactReactiveStore = ReactiveStoreFactory({
  soupName: 'contacts',
  filterKeys: ['FirstName', 'LastName']
});

export default ContactReactiveStore;
