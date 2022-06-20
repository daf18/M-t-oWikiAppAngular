import { Router, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { Authentification } from '../../../common/authentification';
import { UserConnection } from '../../../common/userConnection';
import { User } from '../interfaces';
import { AuthService } from '../services/auth.service';
import { MongodbService } from '../services/mongodb.service';
import { TYPES } from '../types';


@injectable()
export class AuthController{
    public constructor(@inject(TYPES.AuthService) private _authService: AuthService, 
                       @inject(TYPES.MongodbService) private _mongodbService: MongodbService){
        //empty
    }

    public get router() : Router {
        
        const router: Router = Router();

        // -> /api/v1/auth/login
        router.post('/login',async (req:Request, res: Response) => {
            const auth: Authentification = req.body;
            const userConnection: UserConnection = {} as UserConnection ;
            
            //TODO Trouver l'utilisateur dans la BD, 
            const userInfoDb = await this._mongodbService.getUserByUsername(auth.username);
            //si l'utilisateur est null retournez le code 403
            if(userInfoDb === null){
                res.send(403);
            } else {

                //TODO Comparer le mot de passe de la BD avec le mot de passe de la requête, utiliser le auth.service
                //Retournez le code 403 au besoin
                if(!await this._authService.isPasswordValid(auth.password,userInfoDb.hash )){
                    res.send(403);
                } else {
                    //TODO Générer le jeton de l'utilisateur à l'aide du service auth.service
                    userConnection.id= userInfoDb._id;
                    userConnection.token= this._authService.generateToken(userConnection.id);
                    userConnection.username= userInfoDb.username;

                    //TODO Retourner les informations de connexion de l'utilisateur (voir interface UserConnection) sous format json 
                    res.json(userConnection);  
                }
            }
        });
        
        // -> /api/v1/auth/signup
        router.post('/signup',async (req:Request, res: Response) => {
            const auth: Authentification = req.body;
            const userConnection: UserConnection = {} as UserConnection ;
            let newUser:User;

            //TODO Valider que l'utilisateur (username) n'est pas déjà dans la BD
            // //Retounez un code 405 si déjà présent
            if( await this._mongodbService.getUserByUsername(auth.username) !== null ){
                res.send(405);
            } else {
                //TODO Chiffrer le mot de passe avec auth.service
                newUser = {hash: await this._authService.encryptPassword(auth.password), username: auth.username};
                //TODO Ajouter l'utilisateur à la BD
                //Retounez un code 500 en cas de problème
                const userInDb = await this._mongodbService.createUser(newUser);
            
                if(userInDb === null){
                    res.send(500);
                } else {
                    //TODO Générer le jeton de l'utilisateur à l'aide du service auth.service
                    userConnection.id= userInDb._id;
                    userConnection.token= this._authService.generateToken(userConnection.id);
                    userConnection.username= userInDb.username;
                    //TODO Retourner les informations de connexion de l'utilisateur (voir interface UserConnection) sous format json 
                    res.json(userConnection);
                }
            }
        });
        
        return router;
    }

}