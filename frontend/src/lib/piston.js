// // Piston API is a service for code execution

// const PISTON_API = "https://emkc.org/api/v2/piston";

// const LANGUAGE_VERSIONS = {
//   javascript: { language: "javascript", version: "18.15.0" },
//   python: { language: "python", version: "3.10.0" },
//   java: { language: "java", version: "15.0.2" },
// };

// /**
//  * @param {string} language - programming language
//  * @param {string} code - source code to executed
//  * @returns {Promise<{success:boolean, output?:string, error?: string}>}
//  */
// export async function executeCode(language, code, stdin = "") {
//   try {
//     const languageConfig = LANGUAGE_VERSIONS[language];

//     if (!languageConfig) {
//       return {
//         success: false,
//         error: `Unsupported language: ${language}`,
//       };
//     }

//     const response = await fetch(`${PISTON_API}/execute`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         "Authorization": ""
//       },
//       body: JSON.stringify({
//         language: languageConfig.language,
//         version: languageConfig.version,
//         files: [
//           {
//             name: `main.${getFileExtension(language)}`,
//             content: code,
//           },
//         ],
//         stdin,
//       }),
//     });

//     console.log(response)

//     if (!response.ok) {
//       return {
//         success: false,
//         error: `HTTP error! status: ${response.status}`,
//       };
//     }

//     const data = await response.json();
//     const output = data.run.output || "";
//     const stderr = data.run.stderr || "";

//     if (stderr) {
//       return {
//         success: false,
//         output: output,
//         error: stderr,
//       };
//     }

//     return {
//       success: true,
//       output: output || "No output",
//     };
//   } catch (error) {
//     return {
//       success: false,
//       error: `Failed to execute code: ${error.message}`,
//     };
//   }
// }

// function getFileExtension(language) {
//   const extensions = {
//     javascript: "js",
//     python: "py",
//     java: "java",
//   };

//   return extensions[language] || "txt";
// }

// GANTI DENGAN IP LAPTOP GURU!
const SERVER_IP = "192.168.1.5"; 
const PISTON_API = `http://${SERVER_IP}:2000/api/v2/piston/execute`;

export async function executeCode(language, code, stdin = "") {
  // Mapping versi sesuai yang kamu install di Docker tadi
  const versions = {
    javascript: "18.15.0",
    python: "3.10.0",
    java: "15.0.2"
  };

  try {
    const response = await fetch(PISTON_API, {
      method: "POST",
      // Karena ini LOCAL, browser biasanya lebih longgar, 
      // tapi kalau "Failed to fetch" muncul, murid tetap butuh ekstensi Allow CORS
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        language: language,
        version: versions[language],
        files: [{ content: code }],
        stdin: stdin
      }),
    });

    const data = await response.json();
    return {
      success: true,
      output: data.run.output || "No output",
      error: data.run.stderr
    };
  } catch (error) {
    return { 
      success: false, 
      error: "Gagal terhubung ke Server Guru. Pastikan satu Wi-Fi!" 
    };
  }
}