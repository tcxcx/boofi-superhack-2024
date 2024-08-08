import { NextRequest, NextResponse } from "next/server";
import { spawn } from "child_process";
import path from "path";

export async function POST(req: NextRequest): Promise<Response> {
  // Explicitly type the return value
  const { userId, cryptoBalances } = await req.json();

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  console.log("Received userId:", userId);
  console.log("Received cryptoBalances:", cryptoBalances);

  const scriptPath = path.join(
    process.cwd(),
    "..",
    "boofi-potential-index",
    "defi_potential_algorithm.py"
  );

  return new Promise((resolve) => {
    const pythonProcess = spawn("conda", [
      "run",
      "-n",
      "boofi-env",
      "python",
      scriptPath,
      userId,
      JSON.stringify(cryptoBalances || { totalBalanceUSD: 0 }),
    ]);

    let outputData = "";
    let errorData = "";

    pythonProcess.stdout.on("data", (data) => {
      outputData += data.toString();
    });

    pythonProcess.stderr.on("data", (data) => {
      errorData += data.toString();
      console.error(`Python script error: ${data}`);
    });

    pythonProcess.on("close", (code) => {
      if (code !== 0) {
        console.error("Python script error output:", errorData);
        resolve(
          NextResponse.json(
            { error: "Error executing Python script", details: errorData },
            { status: 500 }
          )
        );
      } else {
        try {
          console.log("Script output data:", outputData);

          const jsonOutput = JSON.parse(outputData);

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
                output: outputData,
              },
              { status: 500 }
            )
          );
        }
      }
    });
  });
}
