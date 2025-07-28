import { CommonEntity } from "../../entities/CommonEntity";
import { BaseRepository } from "../BaseRepository";
import { GenericQueryParams } from "../../interfaces/queries/GenericQueryParams";

//purpose: This repository is specifically for handling Contact entities.
//it extends the BaseRepository to inherit common database operations.
//similar repositories can be created for other entities like Product, Order, etc.
export class ContactRepository extends BaseRepository<CommonEntity> {
    save(item: CommonEntity): Promise<void> {
        // Save the entry using the base repository's save method
        return super.save(item);
    }

    update(id: string, item: CommonEntity): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

   
}

