import { limitLines } from "./run-shell-command.tool"

describe(limitLines, () => {
  const testCases = [
    {
      input: ["abc", "def"],
      maxLines: 1,
      expected: [
        "[System: too many lines; 1 lines skipped]",
        "def",
      ],
    },
    {
      input: ["abc", "def", "ghi"],
      maxLines: 2,
      expected: [
        "abc",
        "[System: too many lines; 1 lines skipped]",
        "ghi",
      ],
    },
    {
      input: ["abc", "def", "ghi", "jkl"],
      maxLines: 2,
      expected: [
        "abc",
        "[System: too many lines; 2 lines skipped]",
        "jkl",
      ],
    },
    {
      input: ["abc", "def", "ghi", "jkl", "mno", "pqr", "stu"],
      maxLines: 2,
      expected: [
        "abc",
        "[System: too many lines; 5 lines skipped]",
        "stu",
      ],
    },
  ];

  const join = (lines: string[]): string => {
    return lines.join("\n") + "\n";
  };

  it.each(testCases)("should handle ($input, $maxLines)", ({
    input,
    maxLines,
    expected
  }) => {
    expect(
      limitLines(join(input), maxLines)
    ).toEqual(join(expected));
  });

  it("should handle an empty string", () => {
    expect(limitLines("")).toEqual("");
  });
});
