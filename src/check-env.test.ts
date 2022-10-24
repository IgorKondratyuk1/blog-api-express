import {destruct} from "./common/errors";
import {SETTINGS} from "./config";

describe('check-env', () => {
    it('check-env1', () => {
        console.log({SETTINGS})
        console.log(destruct(process.env))
        expect(1).toBe(1)
    })
})