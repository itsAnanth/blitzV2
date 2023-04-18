import { JsonWebKey } from "crypto";
abstract class User {
    id: string;
    username: string;
    avatar: number;
    publicKeyJwk: JsonWebKey;
}

export default User;