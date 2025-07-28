import { User } from "../../entities/UserEnitiies";
import { GenericQueryParams } from "../../interfaces/queries/GenericQueryParams";
import { BaseRepository } from "../BaseRepository";

export class UserRepository extends BaseRepository<User>{
    getUserData(query: GenericQueryParams): Promise<User | null> {
        // Call the base repository's getUserData method
        return super.getUserData(query);
    }
    
}