import { validateMatterCode2 } from "./matterCode2Validator.js";

describe("validateMatterCode2", () => {
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

  it("should not return errors when matter Code 2 is valid", () => {
    expect(validateMatterCode2(validMatterCodes1, "FAMA")).toEqual({
      list: [],
      messages: {},
    });
  });

  it.each([null, ""])(
    "should return errors when matterCode = %s",
    (matterCode2) => {
      expect(validateMatterCode2(validMatterCodes1, matterCode2)).toEqual({
        list: [
          {
            href: "#matterCode2",
            text: "'Matter Code 2' not entered",
          },
        ],
        messages: {
          matterCode2: {
            text: "'Matter Code 2' not entered",
          },
        },
      });
    },
  );

  it("should not return errors when matter Code 2 is not valid", () => {
    expect(validateMatterCode2(validMatterCodes1, "BLAH")).toEqual({
      list: [
        {
          href: "#matterCode2",
          text: "'Matter Code 2' is not valid",
        },
      ],
      messages: {
        matterCode2: {
          text: "'Matter Code 2' is not valid",
        },
      },
    });
  });
});
