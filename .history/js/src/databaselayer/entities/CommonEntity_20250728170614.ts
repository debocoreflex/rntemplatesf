

export class CommonEntity {
    constructor(
        public Id: string,
        public FirstName: string,
         public Email: string,
        public LastName?: string,
        public Title?: string,
        public MobilePhone?: string,
        public Department?: string,
    ) { }
}
