import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcryptjs';
export default function initialize(passport, getUserByUserName, getUserById) {
    passport.use(new LocalStrategy({ usernameField: 'username' }, async (username, password, done) => {
        const user = await getUserByUserName(username);
        if (user === null || user === undefined)
            return done(null, false, { message: 'No user found' });
        try {
            if (await bcrypt.compare(password, user.password)) {
                console.log('logged in');
                return done(null, user);
            }
            else
                return done(null, false, { message: 'Password incorrect' });
        }
        catch (e) {
            return done(e);
        }
    }));
    passport.serializeUser((user, done) => done(null, user._id));
    passport.deserializeUser(async (id, done) => {
        const deserializedUser = await getUserById(id);
        return done(null, deserializedUser);
    });
}
