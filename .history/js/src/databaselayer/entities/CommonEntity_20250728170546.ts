

export class CommonEntity {
    constructor(
        public Id: string,
        public FirstName: string,
        public LastName?: string,
        public Title?: string,
        public Email: string,
        public MobilePhone?: string,
        public Department?: string,
    ) { }
}
