import { injectable } from 'inversify';
import { Collection, MongoClient, WithId } from 'mongodb';
import { User } from '../interfaces';

const url = 'mongodb://127.0.0.1:27017';

@injectable()
/*
* Cette classe s'occupe des communications avec MongoDB
*/
export class MongodbService {

    private _client: MongoClient = new MongoClient(url);
    private _collection: Collection<User>;

    constructor(){
        this._client.connect();
        //Collection à utiliser
        this._collection = this._client.db('tp2').collection<User>('users');
    }
    
    //Retourne les informations d'un utilisateur à partir de son username
    async getUserByUsername(username: string):Promise<WithId<User> | null>{
        // throw new Error('Not implemented method');
        //TODO Trouver l'utilisateur en fonction de son nom d'utilisateur
        const user = this._collection.findOne({username: username});
        //TODO Retourner l'utilisateur avec son _id
        return await user;
    }
    
    //Fait la création d'un utilisateur dans la base de données
    async createUser(user: User): Promise<WithId<User> | null>{
        //throw new Error('Not implemented method');
        //TODO Créer un utilisateur en fonction des information d'authentification
        //Utilisez l'interface User
        await this._collection.insertOne({
            hash: user.hash,
            username: user.username
        });
           
        //TODO Retourner le user créé avec son _id
        return await this.getUserByUsername(user.username);
    }

}