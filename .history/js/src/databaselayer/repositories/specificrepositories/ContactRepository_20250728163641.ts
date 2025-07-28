import { BaseRepository } from "../BaseRepository";

export class ContactRepository extends BaseRepository<CommonEntity> {
    save(item: CommonEntity): Promise<void> {
        // Save the entry using the base repository's save method
        return super.save(item);
    }

    update(id: string, item: CommonEntity): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
}

