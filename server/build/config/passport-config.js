"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = initialize;
const passport_local_1 = require("passport-local");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
function initialize(passport, getUserByUserName, getUserById) {
    passport.use(new passport_local_1.Strategy({ usernameField: 'username' }, async (username, password, done) => {
        const user = await getUserByUserName(username);
        if (user === null || user === undefined)
            return done(null, false, { message: 'No user found' });
        try {
            if (await bcryptjs_1.default.compare(password, user.password)) {
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
