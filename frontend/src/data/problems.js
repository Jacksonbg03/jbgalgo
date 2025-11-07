export const PROBLEMS = {
//   "two-sum": {
//     id: "two-sum",
//     title: "Two Sum",
//     difficulty: "Easy",
//     category: ["Array", "Hash Table"],
//     description: {
//       text: "Given an array of integers nums and an integer target, return indices of the two numbers in the array such that they add up to target.",
//       notes: [
//         "You may assume that each input would have exactly one solution, and you may not use the same element twice.",
//         "You can return the answer in any order.",
//       ],
//     },
//     examples: [
//       { input: "nums = [2,7,11,15], target = 9", output: "[0,1]" },
//       { input: "nums = [3,2,4], target = 6", output: "[1,2]" },
//       { input: "nums = [3,3], target = 6", output: "[0,1]" },
//     ],
//     constraints: [
//       "2 ≤ nums.length ≤ 10⁴",
//       "-10⁹ ≤ nums[i] ≤ 10⁹",
//       "-10⁹ ≤ target ≤ 10⁹",
//       "Only one valid answer exists",
//     ],
//     starterCode: {
//       javascript: `function twoSum(nums, target) {
//   // --- YOUR CODE HERE ---
//   return [];
// }

// // --- INPUT SECTION ---
// const nums = JSON.parse(readline());
// const target = parseInt(readline());

// // --- OUTPUT SECTION ---
// console.log(twoSum(nums, target));`,
//       python: `def twoSum(nums, target):
//     # --- YOUR CODE HERE ---
//     pass

// # --- INPUT SECTION ---
// nums = eval(input())
// target = int(input())

// # --- OUTPUT SECTION ---
// print(twoSum(nums, target))`,
//       java: `import java.util.*;

// public class Main {
//     public static int[] twoSum(int[] nums, int target) {
//         // --- YOUR CODE HERE ---
//         return new int[]{};
//     }

//     public static void main(String[] args) {
//         // --- INPUT SECTION ---
//         Scanner sc = new Scanner(System.in);
//         String numsStr = sc.nextLine();
//         int target = sc.nextInt();
//         numsStr = numsStr.replaceAll("\\\\[|\\\\]", "");
//         String[] parts = numsStr.split(",");
//         int[] nums = new int[parts.length];
//         for (int i = 0; i < parts.length; i++) nums[i] = Integer.parseInt(parts[i].trim());

//         // --- OUTPUT SECTION ---
//         System.out.println(Arrays.toString(twoSum(nums, target)));
//     }
// }` },
//     expectedOutput: {
//       javascript: "[0,1]\n[1,2]\n[0,1]",
//       python: "[0, 1]\n[1, 2]\n[0, 1]",
//       java: "[0, 1]\n[1, 2]\n[0, 1]",
//     },
//     hiddenInputs: ["[2,7,11,15]\n9", "[3,2,4]\n6", "[3,3]\n6"],
//   },

//   "reverse-string": {
//     id: "reverse-string",
//     title: "Reverse String",
//     difficulty: "Easy",
//     category: ["String", "Two Pointers"],
//     description: {
//       text: "Write a function that reverses a string. The input string is given as an array of characters s.",
//       notes: ["You must do this by modifying the input array in-place with O(1) extra memory."],
//     },
//     examples: [
//       { input: 's = ["h","e","l","l","o"]', output: '["o","l","l","e","h"]' },
//       { input: 's = ["H","a","n","n","a","h"]', output: '["h","a","n","n","a","H"]' },
//     ],
//     constraints: ["1 ≤ s.length ≤ 10⁵", "s[i] is a printable ascii character"],
//     starterCode: {
//       javascript: `function reverseString(s) {
//   // --- YOUR CODE HERE ---
//   return s.reverse();
// }

// // --- INPUT SECTION ---
// let s = JSON.parse(readline());

// // --- OUTPUT SECTION ---
// console.log(JSON.stringify(reverseString(s)));`,
//       python: `def reverseString(s):
//     # --- YOUR CODE HERE ---
//     return s[::-1]

// # --- INPUT SECTION ---
// s = eval(input())

// # --- OUTPUT SECTION ---
// print(reverseString(s))`,
//       java: `import java.util.*;

// public class Main {
//     public static char[] reverseString(char[] s) {
//         // --- YOUR CODE HERE ---
//         int l = 0, r = s.length - 1;
//         while (l < r) {
//             char tmp = s[l];
//             s[l] = s[r];
//             s[r] = tmp;
//             l++; r--;
//         }
//         return s;
//     }

//     public static void main(String[] args) {
//         // --- INPUT SECTION ---
//         Scanner sc = new Scanner(System.in);
//         String input = sc.nextLine();
//         input = input.replaceAll("\\\\[|\\\\]|\"", "");
//         String[] parts = input.split(",");
//         char[] s = new char[parts.length];
//         for (int i = 0; i < parts.length; i++) s[i] = parts[i].trim().charAt(0);

//         // --- OUTPUT SECTION ---
//         System.out.println(Arrays.toString(reverseString(s)));
//     }
// }` },
//     expectedOutput: {
//       javascript: '["o","l","l","e","h"]\n["h","a","n","n","a","H"]',
//       python: "['o', 'l', 'l', 'e', 'h']\n['h', 'a', 'n', 'n', 'a', 'H']",
//       java: "[o, l, l, e, h]\n[h, a, n, n, a, H]",
//     },
//     hiddenInputs: ['["h","e","l","l","o"]', '["H","a","n","n","a","h"]'],
//   },

//   "valid-palindrome": {
//     id: "valid-palindrome",
//     title: "Valid Palindrome",
//     difficulty: "Easy",
//     category: ["String", "Two Pointers"],
//     description: {
//       text: "A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.",
//       notes: ["Given a string s, return true if it is a palindrome, or false otherwise."],
//     },
//     examples: [
//       { input: 's = "A man, a plan, a canal: Panama"', output: "true" },
//       { input: 's = "race a car"', output: "false" },
//       { input: 's = " "', output: "true" },
//     ],
//     constraints: ["1 ≤ s.length ≤ 2 * 10⁵", "s consists only of printable ASCII characters"],
//     starterCode: {
//       javascript: `function isPalindrome(s) {
//   // --- YOUR CODE HERE ---
//   return false;
// }

// // --- INPUT SECTION ---
// const s = readline();

// // --- OUTPUT SECTION ---
// console.log(isPalindrome(s));`,
//       python: `def isPalindrome(s):
//     # --- YOUR CODE HERE ---
//     return False

// # --- INPUT SECTION ---
// s = input()

// # --- OUTPUT SECTION ---
// print(isPalindrome(s))`,
//       java: `public class Main {
//     public static boolean isPalindrome(String s) {
//         // --- YOUR CODE HERE ---
//         return false;
//     }

//     public static void main(String[] args) {
//         // --- INPUT SECTION ---
//         java.util.Scanner sc = new java.util.Scanner(System.in);
//         String s = sc.nextLine();

//         // --- OUTPUT SECTION ---
//         System.out.println(isPalindrome(s));
//     }
// }` },
//     expectedOutput: {
//       javascript: "true\nfalse\ntrue",
//       python: "True\nFalse\nTrue",
//       java: "true\nfalse\ntrue",
//     },
//     hiddenInputs: [
//       "A man, a plan, a canal: Panama",
//       "race a car",
//       " "
//     ],
//   },

//   "maximum-subarray": {
//     id: "maximum-subarray",
//     title: "Maximum Subarray",
//     difficulty: "Medium",
//     category: ["Array", "Dynamic Programming"],
//     description: {
//       text: "Given an integer array nums, find the subarray with the largest sum, and return its sum.",
//     },
//     examples: [
//       { input: "nums = [-2,1,-3,4,-1,2,1,-5,4]", output: "6" },
//       { input: "nums = [1]", output: "1" },
//       { input: "nums = [5,4,-1,7,8]", output: "23" },
//     ],
//     constraints: ["1 ≤ nums.length ≤ 10⁵", "-10⁴ ≤ nums[i] ≤ 10⁴"],
//     starterCode: {
//       javascript: `function maxSubArray(nums) {
//   // --- YOUR CODE HERE ---
//   return 0;
// }

// // --- INPUT SECTION ---
// const nums = JSON.parse(readline());

// // --- OUTPUT SECTION ---
// console.log(maxSubArray(nums));`,
//       python: `def maxSubArray(nums):
//     # --- YOUR CODE HERE ---
//     return 0

// # --- INPUT SECTION ---
// nums = eval(input())

// # --- OUTPUT SECTION ---
// print(maxSubArray(nums))`,
//       java: `import java.util.*;

// public class Main {
//     public static int maxSubArray(int[] nums) {
//         // --- YOUR CODE HERE ---
//         return 0;
//     }

//     public static void main(String[] args) {
//         // --- INPUT SECTION ---
//         Scanner sc = new Scanner(System.in);
//         String numsStr = sc.nextLine();
//         numsStr = numsStr.replaceAll("\\\\[|\\\\]", "");
//         String[] parts = numsStr.split(",");
//         int[] nums = new int[parts.length];
//         for (int i = 0; i < parts.length; i++) nums[i] = Integer.parseInt(parts[i].trim());

//         // --- OUTPUT SECTION ---
//         System.out.println(maxSubArray(nums));
//     }
// }` },
//     expectedOutput: {
//       javascript: "6\n1\n23",
//       python: "6\n1\n23",
//       java: "6\n1\n23",
//     },
//     hiddenInputs: [
//       "[-2,1,-3,4,-1,2,1,-5,4]",
//       "[1]",
//       "[5,4,-1,7,8]"
//     ],
//   },

//   "container-with-most-water": {
//     id: "container-with-most-water",
//     title: "Container With Most Water",
//     difficulty: "Medium",
//     category: ["Array", "Two Pointers"],
//     description: {
//       text: "You are given an integer array height of length n. Find two lines that together with the x-axis form a container that holds the most water.",
//     },
//     examples: [
//       { input: "height = [1,8,6,2,5,4,8,3,7]", output: "49" },
//       { input: "height = [1,1]", output: "1" },
//     ],
//     constraints: ["2 ≤ n ≤ 10⁵", "0 ≤ height[i] ≤ 10⁴"],
//     starterCode: {
//       javascript: `function maxArea(height) {
//   // --- YOUR CODE HERE ---
//   return 0;
// }

// // --- INPUT SECTION ---
// const height = JSON.parse(readline());

// // --- OUTPUT SECTION ---
// console.log(maxArea(height));`,
//       python: `def maxArea(height):
//     # --- YOUR CODE HERE ---
//     return 0

// # --- INPUT SECTION ---
// height = eval(input())

// # --- OUTPUT SECTION ---
// print(maxArea(height))`,
//       java: `import java.util.*;

// public class Main {
//     public static int maxArea(int[] height) {
//         // --- YOUR CODE HERE ---
//         return 0;
//     }

//     public static void main(String[] args) {
//         // --- INPUT SECTION ---
//         Scanner sc = new Scanner(System.in);
//         String arrStr = sc.nextLine();
//         arrStr = arrStr.replaceAll("\\\\[|\\\\]", "");
//         String[] parts = arrStr.split(",");
//         int[] height = new int[parts.length];
//         for (int i = 0; i < parts.length; i++) height[i] = Integer.parseInt(parts[i].trim());

//         // --- OUTPUT SECTION ---
//         System.out.println(maxArea(height));
//     }
// }` },
//     expectedOutput: {
//       javascript: "49\n1",
//       python: "49\n1",
//       java: "49\n1",
//     },
//     hiddenInputs: [
//       "[1,8,6,2,5,4,8,3,7]",
//       "[1,1]"
//     ],
//   },
  "solve-me-first": {
    id: "solve-me-first",
    title: "Solve Me First",
    difficulty: "Easy",
    category: ["Math", "Introductory"],
    description: {
      text: "Complete the function that takes two integers and returns their sum.",
      notes: ["This is a very basic problem to help you get started with reading input and producing output."],
    },
    examples: [
      { input: "a = 2, b = 3", output: "5" },
      { input: "a = 10, b = 20", output: "30" },
    ],
    constraints: ["0 ≤ a, b ≤ 1000"],
    starterCode: {
      javascript: `function solveMeFirst(a, b) {
    // --- YOUR CODE HERE ---
    return a + b;
  }

  // --- INPUT SECTION ---
  const a = parseInt(readline());
  const b = parseInt(readline());

  // --- OUTPUT SECTION ---
  console.log(solveMeFirst(a, b));`,

      python: `def solveMeFirst(a, b):
      # --- YOUR CODE HERE ---
      return a + b

  # --- INPUT SECTION ---
  a = int(input())
  b = int(input())

  # --- OUTPUT SECTION ---
  print(solveMeFirst(a, b))`,

      java: `import java.util.*;

  public class Main {
      public static int solveMeFirst(int a, int b) {
          // --- YOUR CODE HERE ---
          return a + b;
      }

      public static void main(String[] args) {
          // --- INPUT SECTION ---
          Scanner sc = new Scanner(System.in);
          int a = sc.nextInt();
          int b = sc.nextInt();

          // --- OUTPUT SECTION ---
          System.out.println(solveMeFirst(a, b));
      }
  }` },
    expectedOutput: {
      javascript: "5\n30",
      python: "5\n30",
      java: "5\n30",
    },
    hiddenInputs: ["2\n3", "10\n20"],
  },
  "fizzbuzz": {
  id: "fizzbuzz",
  title: "FizzBuzz",
  difficulty: "Easy",
  category: ["Math", "Loop", "Condition"],
  description: {
    text: "Given an integer n, print the numbers from 1 to n. But for multiples of three print 'Fizz' instead of the number and for the multiples of five print 'Buzz'. For numbers which are multiples of both three and five print 'FizzBuzz'.",
    notes: ["Each output should be printed on a new line."],
  },
  examples: [
    { input: "n = 5", output: "1\n2\nFizz\n4\nBuzz" },
    { input: "n = 15", output: "1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz" },
  ],
  constraints: ["1 ≤ n ≤ 10⁴"],
  starterCode: {
    javascript: `function fizzBuzz(n) {
  // --- YOUR CODE HERE ---
  for (let i = 1; i <= n; i++) {
    if (i % 15 === 0) console.log("FizzBuzz");
    else if (i % 3 === 0) console.log("Fizz");
    else if (i % 5 === 0) console.log("Buzz");
    else console.log(i);
  }
}

// --- INPUT SECTION ---
const n = parseInt(readline());

// --- OUTPUT SECTION ---
fizzBuzz(n);`,

    python: `def fizzBuzz(n):
    # --- YOUR CODE HERE ---
    for i in range(1, n + 1):
        if i % 15 == 0:
            print("FizzBuzz")
        elif i % 3 == 0:
            print("Fizz")
        elif i % 5 == 0:
            print("Buzz")
        else:
            print(i)

# --- INPUT SECTION ---
n = int(input())

# --- OUTPUT SECTION ---
fizzBuzz(n)`,

    java: `import java.util.*;

public class Main {
    public static void fizzBuzz(int n) {
        // --- YOUR CODE HERE ---
        for (int i = 1; i <= n; i++) {
            if (i % 15 == 0)
                System.out.println("FizzBuzz");
            else if (i % 3 == 0)
                System.out.println("Fizz");
            else if (i % 5 == 0)
                System.out.println("Buzz");
            else
                System.out.println(i);
        }
    }

    public static void main(String[] args) {
        // --- INPUT SECTION ---
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();

        // --- OUTPUT SECTION ---
        fizzBuzz(n);
    }
}` },
  expectedOutput: {
    javascript: "1\n2\nFizz\n4\nBuzz\n...\nFizzBuzz",
    python: "1\n2\nFizz\n4\nBuzz\n...\nFizzBuzz",
    java: "1\n2\nFizz\n4\nBuzz\n...\nFizzBuzz",
  },
  hiddenInputs: ["5", "15"],
},

};

export const LANGUAGE_CONFIG = {
  javascript: {
    name: "JavaScript",
    icon: "/javascript.png",
    monacoLang: "javascript",
  },
  python: {
    name: "Python",
    icon: "/python.png",
    monacoLang: "python",
  },
  java: {
    name: "Java",
    icon: "/java.png",
    monacoLang: "java",
  },
};
