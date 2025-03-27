import { getSessionData } from "./sessionHelper"

describe("getSessionData", () => {
    it("should return the session data object if defined but empty", () => {

        const req = {
            session: {
                data: {}
            }
        }

        expect(getSessionData(req)).toEqual({})

    })

    it("should return the session data object if defined and populated", () => {

        const data = {
            lawCategory: "family"
        }

        const req = {
            session: {
                data: data
            }
        }

        expect(getSessionData(req)).toEqual(data)

    })

    it("should throw an error if session data missing", () => {

        const req = {
            session: {}
        }

        expect(() => getSessionData(req)).toThrow(Error)

    })

    it("should throw an error if session is missing", () => {

        const req = {}

        expect(() => getSessionData(req)).toThrow(Error)

    })
})