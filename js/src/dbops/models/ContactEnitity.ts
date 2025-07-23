export class ContactEntity {
  constructor(
    public Id: string,
    public FirstName: string,
    public MobilePhone: string,
    public LastName?: string,
    public Email?: string,
    public Title?: string,
    public Department?: string,
  ) {}
}

