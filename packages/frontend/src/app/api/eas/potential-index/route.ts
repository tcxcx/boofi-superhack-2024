import { NextRequest, NextResponse } from "next/server";
import { spawn } from "child_process";
import path from "path";

export async function POST(req: NextRequest) {
  const { userId } = await req.json();

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  const scriptPath = path.join(
    process.cwd(),
    "..",
    "boofi-potential-index",
    "defi_potential_algorithm.py"
  );

  return new Promise((resolve) => {
    // Execute the Python script in the conda environment
    const pythonProcess = spawn("conda", [
      "run",
      "-n",
      "boofi-env",
      "python",
      scriptPath,
      userId,
    ]);

    let outputData = "";

    pythonProcess.stdout.on("data", (data) => {
      outputData += data.toString();
    });

    pythonProcess.stderr.on("data", (data) => {
      console.error(`Error: ${data}`);
    });

    pythonProcess.on("close", (code) => {
      if (code !== 0) {
        resolve(
          NextResponse.json(
            { error: "Error executing Python script" },
            { status: 500 }
          )
        );
      } else {
        try {
          console.log("Script output data:", outputData); // Log the entire output for debugging

          // Attempt to parse the JSON output
          const jsonString = outputData.match(/{.*}/)?.[0] || "";

          console.log("Extracted JSON string:", jsonString); // Log the extracted JSON string for debugging

          const jsonOutput = JSON.parse(jsonString);

          // Perform detailed validation
          if (
            typeof jsonOutput.userId !== "string" ||
            typeof jsonOutput.defiPotentialScore !== "number" ||
            typeof jsonOutput.maxLoanAmount !== "number" ||
            typeof jsonOutput.rationale !== "string" ||
            typeof jsonOutput.timestamp !== "string"
          ) {
            throw new Error("Invalid output format from Python script");
          }

          resolve(NextResponse.json(jsonOutput));
        } catch (error: any) {
          console.error("Error parsing script output:", error);
          resolve(
            NextResponse.json(
              {
                error: "Error parsing script output",
                details: error.message,
              },
              { status: 500 }
            )
          );
        }
      }
    });
  });
}
