// ContactModel.js
class Contact {
  constructor(data) {
    this.Id = data.Id || null;
    this.FirstName = data.FirstName || '';
    this.LastName = data.LastName || '';
    this.Email = data.Email || '';
    this.MobilePhone = data.MobilePhone || '';
    this.Department = data.Department || '';
    this.Title = data.Title || '';
    this.LastModifiedDate = data.LastModifiedDate || null;
    this.__local__ = data.__local__ || false;
    this.__locally_created__ = data.__locally_created__ || false;
    this.__locally_deleted__ = data.__locally_deleted__ || false;
    this.__locally_updated__ = data.__locally_updated__ || false;
    this._soupEntryId = data._soupEntryId || null;
    // Add more fields if needed
  }
}

export default Contact;