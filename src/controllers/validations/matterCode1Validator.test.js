import { validateMatterCode1 } from "./matterCode1Validator.js";

describe("validateMatterCode1", () => {
  const validMatterCodes1 = [
    {
      matterCode: "FAMA",
      description: "Divorce/Judicial Seperation/Nullity",
    },
    {
      matterCode: "FAMC",
      description: "Domestic Abuse",
    },
    {
      matterCode: "FAMD",
      description: "Private Law Children only",
    },
  ];

  it("should not return errors when matter code 1 is valid", () => {
    expect(validateMatterCode1(validMatterCodes1, "FAMA")).toEqual({
      list: [],
      messages: {},
    });
  });

  it.each([null, ""])(
    "should return errors when matterCode = %s",
    (matterCode1) => {
      expect(validateMatterCode1(validMatterCodes1, matterCode1)).toEqual({
        list: [
          {
            href: "#matterCode1",
            text: "'Matter Code 1' not entered",
          },
        ],
        messages: {
          matterCode1: {
            text: "'Matter Code 1' not entered",
          },
        },
      });
    },
  );

  it("should not return errors when matter code 1 is not valid", () => {
    expect(validateMatterCode1(validMatterCodes1, "BLAH")).toEqual({
      list: [
        {
          href: "#matterCode1",
          text: "'Matter Code 1' is not valid",
        },
      ],
      messages: {
        matterCode1: {
          text: "'Matter Code 1' is not valid",
        },
      },
    });
  });
});
