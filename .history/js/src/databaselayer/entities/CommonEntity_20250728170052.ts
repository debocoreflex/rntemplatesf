

export class CommonEntity {
    constructor(
        public Id: string,
        public FirstName: string,
        public LastName?: string,
        public Email?: string,
        public Title?: string,
        public MobilePhone?: string,
        public Department?: string,

    ) { }
}