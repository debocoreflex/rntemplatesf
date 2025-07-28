
class CommonEntity {
    id: string;
    firstName: string;
    lastName: string | null = null;
    title: string | null = null;
    email: string;
    mobilePhone: string;
    department: string | null = null;

    constructor(
        firstName: string,
        lastName: string | null = null,
        title: string | null = null,
        email: string,
        mobilePhone: string,
        department: string | null = null
    ) {
        this.id = `local_${Date.now()}`;
        this.firstName = firstName;
        this.lastName = lastName;
        this.title = title;
        this.email = email;
        this.mobilePhone = mobilePhone;
        this.department = department;
    }
}
