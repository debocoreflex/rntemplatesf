export interface User {
  Trade_Channel__c: string;
  SmallPhotoUrl: string;
  ManagedUsers?: null;
  FullPhotoUrl: string;
  LastName: string;
  Job_Role__c: string;
  LastModifiedDate: string;
  FirstName: string;
  Id: string;
  MediumPhotoUrl: string;
  Country_Code__c: string;
  Is_PhotoRec_User__c: boolean;
  attributes: Attributes;
  __local__: boolean;
  __locally_created__: boolean;
  __locally_updated__: boolean;
  __locally_deleted__: boolean;
  __sync_id__: number;
  _soupEntryId: number;
  _soupLastModifiedDate: number;
}

export interface UserConfig {
  countryCode: string;
  tradeChannel: string;
}
export interface Attributes {
  type: string
  url: string
}